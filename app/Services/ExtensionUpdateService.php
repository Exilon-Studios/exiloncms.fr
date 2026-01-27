<?php

namespace ExilonCMS\Services;

use ExilonCMS\Extensions\Plugin\PluginLoader;
use ExilonCMS\Extensions\Theme\ThemeLoader;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Service for checking updates for plugins and themes from the marketplace
 */
class ExtensionUpdateService
{
    private string $marketplaceUrl;

    private string $cachePrefix = 'extension_updates_';

    private int $cacheTtl = 3600; // 1 hour

    public function __construct()
    {
        $this->marketplaceUrl = config('exiloncms.marketplace.url');
    }

    /**
     * Check for updates for all installed plugins and themes
     */
    public function checkAllUpdates(bool $forceRefresh = false): array
    {
        return [
            'plugins' => $this->checkPluginUpdates($forceRefresh),
            'themes' => $this->checkThemeUpdates($forceRefresh),
        ];
    }

    /**
     * Check for plugin updates from marketplace
     */
    public function checkPluginUpdates(bool $forceRefresh = false): array
    {
        $cacheKey = $this->cachePrefix.'plugins';

        if (! $forceRefresh) {
            $cached = Cache::get($cacheKey);
            if ($cached !== null) {
                return $cached;
            }
        }

        try {
            $pluginLoader = app(PluginLoader::class);
            $installedPlugins = $pluginLoader->getPlugins();

            $updates = [];
            foreach ($installedPlugins as $pluginId => $plugin) {
                $updateInfo = $this->checkSinglePluginUpdate($pluginId, $plugin['version'] ?? '1.0.0');
                if ($updateInfo) {
                    $updates[$pluginId] = $updateInfo;
                }
            }

            Cache::put($cacheKey, $updates, $this->cacheTtl);

            return $updates;
        } catch (\Exception $e) {
            Log::error('Failed to check plugin updates', [
                'error' => $e->getMessage(),
            ]);

            return [];
        }
    }

    /**
     * Check for theme updates from marketplace
     */
    public function checkThemeUpdates(bool $forceRefresh = false): array
    {
        $cacheKey = $this->cachePrefix.'themes';

        if (! $forceRefresh) {
            $cached = Cache::get($cacheKey);
            if ($cached !== null) {
                return $cached;
            }
        }

        try {
            $themeLoader = app(ThemeLoader::class);
            $installedThemes = $themeLoader->getThemes();

            $updates = [];
            foreach ($installedThemes as $themeId => $theme) {
                $updateInfo = $this->checkSingleThemeUpdate($themeId, $theme['version'] ?? '1.0.0');
                if ($updateInfo) {
                    $updates[$themeId] = $updateInfo;
                }
            }

            Cache::put($cacheKey, $updates, $this->cacheTtl);

            return $updates;
        } catch (\Exception $e) {
            Log::error('Failed to check theme updates', [
                'error' => $e->getMessage(),
            ]);

            return [];
        }
    }

    /**
     * Check for updates for a single plugin
     */
    public function checkSinglePluginUpdate(string $pluginId, string $currentVersion): ?array
    {
        try {
            $response = Http::timeout(10)->get("{$this->marketplaceUrl}/api/v1/plugins/{$pluginId}");

            if (! $response->successful()) {
                return null;
            }

            $data = $response->json();

            if (! isset($data['version'])) {
                return null;
            }

            $latestVersion = $data['version'];
            if (version_compare($latestVersion, $currentVersion, '>')) {
                return [
                    'type' => 'plugin',
                    'id' => $pluginId,
                    'name' => $data['name'] ?? $pluginId,
                    'current_version' => $currentVersion,
                    'latest_version' => $latestVersion,
                    'download_url' => $data['download_url'] ?? null,
                    'changelog' => $data['changelog'] ?? null,
                    'released_at' => $data['released_at'] ?? null,
                ];
            }

            return null;
        } catch (\Exception $e) {
            Log::warning("Failed to check updates for plugin {$pluginId}", [
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Check for updates for a single theme
     */
    public function checkSingleThemeUpdate(string $themeId, string $currentVersion): ?array
    {
        try {
            $response = Http::timeout(10)->get("{$this->marketplaceUrl}/api/v1/themes/{$themeId}");

            if (! $response->successful()) {
                return null;
            }

            $data = $response->json();

            if (! isset($data['version'])) {
                return null;
            }

            $latestVersion = $data['version'];
            if (version_compare($latestVersion, $currentVersion, '>')) {
                return [
                    'type' => 'theme',
                    'id' => $themeId,
                    'name' => $data['name'] ?? $themeId,
                    'current_version' => $currentVersion,
                    'latest_version' => $latestVersion,
                    'download_url' => $data['download_url'] ?? null,
                    'changelog' => $data['changelog'] ?? null,
                    'released_at' => $data['released_at'] ?? null,
                ];
            }

            return null;
        } catch (\Exception $e) {
            Log::warning("Failed to check updates for theme {$themeId}", [
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Get count of available updates
     */
    public function getUpdatesCount(bool $forceRefresh = false): int
    {
        $updates = $this->checkAllUpdates($forceRefresh);

        return count($updates['plugins']) + count($updates['themes']);
    }

    /**
     * Clear the update cache
     */
    public function clearCache(): void
    {
        Cache::forget($this->cachePrefix.'plugins');
        Cache::forget($this->cachePrefix.'themes');
    }
}
