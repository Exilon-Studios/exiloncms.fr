<?php

namespace ExilonCMS\Plugins\Translations;

use ExilonCMS\Attributes\PluginMeta;
use ExilonCMS\Classes\Plugin\Plugin;

#[PluginMeta(
    id: 'translations',
    name: 'Translations',
    description: 'Real-time translation management with marketplace sync',
    version: '1.0.0',
    author: 'ExilonCMS',
    url: 'https://exiloncms.fr',
    dependencies: [
        'exiloncms' => '>=1.0.0',
    ],
    permissions: [
        'translations.manage',
        'translations.sync',
        'translations.import',
        'translations.export',
    ],
)]
class Translations extends Plugin
{
    /**
     * Get plugin configuration fields for admin panel
     */
    public function getConfigFields(): array
    {
        return [
            [
                'name' => 'auto_sync',
                'label' => 'Auto-sync with marketplace',
                'type' => 'boolean',
                'default' => true,
                'description' => 'Automatically sync translations with marketplace',
            ],
            [
                'name' => 'sync_interval',
                'label' => 'Sync interval (seconds)',
                'type' => 'number',
                'default' => 3600,
                'description' => 'Interval for automatic sync',
                'validation' => 'integer|min:60|max:86400',
            ],
            [
                'name' => 'fallback_locale',
                'label' => 'Fallback locale',
                'type' => 'select',
                'default' => 'en',
                'options' => [
                    'en' => 'English',
                    'fr' => 'French',
                    'de' => 'German',
                    'es' => 'Spanish',
                ],
                'description' => 'Fallback language when translation is missing',
            ],
            [
                'name' => 'enable_crowd_in',
                'label' => 'Enable CrowdIn integration',
                'type' => 'boolean',
                'default' => false,
                'description' => 'Integrate with CrowdIn for community translations',
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