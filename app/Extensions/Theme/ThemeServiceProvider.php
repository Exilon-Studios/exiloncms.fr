<?php

namespace ExilonCMS\Extensions\Theme;

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class ThemeServiceProvider extends ServiceProvider
{
    protected ?ThemeLoader $loader = null;

    public function register(): void
    {
        $this->app->singleton(ThemeLoader::class, function () {
            return new ThemeLoader;
        });
    }

    public function boot(): void
    {
        // Skip theme registration during package discovery when cache isn't available
        if ($this->app->runningInConsole() && isset($_SERVER['argv']) && in_array('package:discover', $_SERVER['argv'])) {
            return;
        }

        // Lazy load the loader in boot() phase, not register()
        $this->loader = $this->app->make(ThemeLoader::class);

        $this->registerActiveTheme();
        $this->registerThemePaths();
    }

    /**
     * Register the active theme.
     * Checks for preview theme in session first, then falls back to active theme.
     */
    protected function registerActiveTheme(): void
    {
        // Check for preview theme in session (for admin preview functionality)
        $previewThemeId = null;
        try {
            if (request()->hasSession()) {
                $previewThemeId = request()->session()->get('preview_theme');
            }
        } catch (\Exception $e) {
            // Session not available yet, skip preview check
        }

        if ($previewThemeId && $this->loader->hasTheme($previewThemeId)) {
            $activeTheme = $this->loader->getTheme($previewThemeId);
        } else {
            $activeTheme = $this->loader->getActiveTheme();
        }

        // Type check: ensure we have an array with id key
        if (! $activeTheme || ! is_array($activeTheme) || ! isset($activeTheme['id']) || $activeTheme['id'] === 'default') {
            return;
        }

        // Validate theme plugin dependencies
        $this->validateThemeDependencies($activeTheme);

        // Register service provider if defined
        $providerClass = $activeTheme['service_provider'] ?? null;

        if ($providerClass && class_exists($providerClass)) {
            $this->app->register($providerClass);
        }

        // Add theme views to view finder
        $themePath = $activeTheme['path'] ?? '';
        if ($themePath) {
            $viewsPath = $themePath.'/resources/views';

            if (is_dir($viewsPath)) {
                View::addLocation($viewsPath);
            }

            // Load theme translations
            $langPath = $themePath.'/resources/lang';

            if (is_dir($langPath)) {
                $this->loadTranslationsFrom($langPath, 'theme');
            }
        }

        // Share theme info with Inertia for React components
        if (class_exists('\Inertia\Inertia')) {
            $isPreview = ! empty($previewThemeId);
            \Inertia\Inertia::share('theme', fn () => [
                'id' => $activeTheme['id'],
                'name' => $activeTheme['name'],
                'isPreview' => $isPreview,
                'path' => $activeTheme['path'] ?? '',
            ]);
        }
    }

    /**
     * Validate theme plugin dependencies and auto-enable them if needed.
     * When a theme is activated, automatically enable required plugins
     * while keeping existing plugins active.
     * Skips validation if database is not available (during installation).
     */
    protected function validateThemeDependencies(array $theme): void
    {
        // Skip if settings table doesn't exist (during installation)
        if (! Schema::hasTable('settings')) {
            return;
        }

        $requires = $theme['requires'] ?? [];
        $enabledPlugins = collect(setting('enabled_plugins', []))->toArray();
        $pluginsEnabled = false;

        foreach ($requires as $package => $constraint) {
            // Skip CMS version requirement
            if ($package === 'exiloncms') {
                continue;
            }

            // Check if it's a plugin dependency
            if (str_starts_with($package, 'plugin:')) {
                $pluginId = str_replace('plugin:', '', $package);

                // Auto-enable plugin if it's not already enabled
                if (! in_array($pluginId, $enabledPlugins, true)) {
                    // Check if plugin exists
                    $pluginLoader = app(\ExilonCMS\Classes\Plugin\PluginLoader::class);
                    if ($pluginLoader->hasPlugin($pluginId)) {
                        $enabledPlugins[] = $pluginId;
                        $pluginsEnabled = true;
                    }
                }
            }
        }

        // Save updated enabled plugins list if any were auto-enabled
        if ($pluginsEnabled) {
            \ExilonCMS\Models\Setting::updateOrCreate(
                ['name' => 'enabled_plugins'],
                ['value' => json_encode($enabledPlugins)]
            );
        }
    }

    /**
     * Register theme-specific paths.
     */
    protected function registerThemePaths(): void
    {
        // Themes can add custom view namespaces
        $themes = $this->loader->getThemes();

        foreach ($themes as $theme) {
            // Type check: ensure theme is an array with required keys
            if (! is_array($theme) || ! isset($theme['id'], $theme['path'])) {
                continue;
            }

            $viewsPath = $theme['path'].'/resources/views';

            if (is_dir($viewsPath)) {
                View::addNamespace($theme['id'], $viewsPath);
            }
        }
    }
}
