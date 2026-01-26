<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Installer Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for the ExilonCMS installer system
    |
    */

    // GitHub repository for the CMS
    'repo' => env('INSTALLER_REPO', 'Exilon-Studios/exiloncms.fr'),

    // Base URL for downloads
    'download_url' => env('INSTALLER_DOWNLOAD_URL', 'https://github.com'),

    // Marketplace API URL for plugins/themes
    'marketplace_url' => env('MARKETPLACE_URL', 'https://marketplace.exiloncms.fr'),
];
