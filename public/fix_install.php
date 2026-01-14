<?php
/**
 * Quick Fix Script - Creates .env and database for cPanel installations
 * Run this after the installer fails to set up basic files
 */

$root = dirname(__DIR__);

// 1. Create .env file
$envContent = <<<ENV
APP_NAME="ExilonCMS"
APP_ENV=production
APP_KEY=base64:hmU1T3OuvHdi5t1wULI8Xp7geI+JIWGog9pBCNxslY8=
APP_DEBUG=false
APP_URL=https://demo.exiloncms.fr

LOG_CHANNEL=stack
LOG_LEVEL=debug

DB_CONNECTION=sqlite

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120
ENV;

$envPath = $root.'/.env';
if (file_put_contents($envPath, $envContent)) {
    $success[] = "Created .env file";
} else {
    $errors[] = "Failed to create .env file";
}

// 2. Create database directory and file
$dbDir = $root.'/database';
if (! is_dir($dbDir)) {
    mkdir($dbDir, 0755, true);
    $success[] = "Created database directory";
}

$dbFile = $dbDir.'/database.sqlite';
if (! file_exists($dbFile)) {
    touch($dbFile);
    $success[] = "Created database.sqlite file";
} else {
    $success[] = "database.sqlite already exists";
}

// 3. Create storage directories
$dirs = [
    'storage/framework',
    'storage/framework/cache',
    'storage/framework/sessions',
    'storage/framework/views',
    'storage/logs',
    'bootstrap/cache',
];

foreach ($dirs as $dir) {
    $path = $root.'/'.$dir;
    if (! is_dir($path)) {
        mkdir($path, 0755, true);
    }
}
$success[] = "Verified storage directories";

// 4. Check index.php
$indexPath = $root.'/index.php';
if (file_exists($indexPath)) {
    $content = file_get_contents($indexPath);
    if (strpos($content, "__DIR__.'/../vendor/") !== false) {
        // Need to fix paths
        $content = str_replace("__DIR__.'/../vendor/", "__DIR__.'/vendor/", $content);
        $content = str_replace("__DIR__.'/../bootstrap/", "__DIR__.'/bootstrap/", $content);
        $content = str_replace("__DIR__.'/../storage/", "__DIR__.'/storage/", $content);
        file_put_contents($indexPath, $content);
        $success[] = "Fixed paths in index.php";
    } else {
        $success[] = "index.php paths already correct";
    }
} else {
    $errors[] = "index.php not found!";
}

// Output result
header('Content-Type: application/json');
echo json_encode([
    'success' => $success ?? [],
    'errors' => $errors ?? [],
    'next_step' => 'Go to /install to complete the installation',
], JSON_PRETTY_PRINT);
