<?php

namespace ExilonCMS\Extensions\Plugin;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

abstract class BasePluginServiceProvider extends ServiceProvider
{
    /**
     * The plugin ID.
     */
    protected string $pluginId;

    /**
     * The plugin path.
     */
    protected string $pluginPath;

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->registerRoutes();
        $this->registerViews();
        $this->registerTranslations();
        $this->registerMigrations();
    }

    /**
     * Register the plugin's routes.
     */
    protected function registerRoutes(): void
    {
        $routesFile = $this->pluginPath.'/routes/web.php';

        if (File::exists($routesFile)) {
            Route::middleware(['web', 'auth'])
                ->group($routesFile);
        }
    }

    /**
     * Register the plugin's views.
     */
    protected function registerViews(): void
    {
        $viewsPath = $this->pluginPath.'/resources/views';

        if (File::exists($viewsPath)) {
            $this->loadViewsFrom($viewsPath, $this->pluginId);
        }
    }

    /**
     * Register the plugin's translations.
     */
    protected function registerTranslations(): void
    {
        $langPath = $this->pluginPath.'/resources/lang';

        if (File::exists($langPath)) {
            $this->loadTranslationsFrom($langPath, $this->pluginId);
        }
    }

    /**
     * Register the plugin's migrations.
     */
    protected function registerMigrations(): void
    {
        $migrationsPath = $this->pluginPath.'/database/migrations';

        if (File::exists($migrationsPath) && $this->app->runningInConsole()) {
            $this->loadMigrationsFrom($migrationsPath);
        }
    }

    /**
     * Get the plugin ID.
     */
    public function getPluginId(): string
    {
        return $this->pluginId;
    }

    /**
     * Get the plugin path.
     */
    public function getPluginPath(): string
    {
        return $this->pluginPath;
    }
}
