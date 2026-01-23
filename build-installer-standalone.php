<?php

/**
 * Build ExilonCMS Standalone Installer ZIP
 *
 * Creates a minimal ZIP containing only the installer files.
 * Users upload this to their server, and the installer downloads
 * the actual CMS from GitHub during installation.
 */

$root = __DIR__;
$buildDir = $root . '/build/installer-standalone';
$installerZipFile = $root . '/exiloncms-installer.zip';

echo "Building ExilonCMS Standalone Installer...\n\n";

// Clean build directory
if (is_dir($buildDir)) {
    echo "Cleaning build directory...\n";
    shell_exec("rm -rf " . escapeshellarg($buildDir));
}

// Remove old installer zip
if (file_exists($installerZipFile)) {
    echo "Removing old installer zip...\n";
    unlink($installerZipFile);
}

// Create build directory
mkdir($buildDir, 0755, true);

// Files to include in the installer
$installerFiles = [
    'installer/index.php',
    'installer/public',
    'installer/assets',
];

// Copy files
echo "Copying installer files...\n";

// Copy installer directory recursively
$srcInstallerDir = $root . '/installer';
$dstInstallerDir = $buildDir . '/installer';

// Create destination directory
mkdir($dstInstallerDir, 0755, true);

// Copy all files from installer directory
$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($srcInstallerDir, RecursiveDirectoryIterator::SKIP_DOTS),
    RecursiveIteratorIterator::SELF_FIRST
);

foreach ($iterator as $item) {
    $srcPath = $item->getPathname();
    $relativePath = substr($srcPath, strlen($srcInstallerDir) + 1);
    $dstPath = $dstInstallerDir . '/' . $relativePath;

    if ($item->isDir()) {
        if (!file_exists($dstPath)) {
            mkdir($dstPath, 0755, true);
        }
    } else {
        $dstDir = dirname($dstPath);
        if (!file_exists($dstDir)) {
            mkdir($dstDir, 0755, true);
        }
        copy($srcPath, $dstPath);
    }
}

// Create README
$readmeContent = <<<EOT
# ExilonCMS Installer

Welcome to ExilonCMS! This installer will download and set up the latest version of ExilonCMS on your server.

## Requirements

- PHP 8.2 or higher
- Required PHP extensions: bcmath, ctype, json, mbstring, openssl, PDO, tokenizer, xml, xmlwriter, curl, fileinfo, zip
- Write permissions in the installation directory

## Installation

1. Upload all files to your web server
2. Point your browser to the URL where you uploaded the files
3. Follow the installation wizard
4. After installation, delete the `installer` folder

## Support

For help and documentation, visit https://exiloncms.fr

## License

ExilonCMS is open-source software licensed under the MIT license.
EOT;

file_put_contents($buildDir . '/README.md', $readmeContent);

// Create .htaccess for the root to redirect to installer
$htaccessContent = <<<EOT
<IfModule mod_rewrite.c>
    RewriteEngine On

    # Redirect to installer
    RewriteCond %{REQUEST_URI} !^/installer/
    RewriteRule ^(.*)$ installer/$1 [L]
</IfModule>

# Default index
DirectoryIndex index.php

# For servers that don't support mod_rewrite
<IfModule !mod_rewrite.c>
    # No URL rewriting, user needs to access /installer/ directly
</IfModule>
EOT;

file_put_contents($buildDir . '/.htaccess', $htaccessContent);

// Create the zip
echo "Creating installer ZIP archive...\n";
$zip = new ZipArchive();
if ($zip->open($installerZipFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== TRUE) {
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
$fileSize = filesize($installerZipFile);
$fileSizeMB = round($fileSize / 1024 / 1024, 2);

echo "\n✅ Standalone installer build complete!\n";
echo "📦 Package created: $installerZipFile\n";
echo "📊 Size: {$fileSizeMB} MB\n";
echo "\nUpload this ZIP to your server, extract it, and open the URL in your browser.\n";
