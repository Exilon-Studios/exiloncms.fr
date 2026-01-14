<?php

// ============================================================
// EARLY INSTALL CHECK
// ============================================================
$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$requestPath = parse_url($requestUri, PHP_URL_PATH) ?? '/';

// Check if CMS is extracted (vendor folder exists)
$cmsExtracted = file_exists(__DIR__.'/../vendor')
    || file_exists(__DIR__.'/../../exiloncms/vendor')
    || file_exists(__DIR__.'/../../vendor');

if ($cmsExtracted) {
    // CMS is extracted - let Laravel handle the request
    // Include the main Laravel app
    if (file_exists(__DIR__.'/../vendor/autoload.php')) {
        require __DIR__.'/../vendor/autoload.php';
        $app = require_once __DIR__.'/../bootstrap/app.php';
        $app->handleRequest(Illuminate\Http\Request::capture());
        exit;
    } elseif (file_exists(__DIR__.'/../../vendor/autoload.php')) {
        require __DIR__.'/../../vendor/autoload.php';
        $app = require_once __DIR__.'/../../bootstrap/app.php';
        $app->handleRequest(Illuminate\Http\Request::capture());
        exit;
    }
}

// If CMS is not extracted, run the standalone installer
// Set this flag so the installer knows rewrite is working
$validInstallationUrlRewrite = true;

// Include the main installer
require __DIR__.'/../index.php';
