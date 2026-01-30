<?php

namespace ExilonCMS\Classes\Plugin;

use ExilonCMS\Attributes\PluginMeta;
use ExilonCMS\Models\Setting;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use ReflectionClass;

/**
 * Base class for plugins
 *
 * Plugins should extend this class and use the #[PluginMeta] attribute
 *
 * Example:
 * #[PluginMeta(
 *     name: 'My Plugin',
 *     description: 'Plugin description',
 *     version: '1.0.0',
 *     author: 'Author Name',
 *     dependencies: [],
 *     permissions: []
 * )]
 * class MyPlugin extends Plugin
 * {
 *     public function boot(): void
 *     {
 *         // Plugin initialization
 *     }
 * }
 */
abstract class Plugin
{
    /**
     * Get the plugin's metadata from attribute
     */
    public function getMeta(): ?PluginMeta
    {
        $reflection = new ReflectionClass($this);
        $attributes = $reflection->getAttributes(PluginMeta::class);

        if (empty($attributes)) {
            return null;
        }

        return $attributes[0]->newInstance();
    }

    /**
     * Get the plugin's configuration value from database
     */
    public function config(string $key, mixed $default = null): mixed
    {
        $pluginId = $this->getId();
        $setting = Setting::where('key', "plugin_{$pluginId}_{$key}")->first();

        return $setting?->value ?? $default;
    }

    /**
     * Set a configuration value for this plugin
     */
    public function setConfig(string $key, mixed $value): void
    {
        $pluginId = $this->getId();
        Setting::updateOrCreate(
            ['key' => "plugin_{$pluginId}_{$key}"],
            ['value' => $value]
        );
    }

    /**
     * Get the plugin's configuration fields for the admin panel
     *
     * Override this method to define configuration fields
     *
     * @return array<array{name: string, label: string, type: string, default: mixed, description?: string, validation?: string}>
     */
    public function getConfigFields(): array
    {
        return [];
    }

    /**
     * Get all configuration values as an array
     */
    public function getAllConfig(): array
    {
        $config = [];
        foreach ($this->getConfigFields() as $field) {
            $config[$field['name']] = $this->config($field['name'], $field['default'] ?? null);
        }
        return $config;
    }

    /**
     * Called when the plugin is enabled for the first time
     */
    public function installed(): void
    {
        // Override in plugin
        Log::info("Plugin {$this->getId()} installed");
    }

    /**
     * Called when the plugin is disabled
     */
    public function uninstalled(): void
    {
        // Override in plugin
        Log::info("Plugin {$this->getId()} uninstalled");
    }

    /**
     * Called when the plugin is updated to a new version
     */
    public function upgraded(string $oldVersion): void
    {
        // Override in plugin
        Log::info("Plugin {$this->getId()} upgraded from {$oldVersion} to {$this->getMeta()?->version}");
    }

    /**
     * Called every request (if the plugin is enabled)
     */
    public function boot(): void
    {
        // Override in plugin to register routes, views, etc.
    }

    /**
     * Get plugin ID from metadata
     */
    public function getId(): string
    {
        return $this->getMeta()?->id ?? strtolower(class_basename($this));
    }

    /**
     * Get plugin name from metadata
     */
    public function getName(): string
    {
        return $this->getMeta()?->name ?? class_basename($this);
    }

    /**
     * Get plugin version from metadata
     */
    public function getVersion(): string
    {
        return $this->getMeta()?->version ?? '1.0.0';
    }

    /**
     * Get plugin description from metadata
     */
    public function getDescription(): string
    {
        return $this->getMeta()?->description ?? '';
    }

    /**
     * Get plugin author from metadata
     */
    public function getAuthor(): string
    {
        return $this->getMeta()?->author ?? '';
    }

    /**
     * Get plugin URL from metadata
     */
    public function getUrl(): string
    {
        return $this->getMeta()?->url ?? '';
    }

    /**
     * Get plugin dependencies from metadata
     */
    public function getDependencies(): array
    {
        return $this->getMeta()?->dependencies ?? [];
    }

    /**
     * Get plugin permissions from metadata
     */
    public function getPermissions(): array
    {
        return $this->getMeta()?->permissions ?? [];
    }

    /**
     * Get plugin root directory path
     */
    protected function getPluginPath(): string
    {
        $reflection = new ReflectionClass($this);
        return dirname(dirname($reflection->getFileName()));
    }

    /**
     * Get plugin routes path
     */
    public function getRoutesPath(): string
    {
        return $this->getPluginPath().'/routes/web.php';
    }

    /**
     * Get admin routes path
     */
    public function getAdminRoutesPath(): string
    {
        return $this->getPluginPath().'/routes/admin.php';
    }

    /**
     * Get migrations path
     */
    public function getMigrationsPath(): string
    {
        return $this->getPluginPath().'/database/migrations';
    }

    /**
     * Get views path
     */
    public function getViewsPath(): string
    {
        return $this->getPluginPath().'/resources/views';
    }

    /**
     * Get lang path
     */
    public function getLangPath(): string
    {
        return $this->getPluginPath().'/resources/lang';
    }

    /**
     * Get resources path (for JS, CSS, images, etc.)
     */
    public function getResourcesPath(): string
    {
        return $this->getPluginPath().'/resources';
    }

    /**
     * Check if routes file exists
     */
    public function hasRoutes(): bool
    {
        return File::exists($this->getRoutesPath());
    }

    /**
     * Check if admin routes file exists
     */
    public function hasAdminRoutes(): bool
    {
        return File::exists($this->getAdminRoutesPath());
    }

    /**
     * Check if migrations directory exists
     */
    public function hasMigrations(): bool
    {
        return File::exists($this->getMigrationsPath());
    }

    /**
     * Check if views directory exists
     */
    public function hasViews(): bool
    {
        return File::exists($this->getViewsPath());
    }

    /**
     * Check if lang directory exists
     */
    public function hasLang(): bool
    {
        return File::exists($this->getLangPath());
    }

    /**
     * Get plugin namespace (for class loading)
     */
    public function getNamespace(): string
    {
        $reflection = new ReflectionClass($this);
        return $reflection->getNamespaceName();
    }
}
