<?php

namespace ExilonCMS\Classes\Widgets;

use ExilonCMS\Models\Setting;
use Illuminate\Support\Facades\Cache;

/**
 * Widget Manager
 *
 * Manages dashboard widgets from plugins.
 * Plugins can declare widgets in their plugin.json manifest.
 */
class WidgetManager
{
    /**
     * Get all available widgets from enabled plugins.
     *
     * @return array
     */
    public function getWidgets(): array
    {
        $cacheKey = 'dashboard.widgets';
        $locale = app()->getLocale();

        return Cache::remember("{$cacheKey}.{$locale}", now()->addHour(), function () {
            $enabledPlugins = setting('enabled_plugins', []);
            $widgets = [];

            foreach ($enabledPlugins as $pluginId) {
                $pluginWidgets = plugin_widgets($pluginId);
                foreach ($pluginWidgets as $widget) {
                    $widgets[] = $this->normalizeWidget($pluginId, $widget);
                }
            }

            // Sort by position
            usort($widgets, fn ($a, $b) => ($a['position'] ?? 100) <=> ($b['position'] ?? 100));

            return $widgets;
        });
    }

    /**
     * Get widgets for a specific position.
     *
     * @param  string  $position  e.g., 'dashboard_main', 'dashboard_sidebar'
     * @return array
     */
    public function getWidgetsByPosition(string $position): array
    {
        $allWidgets = $this->getWidgets();

        return array_filter($allWidgets, fn ($w) => ($w['position'] ?? '') === $position);
    }

    /**
     * Get user's configured dashboard widgets.
     *
     * @param  int|null  $userId
     * @return array
     */
    public function getUserWidgets(?int $userId = null): array
    {
        if ($userId === null) {
            $userId = auth()->id();
        }

        // Get user's dashboard layout preference
        $layout = Setting::where('name', "user_{$userId}_dashboard_layout")
            ->first();

        if ($layout) {
            return json_decode($layout->value, true) ?? [];
        }

        // Return default widgets
        return $this->getDefaultWidgets();
    }

    /**
     * Save user's dashboard widget configuration.
     *
     * @param  int  $userId
     * @param  array  $layout
     * @return void
     */
    public function saveUserWidgets(int $userId, array $layout): void
    {
        Setting::updateOrCreate(
            ['name' => "user_{$userId}_dashboard_layout"],
            ['value' => json_encode($layout)]
        );

        // Clear cache
        Cache::forget('dashboard.widgets.'.app()->getLocale());
    }

    /**
     * Get default dashboard widgets.
     *
     * @return array
     */
    public function getDefaultWidgets(): array
    {
        return [
            'main' => array_keys($this->getWidgetsByPosition('dashboard_main')),
            'sidebar' => array_keys($this->getWidgetsByPosition('dashboard_sidebar')),
        ];
    }

    /**
     * Normalize widget data.
     *
     * @param  string  $pluginId
     * @param  array  $widget
     * @return array
     */
    protected function normalizeWidget(string $pluginId, array $widget): array
    {
        return [
            'id' => $widget['id'] ?? "{$pluginId}_widget",
            'plugin' => $pluginId,
            'type' => $widget['type'] ?? 'stats_card',
            'position' => $widget['position'] ?? 'dashboard_main',
            'title' => $widget['title'] ?? ucfirst($pluginId).' Widget',
            'component' => $widget['component'] ?? null,
            'permission' => $widget['permission'] ?? null,
            'trans' => $widget['trans'] ?? false,
            'config' => $widget['config'] ?? [],
        ];
    }

    /**
     * Get widget data for rendering.
     *
     * @param  string  $widgetId
     * @return array|null
     */
    public function getWidgetData(string $widgetId): ?array
    {
        $allWidgets = $this->getWidgets();

        foreach ($allWidgets as $widget) {
            if ($widget['id'] === $widgetId) {
                return $widget;
            }
        }

        return null;
    }

    /**
     * Check if user has permission to view a widget.
     *
     * @param  array  $widget
     * @param  \ExilonCMS\Models\User|null  $user
     * @return bool
     */
    public function canViewWidget(array $widget, $user = null): bool
    {
        if ($user === null) {
            $user = auth()->user();
        }

        if (! $user) {
            return false;
        }

        // Admin users can see all widgets
        if ($user->role?->is_admin) {
            return true;
        }

        $permission = $widget['permission'] ?? null;

        if ($permission === null) {
            return true;
        }

        return $user->can($permission);
    }

    /**
     * Clear widget cache.
     *
     * @return void
     */
    public function clearCache(): void
    {
        $locales = array_keys(config('app.available_locales', ['en' => 'English', 'fr' => 'Français']));

        foreach ($locales as $locale) {
            Cache::forget("dashboard.widgets.{$locale}");
        }
    }
}
