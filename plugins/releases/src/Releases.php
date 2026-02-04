<?php

namespace ExilonCMS\Plugins\Releases;

use ExilonCMS\Attributes\PluginMeta;
use ExilonCMS\Classes\Plugin\Plugin;

#[PluginMeta(
    id: 'releases',
    name: 'Releases',
    description: 'Release notes and changelog management plugin',
    version: '1.0.0',
    author: 'ExilonStudios',
    dependencies: [
        'exiloncms' => '>=1.0.0',
    ],
)]
class Releases extends Plugin
{
    /**
     * Get plugin configuration fields for admin panel
     */
    public function getConfigFields(): array
    {
        return [
            [
                'name' => 'enable_changelog',
                'label' => 'Enable changelog',
                'type' => 'boolean',
                'default' => true,
                'description' => 'Show changelog section on release pages',
            ],
            [
                'name' => 'show_prereleases',
                'label' => 'Show pre-releases',
                'type' => 'boolean',
                'default' => true,
                'description' => 'Display pre-release versions',
            ],
            [
                'name' => 'auto_github_sync',
                'label' => 'Auto-sync with GitHub',
                'type' => 'boolean',
                'default' => true,
                'description' => 'Automatically sync releases from GitHub repositories',
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
