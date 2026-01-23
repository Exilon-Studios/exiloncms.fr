<?php

/**
 * Build ExilonCMS Installer ZIP package
 *
 * Ce script crée un zip de l'installateur autonome
 * qui télécharge automatiquement la dernière release
 */

$root = __DIR__;
$installerBuildDir = $root . '/build/installer';
$installerZipFile = $root . '/exiloncms-installer.zip';

// Get latest version from git tag or use default
$version = trim(shell_exec('git describe --tags --abbrev=0 2>/dev/null') ?: 'v1.2.0');
echo "Building installer for version: $version\n";

// Clean build directory
if (is_dir($installerBuildDir)) {
    echo "Cleaning installer build directory...\n";
    shell_exec("rm -rf " . escapeshellarg($installerBuildDir));
}

// Remove old installer zip
if (file_exists($installerZipFile)) {
    echo "Removing old installer zip...\n";
    unlink($installerZipFile);
}

// Create build directory
mkdir($installerBuildDir, 0755, true);

// Files needed for installer
$installerFiles = [
    'app/ExilonCMS.php',
    'app/Exceptions',
    'app/Extensions',
    'app/Http/Controllers/InstallController.php',
    'app/Http/Middleware',
    'app/Models',
    'app/Providers',
    'app/Support',
    'app/View',
    'bootstrap/app.php',
    'config',
    'database/migrations/2014_10_12_000000_create_users_table.php',
    'database/migrations/2014_10_12_100000_create_password_reset_table.php',
    'database/migrations/2019_08_19_000000_create_failed_jobs_table.php',
    'database/migrations/2025_01_14_000001_create_roles_table.php',
    'database/migrations/2025_01_14_000002_create_settings_table.php',
    'database/migrations/2025_01_14_000003_create_servers_table.php',
    'database/migrations/2025_01_14_000004_create_notifications_table.php',
    'database/seeders',
    'public/build',
    'public/index.php',
    'public/hot',
    'resources/css',
    'resources/js',
    'resources/views',
    'resources/lang',
    'routes/install.php',
    'routes/web.php',
    '.env.example',
    'artisan',
    'composer.json',
    'composer.lock',
];

// Copy files
echo "Copying installer files...\n";

if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
    // Windows - use xcopy
    foreach ($installerFiles as $file) {
        $src = $root . '/' . $file;
        $dst = $installerBuildDir . '/' . $file;

        if (!file_exists($src)) {
            continue;
        }

        $dstDir = dirname($dst);
        if (!is_dir($dstDir)) {
            mkdir($dstDir, 0755, true);
        }

        if (is_dir($src)) {
            shell_exec("xcopy /E /I /Y /Q " . escapeshellarg($src) . " " . escapeshellarg($dstDir));
        } else {
            copy($src, $dst);
        }
    }
} else {
    // Unix/Linux/Mac - use rsync
    foreach ($installerFiles as $file) {
        $src = $root . '/' . $file;
        $dst = $installerBuildDir . '/' . $file;

        if (!file_exists($src)) {
            continue;
        }

        $dstDir = dirname($dst);
        if (!is_dir($dstDir)) {
            mkdir($dstDir, 0755, true);
        }

        if (is_dir($src)) {
            shell_exec("rsync -av " . escapeshellarg($src . '/') . " " . escapeshellarg($dst . '/'));
        } else {
            copy($src, $dst);
        }
    }
}

// Create installer config with version
echo "Creating installer config...\n";
$installerConfig = [
    'version' => $version,
    'repo' => 'Exilon-Studios/ExilonCMS',
    'download_url' => 'https://github.com/Exilon-Studios/ExilonCMS/releases/download',
];
file_put_contents($installerBuildDir . '/installer.json', json_encode($installerConfig, JSON_PRETTY_PRINT));

// Create placeholder directories
mkdir($installerBuildDir . '/storage', 0755, true);
mkdir($installerBuildDir . '/storage/app', 0755, true);
mkdir($installerBuildDir . '/storage/framework', 0755, true);
mkdir($installerBuildDir . '/storage/logs', 0755, true);
mkdir($installerBuildDir . '/bootstrap/cache', 0755, true);
touch($installerBuildDir . '/storage/app/.gitkeep');
touch($installerBuildDir . '/storage/framework/.gitkeep');
touch($installerBuildDir . '/storage/logs/.gitkeep');
touch($installerBuildDir . '/bootstrap/cache/.gitkeep');

// Create the zip
echo "Creating installer ZIP archive...\n";
$zip = new ZipArchive();
if ($zip->open($installerZipFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== TRUE) {
    die("Failed to create ZIP archive\n");
}

$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($installerBuildDir, RecursiveDirectoryIterator::SKIP_DOTS),
    RecursiveIteratorIterator::SELF_FIRST
);

foreach ($iterator as $file) {
    $file = realpath($file);
    $relativePath = substr($file, strlen(realpath($installerBuildDir)) + 1);

    if (is_dir($file)) {
        $zip->addEmptyDir($relativePath);
    } else {
        $zip->addFile($file, $relativePath);
    }
}

$zip->close();

// Clean build directory
echo "Cleaning build directory...\n";
shell_exec("rm -rf " . escapeshellarg($installerBuildDir));

// Get file size
$fileSize = filesize($installerZipFile);
$fileSizeMB = round($fileSize / 1024 / 1024, 2);

echo "\n✅ Installer build complete!\n";
echo "📦 Package created: $installerZipFile\n";
echo "📊 Size: {$fileSizeMB} MB\n";
echo "🏷️  Version: $version\n";
