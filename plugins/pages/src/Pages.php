<?php

namespace ExilonCMS\Plugins\Pages;

use ExilonCMS\Attributes\PluginMeta;
use ExilonCMS\Classes\Plugin\Plugin;

#[PluginMeta(
    id: 'pages',
    name: 'Pages',
    description: 'Static page management with rich text editor',
    version: '1.0.0',
    author: 'ExilonCMS',
    url: 'https://exiloncms.fr',
    dependencies: [
        'exiloncms' => '>=1.0.0',
    ],
    permissions: [
        'pages.create',
        'pages.edit',
        'pages.delete',
        'pages.publish',
    ],
)]
class Pages extends Plugin
{
    /**
     * Get plugin configuration fields for admin panel
     */
    public function getConfigFields(): array
    {
        return [
            [
                'name' => 'allow_public_access',
                'label' => 'Allow public access to pages',
                'type' => 'boolean',
                'default' => true,
                'description' => 'Allow unauthenticated users to view pages',
            ],
            [
                'name' => 'enable_drafts',
                'label' => 'Enable page drafts',
                'type' => 'boolean',
                'default' => true,
                'description' => 'Allow saving pages as drafts',
            ],
            [
                'name' => 'enable_scheduling',
                'label' => 'Enable scheduling',
                'type' => 'boolean',
                'default' => true,
                'description' => 'Allow scheduling pages for future publication',
            ],
            [
                'name' => 'enable_versions',
                'label' => 'Enable page versions',
                'type' => 'boolean',
                'default' => true,
                'description' => 'Track page revisions and versions',
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
