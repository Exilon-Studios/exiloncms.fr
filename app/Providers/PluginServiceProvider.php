<?php

namespace ExilonCMS\Providers;

use ExilonCMS\Services\PluginLoader;
use Illuminate\Support\ServiceProvider;

class PluginServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(PluginLoader::class, function ($app) {
            return new PluginLoader;
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Load all plugins on boot
        /** @var PluginLoader $pluginLoader */
        $pluginLoader = app(PluginLoader::class);
        $pluginLoader->loadPlugins();

        // Auto-register plugin migrations
        $this->registerPluginMigrations();
    }

    /**
     * Register plugin migrations automatically
     */
    protected function registerPluginMigrations(): void
    {
        $pluginsPath = base_path('plugins');

        if (! is_dir($pluginsPath)) {
            return;
        }

        $pluginDirectories = glob($pluginsPath.'/*', GLOB_ONLYDIR);

        foreach ($pluginDirectories as $pluginPath) {
            $migrationsPath = $pluginPath.'/database/migrations';

            if (is_dir($migrationsPath)) {
                $this->loadPluginMigrationsFrom($migrationsPath);
            }
        }
    }

    /**
     * Load migrations from a specific path
     */
    protected function loadPluginMigrationsFrom(string $path): void
    {
        // Use Laravel's loadMigrationsFrom to automatically register plugin migrations
        $this->loadMigrationsFrom($path);
    }
}
