<?php

namespace ExilonCMS\Plugins\Shop;

use ExilonCMS\Attributes\PluginMeta;
use ExilonCMS\Classes\Plugin\Plugin;

#[PluginMeta(
    id: 'shop',
    name: 'Shop',
    description: 'Système de boutique pour ExilonCMS - Permet aux utilisateurs d\'acheter des items avec leur monnaie virtuelle',
    version: '1.0.0',
    author: 'ExilonCMS',
    url: 'https://exiloncms.fr',
    dependencies: [
        'exiloncms' => '>=1.0.0',
        'translations' => '>=1.0.0',
    ],
    permissions: [
        'shop.manage',
        'shop.products.create',
        'shop.products.edit',
        'shop.products.delete',
        'shop.orders.view',
        'shop.payments.manage',
    ],
)]
class Shop extends Plugin
{
    /**
     * Get plugin configuration fields for admin panel
     */
    public function getConfigFields(): array
    {
        return [
            [
                'name' => 'currency',
                'label' => 'Devise',
                'type' => 'select',
                'default' => 'EUR',
                'options' => [
                    'EUR' => 'Euro (€)',
                    'USD' => 'Dollar ($)',
                    'GBP' => 'Livre (£)',
                    'CAD' => 'Dollar canadien (C$)',
                ],
                'description' => 'Devise utilisée par la boutique',
            ],
            [
                'name' => 'enable_guest_checkout',
                'label' => 'Activer le paiement invité',
                'type' => 'boolean',
                'default' => false,
                'description' => 'Autoriser les invités à passer commande sans créer de compte',
            ],
            [
                'name' => 'enable_stock_management',
                'label' => 'Activer la gestion des stocks',
                'type' => 'boolean',
                'default' => true,
                'description' => 'Suivre les niveaux de stock des produits',
            ],
            [
                'name' => 'enable_tax',
                'label' => 'Activer les taxes',
                'type' => 'boolean',
                'default' => false,
                'description' => 'Calculer et appliquer les taxes sur les commandes',
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