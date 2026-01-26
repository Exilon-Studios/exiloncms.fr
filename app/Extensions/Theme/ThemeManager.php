<?php

namespace ExilonCMS\Extensions\Theme;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;

class ThemeManager
{
    /**
     * Get all available themes.
     */
    public function getAllThemes(): Collection
    {
        $themes = collect();
        $themePath = base_path('themes');

        if (! File::exists($themePath)) {
            return $themes;
        }

        $directories = File::directories($themePath);

        foreach ($directories as $directory) {
            $themeName = basename($directory);
            $themeJson = $directory.'/theme.json';

            if (File::exists($themeJson)) {
                $config = json_decode(File::get($themeJson), true);

                $themes->push([
                    'id' => $themeName,
                    'name' => $config['name'] ?? $themeName,
                    'description' => $config['description'] ?? '',
                    'version' => $config['version'] ?? '1.0.0',
                    'author' => $config['author'] ?? '',
                    'url' => $config['url'] ?? '',
                    'screenshot' => $config['screenshot'] ?? null,
                    'requires' => $config['requires'] ?? [],
                    'supports' => $config['supports'] ?? [],
                    'path' => $directory,
                    'active' => $this->isActive($themeName),
                ]);
            }
        }

        return $themes;
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

        return $this->getAllThemes()->firstWhere('id', $activeThemeId);
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
        $theme = $this->getAllThemes()->firstWhere('id', $themeId);

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

        // Store theme service provider
        $provider = "Themes\\{$themeId}\\{$themeId}ServiceProvider";

        // Store in config
        Cache::forever('active_theme', $themeId);
        Cache::forever('active_theme_provider', $provider);

        // Clear cache
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
     * Register theme service provider.
     */
    public function registerThemeProviders(): void
    {
        $activeTheme = $this->getActiveTheme();

        if ($activeTheme && $activeTheme['id'] !== 'default') {
            $provider = $activeTheme['path'].'/src/'.$activeTheme['id'].'ServiceProvider.php';

            if (File::exists($provider)) {
                // Register the theme service provider
                $providerClass = "Themes\\{$activeTheme['id']}\\{$activeTheme['id']}ServiceProvider";

                if (class_exists($providerClass)) {
                    app()->register($providerClass);
                }
            }
        }
    }
}
