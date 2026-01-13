<?php
// ExilonCMS Diagnostic Script
header('Content-Type: text/plain; charset=utf-8');

echo "=== ExilonCMS Diagnostic ===\n\n";

echo "PHP Version: " . PHP_VERSION . "\n";
echo "Required: 8.2+\n";
echo version_compare(PHP_VERSION, '8.2', '>=') ? "✓ OK\n\n" : "✗ FAIL\n\n";

echo "=== File Structure ===\n";
$files = [
    'index.php',
    'public/index.php',
    'vendor/autoload.php',
    'bootstrap/app.php',
    '.env',
];

foreach ($files as $file) {
    $exists = file_exists(__DIR__ . '/../' . $file);
    echo ($exists ? '✓' : '✗') . " $file\n";
}

echo "\n=== Directory Permissions ===\n";
$dirs = [
    'storage',
    'storage/logs',
    'storage/framework',
    'storage/framework/cache',
    'storage/framework/sessions',
    'storage/framework/views',
    'bootstrap/cache',
];

foreach ($dirs as $dir) {
    $path = __DIR__ . '/../' . $dir;
    if (is_dir($path)) {
        $writable = is_writable($path);
        $perms = substr(sprintf('%o', fileperms($path)), -4);
        echo ($writable ? '✓' : '✗') . " $dir (perms: $perms)\n";
    } else {
        echo "✗ $dir (not a directory)\n";
    }
}

echo "\n=== Required Extensions ===\n";
$extensions = ['bcmath', 'ctype', 'json', 'mbstring', 'openssl', 'PDO', 'tokenizer', 'xml', 'curl', 'fileinfo', 'zip'];
foreach ($extensions as $ext) {
    echo (extension_loaded($ext) ? '✓' : '✗') . " $ext\n";
}

echo "\n=== Testing vendor/autoload.php ===\n";
if (file_exists(__DIR__ . '/../vendor/autoload.php')) {
    echo "✓ vendor/autoload.php exists\n";
    try {
        require_once __DIR__ . '/../vendor/autoload.php';
        echo "✓ autoload loaded successfully\n";
        if (class_exists('Illuminate\Foundation\Application')) {
            echo "✓ Laravel classes available\n";
        } else {
            echo "✗ Laravel classes NOT found\n";
        }
    } catch (Throwable $e) {
        echo "✗ Error loading autoload: " . $e->getMessage() . "\n";
    }
} else {
    echo "✗ vendor/autoload.php NOT found\n";
}

echo "\n=== Testing bootstrap/app.php ===\n";
if (file_exists(__DIR__ . '/../bootstrap/app.php')) {
    echo "✓ bootstrap/app.php exists\n";
}

echo "\n=== .env file ===\n";
if (file_exists(__DIR__ . '/../.env')) {
    echo "✓ .env exists\n";
    $content = file_get_contents(__DIR__ . '/../.env');
    echo "  Size: " . strlen($content) . " bytes\n";
} else {
    echo "✗ .env NOT found\n";
}

echo "\n=== Last errors ===\n";
if (function_exists('error_get_last')) {
    $error = error_get_last();
    if ($error) {
        echo "Type: {$error['type']}\n";
        echo "Message: {$error['message']}\n";
        echo "File: {$error['file']}:{$error['line']}\n";
    } else {
        echo "No errors recorded\n";
    }
}

echo "\n=== Done ===\n";
