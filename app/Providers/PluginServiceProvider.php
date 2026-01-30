<?php

namespace ExilonCMS\Providers;

use ExilonCMS\Classes\Plugin\Plugin;
use ExilonCMS\Classes\Plugin\PluginLoader;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

/**
 * Plugin Service Provider
 *
 * Loads and boots all enabled plugins using the new Plugin base class system
 */
class PluginServiceProvider extends ServiceProvider
{
    protected PluginLoader $loader;

    public function register(): void
    {
        // Lazy loading to avoid cache issues during package:discover
        $this->app->singleton(PluginLoader::class, function () {
            return new PluginLoader;
        });
    }

    public function boot(): void
    {
        // Skip during package:discover (cache not available yet)
        if ($this->app->runningInConsole() && isset($_SERVER['argv'])
            && in_array('package:discover', $_SERVER['argv'])) {
            return;
        }

        // Lazy load in boot(), not register()
        $this->loader = $this->app->make(PluginLoader::class);

        // Get enabled plugins from settings
        $enabledPlugins = collect(setting('enabled_plugins', []))->toArray();

        // Load all enabled plugins
        $this->loadPlugins($enabledPlugins);
    }

    /**
     * Load all enabled plugins
     */
    protected function loadPlugins(array $enabledPlugins): void
    {
        foreach ($enabledPlugins as $pluginId) {
            $plugin = $this->loader->getPlugin($pluginId);

            if (! $plugin) {
                continue;
            }

            // Load routes
            if ($plugin->hasRoutes()) {
                Route::middleware(['web'])
                    ->prefix('plugins/'.$pluginId)
                    ->group($plugin->getRoutesPath());
            }

            // Load admin routes
            if ($plugin->hasAdminRoutes()) {
                Route::middleware(['web', 'auth', 'admin'])
                    ->prefix('admin/plugins/'.$pluginId)
                    ->group($plugin->getAdminRoutesPath());
            }

            // Load views
            if ($plugin->hasViews()) {
                $this->loadViewsFrom($plugin->getViewsPath(), $pluginId);
            }

            // Load translations
            if ($plugin->hasLang()) {
                $this->loadTranslationsFrom($plugin->getLangPath(), $pluginId);
            }

            // Load migrations
            if ($plugin->hasMigrations() && $this->app->runningInConsole()) {
                $this->loadMigrationsFrom($plugin->getMigrationsPath());
            }
        }

        // Boot all enabled plugins (call their boot() method)
        $this->loader->bootPlugins($enabledPlugins);
    }
}
