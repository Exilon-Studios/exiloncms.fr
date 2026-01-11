<?php
// Simple diagnostic file - bypass Laravel entirely
header('Content-Type: application/json');

$results = [];

// 1. Check if database file exists
$dbFile = realpath(__DIR__ . '/../database/database.sqlite');
$results['database_file'] = [
    'exists' => file_exists($dbFile),
    'path' => $dbFile,
    'writable' => $dbFile ? is_writable($dbFile) : false,
];

// 2. Try to connect to database
try {
    $pdo = new PDO('sqlite:' . __DIR__ . '/../database/database.sqlite');
    $results['db_connection'] = 'OK';

    // Check settings table
    $stmt = $pdo->query("SELECT name FROM sqlite_master WHERE type='table' AND name='settings'");
    $results['settings_table_exists'] = $stmt->fetch() !== false;

    // Get installed_at setting
    $stmt = $pdo->query("SELECT * FROM settings WHERE `key`='installed_at'");
    $installed = $stmt->fetch(PDO::FETCH_ASSOC);
    $results['installed_at_setting'] = $installed;

    // Get all settings
    $stmt = $pdo->query("SELECT * FROM settings");
    $results['all_settings'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

} catch (Exception $e) {
    $results['db_error'] = $e->getMessage();
}

// 3. Check files
$files = [
    'storage/installed.json' => realpath(__DIR__ . '/../storage/installed.json'),
    'bootstrap/cache/installed' => realpath(__DIR__ . '/../bootstrap/cache/installed'),
    'public/installed.json' => realpath(__DIR__ . '/installed.json'),
];

foreach ($files as $name => $path) {
    $results[$name] = [
        'path' => $path,
        'exists' => $path ? file_exists($path) : false,
        'content' => $path && file_exists($path) ? file_get_contents($path) : null,
    ];
}

// 4. Check .env
$envPath = realpath(__DIR__ . '/../.env');
$results['.env'] = [
    'exists' => file_exists($envPath),
    'content' => file_exists($envPath) ? file_get_contents($envPath) : null,
];

echo json_encode($results, JSON_PRETTY_PRINT);
