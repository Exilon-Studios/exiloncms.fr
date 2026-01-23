<?php

$zipFile = __DIR__ . '/exiloncms-installer.zip';
$installerDir = __DIR__ . '/installer';

// Remove old zip
if (file_exists($zipFile)) {
    unlink($zipFile);
}

$zip = new ZipArchive();
if ($zip->open($zipFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
    die("Failed to create ZIP");
}

// Add files
$zip->addFile($installerDir . '/index.php', 'index.php');
$zip->addFile($installerDir . '/.htaccess', '.htaccess');
$zip->addFile($installerDir . '/public/index.php', 'public/index.php');
$zip->addFile($installerDir . '/public/.htaccess', 'public/.htaccess');
$zip->addFile($installerDir . '/README.md', 'README.md');

$zip->close();

echo "ZIP created: " . filesize($zipFile) . " bytes\n";
echo "Location: " . $zipFile . "\n";
