<?php

return [
    /*
    |--------------------------------------------------------------------------
    | ExilonCMS Game
    |--------------------------------------------------------------------------
    |
    | This is the game used by the website. It should NOT be changed after
    | the installation!
    |
    */

    'game' => env('EXILONCMS_GAME'),

    /*
    |--------------------------------------------------------------------------
    | ExilonCMS Version
    |--------------------------------------------------------------------------
    |
    | Current ExilonCMS version
    |
    */

    'version' => \ExilonCMS\ExilonCMS::version(),

    /*
    |--------------------------------------------------------------------------
    | GitHub Update Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for GitHub-based updates
    |
    */

    'github' => [
        'enabled' => env('GITHUB_UPDATES_ENABLED', true),
        'owner' => env('GITHUB_REPO_OWNER', 'your-username'),
        'repository' => env('GITHUB_REPO_NAME', 'outland-cms-v2'),
        'token' => env('GITHUB_TOKEN'), // Optional: for private repos or higher rate limits
        'include_prereleases' => env('GITHUB_INCLUDE_PRERELEASES', false),
        'cache_duration' => 3600, // 1 hour
    ],

    /*
    |--------------------------------------------------------------------------
    | API Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for ExilonCMS API
    |
    */

    'api' => [
        'enabled' => env('EXILONCMS_API_ENABLED', true),
        'rate_limit' => env('EXILONCMS_API_RATE_LIMIT', 60),
    ],

    /*
    |--------------------------------------------------------------------------
    | Features Flags
    |--------------------------------------------------------------------------
    |
    | Enable or disable specific features
    |
    */

    'features' => [
        'plugins' => true,
        'themes' => true,
        'discord_integration' => env('EXILONCMS_DISCORD_ENABLED', false),
        'analytics' => env('EXILONCMS_ANALYTICS_ENABLED', false),
    ],

    /*
    |--------------------------------------------------------------------------
    | Security Configuration
    |--------------------------------------------------------------------------
    |
    | Security-related settings for ExilonCMS including Content Security Policy
    | and other security headers.
    |
    */

    'security' => [
        'csp_enabled' => env('EXILONCMS_CSP_ENABLED', false),
        'csp_directives' => [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self' data:",
            "connect-src 'self'",
        ],
    ],
];
