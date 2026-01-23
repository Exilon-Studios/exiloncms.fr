<?php

namespace ExilonCMS\Extensions\Plugin;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;

class PluginServiceProvider extends ServiceProvider
{
    protected PluginLoader $loader;

    public function register(): void
    {
        $this->app->singleton(PluginLoader::class, function () {
            return new PluginLoader();
        });

        $this->loader = $this->app->make(PluginLoader::class);
    }

    public function boot(): void
    {
        $this->loadPlugins();
        $this->registerPluginGates();
    }

    /**
     * Load all discovered plugins.
     */
    protected function loadPlugins(): void
    {
        $plugins = $this->loader->getPlugins();

        foreach ($plugins as $plugin) {
            $this->loadPlugin($plugin);
        }
    }

    /**
     * Load a single plugin.
     */
    protected function loadPlugin(array $plugin): void
    {
        // Load service provider if defined
        if ($plugin['service_provider']) {
            $this->loadServiceProvider($plugin);
        }

        // Load routes
        $routesFile = $plugin['path'] . '/routes/web.php';
        if (file_exists($routesFile)) {
            $this->loadRoutesFrom($routesFile, $plugin['id']);
        }

        // Load views
        $viewsPath = $plugin['path'] . '/resources/views';
        if (is_dir($viewsPath)) {
            $this->loadViewsFrom($viewsPath, $plugin['id']);
        }

        // Load translations
        $langPath = $plugin['path'] . '/resources/lang';
        if (is_dir($langPath)) {
            $this->loadTranslationsFrom($langPath, $plugin['id']);
        }

        // Load migrations
        $migrationsPath = $plugin['path'] . '/database/migrations';
        if (is_dir($migrationsPath) && $this->app->runningInConsole()) {
            $this->loadMigrationsFrom($migrationsPath);
        }
    }

    /**
     * Load plugin's service provider.
     */
    protected function loadServiceProvider(array $plugin): void
    {
        $providerClass = $plugin['service_provider'];

        if (! class_exists($providerClass)) {
            return;
        }

        $this->app->register($providerClass);
    }

    /**
     * Load routes from a file with plugin prefix.
     */
    protected function loadRoutesFrom(string $path, string $pluginId): void
    {
        Route::prefix('plugins/' . $pluginId)
            ->middleware(['web', 'auth'])
            ->group($path);
    }

    /**
     * Register gates for plugin permissions.
     */
    protected function registerPluginGates(): void
    {
        // Each plugin can define its own gates
        // This is a placeholder for common plugin gates
    }
}
