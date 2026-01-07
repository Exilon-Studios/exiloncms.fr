<?php

return [
    'currency' => env('SHOP_CURRENCY', 'EUR'),
    'payment_gateways' => [
        'paypal' => [
            'enabled' => env('PAYPAL_ENABLED', false),
            'client_id' => env('PAYPAL_CLIENT_ID'),
            'secret' => env('PAYPAL_SECRET'),
            'sandbox' => env('PAYPAL_SANDBOX', true),
        ],
        'stripe' => [
            'enabled' => env('STRIPE_ENABLED', false),
            'public_key' => env('STRIPE_KEY'),
            'secret_key' => env('STRIPE_SECRET'),
        ],
    ],
    'vat_rate' => 20.0,
    'invoices' => [
        'prefix' => 'FAC-',
        'auto_generate' => true,
    ],
    'allow_guest_checkout' => false,
    'require_login' => true,
];
