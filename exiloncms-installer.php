#!/usr/bin/env php
<?php

/**
 * ExilonCMS Standalone Installer
 *
 * This is a standalone installer script that can be run globally
 * to install ExilonCMS, similar to `pnpm dlx` or `composer create-project`.
 *
 * Usage:
 *   php exiloncms-installer.php [directory]
 *
 * Example:
 *   php exiloncms-installer.php my-site
 *
 * @package ExilonCMS
 * @author Exilon Studios
 */

const VERSION = '0.0.1-beta';
const GITHUB_REPO = 'Exilon-Studios/ExilonCMS';

// Colors for terminal output
const COLORS = [
    'reset' => "\033[0m",
    'bold' => "\033[1m",
    'green' => "\033[32m",
    'yellow' => "\033[33m",
    'blue' => "\033[34m",
    'red' => "\033[31m",
    'cyan' => "\033[36m",
];

/**
 * Print colored text to console
 */
function colorize(string $text, string $color = 'reset'): string
{
    return COLORS[$color] . $text . COLORS['reset'];
}

/**
 * Print info message
 */
function info(string $message): void
{
    echo colorize("  ℹ️  {$message}\n", 'cyan');
}

/**
 * Print success message
 */
function success(string $message): void
{
    echo colorize("  ✅ {$message}\n", 'green');
}

/**
 * Print warning message
 */
function warn(string $message): void
{
    echo colorize("  ⚠️  {$message}\n", 'yellow');
}

/**
 * Print error message
 */
function error(string $message): void
{
    echo colorize("  ❌ {$message}\n", 'red');
}

/**
 * Print header
 */
function header(string $text): void
{
    echo "\n" . colorize(str_repeat('=', 60), 'bold') . "\n";
    echo colorize("  {$text}", 'bold') . "\n";
    echo colorize(str_repeat('=', 60), 'bold') . "\n\n";
}

/**
 * Check if PHP version is compatible
 */
function checkPhpVersion(): bool
{
    $minVersion = '8.2';
    $currentVersion = PHP_VERSION;

    if (version_compare($currentVersion, $minVersion, '<')) {
        error("PHP {$minVersion} or higher is required. You are running PHP {$currentVersion}");
        return false;
    }

    success("PHP version: {$currentVersion}");
    return true;
}

/**
 * Check if required extensions are loaded
 */
function checkExtensions(): bool
{
    $required = ['curl', 'zip', 'json', 'mbstring'];
    $missing = [];

    foreach ($required as $ext) {
        if (! extension_loaded($ext)) {
            $missing[] = $ext;
        }
    }

    if (! empty($missing)) {
        error("Missing required PHP extensions: " . implode(', ', $missing));
        return false;
    }

    success("All required extensions are loaded");
    return true;
}

/**
 * Download file from URL
 */
function downloadFile(string $url, string $destination): bool
{
    info("Downloading from: {$url}");

    $fp = fopen($destination, 'w+');
    if (! $fp) {
        error("Could not open file for writing: {$destination}");
        return false;
    }

    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_FILE => $fp,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 300,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_PROGRESSFUNCTION => function ($resource, $downloadSize, $downloaded, $uploadSize, $uploaded) {
            static $lastPercent = 0;
            if ($downloadSize > 0) {
                $percent = intval($downloaded / $downloadSize * 100);
                if ($percent > $lastPercent && $percent % 10 === 0) {
                    $lastPercent = $percent;
                    echo "\r  Downloading: {$percent}%";
                }
            }
            return 0;
        },
    ]);

    $result = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    fclose($fp);

    echo "\n";

    if ($result && $httpCode === 200) {
        success("Download complete");
        return true;
    }

    error("Download failed (HTTP {$httpCode})");
    @unlink($destination);
    return false;
}

/**
 * Get latest release from GitHub API
 */
function getLatestRelease(): ?array
{
    info("Fetching latest release from GitHub...");

    $url = "https://api.github.com/repos/" . GITHUB_REPO . "/releases/latest";

    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_USERAGENT => 'ExilonCMS-Installer',
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTPHEADER => [
            'Accept: application/vnd.github.v3+json',
        ],
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200 && $response) {
        $data = json_decode($response, true);
        success("Found release: {$data['tag_name']}");
        return $data;
    }

    warn("Could not fetch release info, using default version");
    return null;
}

/**
 * Extract ZIP archive
 */
function extractZip(string $zipPath, string $destination): bool
{
    info("Extracting to: {$destination}");

    $zip = new ZipArchive();
    $result = $zip->open($zipPath);

    if ($result !== true) {
        error("Failed to open ZIP archive: {$result}");
        return false;
    }

    // Create destination directory
    if (! is_dir($destination)) {
        mkdir($destination, 0755, true);
    }

    // Extract
    $zip->extractTo($destination);
    $zip->close();

    success("Extraction complete");
    return true;
}

/**
 * Install Composer dependencies
 */
function installComposerDependencies(string $projectPath): bool
{
    info("Installing Composer dependencies...");

    $composerPath = $projectPath . '/composer';

    if (! file_exists($composerPath)) {
        // Try to download composer.phar
        $composerUrl = 'https://getcomposer.org/composer-stable.phar';
        $composerPath = $projectPath . '/composer.phar';

        info("Downloading Composer...");
        if (! downloadFile($composerUrl, $composerPath)) {
            error("Failed to download Composer");
            return false;
        }
    }

    $command = escapeshellcmd(PHP_BINARY) . ' ' . escapeshellarg($composerPath) . ' install --no-interaction';
    $descriptorspec = [
        0 => ['pipe', 'r'],
        1 => ['pipe', 'w'],
        2 => ['pipe', 'w'],
    ];

    $process = proc_open($command, $descriptorspec, $pipes, $projectPath);

    if (! is_resource($process)) {
        error("Failed to start Composer");
        return false;
    }

    fclose($pipes[0]);

    // Stream output
    while (! feof($pipes[1])) {
        echo fgets($pipes[1]);
    }

    fclose($pipes[1]);
    fclose($pipes[2]);

    $returnCode = proc_close($process);

    if ($returnCode === 0) {
        success("Composer dependencies installed");
        return true;
    }

    error("Composer install failed");
    return false;
}

/**
 * Run the interactive installation
 */
function runInteractiveInstall(string $projectPath): bool
{
    $artisanPath = $projectPath . '/artisan';

    if (! file_exists($artisanPath)) {
        error("Could not find artisan file in project");
        return false;
    }

    info("Starting interactive installation...");

    $command = escapeshellcmd(PHP_BINARY) . ' ' . escapeshellarg($artisanPath) . ' install:interactive';
    passthru($command, $returnCode);

    return $returnCode === 0;
}

/**
 * Main installation flow
 */
function install(string $directory): int
{
    header("ExilonCMS Installer v" . VERSION);

    // Check environment
    if (! checkPhpVersion() || ! checkExtensions()) {
        error("Environment check failed. Please fix the issues above and try again.");
        return 1;
    }

    // Get target directory
    $targetDir = getcwd() . '/' . $directory;

    if (is_dir($targetDir)) {
        error("Directory already exists: {$targetDir}");
        return 1;
    }

    // Get latest release
    $release = getLatestRelease();
    $version = $release['tag_name'] ?? VERSION;

    // Find download URL
    $downloadUrl = null;
    if ($release && isset($release['assets'])) {
        foreach ($release['assets'] as $asset) {
            if (str_ends_with($asset['name'], '.zip')) {
                $downloadUrl = $asset['browser_download_url'];
                break;
            }
        }
    }

    if (! $downloadUrl) {
        // Fallback to archive download
        $downloadUrl = "https://github.com/" . GITHUB_REPO . "/archive/refs/tags/{$version}.zip";
    }

    // Create temp directory
    $tempDir = sys_get_temp_dir() . '/exiloncms-installer';
    if (! is_dir($tempDir)) {
        mkdir($tempDir, 0755, true);
    }

    $zipPath = $tempDir . '/exiloncms.zip';

    // Download
    if (! downloadFile($downloadUrl, $zipPath)) {
        return 1;
    }

    // Extract
    if (! extractZip($zipPath, $tempDir . '/extracted')) {
        return 1;
    }

    // Find the extracted directory (might be in a subdirectory)
    $extractedDirs = glob($tempDir . '/extracted/*', GLOB_ONLYDIR);
    $sourceDir = $extractedDirs[0] ?? $tempDir . '/extracted';

    // Move to target directory
    info("Installing to: {$targetDir}");
    if (! rename($sourceDir, $targetDir)) {
        error("Failed to move files to target directory");
        return 1;
    }

    // Cleanup
    @unlink($zipPath);
    @rmdir($tempDir . '/extracted');
    @rmdir($tempDir);

    success("Files installed successfully");

    // Ask if user wants to run interactive setup
    echo "\n";
    $runSetup = readline("  Run interactive setup now? [Y/n]: ");

    if (strtolower($runSetup) !== 'n') {
        if (! runInteractiveInstall($targetDir)) {
            error("Interactive setup failed. You can run it manually later with:");
            echo colorize("    cd {$directory} && php artisan install:interactive\n", 'cyan');
            return 1;
        }
    } else {
        echo "\n";
        info("To complete the installation, run:");
        echo colorize("  cd {$directory}\n", 'cyan');
        echo colorize("  php artisan install:interactive\n", 'cyan');
    }

    return 0;
}

// Parse arguments
$directory = $argv[1] ?? 'exiloncms';

// Validate directory name
if (! preg_match('/^[a-zA-Z0-9_-]+$/', $directory)) {
    error("Invalid directory name. Use only letters, numbers, hyphens, and underscores.");
    exit(1);
}

// Run installation
$exitCode = install($directory);

// Display completion message
if ($exitCode === 0) {
    header("Installation Complete!");
    echo "\n";
    success("ExilonCMS has been installed successfully!");
    echo "\n";
    info("Next steps:");
    echo colorize("  1. cd {$directory}\n", 'cyan');
    echo colorize("  2. php artisan serve\n", 'cyan');
    echo colorize("  3. Open http://localhost:8000 in your browser\n", 'cyan');
    echo "\n";
    info("For more information, visit: https://github.com/" . GITHUB_REPO);
}

exit($exitCode);
