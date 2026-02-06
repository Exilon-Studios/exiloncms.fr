<?php

return [
    'currency' => [
        'type' => 'select',
        'label' => 'Currency',
        'description' => 'Currency used in the shop',
        'default' => 'EUR',
        'options' => [
            'EUR' => 'Euro (€)',
            'USD' => 'Dollar ($)',
            'GBP' => 'Pound (£)',
            'CAD' => 'Canadian Dollar (C$)',
        ],
    ],

    'enable_guest_checkout' => [
        'type' => 'boolean',
        'label' => 'Enable Guest Checkout',
        'description' => 'Allow unauthenticated users to place orders',
        'default' => false,
    ],

    'enable_stock_management' => [
        'type' => 'boolean',
        'label' => 'Enable Stock Management',
        'description' => 'Track product stock levels',
        'default' => true,
    ],

    'enable_tax' => [
        'type' => 'boolean',
        'label' => 'Enable Tax',
        'description' => 'Calculate and apply taxes to orders',
        'default' => false,
    ],

    'tax_rate' => [
        'type' => 'number',
        'label' => 'Tax Rate (%)',
        'description' => 'Tax percentage to apply',
        'default' => 20,
        'min' => 0,
        'max' => 100,
    ],

    'items_per_page' => [
        'type' => 'number',
        'label' => 'Items Per Page',
        'description' => 'Number of items to display per page',
        'default' => 12,
        'min' => 6,
        'max' => 50,
    ],

    'enable_reviews' => [
        'type' => 'boolean',
        'label' => 'Enable Reviews',
        'description' => 'Allow users to review products',
        'default' => true,
    ],

    'auto_approve_reviews' => [
        'type' => 'boolean',
        'label' => 'Auto-approve Reviews',
        'description' => 'Reviews are published without moderation',
        'default' => false,
    ],
];
