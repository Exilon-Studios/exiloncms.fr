<?php

use Illuminate\Support\Facades\File;

/**
 * Get enabled plugins from plugins.json file (Azuriom-style storage)
 */
if (! function_exists('get_enabled_plugins')) {
    function get_enabled_plugins(): array
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
}

/**
 * Save enabled plugins to plugins.json file (Azuriom-style storage)
 */
if (! function_exists('save_enabled_plugins')) {
    function save_enabled_plugins(array $plugins): void
    {
        $pluginsFile = base_path('plugins/plugins.json');
        $pluginsDir = dirname($pluginsFile);

        // Ensure plugins directory exists
        if (! File::exists($pluginsDir)) {
            File::makeDirectory($pluginsDir, 0755, true);
        }

        // Encode as JSON array with pretty print
        $content = json_encode(array_values(array_unique($plugins)), JSON_PRETTY_PRINT);

        File::put($pluginsFile, $content);
    }
}

/**
 * Check if a plugin is enabled
 */
if (! function_exists('is_plugin_enabled')) {
    function is_plugin_enabled(string $pluginId): bool
    {
        return in_array($pluginId, get_enabled_plugins(), true);
    }
}

if (! function_exists('plugin_manifest')) {
    /**
     * Get the plugin.json manifest for a given plugin ID.
     *
     * @param  string  $pluginId  The plugin ID (e.g., 'shop', 'blog')
     * @return array|null The manifest data or null if not found
     */
    function plugin_manifest(string $pluginId): ?array
    {
        $manifestPath = base_path("plugins/{$pluginId}/plugin.json");

        if (! File::exists($manifestPath)) {
            return null;
        }

        $content = File::get($manifestPath);
        $manifest = json_decode($content, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return null;
        }

        return $manifest;
    }
}

if (! function_exists('plugin_has_manifest')) {
    /**
     * Check if a plugin has a plugin.json manifest file.
     *
     * @param  string  $pluginId  The plugin ID
     * @return bool True if manifest exists and is valid JSON
     */
    function plugin_has_manifest(string $pluginId): bool
    {
        return plugin_manifest($pluginId) !== null;
    }
}

if (! function_exists('plugin_navigation')) {
    /**
     * Get the navigation items from a plugin's manifest.
     * Supports both 'navigation' and 'admin_section' formats.
     *
     * @param  string  $pluginId  The plugin ID
     * @return array Navigation items or empty array
     */
    function plugin_navigation(string $pluginId): array
    {
        $manifest = plugin_manifest($pluginId);

        if (! $manifest) {
            return [];
        }

        // Support for new 'navigation' format
        if (isset($manifest['navigation'])) {
            return $manifest['navigation'];
        }

        // Support for legacy 'admin_section' format - convert to new format
        if (isset($manifest['admin_section'])) {
            $section = $manifest['admin_section'];
            return [
                'icon' => $section['icon'] ?? 'Plugin',
                'position' => $section['position'] ?? 100,
                'trans' => $section['trans'] ?? false,
                'label' => $section['label'] ?? ucfirst($pluginId),
                'items' => $section['items'] ?? [],
            ];
        }

        return [];
    }
}

if (! function_exists('plugin_widgets')) {
    /**
     * Get the widgets from a plugin's manifest.
     *
     * @param  string  $pluginId  The plugin ID
     * @return array Widgets or empty array
     */
    function plugin_widgets(string $pluginId): array
    {
        $manifest = plugin_manifest($pluginId);

        return $manifest['widgets'] ?? [];
    }
}

if (! function_exists('plugin_events')) {
    /**
     * Get the events configuration from a plugin's manifest.
     *
     * @param  string  $pluginId  The plugin ID
     * @return array Events config or empty array
     */
    function plugin_events(string $pluginId): array
    {
        $manifest = plugin_manifest($pluginId);

        return $manifest['events'] ?? [];
    }
}

if (! function_exists('plugin_routes_config')) {
    /**
     * Get the routes configuration from a plugin's manifest.
     *
     * @param  string  $pluginId  The plugin ID
     * @return array Routes config or empty array
     */
    function plugin_routes_config(string $pluginId): array
    {
        $manifest = plugin_manifest($pluginId);

        return $manifest['routes'] ?? [];
    }
}

if (! function_exists('plugin_header_icons')) {
    /**
     * Get the header icons from a plugin's manifest.
     *
     * @param  string  $pluginId  The plugin ID
     * @return array Header icons or empty array
     */
    function plugin_header_icons(string $pluginId): array
    {
        $manifest = plugin_manifest($pluginId);

        return $manifest['header_icons'] ?? [];
    }
}

if (! function_exists('plugin_sidebar_links')) {
    /**
     * Get the sidebar links from a plugin's manifest for a specific context.
     *
     * @param  string  $pluginId  The plugin ID
     * @param  string  $context  The context: 'public', 'user', or 'admin'
     * @return array Sidebar links or empty array
     */
    function plugin_sidebar_links(string $pluginId, string $context = 'public'): array
    {
        $manifest = plugin_manifest($pluginId);

        if (! $manifest) {
            return [];
        }

        // Check for context-specific sidebar links
        $sidebarLinks = $manifest['sidebar_links'] ?? [];

        if (isset($sidebarLinks[$context])) {
            return $sidebarLinks[$context];
        }

        // Fallback to legacy 'sidebar' for public context
        if ($context === 'public' && isset($manifest['sidebar'])) {
            return $manifest['sidebar'];
        }

        return [];
    }
}

if (! function_exists('plugin_widgets_by_context')) {
    /**
     * Get the widgets from a plugin's manifest for a specific context.
     *
     * @param  string  $pluginId  The plugin ID
     * @param  string  $context  The context: 'user' or 'admin'
     * @return array Widgets or empty array
     */
    function plugin_widgets_by_context(string $pluginId, string $context = 'user'): array
    {
        $manifest = plugin_manifest($pluginId);

        if (! $manifest) {
            return [];
        }

        $widgets = $manifest['widgets'] ?? [];

        // Filter widgets by context
        return array_filter($widgets, function ($widget) use ($context) {
            $widgetContext = $widget['context'] ?? 'user';
            return $widgetContext === $context || $widgetContext === 'both';
        });
    }
}

if (! function_exists('getPublicSidebarLinks')) {
    /**
     * Get all public sidebar links from enabled plugins.
     * Links are shown to visitors (non-authenticated users).
     *
     * @return array Array of sidebar links with label, href, icon, etc.
     */
    function getPublicSidebarLinks(): array
    {
        $enabledPlugins = get_enabled_plugins();
        $links = [];

        foreach ($enabledPlugins as $pluginId) {
            $pluginLinks = plugin_sidebar_links($pluginId, 'public');
            foreach ($pluginLinks as $link) {
                $links[] = array_merge($link, [
                    'plugin' => $pluginId,
                ]);
            }
        }

        // Sort by position
        usort($links, fn ($a, $b) => ($a['position'] ?? 100) <=> ($b['position'] ?? 100));

        return $links;
    }
}

if (! function_exists('getUserSidebarLinks')) {
    /**
     * Get all user sidebar links from enabled plugins.
     * Links are shown to authenticated users in their dashboard.
     *
     * @return array Array of sidebar links with label, href, icon, etc.
     */
    function getUserSidebarLinks(): array
    {
        $enabledPlugins = get_enabled_plugins();
        $links = [];

        foreach ($enabledPlugins as $pluginId) {
            $pluginLinks = plugin_sidebar_links($pluginId, 'user');
            foreach ($pluginLinks as $link) {
                $links[] = array_merge($link, [
                    'plugin' => $pluginId,
                ]);
            }
        }

        // Sort by position
        usort($links, fn ($a, $b) => ($a['position'] ?? 100) <=> ($b['position'] ?? 100));

        return $links;
    }
}

if (! function_exists('getAdminSidebarLinks')) {
    /**
     * Get all admin sidebar links from enabled plugins.
     * Links are shown in the admin panel sidebar.
     *
     * @return array Array of sidebar links with label, href, icon, permission, etc.
     */
    function getAdminSidebarLinks(): array
    {
        $enabledPlugins = get_enabled_plugins();
        $links = [];

        foreach ($enabledPlugins as $pluginId) {
            $pluginLinks = plugin_sidebar_links($pluginId, 'admin');
            foreach ($pluginLinks as $link) {
                $links[] = array_merge($link, [
                    'plugin' => $pluginId,
                ]);
            }
        }

        // Sort by position
        usort($links, fn ($a, $b) => ($a['position'] ?? 100) <=> ($b['position'] ?? 100));

        return $links;
    }
}

if (! function_exists('getUserWidgets')) {
    /**
     * Get all user dashboard widgets from enabled plugins.
     *
     * @return array Array of widget definitions
     */
    function getUserWidgets(): array
    {
        $enabledPlugins = get_enabled_plugins();
        $widgets = [];

        foreach ($enabledPlugins as $pluginId) {
            $pluginWidgets = plugin_widgets_by_context($pluginId, 'user');
            foreach ($pluginWidgets as $widget) {
                $widgets[] = array_merge($widget, [
                    'plugin' => $pluginId,
                ]);
            }
        }

        // Sort by position
        usort($widgets, fn ($a, $b) => ($a['position'] ?? 100) <=> ($b['position'] ?? 100));

        return $widgets;
    }
}

if (! function_exists('getAdminWidgets')) {
    /**
     * Get all admin dashboard widgets from enabled plugins.
     *
     * @return array Array of widget definitions
     */
    function getAdminWidgets(): array
    {
        $enabledPlugins = get_enabled_plugins();
        $widgets = [];

        foreach ($enabledPlugins as $pluginId) {
            $pluginWidgets = plugin_widgets_by_context($pluginId, 'admin');
            foreach ($pluginWidgets as $widget) {
                $widgets[] = array_merge($widget, [
                    'plugin' => $pluginId,
                ]);
            }
        }

        // Sort by position
        usort($widgets, fn ($a, $b) => ($a['position'] ?? 100) <=> ($b['position'] ?? 100));

        return $widgets;
    }
}

if (! function_exists('getSidebarHeaderElements')) {
    /**
     * Get all sidebar header elements from enabled plugins.
     * These are icons/buttons shown in the header area.
     *
     * @return array Array of header elements
     */
    function getSidebarHeaderElements(): array
    {
        $enabledPlugins = get_enabled_plugins();
        $elements = [];

        foreach ($enabledPlugins as $pluginId) {
            $pluginElements = plugin_header_icons($pluginId);
            foreach ($pluginElements as $element) {
                $elements[] = array_merge($element, [
                    'plugin' => $pluginId,
                ]);
            }
        }

        // Sort by position
        usort($elements, fn ($a, $b) => ($a['position'] ?? 100) <=> ($b['position'] ?? 100));

        return $elements;
    }
}

if (! function_exists('getWidgets')) {
    /**
     * Get all widgets from enabled plugins (both user and admin).
     *
     * @param  string|null  $context  Optional context filter: 'user', 'admin', or null for all
     * @return array Array of widget definitions
     */
    function getWidgets(?string $context = null): array
    {
        if ($context === 'user') {
            return getUserWidgets();
        }

        if ($context === 'admin') {
            return getAdminWidgets();
        }

        // Return all widgets combined
        return array_merge(getUserWidgets(), getAdminWidgets());
    }
}

if (! function_exists('getSidebarLinks')) {
    /**
     * Get all sidebar links from enabled plugins.
     *
     * @param  string|null  $context  Optional context filter: 'public', 'user', 'admin', or null for all
     * @return array Array of sidebar links
     */
    function getSidebarLinks(?string $context = null): array
    {
        if ($context === 'public') {
            return getPublicSidebarLinks();
        }

        if ($context === 'user') {
            return getUserSidebarLinks();
        }

        if ($context === 'admin') {
            return getAdminSidebarLinks();
        }

        // Return all links combined
        return array_merge(
            getPublicSidebarLinks(),
            getUserSidebarLinks(),
            getAdminSidebarLinks()
        );
    }
}

if (! function_exists('get_plugin_instance')) {
    /**
     * Get an instance of a plugin by ID
     *
     * @param  string  $pluginId  The plugin ID
     * @return \ExilonCMS\Classes\Plugin\Plugin|null The plugin instance or null if not found/enabled
     */
    function get_plugin_instance(string $pluginId): ?\ExilonCMS\Classes\Plugin\Plugin
    {
        if (! is_plugin_enabled($pluginId)) {
            return null;
        }

        $pluginLoader = app(\ExilonCMS\Classes\Plugin\PluginLoader::class);
        $plugin = $pluginLoader->getPlugin($pluginId);

        return $plugin ?: null;
    }
}

if (! function_exists('plugin_get_sidebar_links')) {
    /**
     * Get sidebar links from a plugin instance (calls PHP method if available)
     * Falls back to plugin.json if method is not overridden
     *
     * @param  string  $pluginId  The plugin ID
     * @param  string  $context  The context: 'public', 'user', or 'admin'
     * @return array Sidebar links or empty array
     */
    function plugin_get_sidebar_links(string $pluginId, string $context = 'public'): array
    {
        $plugin = get_plugin_instance($pluginId);

        if ($plugin) {
            $links = $plugin->getSidebarLinks();
            return $links[$context] ?? [];
        }

        // Fallback to reading from plugin.json
        return plugin_sidebar_links($pluginId, $context);
    }
}

if (! function_exists('plugin_get_widgets')) {
    /**
     * Get widgets from a plugin instance (calls PHP method if available)
     * Falls back to plugin.json if method is not overridden
     *
     * @param  string  $pluginId  The plugin ID
     * @return array Widgets or empty array
     */
    function plugin_get_widgets(string $pluginId): array
    {
        $plugin = get_plugin_instance($pluginId);

        if ($plugin) {
            return $plugin->getWidgets();
        }

        // Fallback to reading from plugin.json
        return plugin_widgets($pluginId);
    }
}

if (! function_exists('plugin_get_header_elements')) {
    /**
     * Get header elements from a plugin instance (calls PHP method if available)
     * Falls back to plugin.json if method is not overridden
     *
     * @param  string  $pluginId  The plugin ID
     * @return array Header elements or empty array
     */
    function plugin_get_header_elements(string $pluginId): array
    {
        $plugin = get_plugin_instance($pluginId);

        if ($plugin) {
            return $plugin->getHeaderElements();
        }

        // Fallback to reading from plugin.json
        return plugin_header_icons($pluginId);
    }
}

if (! function_exists('plugin_get_navigation')) {
    /**
     * Get navigation items from a plugin instance (calls PHP method if available)
     * Falls back to plugin.json if method is not overridden
     *
     * @param  string  $pluginId  The plugin ID
     * @return array Navigation items or empty array
     */
    function plugin_get_navigation(string $pluginId): array
    {
        $plugin = get_plugin_instance($pluginId);

        if ($plugin) {
            return $plugin->getNavigation();
        }

        // Fallback to reading from plugin.json
        return plugin_navigation($pluginId);
    }
}
