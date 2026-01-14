<?php
// Simple diagnostic - no Laravel needed
$basePath = dirname(__DIR__);

echo "<h2>ExilonCMS Diagnostic</h2>";
echo "<style>body{font-family:sans-serif;padding:20px;background:#1a1a1a;color:#fff;} .ok{color:#22c55e;} .err{color:#ef4444;} pre{background:#2a2a2a;padding:15px;border-radius:8px;margin:10px 0;}</style>";

// Check base path
echo "<h3>📁 Paths</h3>";
echo "<p>Base path: <code>" . htmlspecialchars($basePath) . "</code></p>";
echo "<p>Current file: <code>" . htmlspecialchars(__FILE__) . "</code></p>";

// Check vendor
echo "<h3>📦 Dependencies</h3>";
if (file_exists($basePath . '/vendor/autoload.php')) {
    echo "<p class='ok'>✓ vendor/autoload.php exists</p>";
} else {
    echo "<p class='err'>✗ vendor/autoload.php NOT FOUND</p>";
    echo "<p><strong>Solution:</strong> <code>cd exiloncms && composer install --no-dev</code></p>";
}

// Check .env
echo "<h3>⚙️ Config</h3>";
if (file_exists($basePath . '/.env')) {
    echo "<p class='ok'>✓ .env exists</p>";
    $envContent = file_get_contents($basePath . '/.env');
    if (strpos($envContent, 'APP_KEY=base64') !== false) {
        echo "<p class='ok'>✓ APP_KEY is set</p>";
    } else {
        echo "<p class='err'>✗ APP_KEY NOT SET</p>";
        echo "<p><strong>Solution:</strong> <code>cd exiloncms && php artisan key:generate</code></p>";
    }
} else {
    echo "<p class='err'>✗ .env NOT FOUND</p>";
    echo "<p><strong>Solution:</strong> <code>cd exiloncms && cp .env.example .env && php artisan key:generate</code></p>";
}

// Check storage
echo "<h3>📂 Storage Permissions</h3>";
$storageDirs = ['storage/framework', 'storage/framework/cache', 'storage/framework/sessions', 'storage/framework/views', 'storage/logs', 'bootstrap/cache'];
foreach ($storageDirs as $dir) {
    $fullPath = $basePath . '/' . $dir;
    if (file_exists($fullPath)) {
        $perms = substr(sprintf('%o', fileperms($fullPath)), -4);
        $writable = is_writable($fullPath);
        $status = $writable ? '✓' : '⚠';
        echo "<p class='{$writable ? 'ok' : 'err'}'>$status $dir (perms: $perms)</p>";
    } else {
        echo "<p class='err'>✗ $dir NOT FOUND</p>";
    }
}

// Test simple Laravel boot
echo "<h3>🚀 Laravel Boot Test</h3>";
try {
    if (file_exists($basePath . '/vendor/autoload.php')) {
        require $basePath . '/vendor/autoload.php';
        echo "<p class='ok'>✓ Composer autoload loaded</p>";

        if (file_exists($basePath . '/bootstrap/app.php')) {
            $app = require_once $basePath . '/bootstrap/app.php';
            echo "<p class='ok'>✓ Laravel app boot OK</p>";
        } else {
            echo "<p class='err'>✗ bootstrap/app.php NOT FOUND</p>";
        }
    }
} catch (Throwable $e) {
    echo "<p class='err'>✗ ERROR: " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<pre>" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
}
