<?php

namespace ExilonCMS\Providers;

use ExilonCMS\Classes\Plugin\Plugin;
use ExilonCMS\Classes\Plugin\PluginLoader;
use ExilonCMS\Events\EventDispatcher;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

/**
 * Plugin Service Provider
 *
 * Loads and boots all enabled plugins using the new Plugin base class system
 * Uses file-based storage (plugins/plugins.json) inspired by Azuriom
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

        // Load enabled plugins from file (NOT database)
        $enabledPlugins = $this->loadEnabledPluginsFromFile();

        // Lazy load in boot(), not register()
        $this->loader = $this->app->make(PluginLoader::class);

        // Load all enabled plugins
        $this->loadPlugins($enabledPlugins);

        // Register event listeners from plugin.json manifests
        foreach ($enabledPlugins as $pluginId) {
            EventDispatcher::registerPluginListeners($pluginId);
        }
    }

    /**
     * Load enabled plugins from plugins.json file
     */
    protected function loadEnabledPluginsFromFile(): array
    {
        $pluginsFile = base_path('plugins/plugins.json');

        if (! File::exists($pluginsFile)) {
            return [];
        }

        $content = File::get($pluginsFile);
        $plugins = json_decode($content, true);

        if (! is_array($plugins)) {
            return [];
        }

        return array_filter($plugins, fn ($plugin) => is_string($plugin) && ! empty($plugin));
    }

    /**
     * Load all enabled plugins
     */
    protected function loadPlugins(array $enabledPlugins): void
    {
        // Ensure we have a flat array of plugin IDs
        $enabledPlugins = collect($enabledPlugins)
            ->flatten()
            ->filter()
            ->unique()
            ->values()
            ->toArray();

        foreach ($enabledPlugins as $pluginId) {
            $plugin = $this->loader->getPlugin($pluginId);

            if (! $plugin) {
                continue;
            }

            // Load routes - use plugin ID as prefix (e.g., /shop, /blog)
            // Plugins can override this by setting a route_prefix in their config
            if ($plugin->hasRoutes()) {
                $routesPath = $plugin->getRoutesPath();
                $routePrefix = $this->getPluginRoutePrefix($pluginId, $plugin);
                Route::middleware(['web'])
                    ->prefix($routePrefix)
                    ->group(function () use ($plugin, $routesPath) {
                        require $routesPath;
                    });
            }

            // Load admin routes
            if ($plugin->hasAdminRoutes()) {
                $adminRoutesPath = $plugin->getAdminRoutesPath();
                Route::middleware(['web', 'auth', 'admin'])
                    ->prefix('admin/plugins/'.$pluginId)
                    ->group(function () use ($plugin, $adminRoutesPath) {
                        require $adminRoutesPath;
                    });
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

    /**
     * Get the route prefix for a plugin.
     * Checks plugin manifest first, then database setting, otherwise uses plugin ID.
     * Results are cached for performance.
     */
    protected function getPluginRoutePrefix(string $pluginId, $plugin): string
    {
        $cacheKey = "plugin.{$pluginId}.route_prefix";

        return \Illuminate\Support\Facades\Cache::remember($cacheKey, 3600, function () use ($pluginId, $plugin) {
            // Check plugin manifest for route configuration
            $manifest = $plugin->getPluginManifest();
            $webRoute = $manifest['routes']['web'] ?? null;

            if ($webRoute && is_string($webRoute) && ! str_starts_with($webRoute, '/')) {
                // Use manifest value as default
                $manifestPrefix = $webRoute;
            } else {
                $manifestPrefix = null;
            }

            // Check if plugin has a route_prefix setting in database (can override manifest)
            $configKey = "plugin.{$pluginId}.route_prefix";
            $dbPrefix = setting($configKey);

            // Priority: DB setting > manifest > plugin ID
            if ($dbPrefix && is_string($dbPrefix) && ! empty($dbPrefix)) {
                return trim($dbPrefix, '/');
            }

            if ($manifestPrefix && is_string($manifestPrefix) && ! empty($manifestPrefix)) {
                return $manifestPrefix;
            }

            // Default to plugin ID
            return $pluginId;
        });
    }
}
