#!/usr/bin/env php
<?php

echo "\n";
echo "╔═══════════════════════════════════════════════════════════╗\n";
echo "║       ExilonCMS Installer Builder (ALL FILES AT ROOT)      ║\n";
echo "╚═══════════════════════════════════════════════════════════╝\n";
echo "\n";

$installerDir = __DIR__.'/installer';
$outputFile = __DIR__.'/exiloncms-installer.zip';

// Clean previous build
if (file_exists($outputFile)) {
    echo "Removing previous build...\n";
    unlink($outputFile);
}

echo "Creating installer ZIP (ALL files at ROOT like Azuriom)...\n";

$zip = new ZipArchive();
if ($zip->open($outputFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
    echo "ERROR: Cannot create zip file!\n";
    exit(1);
}

// Add .htaccess (ROOT)
$zip->addFile($installerDir.'/.htaccess', '.htaccess');
echo "  ✓ Added .htaccess (root)\n";

// Add index.php (ROOT - main installer)
$zip->addFile($installerDir.'/index.php', 'index.php');
echo "  ✓ Added index.php (root)\n";

// Add public/.htaccess (in public folder)
$zip->addFile($installerDir.'/public/.htaccess', 'public/.htaccess');
echo "  ✓ Added public/.htaccess\n";

// Add public/index.php (in public folder - redirects to ../index.php)
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
echo "║  Structure: SAME AS AZURIOM                              ║\n";
echo "║  Extract: In httpdocs/ OR public_html/                   ║\n";
echo "╚═══════════════════════════════════════════════════════════╝\n";
echo "\n";
