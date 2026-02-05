<?php

namespace ExilonCMS\Extensions\Theme;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;

class ThemeLoader
{
    /** @var array<string, array{id: string, name: string, version: string, path: string}> */
    protected array $themes = [];

    /** @var string|null The currently active theme ID */
    protected ?string $activeThemeId = null;

    public function __construct()
    {
        $this->discoverThemes();

        // Get active theme from cache, with fallback to default
        $cachedTheme = Cache::get('active_theme');

        // If cached theme doesn't exist on disk, clear cache and use default
        if ($cachedTheme && $cachedTheme !== 'default' && ! isset($this->themes[$cachedTheme])) {
            Cache::forget('active_theme');
            $cachedTheme = null;
        }

        $this->activeThemeId = $cachedTheme ?? 'default';

        // Ensure default theme is cached
        if (! Cache::get('active_theme')) {
            Cache::forever('active_theme', 'default');
        }
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
            $themeJson = $themeDir.'/theme.json';

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
        // If active theme is explicitly set to 'default', return default theme info
        if ($this->activeThemeId === 'default') {
            return [
                'id' => 'default',
                'name' => 'Default',
                'description' => 'Theme par défaut d\'ExilonCMS',
                'version' => app()->version(),
            ];
        }

        // Return the active theme if it exists
        if (isset($this->themes[$this->activeThemeId])) {
            return $this->themes[$this->activeThemeId];
        }

        // Active theme doesn't exist, fall back to default
        Cache::forever('active_theme', 'default');
        $this->activeThemeId = 'default';

        return [
            'id' => 'default',
            'name' => 'Default',
            'description' => 'Theme par défaut d\'ExilonCMS',
            'version' => app()->version(),
        ];
    }

    /**
     * Get the active theme ID.
     * Supports preview mode via session.
     */
    public function getActiveThemeId(): string
    {
        // Check if we're in preview mode
        if (session()->has('preview_theme')) {
            return session('preview_theme');
        }

        return $this->activeThemeId;
    }

    /**
     * Check if we're in preview mode.
     */
    public function isPreviewMode(): bool
    {
        return session()->has('preview_theme');
    }

    /**
     * Check if a theme is active.
     */
    public function isActive(string $themeId): bool
    {
        return $this->activeThemeId === $themeId;
    }

    /**
     * Activate a theme and automatically enable required plugins.
     */
    public function activateTheme(string $themeId): bool
    {
        if (! isset($this->themes[$themeId])) {
            return false;
        }

        $theme = $this->themes[$themeId];

        // Get currently enabled plugins
        $enabledPlugins = collect(setting('enabled_plugins', []))->toArray();

        // Auto-enable required plugins that aren't already enabled
        $requires = $theme['requires'] ?? [];
        foreach ($requires as $package => $constraint) {
            if (str_starts_with($package, 'plugin:')) {
                $pluginId = str_replace('plugin:', '', $package);
                if (! in_array($pluginId, $enabledPlugins, true)) {
                    $enabledPlugins[] = $pluginId;
                }
            }
        }

        // Save updated enabled plugins list
        \ExilonCMS\Models\Setting::updateOrCreate(
            ['name' => 'enabled_plugins'],
            ['value' => json_encode($enabledPlugins)]
        );

        Cache::forever('active_theme', $themeId);
        $this->activeThemeId = $themeId;

        if ($theme['service_provider']) {
            Cache::forever('active_theme_provider', $theme['service_provider']);
        }

        Cache::forget('theme.config');

        return true;
    }

    /**
     * Check plugin dependencies for a theme.
     */
    protected function checkPluginDependencies(array $theme): array
    {
        $requires = $theme['requires'] ?? [];
        $enabledPlugins = collect(setting('enabled_plugins', []))->toArray();
        $missingPlugins = [];

        foreach ($requires as $package => $constraint) {
            if (str_starts_with($package, 'plugin:')) {
                $pluginId = str_replace('plugin:', '', $package);
                if (! in_array($pluginId, $enabledPlugins, true)) {
                    $missingPlugins[] = $pluginId;
                }
            }
        }

        return $missingPlugins;
    }

    /**
     * Deactivate current theme (return to default).
     */
    public function deactivateTheme(): void
    {
        Cache::forever('active_theme', 'default');
        $this->activeThemeId = 'default';
        Cache::forget('active_theme_provider');
        Cache::forget('theme.config');
    }

    /**
     * Get theme URL.
     */
    public function getThemeUrl(string $themeId, string $path = ''): string
    {
        return asset("themes/{$themeId}/".ltrim($path, '/'));
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
            $viewsPath = $theme['path'].'/resources/views';

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
            $langPath = $theme['path'].'/resources/lang';

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
        if ($this->activeThemeId === 'default') {
            return null;
        }

        return $this->themes[$this->activeThemeId]['service_provider'] ?? null;
    }
}
