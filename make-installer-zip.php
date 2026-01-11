#!/usr/bin/env php
<?php

/**
 * ExilonCMS Lightweight Installer Builder
 *
 * Creates a small installer zip (~8KB) that downloads the full CMS from GitHub.
 * This is similar to Azuriom's installer approach.
 */

echo "\n";
echo "╔═══════════════════════════════════════════════════════════╗\n";
echo "║       ExilonCMS Lightweight Installer Builder             ║\n";
echo "╚═══════════════════════════════════════════════════════════╝\n";
echo "\n";

$installerDir = __DIR__.'/installer';
$outputFile = __DIR__.'/exiloncms-installer.zip';

// Clean previous build
if (file_exists($outputFile)) {
    echo "Removing previous build...\n";
    unlink($outputFile);
}

echo "Creating lightweight installer zip...\n";

$zip = new ZipArchive();
if ($zip->open($outputFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
    echo "ERROR: Cannot create zip file!\n";
    exit(1);
}

// Add index.php (entry point for Plesk compatibility)
$zip->addFile($installerDir.'/index.php', 'index.php');
echo "  ✓ Added index.php\n";

// Add install.php
$zip->addFile($installerDir.'/install.php', 'install.php');
echo "  ✓ Added install.php\n";

// Add public/index.php
$zip->addFile($installerDir.'/public/index.php', 'public/index.php');
echo "  ✓ Added public/index.php\n";

// Add README.txt
$zip->addFile($installerDir.'/README.txt', 'README.txt');
echo "  ✓ Added README.txt\n";

$zip->close();

$fileSize = filesize($outputFile);
$fileSizeKB = round($fileSize / 1024, 2);

echo "\n";
echo "╔═══════════════════════════════════════════════════════════╗\n";
echo "║                    BUILD SUCCESS!                        ║\n";
echo "╠═══════════════════════════════════════════════════════════╣\n";
echo "║  File:     exiloncms-installer.zip                       ║\n";
echo "║  Size:     {$fileSizeKB} KB".str_repeat(' ', 46 - strlen($fileSizeKB) - 8)."║\n";
echo "╠═══════════════════════════════════════════════════════════╣\n";
echo "║  Upload this file to GitHub Releases                       ║\n";
echo "╚═══════════════════════════════════════════════════════════╝\n";
echo "\n";
