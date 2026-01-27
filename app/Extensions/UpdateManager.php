<?php

namespace ExilonCMS\Extensions;

use ExilonCMS\ExilonCMS;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Update Manager for ExilonCMS
 * Handles checking for updates, downloading, and installing updates via GitHub Releases
 */
class UpdateManager
{
    private string $repo;

    private string $currentVersion;

    private string $cacheKey = 'cms_updates';

    private int $cacheTtl = 3600; // 1 hour

    private ?array $latestRelease = null;

    private ?array $cachedUpdate = null;

    public function __construct()
    {
        // Use the same repo as installer config
        $this->repo = config('installer.repo', 'Exilon-Studios/ExilonCMS');
        $this->currentVersion = $this->normalizeVersion(ExilonCMS::version());
    }

    /**
     * Normalize version string (remove 'v' prefix if present)
     */
    private function normalizeVersion(string $version): string
    {
        return ltrim($version, 'v');
    }

    /**
     * Check for available updates from GitHub Releases
     */
    public function check(bool $forceRefresh = false): array
    {
        if ($forceRefresh) {
            Cache::forget($this->cacheKey);
        }

        return Cache::remember($this->cacheKey, $this->cacheTtl, function () {
            try {
                $githubToken = env('GITHUB_TOKEN');
                $headers = [];
                if ($githubToken) {
                    $headers['Authorization'] = "Bearer {$githubToken}";
                }

                $response = Http::withHeaders($headers)
                    ->timeout(10)
                    ->get("https://api.github.com/repos/{$this->repo}/releases/latest");

                if (! $response->successful()) {
                    Log::warning('Failed to fetch releases from GitHub', [
                        'status' => $response->status(),
                        'body' => $response->body(),
                    ]);

                    return [
                        'success' => false,
                        'message' => 'Failed to check for updates',
                        'update' => null,
                    ];
                }

                $release = $response->json();
                $this->latestRelease = $release;

                $latestVersion = $this->normalizeVersion($release['tag_name']);

                // Compare versions
                $hasUpdate = version_compare($latestVersion, $this->currentVersion, '>');

                $update = null;
                if ($hasUpdate) {
                    // Find the CMS update zip asset (prioritize update package over full package)
                    $zipAsset = collect($release['assets'] ?? [])
                        ->first(fn ($asset) =>
                            str_ends_with($asset['name'], '.zip') &&
                            ! str_contains($asset['name'], 'installer') &&
                            str_contains($asset['name'], 'update') // Prioritize update package
                        );

                    // Fallback to full package if update package not found
                    if (! $zipAsset) {
                        $zipAsset = collect($release['assets'] ?? [])
                            ->first(fn ($asset) =>
                                str_ends_with($asset['name'], '.zip') &&
                                ! str_contains($asset['name'], 'installer')
                            );
                    }

                    $update = [
                        'version' => $latestVersion,
                        'tag_name' => $release['tag_name'],
                        'name' => $release['name'] ?? $release['tag_name'],
                        'body' => $release['body'] ?? '',
                        'published_at' => $release['published_at'],
                        'html_url' => $release['html_url'],
                        'download_url' => $zipAsset['browser_download_url'] ?? null,
                        'size' => $zipAsset['size'] ?? 0,
                        'php_version' => $this->extractPhpVersion($release['body'] ?? ''),
                    ];
                }

                return [
                    'success' => true,
                    'has_update' => $hasUpdate,
                    'current_version' => $this->currentVersion,
                    'latest_version' => $latestVersion,
                    'update' => $update,
                ];
            } catch (\Exception $e) {
                Log::error('Failed to check for updates', [
                    'error' => $e->getMessage(),
                ]);

                return [
                    'success' => false,
                    'message' => 'Unable to check for updates',
                    'update' => null,
                ];
            }
        });
    }

    /**
     * Extract minimum PHP version from release notes
     */
    private function extractPhpVersion(string $body): string
    {
        if (preg_match('/PHP\s+(\d+\.\d+)/i', $body, $matches)) {
            return $matches[1];
        }

        return '8.2';
    }

    /**
     * Get the latest update (for backward compatibility)
     */
    public function getUpdate(bool $forceRefresh = false): ?array
    {
        $data = $this->check($forceRefresh);

        return $data['success'] ? ($data['update'] ?? null) : null;
    }

    /**
     * Check if there is an update available (for backward compatibility)
     */
    public function hasUpdate(bool $forceRefresh = false): bool
    {
        $data = $this->check($forceRefresh);

        return $data['success'] && ($data['has_update'] ?? false);
    }

    /**
     * Force fetch latest release from GitHub (for backward compatibility)
     */
    public function forceFetchGithubRelease(): array
    {
        return $this->check(true);
    }

    /**
     * Check if the last version is downloaded
     */
    public function isLastVersionDownloaded(): bool
    {
        $update = $this->getUpdate();
        if (! $update) {
            return false;
        }

        $version = $update['version'];
        $downloadedFile = storage_path("app/updates/exiloncms-{$version}.zip");

        return File::exists($downloadedFile);
    }

    /**
     * Download an update (for backward compatibility with UpdateController)
     */
    public function download(array $update): bool
    {
        if (empty($update['download_url'])) {
            Log::error('No download URL found in update data');

            return false;
        }

        $version = $update['version'];
        $savePath = storage_path("app/updates/exiloncms-{$version}.zip");

        return $this->downloadUpdateZip($update['download_url'], $savePath);
    }

    /**
     * Download update from URL
     */
    protected function downloadUpdateZip(string $downloadUrl, string $savePath): bool
    {
        try {
            $response = Http::timeout(120)->get($downloadUrl);

            if (! $response->successful()) {
                Log::error('Failed to download update', [
                    'url' => $downloadUrl,
                    'status' => $response->status(),
                ]);

                return false;
            }

            // Ensure directory exists
            $directory = dirname($savePath);
            if (! File::exists($directory)) {
                File::makeDirectory($directory, 0755, true);
            }

            File::put($savePath, $response->body());

            Log::info('Update downloaded successfully', [
                'path' => $savePath,
                'size' => filesize($savePath),
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to download update', [
                'url' => $downloadUrl,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Extract a zip update
     */
    public function extract(string $zipPath, string $extractTo): bool
    {
        try {
            // Ensure extract directory exists
            if (! File::exists($extractTo)) {
                File::makeDirectory($extractTo, 0755, true);
            }

            // Clean up extract directory if it exists
            if (File::exists($extractTo)) {
                File::deleteDirectory($extractTo);
                File::makeDirectory($extractTo, 0755, true);
            }

            $zip = new \ZipArchive;

            if ($zip->open($zipPath) === true) {
                $result = $zip->extractTo($extractTo);
                $zip->close();

                if ($result === false) {
                    Log::error('ZipArchive::extractTo() returned false', [
                        'zip_path' => $zipPath,
                        'extract_to' => $extractTo,
                    ]);
                    return false;
                }

                // Clean up zip file AFTER successful extraction
                File::delete($zipPath);

                Log::info('Update extracted successfully', [
                    'extract_to' => $extractTo,
                ]);

                return true;
            }

            $errorCode = $zip->open($zipPath);
            Log::error('Failed to open zip file', [
                'zip_path' => $zipPath,
                'error_code' => $errorCode,
                'file_exists' => File::exists($zipPath),
                'file_size' => File::exists($zipPath) ? filesize($zipPath) : 0,
            ]);

            return false;
        } catch (\Exception $e) {
            Log::error('Failed to extract update', [
                'zip_path' => $zipPath,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return false;
        }
    }

    /**
     * Install the latest update (for backward compatibility)
     */
    public function install(): bool
    {
        $update = $this->getUpdate();
        if (! $update) {
            Log::error('No update available to install');

            return false;
        }

        return $this->installUpdate($update['version']);
    }

    /**
     * Install an update
     */
    public function installUpdate(string $version): bool
    {
        try {
            // Create backup
            $backupPath = storage_path('backups/update-backup-'.date('Y-m-d-H-i-s').'.zip');
            $this->createBackup($backupPath);

            // Get downloaded file path
            $tempPath = storage_path("app/updates/exiloncms-{$version}.zip");

            if (! File::exists($tempPath)) {
                Log::error('Update file not found', ['path' => $tempPath]);

                return false;
            }

            // Extract update
            $extractPath = storage_path('app/updates/extract');
            if (! $this->extract($tempPath, $extractPath)) {
                Log::error('Failed to extract update');

                return false;
            }

            // Copy files to base path
            $this->copyUpdateFiles($extractPath, base_path());

            // Run post-install scripts
            $this->runPostInstall($extractPath);

            // Clear caches
            $this->clearCaches();

            // Clean up
            File::deleteDirectory($extractPath);

            // Clear update cache
            Cache::forget($this->cacheKey);

            Log::info('Update installed successfully', ['version' => $version]);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to install update', [
                'version' => $version,
                'error' => $e->getMessage(),
            ]);

            // Rollback
            $this->rollback($backupPath);

            return false;
        }
    }

    /**
     * Copy update files to base path
     */
    protected function copyUpdateFiles(string $sourcePath, string $destPath): void
    {
        // Find the extracted directory (usually the root of the zip)
        $dirs = File::directories($sourcePath);

        if (empty($dirs)) {
            Log::error('No directories found in extracted update', ['source' => $sourcePath]);
            return;
        }

        $actualSource = count($dirs) === 1 ? $dirs[0] : $sourcePath;

        Log::info('Copying update files', [
            'from' => $actualSource,
            'to' => $destPath,
        ]);

        // Get all files from the actual source
        $items = File::allFiles($actualSource);

        $copiedCount = 0;
        $skippedCount = 0;

        foreach ($items as $item) {
            $relativePath = $item->getRelativePathname();

            // Skip certain paths
            if (Str::startsWith($relativePath, 'storage/') ||
                Str::startsWith($relativePath, 'vendor/') ||
                Str::startsWith($relativePath, 'node_modules/') ||
                Str::startsWith($relativePath, '.env') ||
                Str::startsWith($relativePath, 'bootstrap/cache/') ||
                $relativePath === '.env') {
                $skippedCount++;
                continue;
            }

            $destFile = $destPath.'/'.$relativePath;
            $destDir = dirname($destFile);

            if (! File::exists($destDir)) {
                File::makeDirectory($destDir, 0755, true);
            }

            File::copy($item->getPathname(), $destFile);
            $copiedCount++;
        }

        Log::info('Update files copied', [
            'copied' => $copiedCount,
            'skipped' => $skippedCount,
        ]);
    }

    /**
     * Create a backup before updating
     */
    protected function createBackup(string $backupPath): bool
    {
        try {
            $zip = new \ZipArchive;

            if ($zip->open($backupPath, \ZipArchive::CREATE) === true) {
                // Add critical directories
                $directories = ['app', 'config', 'database', 'routes', 'resources', 'public'];

                foreach ($directories as $dir) {
                    $dirPath = base_path($dir);
                    if (File::exists($dirPath)) {
                        $files = File::allFiles($dirPath);
                        foreach ($files as $file) {
                            $relativePath = $file->getRelativePathname();
                            // Skip vendor and node_modules within subdirs
                            if (Str::startsWith($relativePath, 'vendor/') ||
                                Str::startsWith($relativePath, 'node_modules/')) {
                                continue;
                            }
                            $zip->addFile($file->getPathname(), $relativePath);
                        }
                    }
                }

                $zip->close();

                Log::info('Backup created', ['path' => $backupPath]);

                return true;
            }

            return false;
        } catch (\Exception $e) {
            Log::error('Failed to create backup', ['error' => $e->getMessage()]);

            return false;
        }
    }

    /**
     * Rollback to a backup
     */
    protected function rollback(string $backupPath): bool
    {
        try {
            if (! File::exists($backupPath)) {
                return false;
            }

            $zip = new \ZipArchive;

            if ($zip->open($backupPath) === true) {
                $zip->extractTo(base_path());
                $zip->close();

                Log::info('Rollback completed', ['backup' => $backupPath]);

                return true;
            }

            return false;
        } catch (\Exception $e) {
            Log::error('Failed to rollback', ['error' => $e->getMessage()]);

            return false;
        }
    }

    /**
     * Run post-install scripts
     */
    protected function runPostInstall(string $extractPath): void
    {
        Log::info('Running post-install scripts...');

        $cwd = base_path();

        // Check if composer.json changed (compare with current)
        $newComposerJson = $extractPath.'/composer.json';
        $currentComposerJson = $cwd.'/composer.json';
        if (File::exists($newComposerJson)) {
            // Always run composer install to ensure dependencies are up to date
            Log::info('Running composer install...');
            $this->runCommand('composer install --no-interaction --optimize-autoloader --no-dev', 300);
        }

        // Check if package.json changed
        $newPackageJson = $extractPath.'/package.json';
        if (File::exists($newPackageJson)) {
            // Run npm install
            Log::info('Running npm install...');
            $this->runCommand('npm install', 180);
            // Build assets
            Log::info('Running npm run build...');
            $this->runCommand('npm run build', 180);
        }

        // Run migrations
        Log::info('Running migrations...');
        $this->runCommand('php artisan migrate --force', 60);

        // Clear all caches
        Log::info('Clearing caches...');
        $this->runCommand('php artisan cache:clear', 30);
        $this->runCommand('php artisan config:clear', 30);
        $this->runCommand('php artisan route:clear', 30);
        $this->runCommand('php artisan view:clear', 30);
        $this->runCommand('php artisan cache:clear', 30);

        Log::info('Post-install scripts completed');
    }

    /**
     * Run a shell command with timeout
     */
    protected function runCommand(string $command, int $timeoutSeconds = 120): void
    {
        $cwd = base_path();

        Log::info('Running command', [
            'command' => $command,
            'timeout' => $timeoutSeconds.'s',
        ]);

        $output = [];
        $returnCode = 0;

        // Use proc_open for better control with timeouts
        $descriptorspec = [
            0 => ['pipe', 'r'],  // stdin
            1 => ['pipe', 'w'],  // stdout
            2 => ['pipe', 'w'],  // stderr
        ];

        $process = proc_open(
            'cd '.escapeshellarg($cwd)." && {$command}",
            $descriptorspec,
            $pipes
        );

        if (is_resource($process)) {
            // Set timeout
            $timeout = time() + $timeoutSeconds;

            // Close stdin
            fclose($pipes[0]);

            // Set stdout and stderr to non-blocking mode
            stream_set_blocking($pipes[1], false);
            stream_set_blocking($pipes[2], false);

            $stdout = '';
            $stderr = '';

            while (true) {
                // Check timeout
                if (time() > $timeout) {
                    proc_terminate($process, 9); // SIGKILL
                    Log::error('Command timeout', [
                        'command' => $command,
                        'timeout' => $timeoutSeconds,
                    ]);
                    break;
                }

                // Check if process is still running
                $status = proc_get_status($process);
                if (! $status['running']) {
                    $returnCode = $status['exitcode'];
                    break;
                }

                // Read output
                $stdoutChunk = fread($pipes[1], 8192);
                if ($stdoutChunk !== false && $stdoutChunk !== '') {
                    $stdout .= $stdoutChunk;
                }

                $stderrChunk = fread($pipes[2], 8192);
                if ($stderrChunk !== false && $stderrChunk !== '') {
                    $stderr .= $stderrChunk;
                }

                // Small sleep to prevent CPU spinning
                usleep(100000); // 0.1 seconds
            }

            // Close pipes
            fclose($pipes[1]);
            fclose($pipes[2]);

            // Close process
            proc_close($process);

            $output = array_filter(array_merge(
                explode("\n", trim($stdout)),
                explode("\n", trim($stderr))
            ));
        }

        if ($returnCode !== 0) {
            Log::warning('Command failed', [
                'command' => $command,
                'return_code' => $returnCode,
                'output' => implode("\n", $output),
            ]);
        } else {
            Log::info('Command succeeded', [
                'command' => $command,
                'output_lines' => count($output),
            ]);
        }
    }

    /**
     * Clear all caches
     */
    protected function clearCaches(): void
    {
        $this->runCommand('php artisan cache:clear');
        $this->runCommand('php artisan config:clear');
        $this->runCommand('php artisan route:clear');
        $this->runCommand('php artisan view:clear');
    }

    /**
     * Get current version
     */
    public function getCurrentVersion(): string
    {
        return $this->currentVersion;
    }

    /**
     * Get count of available updates (for backward compatibility)
     */
    public function getUpdatesCount(): int
    {
        return $this->hasUpdate() ? 1 : 0;
    }

    /**
     * Check if there are updates available (alias for hasUpdate)
     */
    public function hasUpdates(): bool
    {
        return $this->hasUpdate();
    }

    /**
     * Get all available updates (for backward compatibility)
     */
    public function getUpdates(?string $type = null): array
    {
        $update = $this->getUpdate();

        return $update ? [$update] : [];
    }
}
