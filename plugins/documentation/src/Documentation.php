<?php

namespace ExilonCMS\Plugins\Documentation;

use ExilonCMS\Attributes\PluginMeta;
use ExilonCMS\Classes\Plugin\Plugin;

#[PluginMeta(
    id: 'documentation',
    name: 'Documentation',
    version: '1.0.0',
    description: 'Système de documentation intégré avec support multilingue',
    author: 'ExilonCMS',
    dependencies: [],
    permissions: ['documentation.view', 'documentation.admin']
)]
class Documentation extends Plugin
{
    public function boot(): void
    {
        // Routes are loaded automatically by PluginServiceProvider
    }

    public function getConfigFields(): array
    {
        return [
            [
                'name' => 'default_locale',
                'label' => 'Langue par défaut',
                'type' => 'select',
                'default' => 'fr',
                'options' => [
                    'fr' => 'Français',
                    'en' => 'English',
                ],
            ],
            [
                'name' => 'cache_enabled',
                'label' => 'Activer le cache',
                'type' => 'boolean',
                'default' => true,
            ],
            [
                'name' => 'cache_duration',
                'label' => 'Durée du cache (secondes)',
                'type' => 'integer',
                'default' => 3600,
            ],
            [
                'name' => 'comments_enabled',
                'label' => 'Activer les commentaires',
                'type' => 'boolean',
                'default' => true,
            ],
        ];
    }
}
