<?php

namespace MCCMS\Extensions;

use MCCMS\MCCMS;
use MCCMS\Models\User;
use MCCMS\Support\Optimizer;
use Exception;
use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use ZipArchive;

class UpdateManager
{
    /**
     * The cached updates.
     */
    protected ?array $updates = null;

    /**
     * The cached GitHub release.
     */
    protected ?array $githubRelease = null;

    protected Filesystem $files;

    /**
     * Create a new UpdateManager instance.
     */
    public function __construct(Filesystem $files)
    {
        $this->files = $files;
    }

    // ============================================================
    // GITHUB UPDATE METHODS (for CMS core)
    // ============================================================

    /**
     * Check if GitHub updates are enabled.
     */
    public function isGithubEnabled(): bool
    {
        return Config::get('mccms.github.enabled', false);
    }

    /**
     * Get the latest GitHub release.
     */
    public function getGithubRelease(bool $force = false): ?array
    {
        if (! $this->isGithubEnabled()) {
            return null;
        }

        if ($this->githubRelease !== null && ! $force) {
            return $this->githubRelease;
        }

        if ($force) {
            try {
                return $this->forceFetchGithubRelease();
            } catch (Exception) {
                return null;
            }
        }

        return Cache::remember('github_release', now()->addHour(), function () {
            try {
                return $this->forceFetchGithubRelease(false);
            } catch (Exception) {
                return null;
            }
        });
    }

    /**
     * Force fetch the latest GitHub release.
     */
    public function forceFetchGithubRelease(bool $cache = true): ?array
    {
        $owner = Config::get('mccms.github.owner');
        $repository = Config::get('mccms.github.repository');
        $includePrereleases = Config::get('mccms.github.include_prereleases', false);

        $url = "https://api.github.com/repos/{$owner}/{$repository}/releases";

        $response = $this->prepareGithubHttpRequest()
            ->get($url)
            ->throw()
            ->json();

        if (! is_array($response)) {
            return null;
        }

        // Find the latest release (excluding prereleases if not enabled)
        $release = null;
        foreach ($response as $releaseData) {
            if ($includePrereleases || ($releaseData['prerelease'] ?? false) === false) {
                $release = $releaseData;
                break;
            }
        }

        if ($release === null) {
            return null;
        }

        $this->githubRelease = $this->formatGithubRelease($release);

        if ($cache) {
            Cache::put('github_release', $this->githubRelease, now()->addHour());
        }

        return $this->githubRelease;
    }

    /**
     * Format GitHub release data for internal use.
     */
    protected function formatGithubRelease(array $release): array
    {
        // Find the zip asset
        $zipAsset = null;
        foreach (($release['assets'] ?? []) as $asset) {
            if (str_ends_with($asset['name'] ?? '', '.zip')) {
                $zipAsset = $asset;
                break;
            }
        }

        if ($zipAsset === null) {
            return null;
        }

        return [
            'version' => ltrim($release['tag_name'] ?? '', 'v'),
            'name' => $release['name'] ?? $release['tag_name'] ?? '',
            'description' => $release['body'] ?? '',
            'released_at' => $release['published_at'] ?? '',
            'url' => $zipAsset['browser_download_url'] ?? '',
            'file' => $zipAsset['name'] ?? 'update.zip',
            'hash' => '', // GitHub doesn't provide SHA256, we'll verify after download
            'php_version' => '8.2', // Default requirement
            'github_url' => $release['html_url'] ?? '',
        ];
    }

    /**
     * Check if there's a GitHub update available.
     */
    public function hasGithubUpdate(bool $force = false): bool
    {
        if (! $this->isGithubEnabled()) {
            return false;
        }

        $release = $this->getGithubRelease($force);

        if ($release === null) {
            return false;
        }

        return version_compare($release['version'], MCCMS::version(), '>');
    }

    /**
     * Get the latest GitHub version.
     */
    public function getGithubVersion(bool $force = false): ?string
    {
        return $this->getGithubRelease($force)['version'] ?? null;
    }

    /**
     * Download GitHub release.
     */
    public function downloadGithubRelease(array $info, string $tempDir = ''): void
    {
        $updatesPath = storage_path('app/updates/');

        if (! $this->files->exists($updatesPath)) {
            $this->files->makeDirectory($updatesPath, 0755, true);
        }

        $dir = $updatesPath.$tempDir;
        $path = $dir.$info['file'];

        if (! $this->files->exists($dir)) {
            $this->files->makeDirectory($dir, 0755, true);
        }

        if ($this->files->exists($path)) {
            $this->files->delete($path);
        }

        // Download from GitHub URL
        Http::withOptions(['sink' => $path])
            ->withToken(Config::get('mccms.github.token'))
            ->get($info['url'])
            ->throw();

        // Calculate SHA256 hash for verification
        $info['hash'] = hash_file('sha256', $path);
    }

    /**
     * Install GitHub update with backup.
     */
    public function installGithubUpdate(array $info): void
    {
        if (! is_writable(base_path())) {
            throw new RuntimeException('Missing write permission on '.base_path());
        }

        // Create backups before installing
        $backupPath = $this->createBackup();

        try {
            // Extract and install
            $this->extract($info, base_path());

            // Clear caches
            app(Optimizer::class)->clear();
            Cache::flush();

            // Run migrations
            Artisan::call('migrate', ['--force' => true]);

            Log::info('ExilonCMS updated successfully', [
                'version' => $info['version'],
                'backup' => $backupPath,
            ]);

        } catch (Exception $e) {
            // Rollback by restoring backup
            Log::error('Update failed, attempting rollback', [
                'error' => $e->getMessage(),
                'backup' => $backupPath,
            ]);

            $this->restoreBackup($backupPath);

            throw new RuntimeException('Update failed: '.$e->getMessage().'. Backup restored from: '.$backupPath);
        }
    }

    // ============================================================
    // MARKETPLACE METHODS (for plugins/themes)
    // ============================================================

    public function getApiAlerts(bool $force = false): array
    {
        return $this->fetchMarketplace($force)['alerts'] ?? [];
    }

    public function isLastVersionDownloaded(bool $force = false): bool
    {
        $updates = $this->getUpdate($force);

        if (empty($updates)) {
            return false;
        }

        return $this->files->exists(storage_path('app/updates/'.$updates['file']));
    }

    public function hasUpdate(bool $force = false): bool
    {
        // Check GitHub first if enabled
        if ($this->isGithubEnabled() && $this->hasGithubUpdate($force)) {
            return true;
        }

        // Fallback to marketplace
        $version = $this->getLastVersion($force);

        if ($version === null) {
            return false;
        }

        return version_compare($version, MCCMS::version(), '>');
    }

    public function getLastVersion(bool $force = false): ?string
    {
        // Check GitHub first if enabled
        if ($this->isGithubEnabled()) {
            return $this->getGithubVersion($force);
        }

        // Fallback to marketplace
        return $this->getUpdate($force)['version'] ?? null;
    }

    public function getUpdate(bool $force = false)
    {
        // Check GitHub first if enabled
        if ($this->isGithubEnabled()) {
            return $this->getGithubRelease($force);
        }

        // Fallback to marketplace
        return $this->fetchMarketplace($force)['update'] ?? null;
    }

    public function getPlugins(bool $force = false): array
    {
        return $this->fetchMarketplace($force)['plugins'] ?? [];
    }

    public function getThemes(bool $force = false): array
    {
        return $this->fetchMarketplace($force)['themes'] ?? [];
    }

    public function getGames(bool $force = false): array
    {
        return $this->fetchMarketplace($force)['games'] ?? [];
    }

    public function fetchMarketplace(bool $force = false): array
    {
        if ($this->updates !== null) {
            return $this->updates;
        }

        if ($force) {
            try {
                return $this->forceFetchMarketplace();
            } catch (Exception) {
                return [];
            }
        }

        return Cache::remember('marketplace', now()->addMinutes(15), function () {
            try {
                return $this->forceFetchMarketplace(false);
            } catch (Exception) {
                return [];
            }
        });
    }

    public function forceFetchMarketplace(bool $cache = true): ?array
    {
        $marketplaceUrl = config('mccms.marketplace.url');
        $registryFile = config('mccms.marketplace.registry', 'registry.json');

        $updates = $this->prepareHttpRequest()
            ->get("{$marketplaceUrl}/{$registryFile}")
            ->throw()
            ->json();

        if ($updates !== null) {
            $this->updates = $updates;
        }

        $cacheDuration = config('mccms.marketplace.cache_duration', 3600);

        if ($cache) {
            Cache::put('marketplace', $updates ?? [], now()->addSeconds($cacheDuration));
        }

        return $updates;
    }

    // ============================================================
    // SHARED METHODS
    // ============================================================

    public function download(array $info, string $tempDir = '', bool $verifyHash = true): void
    {
        // If this is a GitHub release, use GitHub download method
        if ($this->isGithubEnabled() && isset($info['github_url'])) {
            $this->downloadGithubRelease($info, $tempDir);
            return;
        }

        // Original marketplace download method
        $updatesPath = storage_path('app/updates/');

        if (! $this->files->exists($updatesPath)) {
            $this->files->makeDirectory($updatesPath);
        }

        if (! array_key_exists('file', $info)) {
            throw new RuntimeException('No file available. If it\'s a paid extension, make sure you purchased it and verify the site key.');
        }

        $dir = $updatesPath.$tempDir;
        $path = $dir.$info['file'];

        if (! $this->files->exists($dir)) {
            $this->files->makeDirectory($dir);
        }

        if ($this->files->exists($path)) {
            $this->files->delete($path);
        }

        $this->prepareHttpRequest()
            ->withOptions(['sink' => $path])
            ->get($info['url'])
            ->throw();

        if ($verifyHash && ! empty($info['hash']) && ! hash_equals($info['hash'], hash_file('sha256', $path))) {
            $this->files->delete($path);

            throw new RuntimeException('The file hash do not match expected hash!');
        }

        Cache::forget('updates_counts');
    }

    public function installUpdate(array $info): void
    {
        // If this is a GitHub release, use GitHub install method
        if ($this->isGithubEnabled() && isset($info['github_url'])) {
            $this->installGithubUpdate($info);
            return;
        }

        // Original marketplace install method
        if (! is_writable(base_path())) {
            throw new RuntimeException('Missing write permission on '.base_path());
        }

        $this->extract($info, base_path());

        app(Optimizer::class)->clear();

        Cache::flush();

        Artisan::call('migrate', ['--force' => true, '--seed' => true]);
    }

    public function extract(array $info, string $targetDir, string $tempDir = ''): void
    {
        $file = storage_path('app/updates/'.$tempDir.$info['file']);

        if ($this->files->extension($file) !== 'zip') {
            throw new RuntimeException('Invalid file extension');
        }

        if (! $this->files->exists($file)) {
            throw new FileNotFoundException('File not found');
        }

        $zip = new ZipArchive();

        if (($status = $zip->open($file)) !== true) {
            throw new RuntimeException('Unable to open zip: '.$status);
        }

        if (! $zip->extractTo($targetDir)) {
            throw new RuntimeException('Unable to extract zip');
        }

        $zip->close();

        $this->files->delete($file);
    }

    // ============================================================
    // BACKUP METHODS
    // ============================================================

    /**
     * Create backup of database and important files.
     */
    public function createBackup(): string
    {
        $backupDate = now()->format('Y-m-d_H-i-s');
        $backupPath = storage_path('app/backups/'.$backupDate);

        if (! $this->files->exists($backupPath)) {
            $this->files->makeDirectory($backupPath, 0755, true);
        }

        // Backup database
        $this->backupDatabase($backupPath);

        // Backup important files
        $this->backupFiles($backupPath);

        // Create backup info file
        $this->createBackupInfo($backupPath);

        Log::info('Backup created successfully', ['path' => $backupPath]);

        return $backupPath;
    }

    /**
     * Backup the database.
     */
    protected function backupDatabase(string $backupPath): void
    {
        $database = config('database.connections.'.config('database.default'));
        $backupFile = $backupPath.'/database.sql';

        switch ($database['driver']) {
            case 'pgsql':
                $command = sprintf(
                    'PGPASSWORD=%s pg_dump -h %s -p %s -U %s -d %s > %s',
                    escapeshellarg($database['password']),
                    escapeshellarg($database['host']),
                    escapeshellarg($database['port']),
                    escapeshellarg($database['username']),
                    escapeshellarg($database['database']),
                    escapeshellarg($backupFile)
                );
                break;

            case 'mysql':
                $command = sprintf(
                    'mysqldump -h %s -P %s -u %s -p%s %s > %s',
                    escapeshellarg($database['host']),
                    escapeshellarg($database['port']),
                    escapeshellarg($database['username']),
                    escapeshellarg($database['password']),
                    escapeshellarg($database['database']),
                    escapeshellarg($backupFile)
                );
                break;

            default:
                // Use Laravel's dump functionality as fallback
                $this->backupDatabaseLaravel($backupPath);
                return;
        }

        exec($command.' 2>&1', $output, $returnVar);

        if ($returnVar !== 0 && ! $this->files->exists($backupFile)) {
            throw new RuntimeException('Database backup failed. Command: '.$command);
        }
    }

    /**
     * Backup database using Laravel (fallback).
     */
    protected function backupDatabaseLaravel(string $backupPath): void
    {
        $backupFile = $backupPath.'/database.json';

        // Get all tables
        $tables = DB::select('SELECT table_name FROM information_schema.tables WHERE table_schema = public()');

        $data = [];

        foreach ($tables as $table) {
            $tableName = $table->table_name ?? $table->TABLE_NAME;
            if (! $tableName) {
                continue;
            }

            $rows = DB::table($tableName)->get();
            $data[$tableName] = $rows->toArray();
        }

        $this->files->put($backupFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    /**
     * Backup important files.
     */
    protected function backupFiles(string $backupPath): void
    {
        $filesToBackup = [
            '.env',
            'composer.json',
            'composer.lock',
            'package.json',
            'package-lock.json',
        ];

        $dirsToBackup = [
            'config',
        ];

        $filesDir = $backupPath.'/files';
        $this->files->makeDirectory($filesDir, 0755, true);

        foreach ($filesToBackup as $file) {
            $filePath = base_path($file);
            if ($this->files->exists($filePath)) {
                $this->files->copy($filePath, $filesDir.'/'.$file);
            }
        }

        foreach ($dirsToBackup as $dir) {
            $dirPath = base_path($dir);
            if ($this->files->exists($dirPath)) {
                $this->files->copyDirectory($dirPath, $filesDir.'/'.$dir);
            }
        }
    }

    /**
     * Create backup info file.
     */
    protected function createBackupInfo(string $backupPath): void
    {
        $info = [
            'date' => now()->toIso8601String(),
            'version' => MCCMS::version(),
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
            'environment' => app()->environment(),
            'database' => config('database.default'),
        ];

        $this->files->put(
            $backupPath.'/backup_info.json',
            json_encode($info, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
        );
    }

    /**
     * Restore from backup.
     */
    protected function restoreBackup(string $backupPath): void
    {
        if (! $this->files->exists($backupPath)) {
            throw new RuntimeException('Backup not found: '.$backupPath);
        }

        // Restore database
        $this->restoreDatabase($backupPath);

        // Restore files
        $this->restoreFiles($backupPath);

        Log::info('Backup restored successfully', ['path' => $backupPath]);
    }

    /**
     * Restore database from backup.
     */
    protected function restoreDatabase(string $backupPath): void
    {
        $database = config('database.connections.'.config('database.default'));

        if ($database['driver'] === 'pgsql') {
            $backupFile = $backupPath.'/database.sql';
            if ($this->files->exists($backupFile)) {
                $command = sprintf(
                    'PGPASSWORD=%s psql -h %s -p %s -U %s -d %s -f %s',
                    escapeshellarg($database['password']),
                    escapeshellarg($database['host']),
                    escapeshellarg($database['port']),
                    escapeshellarg($database['username']),
                    escapeshellarg($database['database']),
                    escapeshellarg($backupFile)
                );
                exec($command.' 2>&1', $output, $returnVar);
            }
        }
    }

    /**
     * Restore files from backup.
     */
    protected function restoreFiles(string $backupPath): void
    {
        $filesDir = $backupPath.'/files';

        if (! $this->files->exists($filesDir)) {
            return;
        }

        // Restore .env file
        $envBackup = $filesDir.'/.env';
        if ($this->files->exists($envBackup)) {
            $this->files->copy($envBackup, base_path('.env'));
        }
    }

    // ============================================================
    // HTTP REQUEST HELPERS
    // ============================================================

    private function prepareHttpRequest(): PendingRequest
    {
        $userAgent = 'ExilonCMS updater (v'.MCCMS::version().' - '.url('/').')';

        $request = Http::withUserAgent($userAgent)->withHeaders([
            'Exilon-Version' => MCCMS::version(),
            'Exilon-PHP-Version' => PHP_VERSION,
            'Exilon-Locale' => app()->getLocale(),
            'Exilon-Game' => game()->id(),
            'Exilon-Users' => is_installed() ? User::count() : 0,
        ]);

        $siteKey = setting('site-key');

        if ($siteKey === null) {
            return $request;
        }

        return $request->withHeaders(['Exilon-Site-Key' => $siteKey]);
    }

    private function prepareGithubHttpRequest(): PendingRequest
    {
        $request = Http::withHeaders([
            'Accept' => 'application/vnd.github.v3+json',
            'User-Agent' => 'ExilonCMS',
        ]);

        $token = Config::get('mccms.github.token');

        if ($token) {
            $request = $request->withToken($token);
        }

        return $request;
    }
}
