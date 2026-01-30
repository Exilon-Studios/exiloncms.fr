<?php

namespace ExilonCMS\Plugins\Legal;

use ExilonCMS\Attributes\PluginMeta;
use ExilonCMS\Classes\Plugin\Plugin;

#[PluginMeta(
    id: 'legal',
    name: 'Legal Pages',
    description: 'GDPR compliant legal pages management (Privacy, Terms, Cookies, Refund)',
    version: '1.0.0',
    author: 'ExilonCMS',
    url: 'https://exiloncms.fr',
    dependencies: [
        'exiloncms' => '>=1.0.0',
    ],
    permissions: [
        'legal.manage',
        'legal.publish',
    ],
)]
class Legal extends Plugin
{
    /**
     * Get plugin configuration fields for admin panel
     */
    public function getConfigFields(): array
    {
        return [
            [
                'name' => 'default_locale',
                'label' => 'Default locale for legal pages',
                'type' => 'select',
                'default' => 'en',
                'options' => [
                    'en' => 'English',
                    'fr' => 'French',
                    'de' => 'German',
                    'es' => 'Spanish',
                ],
                'description' => 'Default language for legal pages',
            ],
            [
                'name' => 'show_last_updated',
                'label' => 'Show last updated date',
                'type' => 'boolean',
                'default' => true,
                'description' => 'Display last updated date on legal pages',
            ],
            [
                'name' => 'require_confirmation',
                'label' => 'Require confirmation',
                'type' => 'boolean',
                'default' => true,
                'description' => 'Require user confirmation before accessing content',
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