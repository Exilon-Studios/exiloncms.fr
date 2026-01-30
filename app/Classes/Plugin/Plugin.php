<?php

namespace ExilonCMS\Classes\Plugin;

use Illuminate\Support\Facades\File;

/**
 * Base class for plugins
 *
 * Plugins should extend this class and use the #[PluginMeta] attribute
 */
abstract class Plugin
{
    /**
     * Get the plugin's configuration values
     */
    public function config(string $key, mixed $default = null): mixed
    {
        // TODO: Load from database settings
        return $default;
    }

    /**
     * Get the plugin's configuration fields for the admin panel
     *
     * @return array<array{name: string, label: string, type: string, default: mixed, description?: string}>
     */
    public function getConfigFields(): array
    {
        return [];
    }

    /**
     * Called when the plugin is enabled for the first time
     */
    public function installed(): void
    {
        // Override in plugin
    }

    /**
     * Called when the plugin is disabled
     */
    public function uninstalled(): void
    {
        // Override in plugin
    }

    /**
     * Called when the plugin is updated to a new version
     */
    public function upgraded(string $oldVersion): void
    {
        // Override in plugin
    }

    /**
     * Called every request (if the plugin is enabled)
     */
    public function boot(): void
    {
        // Override in plugin
    }

    /**
     * Get plugin routes path
     */
    protected function getRoutesPath(): string
    {
        $reflection = new \ReflectionClass($this);
        $pluginDir = dirname($reflection->getFileName());

        return $pluginDir.'/../routes/web.php';
    }

    /**
     * Get admin routes path
     */
    protected function getAdminRoutesPath(): string
    {
        $reflection = new \ReflectionClass($this);
        $pluginDir = dirname($reflection->getFileName());

        return $pluginDir.'/../routes/admin.php';
    }

    /**
     * Get migrations path
     */
    protected function getMigrationsPath(): string
    {
        $reflection = new \ReflectionClass($this);
        $pluginDir = dirname($reflection->getFileName());

        return $pluginDir.'/../database/migrations';
    }

    /**
     * Get views path
     */
    protected function getViewsPath(): string
    {
        $reflection = new \ReflectionClass($this);
        $pluginDir = dirname($reflection->getFileName());

        return $pluginDir.'/../resources/views';
    }

    /**
     * Get lang path
     */
    protected function getLangPath(): string
    {
        $reflection = new \ReflectionClass($this);
        $pluginDir = dirname($reflection->getFileName());

        return $pluginDir.'/../resources/lang';
    }

    /**
     * Get plugin ID
     */
    public function getId(): string
    {
        $reflection = new \ReflectionClass($this);
        $attributes = $reflection->getAttributes(\ExilonCMS\Attributes\PluginMeta::class);

        if (empty($attributes)) {
            return strtolower(class_basename($this));
        }

        return $attributes[0]->newInstance()->id;
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
}
