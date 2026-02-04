<?php

return [
    'currency_name' => [
        'type' => 'text',
        'label' => 'Currency Name',
        'description' => 'The name of your virtual currency (e.g., Coins, Points, Credits)',
        'default' => 'Coins',
    ],

    'currency_symbol' => [
        'type' => 'text',
        'label' => 'Currency Symbol',
        'description' => 'The symbol displayed before amounts (e.g., $, €, £)',
        'default' => '$',
    ],

    'enable_shop' => [
        'type' => 'boolean',
        'label' => 'Enable Shop',
        'description' => 'Enable or disable the shop functionality',
        'default' => true,
    ],

    'items_per_page' => [
        'type' => 'number',
        'label' => 'Items per Page',
        'description' => 'Number of items to display per page in the shop',
        'default' => 12,
        'min' => 6,
        'max' => 48,
    ],

    'enable_featured_items' => [
        'type' => 'boolean',
        'label' => 'Enable Featured Items',
        'description' => 'Show a section for featured items on the shop page',
        'default' => true,
    ],

    'auto_deliver' => [
        'type' => 'boolean',
        'label' => 'Auto-Delivery',
        'description' => 'Automatically deliver items after purchase (if supported by game server)',
        'default' => false,
    ],
];
