<?php

/**
 * Build ExilonCMS ZIP package
 *
 * Ce script crée un zip du CMS prêt à être déployé
 * sans les fichiers inutiles (node_modules, plugins, themes spécifiques, etc.)
 */

$root = __DIR__;
$buildDir = $root . '/build';
$zipFile = $root . '/exiloncms.zip';

// Clean build directory
if (is_dir($buildDir)) {
    echo "Cleaning build directory...\n";
    shell_exec("rm -rf " . escapeshellarg($buildDir));
}

// Remove old zip
if (file_exists($zipFile)) {
    echo "Removing old zip...\n";
    unlink($zipFile);
}

// Files and directories to exclude
$exclude = [
    'node_modules',
    'vendor',
    '.git',
    '.github',
    '.claude',
    'plugins',
    'themes',
    'storage',
    'bootstrap/cache',
    'build',
    'build-cms.php',
    'build-installer.php',
    'build-installer-simple.php',
    'build-installer-standalone.php',
    'create-installer-zip.php',
    'create-release.php',
    '.env',
    '.env.backup',
    '.env.production',
    '*.log',
    '*.backup',
    'exiloncms.zip',
    'exiloncms-installer.zip',
    'vite.installer.config.ts',
];

// Copy files to build directory
echo "Copying files to build directory...\n";
mkdir($buildDir, 0755, true);

// Use rsync or robocopy depending on OS
if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
    // Windows - use robocopy with proper exclusion syntax
    $excludeDirs = implode(' ', array_map(fn($e) => "/xd $e", array_filter($exclude, fn($e) => !str_starts_with($e, '*'))));
    $excludeFiles = implode(' ', array_map(fn($e) => "/xf $e", array_filter($exclude, fn($e) => str_starts_with($e, '*'))));
    $excludeFiles .= " /xf composer.lock package-lock.json .env .env.* vite.installer.config.ts *.backup";
    shell_exec("robocopy . \"$buildDir\" /E /NFL /NDL /NJH /NJS /xd node_modules vendor .git .github .claude plugins themes storage build $excludeFiles");
} else {
    // Unix/Linux/Mac
    $excludeStr = implode(' ', array_map(fn($e) => "--exclude=$e", $exclude));
    shell_exec("rsync -av $excludeStr --exclude='.env*' --exclude='composer.lock' --exclude='package-lock.json' --exclude='vite.installer.config.ts' . $buildDir/");
}

// Create placeholder directories
echo "Creating placeholder directories...\n";
mkdir($buildDir . '/storage', 0755, true);
mkdir($buildDir . '/storage/app', 0755, true);
mkdir($buildDir . '/storage/framework', 0755, true);
mkdir($buildDir . '/storage/logs', 0755, true);
mkdir($buildDir . '/bootstrap/cache', 0755, true);

// Create .gitkeep files
touch($buildDir . '/storage/app/.gitkeep');
touch($buildDir . '/storage/framework/.gitkeep');
touch($buildDir . '/storage/logs/.gitkeep');
touch($buildDir . '/bootstrap/cache/.gitkeep');

// Create example env file
echo "Creating example env file...\n";
copy($root . '/.env.example', $buildDir . '/.env.example');

// Create the zip
echo "Creating ZIP archive...\n";
$zip = new ZipArchive();
if ($zip->open($zipFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== TRUE) {
    die("Failed to create ZIP archive\n");
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

// Clean build directory
echo "Cleaning build directory...\n";
shell_exec("rm -rf " . escapeshellarg($buildDir));

// Get file size
$fileSize = filesize($zipFile);
$fileSizeMB = round($fileSize / 1024 / 1024, 2);

echo "\n✅ Build complete!\n";
echo "📦 Package created: $zipFile\n";
echo "📊 Size: {$fileSizeMB} MB\n";
