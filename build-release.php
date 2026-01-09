#!/usr/bin/env php
<?php

/**
 * ExilonCMS Release Builder
 *
 * This script creates a distributable release zip file containing
 * all dependencies and compiled assets for drag-and-drop deployment.
 *
 * Usage: php build-release.php [version]
 */

$startTime = microtime(true);

echo "\n";
echo "╔═══════════════════════════════════════════════════════════╗\n";
echo "║          ExilonCMS Release Builder v1.0.0                 ║\n";
echo "╚═══════════════════════════════════════════════════════════╝\n";
echo "\n";

// Get version from argument or version.json
$version = $argv[1] ?? null;
if (!$version) {
    $versionFile = __DIR__.'/version.json';
    if (file_exists($versionFile)) {
        $versionData = json_decode(file_get_contents($versionFile), true);
        $version = $versionData['version'] ?? '1.0.0';
    } else {
        $version = '1.0.0';
    }
}

echo "Version: {$version}\n\n";

// Configuration
$buildDir = __DIR__.'/.release-cache';
$distDir = __DIR__.'/.dist';
$releaseName = "exiloncms-v{$version}";
$releaseFile = __DIR__."/{$releaseName}.zip";

// Files and directories to exclude from the release
$exclude = [
    '.git',
    '.gitattributes',
    '.github',
    'node_modules',
    '.npm',
    'tests',
    'phpunit.xml',
    '.phpunit.result.cache',
    '.env',
    '.env.backup',
    'composer.lock',
    'package-lock.json',
    'pnpm-lock.yaml',
    'build-release.php',
    '.dist',
    '.release-cache',
    'TODO.md',
    '*.log',
    '.DS_Store',
    'Thumbs.db',
];

// Patterns to exclude (regex)
$excludePatterns = [
    '/\.idea$/',
    '/\.vscode$/',
    '/\.vreilier$/',
    '/\.nuxt$/',
    '/\.cache$/',
];

// Step 1: Clean previous build
echo "[1/7] Cleaning previous build...\n";
cleanDirectory($buildDir);
cleanDirectory($distDir);
@unlink($releaseFile);
echo "       ✓ Cleaned\n\n";

// Step 2: Install dependencies
echo "[2/7] Installing dependencies...\n";
echo "       → Running composer install...\n";
$composerOutput = [];
$composerResult = exec('composer install --no-dev --optimize-autoloader --no-interaction 2>&1', $composerOutput, $composerReturn);
if ($composerReturn !== 0) {
    echo "       ✗ Composer install failed!\n";
    echo implode("\n", $composerOutput);
    exit(1);
}
echo "       ✓ Composer dependencies installed\n";

echo "       → Running npm install...\n";
$npmOutput = [];
$npmResult = exec('npm install 2>&1', $npmOutput, $npmReturn);
if ($npmReturn !== 0) {
    echo "       ✗ npm install failed!\n";
    echo implode("\n", $npmOutput);
    exit(1);
}
echo "       ✓ npm dependencies installed\n\n";

// Step 3: Build assets
echo "[3/7] Building frontend assets...\n";
$buildOutput = [];
$buildResult = exec('npm run build 2>&1', $buildOutput, $buildReturn);
if ($buildReturn !== 0) {
    echo "       ✗ Asset build failed!\n";
    echo implode("\n", $buildOutput);
    exit(1);
}
echo "       ✓ Assets built\n\n";

// Step 4: Copy files to build directory
echo "[4/7] Copying files to build directory...\n";
$filesToCopy = getFilesToCopy(__DIR__, $exclude, $excludePatterns);
copyFiles($filesToCopy, __DIR__, $buildDir);
echo "       ✓ ".count($filesToCopy)." files copied\n\n";

// Step 5: Set permissions
echo "[5/7] Setting permissions...\n";
setPermissions($buildDir);
echo "       ✓ Permissions set\n\n";

// Step 6: Create zip
echo "[6/7] Creating release zip...\n";
createZip($buildDir, $releaseFile, $releaseName);

$zipSize = filesize($releaseFile);
$zipSizeMB = round($zipSize / 1024 / 1024, 2);
echo "       ✓ Created: {$releaseName}.zip ({$zipSizeMB} MB)\n\n";

// Step 7: Generate checksum
echo "[7/7] Generating checksums...\n";
$md5 = md5_file($releaseFile);
$sha256 = hash_file('sha256', $releaseFile);

echo "       MD5:    {$md5}\n";
echo "       SHA256: {$sha256}\n\n";

// Calculate build time
$endTime = microtime(true);
$duration = round($endTime - $startTime, 2);

echo "╔═══════════════════════════════════════════════════════════╗\n";
echo "║                    BUILD SUCCESS!                        ║\n";
echo "╠═══════════════════════════════════════════════════════════╣\n";
echo "║  Release:  {$releaseName}".str_repeat(' ', 38 - strlen($releaseName))."║\n";
echo "║  File:     {$releaseName}.zip".str_repeat(' ', 36 - strlen($releaseName))."║\n";
echo "║  Size:     {$zipSizeMB} MB".str_repeat(' ', 44 - strlen($zipSizeMB) - 5)."║\n";
echo "║  Time:     {$duration}s".str_repeat(' ', 46 - strlen($duration) - 6)."║\n";
echo "╠═══════════════════════════════════════════════════════════╣\n";
echo "║  Upload this file to GitHub Releases                       ║\n";
echo "╚═══════════════════════════════════════════════════════════╝\n";
echo "\n";

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Clean a directory recursively.
 */
function cleanDirectory(string $dir): void
{
    if (! is_dir($dir)) {
        return;
    }

    $files = array_diff(scandir($dir), ['.', '..']);
    foreach ($files as $file) {
        $path = $dir.'/'.$file;
        is_dir($path) ? cleanDirectory($path) : unlink($path);
    }

    rmdir($dir);
}

/**
 * Get list of files to copy.
 *
 * @return array<string, string>
 */
function getFilesToCopy(string $sourceDir, array $exclude, array $excludePatterns): array
{
    $files = [];
    $sourceDir = realpath($sourceDir);

    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($sourceDir, RecursiveDirectoryIterator::SKIP_DOTS),
        RecursiveIteratorIterator::SELF_FIRST
    );

    foreach ($iterator as $file) {
        $relativePath = substr($file->getPathname(), strlen($sourceDir) + 1);

        // Skip excluded files/directories
        $skip = false;
        foreach ($exclude as $excluded) {
            if (str_starts_with($relativePath, $excluded) || $relativePath === $excluded) {
                $skip = true;
                break;
            }
        }

        // Skip excluded patterns
        if (! $skip) {
            foreach ($excludePatterns as $pattern) {
                if (preg_match($pattern, $relativePath)) {
                    $skip = true;
                    break;
                }
            }
        }

        if (! $skip) {
            $files[$relativePath] = $file->getPathname();
        }
    }

    return $files;
}

/**
 * Copy files to destination.
 *
 * @param array<string, string> $files
 */
function copyFiles(array $files, string $sourceDir, string $destDir): void
{
    foreach ($files as $relativePath => $sourcePath) {
        $destPath = $destDir.'/'.$relativePath;
        $destDirName = dirname($destPath);

        if (! is_dir($destDirName)) {
            mkdir($destDirName, 0755, true);
        }

        if (is_file($sourcePath)) {
            copy($sourcePath, $destPath);
        }
    }
}

/**
 * Set proper permissions for directories.
 */
function setPermissions(string $dir): void
{
    $directories = [
        $dir.'/storage',
        $dir.'/storage/app',
        $dir.'/storage/framework',
        $dir.'/storage/framework/cache',
        $dir.'/storage/framework/sessions',
        $dir.'/storage/framework/views',
        $dir.'/storage/logs',
        $dir.'/bootstrap/cache',
    ];

    foreach ($directories as $directory) {
        if (is_dir($directory)) {
            chmod($directory, 0755);
        }
    }
}

/**
 * Create a zip archive.
 */
function createZip(string $sourceDir, string $destFile, string $zipRoot): void
{
    $zip = new ZipArchive();
    if ($zip->open($destFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
        throw new RuntimeException("Cannot create zip file: {$destFile}");
    }

    $sourceDir = realpath($sourceDir);
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($sourceDir, RecursiveDirectoryIterator::SKIP_DOTS)
    );

    foreach ($iterator as $file) {
        $relativePath = substr($file->getPathname(), strlen($sourceDir) + 1);
        $zipPath = $zipRoot.'/'.$relativePath;

        if (is_file($file->getPathname())) {
            $zip->addFile($file->getPathname(), $zipPath);
        }
    }

    $zip->close();
}
