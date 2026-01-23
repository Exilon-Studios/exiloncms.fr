<?php

namespace ExilonCMS\Extensions\Theme;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;

class ThemeServiceProvider extends ServiceProvider
{
    protected ThemeLoader $loader;

    public function register(): void
    {
        $this->app->singleton(ThemeLoader::class, function () {
            return new ThemeLoader();
        });

        $this->loader = $this->app->make(ThemeLoader::class);

        // Alias for backward compatibility
        $this->app->alias(ThemeLoader::class, 'theme.loader');
    }

    public function boot(): void
    {
        $this->registerActiveTheme();
        $this->registerThemePaths();
    }

    /**
     * Register the active theme.
     */
    protected function registerActiveTheme(): void
    {
        $activeTheme = $this->loader->getActiveTheme();

        if (! $activeTheme || $activeTheme['id'] === 'default') {
            return;
        }

        // Register service provider if defined
        $providerClass = $activeTheme['service_provider'] ?? null;

        if ($providerClass && class_exists($providerClass)) {
            $this->app->register($providerClass);
        }

        // Add theme views to view finder
        $viewsPath = $activeTheme['path'] . '/resources/views';

        if (is_dir($viewsPath)) {
            View::addLocation($viewsPath);
        }

        // Load theme translations
        $langPath = $activeTheme['path'] . '/resources/lang';

        if (is_dir($langPath)) {
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
            $viewsPath = $theme['path'] . '/resources/views';

            if (is_dir($viewsPath)) {
                View::addNamespace($theme['id'], $viewsPath);
            }
        }
    }
}
