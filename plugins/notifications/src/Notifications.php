<?php

namespace ExilonCMS\Plugins\Notifications;

use ExilonCMS\Attributes\PluginMeta;
use ExilonCMS\Classes\Plugin\Plugin;

#[PluginMeta(
    id: 'notifications',
    name: 'Notifications',
    description: 'Multi-channel notification system with email, SMS, and push notifications',
    version: '1.0.0',
    author: 'ExilonCMS',
    dependencies: [
        'exiloncms' => '>=1.0.0',
    ],
    permissions: [
        'notifications.manage',
        'notifications.templates.manage',
        'notifications.send',
    ],
)]
class Notifications extends Plugin
{
    /**
     * Get plugin configuration fields for admin panel
     */
    public function getConfigFields(): array
    {
        return [
            [
                'name' => 'email_enabled',
                'label' => 'Enable email notifications',
                'type' => 'boolean',
                'default' => true,
                'description' => 'Enable email channel for notifications',
            ],
            [
                'name' => 'sms_enabled',
                'label' => 'Enable SMS notifications',
                'type' => 'boolean',
                'default' => false,
                'description' => 'Enable SMS channel for notifications',
            ],
            [
                'name' => 'push_enabled',
                'label' => 'Enable push notifications',
                'type' => 'boolean',
                'default' => false,
                'description' => 'Enable push notification channel',
            ],
            [
                'name' => 'queue_notifications',
                'label' => 'Queue notifications',
                'type' => 'boolean',
                'default' => true,
                'description' => 'Process notifications asynchronously',
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