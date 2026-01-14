<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// ============================================================
// INSTALLATION CHECK - Redirect to /install if not installed
// ============================================================
$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$requestPath = parse_url($requestUri, PHP_URL_PATH) ?? '/';

// Check if CMS is installed
$cmsInstalled = false;
if (file_exists(__DIR__.'/../.env')) {
    $cmsInstalled = file_exists(__DIR__.'/../storage/installed.json')
        || file_exists(__DIR__.'/../bootstrap/cache/installed')
        || file_exists(__DIR__.'/installed.json');
}

// If not installed and not already on /install page, redirect
if (!$cmsInstalled && $requestPath !== '/install' && !str_starts_with($requestPath, '/install/')) {
    header('Location: /install', true, 302);
    exit;
}

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$app->handleRequest(Request::capture());
