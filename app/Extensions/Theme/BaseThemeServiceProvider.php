<?php

namespace ExilonCMS\Extensions\Theme;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\File;

abstract class BaseThemeServiceProvider extends ServiceProvider
{
    /**
     * The theme ID.
     */
    protected string $themeId;

    /**
     * The theme path.
     */
    protected string $themePath;

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->registerViews();
        $this->registerTranslations();
        $this->registerConfig();
    }

    /**
     * Register the theme's views.
     */
    protected function registerViews(): void
    {
        $viewsPath = $this->themePath . '/resources/views';

        if (File::exists($viewsPath)) {
            $this->loadViewsFrom($viewsPath, $this->themeId);
        }
    }

    /**
     * Register the theme's translations.
     */
    protected function registerTranslations(): void
    {
        $langPath = $this->themePath . '/resources/lang';

        if (File::exists($langPath)) {
            $this->loadTranslationsFrom($langPath, $this->themeId);
        }
    }

    /**
     * Register theme configuration.
     */
    protected function registerConfig(): void
    {
        $configPath = $this->themePath . '/config';

        if (File::exists($configPath)) {
            $configFiles = File::files($configPath);

            foreach ($configFiles as $file) {
                $key = $file->getFilenameWithoutExtension();
                $this->mergeConfigFrom($file->getPathname(), $key);
            }
        }
    }

    /**
     * Get the theme ID.
     */
    public function getThemeId(): string
    {
        return $this->themeId;
    }

    /**
     * Get the theme path.
     */
    public function getThemePath(): string
    {
        return $this->themePath;
    }
}
