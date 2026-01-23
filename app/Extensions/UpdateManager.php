<?php

namespace ExilonCMS\Extensions;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Update Manager for ExilonCMS
 * Handles checking for updates, downloading, and installing updates
 */
class UpdateManager
{
    private string $apiUrl;
    private string $currentVersion;
    private string $cacheKey = 'cms_updates';
    private int $cacheTtl = 3600; // 1 hour

    public function __construct()
    {
        $this->apiUrl = config('app.update_url', 'https://api.exiloncms.fr');
        $this->currentVersion = app()->version();
    }

    /**
     * Check for available updates
     */
    public function check(): array
    {
        return Cache::remember($this->cacheKey, $this->cacheTtl, function () {
            try {
                $response = Http::timeout(10)->get($this->apiUrl . '/v1/check', [
                    'current_version' => $this->currentVersion,
                    'php_version' => PHP_VERSION,
                    'laravel_version' => app()->version(),
                ]);

                if ($response->successful()) {
                    return $response->json();
                }

                return [
                    'success' => false,
                    'message' => 'Failed to check for updates',
                    'updates' => [],
                ];
            } catch (\Exception $e) {
                Log::error('Failed to check for updates', [
                    'error' => $e->getMessage(),
                ]);

                return [
                    'success' => false,
                    'message' => 'Unable to check for updates',
                    'updates' => [],
                ];
            }
        });
    }

    /**
     * Get available updates for a specific type
     */
    public function getUpdates(?string $type = null): array
    {
        $data = $this->check();

        if (!$data['success']) {
            return [];
        }

        $updates = $data['updates'] ?? [];

        if ($type) {
            return array_filter($updates, fn ($update) => $update['type'] === $type);
        }

        return $updates;
    }

    /**
     * Download an update
     */
    public function download(string $updateId, string $savePath): bool
    {
        try {
            $response = Http::timeout(60)->get($this->apiUrl . '/v1/download/' . $updateId);

            if (!$response->successful()) {
                return false;
            }

            // Ensure directory exists
            $directory = dirname($savePath);
            if (!File::exists($directory)) {
                File::makeDirectory($directory, 0755, true);
            }

            File::put($savePath, $response->body());

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to download update', [
                'update_id' => $updateId,
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
            $zip = new \ZipArchive();

            if ($zip->open($zipPath) === true) {
                $zip->extractTo($extractTo);
                $zip->close();

                // Clean up zip file
                File::delete($zipPath);

                return true;
            }

            return false;
        } catch (\Exception $e) {
            Log::error('Failed to extract update', [
                'zip_path' => $zipPath,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Install an update
     */
    public function install(string $updateId): bool
    {
        try {
            // Create backup
            $backupPath = storage_path('backups/update-backup-' . date('Y-m-d-H-i-s') . '.zip');
            $this->createBackup($backupPath);

            // Download update
            $tempPath = storage_path('app/updates/temp.zip');
            if (!$this->download($updateId, $tempPath)) {
                return false;
            }

            // Extract update
            $extractPath = storage_path('app/updates/extract');
            if (!$this->extract($tempPath, $extractPath)) {
                return false;
            }

            // Run post-install scripts
            $this->runPostInstall($extractPath);

            // Clear caches
            $this->clearCaches();

            // Clean up
            File::deleteDirectory($extractPath);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to install update', [
                'update_id' => $updateId,
                'error' => $e->getMessage(),
            ]);

            // Rollback
            $this->rollback($backupPath);

            return false;
        }
    }

    /**
     * Create a backup before updating
     */
    protected function createBackup(string $backupPath): bool
    {
        try {
            $zip = new \ZipArchive();

            if ($zip->open($backupPath, \ZipArchive::CREATE) === true) {
                // Add core files
                $files = File::files(base_path());
                foreach ($files as $file) {
                    if ($file->getFilename() !== 'vendor' && $file->getFilename() !== 'node_modules') {
                        $zip->addFile($file->getPathname(), $file->getRelativePath());
                    }
                }

                // Add app directory
                $zip->addGlob(base_path('app/**/*.php'));

                $zip->close();

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
            if (!File::exists($backupPath)) {
                return false;
            }

            $zip = new \ZipArchive();

            if ($zip->open($backupPath) === true) {
                $zip->extractTo(base_path());
                $zip->close();

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
        // Run composer install if composer.json changed
        if (File::exists($extractPath . '/composer.json')) {
            // Copy new composer.json
            File::copy($extractPath . '/composer.json', base_path('composer.json'));

            // Run composer install
            $this->runCommand('composer install --no-interaction');
        }

        // Run migrations
        $this->runCommand('php artisan migrate --force');

        // Clear and cache config
        $this->runCommand('php artisan config:clear');
        $this->runCommand('php artisan config:cache');
    }

    /**
     * Run a shell command
     */
    protected function runCommand(string $command): void
    {
        exec($command . ' 2>&1', $output, $returnCode);

        if ($returnCode !== 0) {
            Log::warning('Command failed', [
                'command' => $command,
                'output' => implode("\n", $output),
            ]);
        }
    }

    /**
     * Clear all caches
     */
    protected function clearCaches(): void
    {
        Cache::forget($this->cacheKey);

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
     * Check if there are updates available
     */
    public function hasUpdates(): bool
    {
        $updates = $this->getUpdates();
        return count($updates) > 0;
    }

    /**
     * Get count of available updates
     */
    public function getUpdatesCount(): int
    {
        return count($this->getUpdates());
    }
}
