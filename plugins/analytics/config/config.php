<?php

return [
    'tracking_enabled' => [
        'type' => 'boolean',
        'label' => 'Enable Tracking',
        'description' => 'Enable visitor tracking and analytics',
        'default' => true,
    ],

    'anonymize_ip' => [
        'type' => 'boolean',
        'label' => 'Anonymize IP Addresses',
        'description' => 'Anonymize user IP addresses for privacy compliance (GDPR)',
        'default' => true,
    ],

    'track_admin_users' => [
        'type' => 'boolean',
        'label' => 'Track Admin Users',
        'description' => 'Include admin users in analytics tracking',
        'default' => false,
    ],

    'data_retention_days' => [
        'type' => 'number',
        'label' => 'Data Retention (Days)',
        'description' => 'How many days to keep analytics data before automatic cleanup',
        'default' => 90,
        'min' => 7,
        'max' => 365,
    ],

    'tracking_code' => [
        'type' => 'textarea',
        'label' => 'Custom Tracking Code',
        'description' => 'Add custom tracking scripts (Google Analytics, etc.)',
        'default' => '',
    ],
];
