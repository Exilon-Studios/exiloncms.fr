<?php

namespace ExilonCMS\Plugins\Analytics;

use ExilonCMS\Attributes\PluginMeta;
use ExilonCMS\Classes\Plugin\Plugin;

#[PluginMeta(
    id: 'analytics',
    name: 'Analytics',
    description: 'Traffic analytics and user behavior tracking dashboard',
    version: '1.0.0',
    author: 'ExilonCMS',
    dependencies: [
        'exiloncms' => '>=1.0.0',
    ],
    permissions: [
        'analytics.view',
        'analytics.export',
    ],
)]
class Analytics extends Plugin
{
    /**
     * Get plugin configuration fields for admin panel
     */
    public function getConfigFields(): array
    {
        return [
            [
                'name' => 'track_admin',
                'label' => 'Track admin users',
                'type' => 'boolean',
                'default' => false,
                'description' => 'Enable analytics tracking for admin users',
            ],
            [
                'name' => 'data_retention',
                'label' => 'Data retention (days)',
                'type' => 'number',
                'default' => 90,
                'description' => 'Number of days to keep analytics data',
                'validation' => 'integer|min:30|max:365',
            ],
            [
                'name' => 'anonymize_ip',
                'label' => 'Anonymize IP addresses (GDPR)',
                'type' => 'boolean',
                'default' => true,
                'description' => 'Anonymize IP addresses for privacy compliance',
            ],
        ];
    }

    /**
     * Boot the plugin
     */
    public function boot(): void
    {
        // Routes, views, and migrations are auto-loaded by PluginLoader
        // Add custom boot logic here if needed
    }
}
