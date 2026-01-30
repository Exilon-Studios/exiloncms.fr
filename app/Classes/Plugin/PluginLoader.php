<?php

namespace ExilonCMS\Classes\Plugin;

use ExilonCMS\Attributes\PluginMeta;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use ReflectionClass;

/**
 * Simplified plugin loader using composer autoload and PHP 8 attributes
 */
class PluginLoader
{
    /** @var array<string, Plugin> */
    protected array $plugins = [];

    /** @var array<string, array{id: string, name: string, version: string, description: string, author: string, url: string, dependencies: array, permissions: array}> */
    protected array $pluginsMeta = [];

    protected bool $loaded = false;

    protected string $cacheKey = 'plugins.loaded.v2';

    public function __construct()
    {
        $this->discoverPlugins();
    }

    /**
     * Discover all plugins using composer autoload classmap
     */
    protected function discoverPlugins(): void
    {
        // Check if already loaded in this instance
        if ($this->loaded) {
            return;
        }

        $pluginsPath = base_path('plugins');

        if (! File::exists($pluginsPath)) {
            return;
        }

        // Get composer autoload classmap
        $classmap = require base_path('vendor/composer/autoload_classmap.php');

        // Scan for plugin classes in ExilonCMS\Plugins namespace
        foreach ($classmap as $class => $path) {
            if (strpos($class, 'ExilonCMS\\Plugins\\') !== 0) {
                continue;
            }

            // Example: ExilonCMS\Plugins\Blog\Blog
            $parts = explode('\\', $class);

            // Must have: ExilonCMS, Plugins, <Name>, <Name>
            if (count($parts) < 4) {
                continue;
            }

            $pluginName = $parts[2];
            $className = $parts[3];

            // Only register the main plugin class (class name matches plugin name)
            if ($className !== $pluginName) {
                continue;
            }

            if (! file_exists($path) || ! class_exists($class)) {
                continue;
            }

            $reflection = new ReflectionClass($class);

            // Skip abstract classes
            if ($reflection->isAbstract()) {
                continue;
            }

            // Skip if doesn't extend Plugin base class
            if (! $reflection->isSubclassOf(Plugin::class)) {
                continue;
            }

            // Get plugin metadata from attribute
            $meta = $this->getPluginMeta($class);

            if (! $meta) {
                Log::warning("Plugin {$class} does not have #[PluginMeta] attribute");

                continue;
            }

            // Get plugin directory
            // Path structure: plugins/<name>/src/<Name>.php
            // So we need to go up 2 levels from the file to get to the plugin folder
            $pluginDir = dirname(dirname($path));

            // Store plugin metadata
            $this->pluginsMeta[$meta->id] = [
                'id' => $meta->id,
                'name' => $meta->name,
                'version' => $meta->version,
                'description' => $meta->description,
                'author' => $meta->author,
                'url' => $meta->url,
                'dependencies' => $meta->dependencies,
                'permissions' => $meta->permissions,
                'class' => $class,
                'path' => $pluginDir,
            ];

            // Instantiate plugin
            $this->plugins[$meta->id] = new $class;
        }

        $this->loaded = true;

        if (! empty($this->plugins)) {
            Log::info('Discovered '.count($this->plugins).' plugin(s): '.implode(', ', array_keys($this->plugins)));
        }
    }

    /**
     * Get plugin metadata from PHP 8 attribute
     */
    protected function getPluginMeta(string $class): ?PluginMeta
    {
        $reflection = new ReflectionClass($class);
        $attributes = $reflection->getAttributes(PluginMeta::class);

        if (empty($attributes)) {
            return null;
        }

        return $attributes[0]->newInstance();
    }

    /**
     * Get all discovered plugins
     *
     * @return array<string, Plugin>
     */
    public function getPlugins(): array
    {
        return $this->plugins;
    }

    /**
     * Get all plugins metadata
     *
     * @return array<string, array{id: string, name: string, version: string, description: string, author: string, url: string, dependencies: array, permissions: array}>
     */
    public function getPluginsMeta(): array
    {
        return $this->pluginsMeta;
    }

    /**
     * Get a specific plugin instance by ID
     */
    public function getPlugin(string $id): ?Plugin
    {
        return $this->plugins[$id] ?? null;
    }

    /**
     * Check if a plugin exists
     */
    public function hasPlugin(string $id): bool
    {
        return isset($this->plugins[$id]);
    }

    /**
     * Get all plugin routes files
     *
     * @return array<string, string>
     */
    public function getRoutesFiles(): array
    {
        $routes = [];

        foreach ($this->plugins as $id => $plugin) {
            if ($plugin->hasRoutes()) {
                $routes[$id] = $plugin->getRoutesPath();
            }
        }

        return $routes;
    }

    /**
     * Get all plugin admin routes files
     *
     * @return array<string, string>
     */
    public function getAdminRoutesFiles(): array
    {
        $routes = [];

        foreach ($this->plugins as $id => $plugin) {
            if ($plugin->hasAdminRoutes()) {
                $routes[$id] = $plugin->getAdminRoutesPath();
            }
        }

        return $routes;
    }

    /**
     * Get all plugin migration directories
     *
     * @return array<string, string>
     */
    public function getMigrationPaths(): array
    {
        $paths = [];

        foreach ($this->plugins as $id => $plugin) {
            if ($plugin->hasMigrations()) {
                $paths[$id] = $plugin->getMigrationsPath();
            }
        }

        return $paths;
    }

    /**
     * Get all plugin view paths
     *
     * @return array<string, string>
     */
    public function getViewPaths(): array
    {
        $paths = [];

        foreach ($this->plugins as $id => $plugin) {
            if ($plugin->hasViews()) {
                $paths[$id] = $plugin->getViewsPath();
            }
        }

        return $paths;
    }

    /**
     * Get all plugin lang paths
     *
     * @return array<string, string>
     */
    public function getLangPaths(): array
    {
        $paths = [];

        foreach ($this->plugins as $id => $plugin) {
            if ($plugin->hasLang()) {
                $paths[$id] = $plugin->getLangPath();
            }
        }

        return $paths;
    }

    /**
     * Boot all enabled plugins
     */
    public function bootPlugins(array $enabledPlugins): void
    {
        foreach ($enabledPlugins as $pluginId) {
            $plugin = $this->getPlugin($pluginId);

            if ($plugin) {
                $plugin->boot();
            }
        }
    }

    /**
     * Clear plugin cache
     */
    public function clearCache(): void
    {
        $this->loaded = false;
        $this->plugins = [];
        $this->pluginsMeta = [];
    }
}
