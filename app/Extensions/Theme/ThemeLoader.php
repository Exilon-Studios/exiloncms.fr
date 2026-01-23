<?php

namespace ExilonCMS\Extensions\Theme;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class ThemeLoader
{
    /** @var array<string, array{id: string, name: string, version: string, path: string}> */
    protected array $themes = [];

    public function __construct()
    {
        $this->discoverThemes();
    }

    /**
     * Discover all themes in the themes directory.
     */
    protected function discoverThemes(): void
    {
        $themesPath = base_path('themes');

        if (! File::exists($themesPath)) {
            return;
        }

        $themeDirs = File::directories($themesPath);

        foreach ($themeDirs as $themeDir) {
            $themeJson = $themeDir . '/theme.json';

            if (! File::exists($themeJson)) {
                continue;
            }

            $data = json_decode(File::get($themeJson), true);

            if (! $data || ! isset($data['id'], $data['name'])) {
                continue;
            }

            $this->themes[$data['id']] = [
                'id' => $data['id'],
                'name' => $data['name'],
                'version' => $data['version'] ?? '1.0.0',
                'description' => $data['description'] ?? '',
                'author' => $data['author'] ?? '',
                'url' => $data['url'] ?? '',
                'screenshot' => $data['screenshot'] ?? null,
                'requires' => $data['requires'] ?? [],
                'supports' => $data['supports'] ?? [],
                'path' => $themeDir,
                'service_provider' => $data['service_provider'] ?? null,
                'active' => $this->isActive($data['id']),
            ];
        }
    }

    /**
     * Get all discovered themes.
     *
     * @return array<string, array{id: string, name: string, version: string, path: string}>
     */
    public function getThemes(): array
    {
        return $this->themes;
    }

    /**
     * Get a specific theme by ID.
     */
    public function getTheme(string $id): ?array
    {
        return $this->themes[$id] ?? null;
    }

    /**
     * Check if a theme exists.
     */
    public function hasTheme(string $id): bool
    {
        return isset($this->themes[$id]);
    }

    /**
     * Get the active theme.
     */
    public function getActiveTheme(): ?array
    {
        $activeThemeId = Cache::get('active_theme', 'default');

        if ($activeThemeId === 'default') {
            return [
                'id' => 'default',
                'name' => 'Default',
                'description' => 'Theme par défaut d\'ExilonCMS',
                'version' => app()->version(),
                'active' => true,
            ];
        }

        return $this->themes[$activeThemeId] ?? null;
    }

    /**
     * Check if a theme is active.
     */
    public function isActive(string $themeId): bool
    {
        return Cache::get('active_theme', 'default') === $themeId;
    }

    /**
     * Activate a theme.
     */
    public function activateTheme(string $themeId): bool
    {
        $theme = $this->getTheme($themeId);

        if (! $theme) {
            return false;
        }

        // Check requirements
        if (! empty($theme['requires'])) {
            foreach ($theme['requires'] as $package => $constraint) {
                if (! class_exists($package)) {
                    throw new \Exception("Theme requires {$package} but it's not installed.");
                }
            }
        }

        Cache::forever('active_theme', $themeId);

        if ($theme['service_provider']) {
            Cache::forever('active_theme_provider', $theme['service_provider']);
        }

        Cache::forget('theme.config');

        return true;
    }

    /**
     * Deactivate current theme (return to default).
     */
    public function deactivateTheme(): void
    {
        Cache::forever('active_theme', 'default');
        Cache::forget('active_theme_provider');
        Cache::forget('theme.config');
    }

    /**
     * Get theme URL.
     */
    public function getThemeUrl(string $themeId, string $path = ''): string
    {
        return asset("themes/{$themeId}/" . ltrim($path, '/'));
    }

    /**
     * Get theme asset path.
     */
    public function getThemeAsset(string $themeId, string $asset): string
    {
        $path = base_path("themes/{$themeId}/resources/{$asset}");

        if (File::exists($path)) {
            return $this->getThemeUrl($themeId, $asset);
        }

        // Fallback to public assets if published
        $publicPath = public_path("themes/{$themeId}/{$asset}");
        if (File::exists($publicPath)) {
            return asset("themes/{$themeId}/{$asset}");
        }

        return '';
    }

    /**
     * Publish theme assets.
     */
    public function publishAssets(string $themeId): bool
    {
        $themePath = base_path("themes/{$themeId}/resources");
        $publicPath = public_path("themes/{$themeId}");

        if (! File::exists($themePath)) {
            return false;
        }

        // Create public directory if it doesn't exist
        if (! File::exists($publicPath)) {
            File::makeDirectory($publicPath, 0755, true);
        }

        // Copy CSS
        if (File::exists("{$themePath}/css")) {
            File::copyDirectory("{$themePath}/css", "{$publicPath}/css");
        }

        // Copy JS
        if (File::exists("{$themePath}/js")) {
            File::copyDirectory("{$themePath}/js", "{$publicPath}/js");
        }

        // Copy images
        if (File::exists("{$themePath}/images")) {
            File::copyDirectory("{$themePath}/images", "{$publicPath}/images");
        }

        return true;
    }

    /**
     * Get all theme view paths.
     *
     * @return array<string, string>
     */
    public function getViewPaths(): array
    {
        $paths = [];

        foreach ($this->themes as $theme) {
            $viewsPath = $theme['path'] . '/resources/views';

            if (File::exists($viewsPath)) {
                $paths[$theme['id']] = $viewsPath;
            }
        }

        return $paths;
    }

    /**
     * Get all theme lang paths.
     *
     * @return array<string, string>
     */
    public function getLangPaths(): array
    {
        $paths = [];

        foreach ($this->themes as $theme) {
            $langPath = $theme['path'] . '/resources/lang';

            if (File::exists($langPath)) {
                $paths[$theme['id']] = $langPath;
            }
        }

        return $paths;
    }

    /**
     * Get active theme service provider.
     */
    public function getActiveThemeProvider(): ?string
    {
        $activeTheme = $this->getActiveTheme();

        if (! $activeTheme || $activeTheme['id'] === 'default') {
            return null;
        }

        return $activeTheme['service_provider'] ?? null;
    }
}
