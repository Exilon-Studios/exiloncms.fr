<?php

return [
    /*
    |--------------------------------------------------------------------------
    | MC-CMS Game
    |--------------------------------------------------------------------------
    |
    | This is the game used by the website. It should NOT be changed after
    | the installation!
    |
    */

    'game' => env('MCCMS_GAME'),

    /*
    |--------------------------------------------------------------------------
    | MC-CMS Version
    |--------------------------------------------------------------------------
    |
    | Current MC-CMS version
    |
    */

    'version' => \ExilonCMS\ExilonCMS::version(),

    /*
    |--------------------------------------------------------------------------
    | Marketplace Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for the ExilonCMS marketplace system
    |
    */

    'marketplace' => [
        'enabled' => env('EXILONCMS_MARKETPLACE_ENABLED', true),
        'url' => env('EXILONCMS_MARKETPLACE_URL', 'https://marketplace.exiloncms.com'),
        'registry_url' => env('EXILONCMS_MARKETPLACE_REGISTRY_URL', 'https://raw.githubusercontent.com/Exilon-Studios/ExilonCMS-marketplace/main'),
        'api_version' => 'v1',
        'registry' => 'registry.json',
        'cache_duration' => 3600, // 1 hour
    ],

    /*
    |--------------------------------------------------------------------------
    | GitHub Update Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for GitHub-based updates (for CMS core updates)
    | Plugins and themes still use the marketplace above
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
    | Configuration for MC-CMS API
    |
    */

    'api' => [
        'enabled' => env('MCCMS_API_ENABLED', true),
        'rate_limit' => env('MCCMS_API_RATE_LIMIT', 60),
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
        'marketplace' => true,
        'discord_integration' => env('MCCMS_DISCORD_ENABLED', false),
        'analytics' => env('MCCMS_ANALYTICS_ENABLED', false),
    ],

    /*
    |--------------------------------------------------------------------------
    | Security Configuration
    |--------------------------------------------------------------------------
    |
    | Security-related settings for MC-CMS including Content Security Policy
    | and other security headers.
    |
    */

    'security' => [
        'csp_enabled' => env('MCCMS_CSP_ENABLED', false),
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
