<?php

/**
 * ExilonCMS Installer Entry Point
 *
 * This file is the entry point for the installer.
 * It checks if ExilonCMS is installed and redirects accordingly.
 *
 * For Plesk compatibility, this file should be at the root of your hosting
 * and the document root should point to this directory.
 */

// Check if ExilonCMS is already installed
$installed = file_exists(__DIR__ . '/.env') && file_exists(__DIR__ . '/app/Http/Middleware/HandleInertiaRequests.php');

if ($installed) {
    // Read the .env file to check APP_KEY
    $envFile = __DIR__ . '/.env';
    $envContent = file_get_contents($envFile);

    // Check if using the temporary installer key
    if (strpos($envContent, 'APP_KEY=base64:hmU1T3OuvHdi5t1wULI8Xp7geI+JIWGog9pBCNxslY8=') !== false
        || strpos($envContent, 'APP_KEY="base64:hmU1T3OuvHdi5t1wULI8Xp7geI+JIWGog9pBCNxslY8="') !== false) {
        // Still in installation mode
        $installed = false;
    }
}

if ($installed) {
    // ExilonCMS is installed, redirect to the app
    $scriptName = $_SERVER['SCRIPT_NAME'];
    $requestUri = $_SERVER['REQUEST_URI'];

    // Remove index.php from the script name
    $basePath = str_replace(['/index.php', 'index.php'], '', $scriptName);

    // Redirect to public/index.php
    require __DIR__ . '/public/index.php';
    exit;
}

// Not installed, show the installer
require __DIR__ . '/install.php';
