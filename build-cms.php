#!/usr/bin/env php
<?php

echo "\n";
echo "╔═══════════════════════════════════════════════════════════╗\n";
echo "║     ExilonCMS Full Release Builder                       ║\n";
echo "║     (Upload to GitHub Releases as exiloncms-full.zip)    ║\n";
echo "╚═══════════════════════════════════════════════════════════╝\n";
echo "\n";

$rootDir = realpath(__DIR__);
$outputFile = $rootDir.'/exiloncms-full.zip';

echo "Building full CMS ZIP...\n";
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

function shouldExclude($path) {
    $path = str_replace('\\', '/', $path);
    $excludes = [
        '/installer/', '/installer-plesk/', '/installer-light/',
        '/stubs/', '/Tests/', '/tests/', '/Test/', '/test/',
        '/docs/', '/examples/', '/example/',
        '/.git/', '/.github/', '/.vscode/', '/.idea/', '/.fleet/',
        '/node_modules/', '/storage/debugbar/', '/storage/logs/',
    ];
    foreach ($excludes as $ex) {
        if (strpos($path, $ex) !== false) return true;
    }
    $basename = basename($path);
    if (preg_match('/^(make|build|create|check)-|\.zip$|nul$/', $basename)) return true;
    return false;
}

function addDir($zip, $dir, $base) {
    if (!is_dir($dir)) return 0;
    $count = 0;
    $iter = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS)
    );
    foreach ($iter as $f) {
        if ($f->isFile() && !shouldExclude($f->getPathname())) {
            $path = str_replace('\\', '/', substr($f->getPathname(), strlen($base)));
            $zip->addFile($f->getPathname(), $path);
            $count++;
            if ($count % 2000 == 0) echo "  Added $count files...\n";
        }
    }
    return $count;
}

echo "Adding CMS files...\n";
$total = 0;
foreach (['app', 'bootstrap', 'config', 'database', 'public', 'resources', 'routes', 'storage', 'lang'] as $d) {
    echo "  $d/...\n";
    $total += addDir($zip, $rootDir.'/'.$d, $rootDir);
}

echo "  vendor/...\n";
$total += addDir($zip, $rootDir.'/vendor', $rootDir);

foreach (['.htaccess', 'artisan', 'composer.json', 'composer.lock', 'package.json', 'vite.config.ts', 'tsconfig.json'] as $f) {
    if (file_exists($rootDir.'/'.$f)) {
        $zip->addFile($rootDir.'/'.$f, $f);
        $total++;
    }
}

$zip->close();

echo "\nCreated!\n";

$size = filesize($outputFile);
$mb = round($size / 1024 / 1024, 2);

echo "\n";
echo "╔═══════════════════════════════════════════════════════════╗\n";
echo "║                    BUILD SUCCESS!                        ║\n";
echo "╠═══════════════════════════════════════════════════════════╣";
echo "║  File:     exiloncms-full.zip                           ║\n";
echo "║  Size:     {$mb} MB".str_repeat(' ', 47 - strlen($mb) - 6)."║\n";
echo "║  Files:    $total".str_repeat(' ', 47 - strlen((string)$total))."║\n";
echo "╠═══════════════════════════════════════════════════════════╣\n";
echo "║  Upload this to GitHub Releases                          ║\n";
echo "║  Filename must be: exiloncms-full.zip                    ║\n";
echo "╚═══════════════════════════════════════════════════════════╝\n";
echo "\nDone!\n";
