<?php

namespace ExilonCMS\Plugins\Docs;

use ExilonCMS\Attributes\PluginMeta;
use ExilonCMS\Classes\Plugin\Plugin;

#[PluginMeta(
    id: 'docs',
    name: 'Docs',
    description: 'Modern documentation plugin with animated sidebar',
    version: '1.0.0',
    author: 'ExilonStudios',
    dependencies: [
        'exiloncms' => '>=1.0.0',
    ],
)]
class Docs extends Plugin
{
    /**
     * Get plugin configuration fields for admin panel
     */
    public function getConfigFields(): array
    {
        return [
            [
                'name' => 'sidebar_animation',
                'label' => 'Enable sidebar animations',
                'type' => 'boolean',
                'default' => true,
                'description' => 'Enable animated sidebar navigation',
            ],
            [
                'name' => 'search_enabled',
                'label' => 'Enable search functionality',
                'type' => 'boolean',
                'default' => true,
                'description' => 'Enable global search within documentation',
            ],
            [
                'name' => 'table_of_contents',
                'label' => 'Show table of contents',
                'type' => 'boolean',
                'default' => true,
                'description' => 'Display table of contents on documentation pages',
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