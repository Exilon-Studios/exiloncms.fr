<?php

return [
    'tracking_enabled' => env('ANALYTICS_TRACKING_ENABLED', true),

    'data_retention_days' => env('ANALYTICS_DATA_RETENTION_DAYS', 90),

    'anonymize_ip' => env('ANALYTICS_ANONYMIZE_IP', true),

    'track_admin_users' => env('ANALYTICS_TRACK_ADMIN', false),

    'ignore_paths' => [
        'admin/*',
        'api/*',
        'nova-api/*',
    ],

    'sampling_rate' => env('ANALYTICS_SAMPLING_RATE', 100),
];
