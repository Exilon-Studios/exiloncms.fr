<?php

namespace ExilonCMS\Plugins\Tickets;

use ExilonCMS\Attributes\PluginMeta;
use ExilonCMS\Classes\Plugin\Plugin;

#[PluginMeta(
    id: 'tickets',
    name: 'Tickets',
    version: '2.0.0',
    description: 'Système de tickets de support pour ExilonCMS',
    author: 'ExilonCMS',
    dependencies: [],
    permissions: ['tickets.view', 'tickets.admin', 'tickets.create', 'tickets.respond']
)]
class Tickets extends Plugin
{
    public function boot(): void
    {
        //
    }

    public function getConfigFields(): array
    {
        return [
            [
                'name' => 'allow_guest_tickets',
                'label' => 'Autoriser les tickets invités',
                'type' => 'boolean',
                'default' => false,
                'description' => 'Permettre aux utilisateurs non connectés de créer des tickets',
            ],
            [
                'name' => 'auto_assign',
                'label' => 'Assignation automatique',
                'type' => 'boolean',
                'default' => true,
                'description' => 'Assigner automatiquement les tickets aux administrateurs',
            ],
        ];
    }
}
