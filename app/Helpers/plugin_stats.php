<?php

/**
 * Get dashboard stats from all enabled plugins
 * Plugins can provide stats by implementing getDashboardStats() method
 *
 * @return array Array of stats from all plugins
 */
if (! function_exists('get_plugin_dashboard_stats')) {
    function get_plugin_dashboard_stats(): array
    {
        $enabledPlugins = get_enabled_plugins();
        $stats = [];

        foreach ($enabledPlugins as $pluginId) {
            $plugin = get_plugin_instance($pluginId);

            if ($plugin && method_exists($plugin, 'getDashboardStats')) {
                $pluginStats = $plugin->getDashboardStats();
                if (is_array($pluginStats)) {
                    $stats = array_merge($stats, $pluginStats);
                }
            }
        }

        return $stats;
    }
}
