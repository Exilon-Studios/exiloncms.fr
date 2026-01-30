<?php

namespace ExilonCMS\Plugins\Votes;

use ExilonCMS\Attributes\PluginMeta;
use ExilonCMS\Classes\Plugin\Plugin;

#[PluginMeta(
    id: 'votes',
    name: 'Votes & Rewards',
    description: 'Voting system with automatic rewards (money, items, roles, commands)',
    version: '1.0.0',
    author: 'ExilonCMS',
    dependencies: [
        'exiloncms' => '>=1.0.0',
    ],
    permissions: [
        'votes.manage',
        'votes.rewards.manage',
    ],
)]
class Votes extends Plugin
{
    /**
     * Get plugin configuration fields for admin panel
     */
    public function getConfigFields(): array
    {
        return [
            [
                'name' => 'vote_cooldown',
                'label' => 'Vote cooldown (hours)',
                'type' => 'number',
                'default' => 24,
                'description' => 'Time between allowed votes',
                'validation' => 'integer|min:1|max:168',
            ],
            [
                'name' => 'auto_reward',
                'label' => 'Automatically give rewards',
                'type' => 'boolean',
                'default' => true,
                'description' => 'Give rewards immediately after vote',
            ],
            [
                'name' => 'enable_multiple_servers',
                'label' => 'Enable multiple servers',
                'type' => 'boolean',
                'default' => true,
                'description' => 'Allow voting for multiple servers',
            ],
            [
                'name' => 'enable_verification',
                'label' => 'Enable vote verification',
                'type' => 'boolean',
                'default' => true,
                'description' => 'Verify votes through third-party services',
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