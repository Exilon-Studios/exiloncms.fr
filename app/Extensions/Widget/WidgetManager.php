<?php

namespace ExilonCMS\Extensions\Widget;

use ExilonCMS\Extensions\Plugin\PluginManager;
use ExilonCMS\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Filesystem\Filesystem;

class WidgetManager
{
    protected Filesystem $files;

    public function __construct(Filesystem $files)
    {
        $this->files = $files;
    }

    /**
     * Get all widgets from all enabled plugins.
     */
    public function getWidgetsFromPlugins(?User $user = null): Collection
    {
        $pluginManager = app(PluginManager::class);
        $plugins = $pluginManager->findPluginsDescriptions();

        $widgets = collect();

        foreach ($plugins as $pluginId => $plugin) {
            if (! $plugin->enabled) {
                continue;
            }

            $pluginWidgets = $this->getWidgetsFromPlugin($pluginId, $user);
            $widgets = $widgets->merge($pluginWidgets);
        }

        return $widgets;
    }

    /**
     * Get widgets from a specific plugin.
     */
    public function getWidgetsFromPlugin(string $pluginId, ?User $user = null): Collection
    {
        $widgetsPath = plugin_path($pluginId . '/Widgets');

        if (! $this->files->exists($widgetsPath)) {
            return collect();
        }

        $widgetFiles = $this->files->files($widgetsPath);

        return collect($widgetFiles)
            ->filter(fn ($file) => $file->getExtension() === 'php')
            ->map(fn ($file) => $this->loadWidgetFromFile($pluginId, $file, $user))
            ->filter(fn ($widget) => $widget !== null)
            ->filter(fn ($widget) => ! isset($widget['permission']) || $user?->can($widget['permission']))
            ->values();
    }

    /**
     * Load a widget class from file.
     */
    protected function loadWidgetFromFile(string $pluginId, $file, ?User $user = null): ?array
    {
        $className = $file->getFilenameWithoutExtension();
        $fullClassName = sprintf(
            'ExilonCMS\\Plugins\\%s\\Widgets\\%s',
            ucfirst($pluginId),
            $className
        );

        // Include the file if class doesn't exist
        if (! class_exists($fullClassName)) {
            require_once $file->getPathname();
        }

        if (! class_exists($fullClassName)) {
            return null;
        }

        $widget = new $fullClassName();

        if (! $widget instanceof BaseWidget) {
            return null;
        }

        // Check if widget should be visible
        if ($user && ! $widget->isVisible($user)) {
            return null;
        }

        return $widget->toArray($user);
    }

    /**
     * Get dashboard cards from plugins.
     */
    public function getDashboardCards(?User $user = null): Collection
    {
        return $this->getWidgetsFromPlugins($user)
            ->filter(fn ($widget) => ($widget['type'] ?? 'widget') === 'card');
    }

    /**
     * Get dashboard widgets from plugins.
     */
    public function getDashboardWidgets(?User $user = null): Collection
    {
        return $this->getWidgetsFromPlugins($user)
            ->filter(fn ($widget) => ($widget['type'] ?? 'widget') === 'widget');
    }
}
