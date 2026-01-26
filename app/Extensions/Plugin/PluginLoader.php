<?php

namespace ExilonCMS\Extensions\Plugin;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;

class PluginLoader
{
    /** @var array<string, array{id: string, name: string, version: string, path: string}> */
    protected array $plugins = [];

    public function __construct()
    {
        $this->discoverPlugins();
    }

    /**
     * Discover all plugins in the plugins directory.
     */
    protected function discoverPlugins(): void
    {
        $pluginsPath = base_path('plugins');

        if (! File::exists($pluginsPath)) {
            return;
        }

        $pluginDirs = File::directories($pluginsPath);

        foreach ($pluginDirs as $pluginDir) {
            $pluginJson = $pluginDir.'/plugin.json';

            if (! File::exists($pluginJson)) {
                continue;
            }

            $data = json_decode(File::get($pluginJson), true);

            if (! $data || ! isset($data['id'], $data['name'])) {
                continue;
            }

            $this->plugins[$data['id']] = [
                'id' => $data['id'],
                'name' => $data['name'],
                'version' => $data['version'] ?? '1.0.0',
                'description' => $data['description'] ?? '',
                'path' => $pluginDir,
                'namespace' => $data['namespace'] ?? null,
                'service_provider' => $data['service_provider'] ?? null,
            ];
        }
    }

    /**
     * Get all discovered plugins.
     *
     * @return array<string, array{id: string, name: string, version: string, path: string}>
     */
    public function getPlugins(): array
    {
        return $this->plugins;
    }

    /**
     * Get a specific plugin by ID.
     */
    public function getPlugin(string $id): ?array
    {
        return $this->plugins[$id] ?? null;
    }

    /**
     * Check if a plugin exists.
     */
    public function hasPlugin(string $id): bool
    {
        return isset($this->plugins[$id]);
    }

    /**
     * Load service providers for all plugins.
     */
    public function loadServiceProviders(): void
    {
        foreach ($this->plugins as $plugin) {
            if ($plugin['service_provider']) {
                $this->loadServiceProvider($plugin);
            }
        }
    }

    /**
     * Load a plugin's service provider.
     */
    protected function loadServiceProvider(array $plugin): void
    {
        $providerClass = $plugin['service_provider'];

        if (! class_exists($providerClass)) {
            Log::warning("Service provider not found for plugin {$plugin['id']}: {$providerClass}");

            return;
        }

        if (! is_subclass_of($providerClass, ServiceProvider::class)) {
            Log::warning("Service provider for plugin {$plugin['id']} must extend ServiceProvider");

            return;
        }

        app()->register($providerClass);

        Log::info("Loaded plugin {$plugin['id']}");
    }

    /**
     * Get all plugin routes files.
     *
     * @return array<string, string>
     */
    public function getRoutesFiles(): array
    {
        $routes = [];

        foreach ($this->plugins as $plugin) {
            $routesFile = $plugin['path'].'/routes/web.php';

            if (File::exists($routesFile)) {
                $routes[$plugin['id']] = $routesFile;
            }
        }

        return $routes;
    }

    /**
     * Get all plugin migration directories.
     *
     * @return array<string, string>
     */
    public function getMigrationPaths(): array
    {
        $paths = [];

        foreach ($this->plugins as $plugin) {
            $migrationsPath = $plugin['path'].'/database/migrations';

            if (File::exists($migrationsPath)) {
                $paths[$plugin['id']] = $migrationsPath;
            }
        }

        return $paths;
    }

    /**
     * Get all plugin view paths.
     *
     * @return array<string, string>
     */
    public function getViewPaths(): array
    {
        $paths = [];

        foreach ($this->plugins as $plugin) {
            $viewsPath = $plugin['path'].'/resources/views';

            if (File::exists($viewsPath)) {
                $paths[$plugin['id']] = $viewsPath;
            }
        }

        return $paths;
    }

    /**
     * Get all plugin lang paths.
     *
     * @return array<string, string>
     */
    public function getLangPaths(): array
    {
        $paths = [];

        foreach ($this->plugins as $plugin) {
            $langPath = $plugin['path'].'/resources/lang';

            if (File::exists($langPath)) {
                $paths[$plugin['id']] = $langPath;
            }
        }

        return $paths;
    }
}
