#!/usr/bin/env php
<?php

echo "\n";
echo "╔═══════════════════════════════════════════════════════════╗\n";
echo "║       ExilonCMS Plesk Installer Builder                    ║\n";
echo "╚═══════════════════════════════════════════════════════════╝\n";
echo "\n";

$installerDir = __DIR__.'/installer-plesk';
$outputFile = __DIR__.'/exiloncms-plesk-installer.zip';

// Clean previous build
if (file_exists($outputFile)) {
    echo "Removing previous build...\n";
    unlink($outputFile);
}

echo "Creating Plesk installer zip...\n";

$zip = new ZipArchive();
if ($zip->open($outputFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
    echo "ERROR: Cannot create zip file!\n";
    exit(1);
}

// Add .htaccess
$zip->addFile($installerDir.'/.htaccess', '.htaccess');
echo "  ✓ Added .htaccess\n";

// Add install.php
$zip->addFile($installerDir.'/install.php', 'install.php');
echo "  ✓ Added install.php\n";

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
echo "║  File:     exiloncms-plesk-installer.zip                ║\n";
echo "║  Size:     {$fileSizeKB} KB".str_repeat(' ', 46 - strlen($fileSizeKB) - 8)."║\n";
echo "╠═══════════════════════════════════════════════════════════╣\n";
echo "║  Plesk: Extract directly in httpdocs/ OR public_html/   ║\n";
echo "╚═══════════════════════════════════════════════════════════╝\n";
echo "\n";
