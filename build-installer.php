#!/usr/bin/env php
<?php

echo "\n";
echo "╔═══════════════════════════════════════════════════════════╗\n";
echo "║     ExilonCMS Installer Builder                          ║\n";
echo "║     (Like Azuriom - 5 files only)                         ║\n";
echo "╚═══════════════════════════════════════════════════════════╝\n";
echo "\n";

$rootDir = realpath(__DIR__);
$installerDir = $rootDir.'/installer';
$outputFile = $rootDir.'/exiloncms-installer.zip';

echo "Building installer ZIP...\n";
echo "Source: $installerDir\n";
echo "Output: $outputFile\n\n";

if (file_exists($outputFile)) {
    echo "Removing previous build...\n";
    unlink($outputFile);
}

$zip = new ZipArchive();
if ($zip->open($outputFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== TRUE) {
    echo "ERROR: Failed to create ZIP\n";
    exit(1);
}

// Add index.php
$zip->addFile($installerDir.'/index.php', 'index.php');
echo "  Added: index.php\n";

// Add .htaccess
$zip->addFile($installerDir.'/.htaccess', '.htaccess');
echo "  Added: .htaccess\n";

// Add public/index.php
$zip->addFile($installerDir.'/public/index.php', 'public/index.php');
echo "  Added: public/index.php\n";

// Add public/.htaccess
$zip->addFile($installerDir.'/public/.htaccess', 'public/.htaccess');
echo "  Added: public/.htaccess\n";

$zip->close();

echo "\nZIP created.\n";

if (!file_exists($outputFile)) {
    echo "ERROR: ZIP not created\n";
    exit(1);
}

$fileSize = filesize($outputFile);
$fileSizeKB = round($fileSize / 1024, 1);

echo "\n";
echo "╔═══════════════════════════════════════════════════════════╗\n";
echo "║                    BUILD SUCCESS!                        ║\n";
echo "╠═══════════════════════════════════════════════════════════╣";
echo "║  File:     exiloncms-installer.zip                       ║\n";
echo "║  Size:     {$fileSizeKB} KB".str_repeat(' ', 46 - strlen($fileSizeKB) - 6)."║\n";
echo "║  Files:    4 (like Azuriom)                              ║\n";
echo "╠═══════════════════════════════════════════════════════════╣\n";
echo "║  Upload this file to your hosting                        ║\n";
echo "║  The installer will download CMS from GitHub             ║\n";
echo "╚═══════════════════════════════════════════════════════════╝\n";
echo "\nDone!\n";
