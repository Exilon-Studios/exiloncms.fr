<?php

/**
 * Build ExilonCMS Standalone Installer ZIP
 * Simple structure like Azuriom
 */

$root = __DIR__;
$installerZipFile = $root . '/exiloncms-installer.zip';
$buildDir = $root . '/build/installer-temp';

echo "Building ExilonCMS Installer (Azuriom style)...\n\n";

// Clean
if (is_dir($buildDir)) {
    shell_exec("rm -rf " . escapeshellarg($buildDir));
}
if (file_exists($installerZipFile)) {
    unlink($installerZipFile);
}

mkdir($buildDir, 0755, true);

// Copy installer directory
$srcInstaller = $root . '/installer';
$dstInstaller = $buildDir;

// Copy files (not directories yet)
$files = ['index.php', '.htaccess'];
foreach ($files as $file) {
    if (file_exists($srcInstaller . '/' . $file)) {
        copy($srcInstaller . '/' . $file, $dstInstaller . '/' . $file);
    }
}

// Copy public directory
if (is_dir($srcInstaller . '/public')) {
    mkdir($dstInstaller . '/public', 0755, true);
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($srcInstaller . '/public', RecursiveDirectoryIterator::SKIP_DOTS),
        RecursiveIteratorIterator::SELF_FIRST
    );
    foreach ($iterator as $item) {
        $srcPath = $item->getPathname();
        $relativePath = substr($srcPath, strlen($srcInstaller . '/public') + 1);
        $dstPath = $dstInstaller . '/public/' . $relativePath;
        if ($item->isDir()) {
            if (!file_exists($dstPath)) {
                mkdir($dstPath, 0755, true);
            }
        } else {
            copy($srcPath, $dstPath);
        }
    }
}

// Copy README
$readme = <<<EOT
# ExilonCMS Installer

Welcome to ExilonCMS! This installer will download and set up the latest version of ExilonCMS on your server.

## Requirements

- PHP 8.2 or higher
- Required PHP extensions: bcmath, ctype, json, mbstring, openssl, PDO, tokenizer, xml, xmlwriter, curl, fileinfo, zip
- Write permissions in the installation directory

## Installation

1. Upload all files to your web server root
2. Point your browser to your site URL
3. Follow the installation wizard
4. After installation, delete the installer files

## Support

For help and documentation, visit https://exiloncms.fr
EOT;
file_put_contents($buildDir . '/README.md', $readme);

// Create ZIP
echo "Creating ZIP...\n";
$zip = new ZipArchive();
if ($zip->open($installerZipFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== TRUE) {
    die("Failed to create ZIP\n");
}

$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($buildDir, RecursiveDirectoryIterator::SKIP_DOTS),
    RecursiveIteratorIterator::SELF_FIRST
);

foreach ($iterator as $file) {
    $file = realpath($file);
    $relativePath = substr($file, strlen(realpath($buildDir)) + 1);
    if (is_dir($file)) {
        $zip->addEmptyDir($relativePath);
    } else {
        $zip->addFile($file, $relativePath);
    }
}

$zip->close();

// Clean
shell_exec("rm -rf " . escapeshellarg($buildDir));

$fileSize = round(filesize($installerZipFile) / 1024, 2);
echo "\n Installer ZIP created!\n";
echo " Size: {$fileSize} KB\n";
echo " Location: {$installerZipFile}\n\n";
echo "Upload and extract to your web server root.\n";
