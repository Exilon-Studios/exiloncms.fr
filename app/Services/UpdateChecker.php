<?php

namespace ExilonCMS\Services;

use ExilonCMS\Models\PluginInstalled;
use ExilonCMS\Models\Theme;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class UpdateChecker
{
    /**
     * Check for updates for all installed plugins and themes.
     */
    public function checkAllUpdates(): array
    {
        $updates = [
            'plugins' => $this->checkPluginUpdates(),
            'themes' => $this->checkThemeUpdates(),
        ];

        return $updates;
    }

    /**
     * Check for plugin updates.
     */
    protected function checkPluginUpdates(): array
    {
        $updates = [];
        $plugins = PluginInstalled::whereNotNull('source_url')->get();

        foreach ($plugins as $plugin) {
            try {
                $latest = $this->checkPluginUpdate($plugin);
                if ($latest) {
                    $updates[] = [
                        'type' => 'plugin',
                        'name' => $plugin->name,
                        'current_version' => $plugin->version,
                        'latest_version' => $latest['version'],
                        'download_url' => $latest['download_url'] ?? $plugin->source_url,
                        'changelog' => $latest['changelog'] ?? null,
                        'plugin_id' => $plugin->id,
                    ];
                }
            } catch (\Exception $e) {
                Log::warning("Failed to check updates for plugin {$plugin->name}", [
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return $updates;
    }

    /**
     * Check for theme updates.
     */
    protected function checkThemeUpdates(): array
    {
        $updates = [];
        $themes = Theme::whereNotNull('source_url')->get();

        foreach ($themes as $theme) {
            try {
                $latest = $this->checkThemeUpdate($theme);
                if ($latest) {
                    $updates[] = [
                        'type' => 'theme',
                        'name' => $theme->name,
                        'current_version' => $theme->version,
                        'latest_version' => $latest['version'],
                        'download_url' => $latest['download_url'] ?? $theme->source_url,
                        'changelog' => $latest['changelog'] ?? null,
                        'theme_id' => $theme->id,
                    ];
                }
            } catch (\Exception $e) {
                Log::warning("Failed to check updates for theme {$theme->name}", [
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return $updates;
    }

    /**
     * Check update for a specific plugin.
     */
    protected function checkPluginUpdate(PluginInstalled $plugin): ?array
    {
        // Try to fetch version info from source_url
        $response = Http::timeout(10)->get($plugin->source_url, [
            'action' => 'check_version',
            'current_version' => $plugin->version,
        ]);

        if (! $response->successful()) {
            return null;
        }

        $data = $response->json();

        // Check if there's a newer version
        if (isset($data['version']) && version_compare($data['version'], $plugin->version, '>')) {
            // Update the plugin record with latest version info
            $plugin->update([
                'latest_version' => $data['version'],
                'checked_at' => now(),
            ]);

            return [
                'version' => $data['version'],
                'download_url' => $data['download_url'] ?? null,
                'changelog' => $data['changelog'] ?? null,
            ];
        }

        $plugin->update(['checked_at' => now()]);

        return null;
    }

    /**
     * Check update for a specific theme.
     */
    protected function checkThemeUpdate(Theme $theme): ?array
    {
        // Try to fetch version info from source_url
        $response = Http::timeout(10)->get($theme->source_url, [
            'action' => 'check_version',
            'current_version' => $theme->version,
        ]);

        if (! $response->successful()) {
            return null;
        }

        $data = $response->json();

        // Check if there's a newer version
        if (isset($data['version']) && version_compare($data['version'], $theme->version, '>')) {
            // Update the theme record with latest version info
            $theme->update([
                'latest_version' => $data['version'],
                'checked_at' => now(),
            ]);

            return [
                'version' => $data['version'],
                'download_url' => $data['download_url'] ?? null,
                'changelog' => $data['changelog'] ?? null,
            ];
        }

        $theme->update(['checked_at' => now()]);

        return null;
    }

    /**
     * Get count of available updates.
     */
    public function getUpdatesCount(): int
    {
        $pluginUpdates = PluginInstalled::whereNotNull('latest_version')
            ->whereColumn('latest_version', '>', 'version')
            ->count();

        $themeUpdates = Theme::whereNotNull('latest_version')
            ->whereColumn('latest_version', '>', 'version')
            ->count();

        return $pluginUpdates + $themeUpdates;
    }
}
