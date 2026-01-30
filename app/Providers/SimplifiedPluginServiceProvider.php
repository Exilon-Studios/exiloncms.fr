<?php

namespace ExilonCMS\Providers;

use ExilonCMS\Classes\Plugin\Plugin;
use ExilonCMS\Classes\Plugin\PluginLoader;
use ExilonCMS\Extensions\Plugin\PluginLoader as OldPluginLoader;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

/**
 * Simplified plugin service provider following Paymenter architecture
 *
 * Supports both new (Plugin base class) and old (service provider) systems during migration
 */
class SimplifiedPluginServiceProvider extends ServiceProvider
{
    protected PluginLoader $loader;

    protected OldPluginLoader $oldLoader;

    public function register(): void
    {
        // Use lazy loading to avoid "Class cache does not exist" errors during package:discover
        $this->app->singleton(PluginLoader::class, function () {
            return new PluginLoader;
        });

        // Also register old loader for backward compatibility
        $this->app->singleton(OldPluginLoader::class, function () {
            return new OldPluginLoader;
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
        $this->oldLoader = $this->app->make(OldPluginLoader::class);

        // Get enabled plugins from settings
        $enabledPlugins = collect(setting('enabled_plugins', []))->toArray();

        // Load enabled plugins
        $this->loadPlugins($enabledPlugins);
    }

    /**
     * Load all enabled plugins
     */
    protected function loadPlugins(array $enabledPlugins): void
    {
        foreach ($enabledPlugins as $pluginId) {
            // Try new system first (Plugin base class)
            $plugin = $this->loader->getPlugin($pluginId);

            if ($plugin) {
                $this->loadNewPlugin($plugin, $pluginId);

                continue;
            }

            // Fall back to old system (service provider)
            $oldPlugin = $this->oldLoader->getPlugin($pluginId);

            if ($oldPlugin) {
                $this->loadOldPlugin($oldPlugin);
            }
        }

        // Boot all enabled plugins (new system only)
        $this->loader->bootPlugins($enabledPlugins);
    }

    /**
     * Load a plugin using the new system (Plugin base class)
     */
    protected function loadNewPlugin(Plugin $plugin, string $pluginId): void
    {
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

    /**
     * Load a plugin using the old system (service provider)
     */
    protected function loadOldPlugin(array $plugin): void
    {
        // Load service provider if defined
        if (isset($plugin['service_provider']) && class_exists($plugin['service_provider'])) {
            $this->app->register($plugin['service_provider']);
        }

        // Load routes
        $routesFile = $plugin['path'].'/routes/web.php';
        if (file_exists($routesFile)) {
            Route::prefix('plugins/'.$plugin['id'])
                ->middleware(['web'])
                ->group($routesFile);
        }

        // Load admin routes
        $adminRoutesFile = $plugin['path'].'/routes/admin.php';
        if (file_exists($adminRoutesFile)) {
            Route::prefix('admin/plugins/'.$plugin['id'])
                ->middleware(['web', 'auth', 'admin'])
                ->group($adminRoutesFile);
        }

        // Load views
        $viewsPath = $plugin['path'].'/resources/views';
        if (is_dir($viewsPath)) {
            $this->loadViewsFrom($viewsPath, $plugin['id']);
        }

        // Load translations
        $langPath = $plugin['path'].'/resources/lang';
        if (is_dir($langPath)) {
            $this->loadTranslationsFrom($langPath, $plugin['id']);
        }

        // Load migrations
        $migrationsPath = $plugin['path'].'/database/migrations';
        if (is_dir($migrationsPath) && $this->app->runningInConsole()) {
            $this->loadMigrationsFrom($migrationsPath);
        }
    }
}
