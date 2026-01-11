#!/usr/bin/env php
<?php

/**
 * ExilonCMS Release ZIP Builder
 *
 * Creates a full release ZIP for GitHub Releases.
 * Excludes unnecessary files like node_modules, vendor, etc.
 */

echo "\n";
echo "╔═══════════════════════════════════════════════════════════╗\n";
echo "║       ExilonCMS Release ZIP Builder                        ║\n";
echo "╚═══════════════════════════════════════════════════════════╝\n";
echo "\n";

$version = 'v0.0.3';
$sourceDir = __DIR__;
$destFile = __DIR__."/exiloncms-{$version}.zip";

// Directories and files to exclude
$exclude = [
    'node_modules',
    'vendor',
    '.git',
    '.github',
    'storage',
    'bootstrap/cache',
    'public/build',
    'public/hot',
    '.DS_Store',
    '.idea',
    '.vscode',
    '*.log',
    '.env',
    '.env.example',
    '.npmrc',
    '.phpunit.result.cache',
    'exiloncms-*.zip',
    'install-wizard',
    'install-wizard.zip',
    'install',
    'installer-complete',
    '.release-cache',
    'database/database.sqlite',
    'database/database.sqlite-*',
    'Thumbs.db',
];

echo "Version: {$version}\n";
echo "Source:  {$sourceDir}\n";
echo "Output:  {$destFile}\n";
echo "\n";

// Remove existing zip if exists
if (file_exists($destFile)) {
    echo "Removing previous build...\n";
    unlink($destFile);
}

echo "Creating release ZIP...\n";

$zip = new ZipArchive();
if ($zip->open($destFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
    echo "ERROR: Cannot create zip file!\n";
    exit(1);
}

$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($sourceDir, RecursiveDirectoryIterator::SKIP_DOTS),
    RecursiveIteratorIterator::SELF_FIRST
);

$fileCount = 0;
$excludedCount = 0;

foreach ($iterator as $file) {
    $relativePath = substr($file->getPathname(), strlen($sourceDir) + 1);
    // Convert Windows backslashes to Unix forward slashes
    $relativePath = str_replace('\\', '/', $relativePath);

    // Check if should be excluded
    if (shouldExclude($relativePath, $exclude)) {
        $excludedCount++;
        continue;
    }

    if (is_dir($file->getPathname())) {
        $zip->addEmptyDir($relativePath);
    } else {
        $zip->addFile($file->getPathname(), $relativePath);
        $fileCount++;

        if ($fileCount % 100 === 0) {
            echo "  Added {$fileCount} files...\n";
        }
    }
}

$zip->close();

$fileSize = filesize($destFile);
$fileSizeMB = round($fileSize / 1024 / 1024, 2);

echo "\n";
echo "╔═══════════════════════════════════════════════════════════╗\n";
echo "║                    BUILD SUCCESS!                        ║\n";
echo "╠═══════════════════════════════════════════════════════════╣\n";
echo "║  File:     exiloncms-{$version}.zip                           ║\n";
echo "║  Size:     {$fileSizeMB} MB".str_repeat(' ', 45 - strlen($fileSizeMB) - 5)."║\n";
echo "║  Files:    {$fileCount}".str_repeat(' ', 47 - strlen($fileCount))."║\n";
echo "║  Excluded: {$excludedCount}".str_repeat(' ', 47 - strlen($excludedCount))."║\n";
echo "╠═══════════════════════════════════════════════════════════╣\n";
echo "║  Upload this file to GitHub Releases                       ║\n";
echo "╚═══════════════════════════════════════════════════════════╝\n";
echo "\n";

function shouldExclude($path, $excludePatterns): bool
{
    foreach ($excludePatterns as $pattern) {
        // Simple wildcard match
        $regex = '#^'.strtr(preg_quote($pattern, '#'), [
            '*' => '.*',
            '?' => '.',
        ]).'$#i';

        if (preg_match($regex, $path) || strpos($path, $pattern) === 0) {
            return true;
        }
    }

    // Also check if path contains any excluded pattern
    foreach ($excludePatterns as $pattern) {
        if (strpos($path, '/'.$pattern.'/') !== false || str_ends_with($path, '/'.$pattern)) {
            return true;
        }
    }

    return false;
}
