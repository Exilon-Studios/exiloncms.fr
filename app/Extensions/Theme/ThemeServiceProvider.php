<?php

namespace ExilonCMS\Extensions\Theme;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;

class ThemeServiceProvider extends ServiceProvider
{
    protected ?ThemeLoader $loader = null;

    public function register(): void
    {
        $this->app->singleton(ThemeLoader::class, function () {
            return new ThemeLoader();
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
     */
    protected function registerActiveTheme(): void
    {
        $activeTheme = $this->loader->getActiveTheme();

        // Type check: ensure we have an array with id key
        if (! $activeTheme || !is_array($activeTheme) || !isset($activeTheme['id']) || $activeTheme['id'] === 'default') {
            return;
        }

        // Register service provider if defined
        $providerClass = $activeTheme['service_provider'] ?? null;

        if ($providerClass && class_exists($providerClass)) {
            $this->app->register($providerClass);
        }

        // Add theme views to view finder
        $viewsPath = ($activeTheme['path'] ?? '') . '/resources/views';

        if (isset($activeTheme['path']) && is_dir($viewsPath)) {
            View::addLocation($viewsPath);
        }

        // Load theme translations
        $langPath = ($activeTheme['path'] ?? '') . '/resources/lang';

        if (isset($activeTheme['path']) && is_dir($langPath)) {
            $this->loadTranslationsFrom($langPath, 'theme');
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
            if (!is_array($theme) || !isset($theme['id'], $theme['path'])) {
                continue;
            }

            $viewsPath = $theme['path'] . '/resources/views';

            if (is_dir($viewsPath)) {
                View::addNamespace($theme['id'], $viewsPath);
            }
        }
    }
}
