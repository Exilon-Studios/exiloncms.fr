<?php

namespace ExilonCMS\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class PluginLoader
{
    protected string $pluginsPath;

    protected array $plugins = [];

    protected bool $loaded = false;

    protected string $cacheKey;

    public function __construct()
    {
        $this->pluginsPath = base_path('plugins');
        $this->cacheKey = 'plugins.loaded.v1';
    }

    /**
     * Discover and load all plugins
     */
    public function loadPlugins(): void
    {
        // Use persistent cache to prevent loading multiple times per request
        if ($this->loaded || Cache::has($this->cacheKey)) {
            return;
        }

        if (! File::exists($this->pluginsPath)) {
            return;
        }

        $pluginDirectories = File::directories($this->pluginsPath);

        foreach ($pluginDirectories as $pluginPath) {
            $this->loadPlugin($pluginPath);
        }

        $this->loaded = true;

        // Cache for 5 minutes to prevent spam in logs
        Cache::put($this->cacheKey, true, 300);

        // Single log line instead of spamming one per plugin
        if (! empty($this->plugins)) {
            Log::info("Loaded ".count($this->plugins)." plugin(s): ".implode(', ', array_column($this->plugins, 'name')));
        }
    }

    /**
     * Load a single plugin
     */
    protected function loadPlugin(string $pluginPath): void
    {
        $pluginJsonPath = $pluginPath.'/plugin.json';

        if (! File::exists($pluginJsonPath)) {
            return;
        }

        try {
            $pluginConfig = json_decode(File::get($pluginJsonPath), true);

            if (! isset($pluginConfig['service_provider'])) {
                Log::warning("Plugin at {$pluginPath} does not have a service_provider defined");

                return;
            }

            $providerClass = $pluginConfig['service_provider'];

            // Check if provider class exists
            if (! class_exists($providerClass)) {
                // Try to autoload the plugin
                $this->autoloadPlugin($pluginPath, $pluginConfig);
            }

            // Register the service provider
            if (class_exists($providerClass)) {
                $this->plugins[] = $pluginConfig;
                app()->register($providerClass);
            }
        } catch (\Exception $e) {
            Log::error("Failed to load plugin at {$pluginPath}: ".$e->getMessage());
        }
    }

    /**
     * Autoload plugin files
     */
    protected function autoloadPlugin(string $pluginPath, array $pluginConfig): void
    {
        // Load any PHP files in the plugin
        $srcPath = $pluginPath.'/src';

        if (File::exists($srcPath)) {
            // Recursively load all PHP files
            $files = File::allFiles($srcPath);

            foreach ($files as $file) {
                if ($file->getExtension() === 'php') {
                    require_once $file->getPathname();
                }
            }
        }
    }

    /**
     * Get all loaded plugins
     */
    public function getPlugins(): array
    {
        return $this->plugins;
    }

    /**
     * Get plugin by name
     */
    public function getPlugin(string $name): ?array
    {
        foreach ($this->plugins as $plugin) {
            if ($plugin['name'] === $name) {
                return $plugin;
            }
        }

        return null;
    }

    /**
     * Check if a plugin is loaded
     */
    public function hasPlugin(string $name): bool
    {
        return $this->getPlugin($name) !== null;
    }

    /**
     * Run migrations for all plugins
     */
    public function runMigrations(): void
    {
        $pluginDirectories = File::directories($this->pluginsPath);

        foreach ($pluginDirectories as $pluginPath) {
            $this->runPluginMigrations($pluginPath);
        }
    }

    /**
     * Run migrations for a specific plugin
     */
    protected function runPluginMigrations(string $pluginPath): void
    {
        $migrationsPath = $pluginPath.'/database/migrations';

        if (! File::exists($migrationsPath)) {
            return;
        }

        $pluginJsonPath = $pluginPath.'/plugin.json';

        if (! File::exists($pluginJsonPath)) {
            return;
        }

        $pluginConfig = json_decode(File::get($pluginJsonPath), true);
        $pluginName = $pluginConfig['name'] ?? 'unknown';

        // Get migration files
        $migrations = File::files($migrationsPath);

        if (empty($migrations)) {
            return;
        }

        // Register migration path
        $this->loadMigrationsFrom($migrationsPath, $pluginName);

        Log::info("Registered migrations for plugin: {$pluginName}");
    }

    /**
     * Load migrations from a path
     */
    protected function loadMigrationsFrom(string $path, string $pluginName): void
    {
        $migrationFiles = File::files($path);

        foreach ($migrationFiles as $file) {
            require_once $file->getPathname();
        }
    }

    /**
     * Publish assets for all plugins
     */
    public function publishAssets(): void
    {
        $pluginDirectories = File::directories($this->pluginsPath);

        foreach ($pluginDirectories as $pluginPath) {
            $this->publishPluginAssets($pluginPath);
        }
    }

    /**
     * Publish assets for a specific plugin
     */
    protected function publishPluginAssets(string $pluginPath): void
    {
        $assetsPath = $pluginPath.'/resources/assets';

        if (File::exists($assetsPath)) {
            $publicPath = public_path('vendor/plugins/'.basename($pluginPath));

            if (! File::exists($publicPath)) {
                File::makeDirectory($publicPath, 0755, true);
            }

            File::copyDirectory($assetsPath, $publicPath);
        }
    }

    /**
     * Clear plugin cache
     */
    public function clearCache(): void
    {
        $this->loaded = false;
        Cache::forget($this->cacheKey);
    }

    /**
     * Get all available plugins (including inactive)
     */
    public function scanAvailablePlugins(): array
    {
        $plugins = [];
        $pluginDirectories = File::directories($this->pluginsPath);

        foreach ($pluginDirectories as $pluginPath) {
            $pluginJsonPath = $pluginPath.'/plugin.json';

            if (File::exists($pluginJsonPath)) {
                $pluginConfig = json_decode(File::get($pluginJsonPath), true);
                $pluginConfig['path'] = $pluginPath;
                $pluginConfig['enabled'] = isset($pluginConfig['service_provider']) && class_exists($pluginConfig['service_provider']);
                $plugins[] = $pluginConfig;
            }
        }

        return $plugins;
    }
}
