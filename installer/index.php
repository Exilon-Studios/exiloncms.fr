<?php

/*
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ExilonCMS Installer</title>
</head>
<body style="font-family: sans-serif; text-align: center; margin-top: 1rem">
<h1>ExilonCMS - PHP installation issue</h1>
<h2>PHP is not executed</h2>
<p>If you see this page in your browser, it means that PHP is not installed or not configured properly on your server.</p>
<p>On Linux with Apache2 you can try the following command: <code>apt install libapache2-mod-php</code></p>
<p>If you are using another setup, please refer to your web server documentation.</p>
<hr>
<p>This is NOT an issue related to ExilonCMS.</p>
</body>
</html><!--
*/

/**
 * The ExilonCMS installer.
 *
 * This file is not a part of ExilonCMS itself,
 * and can be removed when ExilonCMS is installed.
 *
 * @author Exilon-Studios
 */
$installerVersion = '1.0.0';

$minPhpVersion = '8.2';

$requiredExtensions = [
    'bcmath', 'ctype', 'json', 'mbstring', 'openssl', 'PDO', 'tokenizer', 'xml', 'xmlwriter', 'curl', 'fileinfo', 'zip',
];

set_error_handler(function ($level, $message, $file = 'unknown', $line = 0) {
    http_response_code(500);
    exit(json_encode(['message' => "A fatal error occurred: {$message} ({$file}:{$line})"]));
});

//
// Some helper functions
//

/**
 * Parse the PHP version to x.x format.
 *
 * @return string
 */
function parse_php_version()
{
    preg_match('/^(\d+)\.(\d+)/', PHP_VERSION, $matches);

    if (count($matches) > 2) {
        return "{$matches[1]}.{$matches[2]}";
    }

    return PHP_VERSION;
}

/**
 * Get an item from an array using "dot" notation.
 *
 * @param  array  $array
 * @param  int|string  $key
 * @param  mixed  $default
 * @return mixed
 */
function array_get($array, $key, $default = null)
{
    if (array_key_exists($key, $array)) {
        return $array[$key];
    }

    if (strpos($key, '.') === false) {
        return isset($array[$key]) ? $array[$key] : $default;
    }

    foreach (explode('.', $key) as $segment) {
        if (! array_key_exists($segment, $array)) {
            return $default;
        }

        $array = $array[$segment];
    }

    return $array;
}

/**
 * Get the HTTP method of the request.
 *
 * @return string
 */
function request_method()
{
    return strtoupper(array_get($_SERVER, 'REQUEST_METHOD', 'GET'));
}

$requestContent = null;

/**
 * Get an input from the request.
 *
 * @param  string  $key
 * @param  mixed  $default
 * @return null|string
 */
function request_input($key, $default = null)
{
    global $requestContent;

    if (! in_array(request_method(), ['GET', 'HEAD'], true)) {
        if ($requestContent === null) {
            $requestContent = json_decode(file_get_contents('php://input'), true);
        }

        if ($requestContent) {
            $value = array_get($requestContent, $key);

            if ($value !== null) {
                return $value;
            }
        }
    }

    return array_get($_GET, $key, $default);
}

/**
 * Send the response as JSON and exit.
 *
 * @param  array  $data
 * @param  int  $status
 */
function send_json_response($data = null, $status = 200)
{
    if ($data === null && $status === 200) {
        $status = 204;
    }

    if ($status !== 200) {
        http_response_code($status);
    }

    header('Content-Type: application/json');

    if ($data === null) {
        exit();
    }

    exit(json_encode($data));
}

/**
 * Read the given url as a string.
 *
 * @param  string  $url
 * @param  null|array  $curlOptions
 * @return string
 */
function read_url($url, $curlOptions = null)
{
    $ch = curl_init($url);

    curl_setopt_array($ch, [
        CURLOPT_CONNECTTIMEOUT => 150,
        CURLOPT_HTTPHEADER => [
            'User-Agent: ExilonCMS Installer v1',
            'Accept: application/vnd.github.v3+json',
        ],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
    ]);

    if ($curlOptions !== null) {
        curl_setopt_array($ch, $curlOptions);
    }

    $response = curl_exec($ch);
    $errno = curl_errno($ch);

    if ($errno || $response === false) {
        $error = curl_error($ch);

        throw new RuntimeException("cURL error {$errno}: {$error}");
    }

    $statusCode = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);

    if ($statusCode >= 400) {
        throw new RuntimeException("HTTP code {$statusCode} returned for '{$url}'.", $statusCode);
    }

    return $response;
}

/**
 * Download a file from the given url and save it to the given path.
 *
 * @param  string  $url
 * @param  string  $path
 * @return string
 */
function download_file($url, $path)
{
    return read_url($url, [CURLOPT_FILE => fopen($path, 'wb+')]);
}

/**
 * Determines if a function exists and is not disabled.
 *
 * @param  string  $function
 * @return bool
 */
function has_function($function)
{
    if (! function_exists($function)) {
        return false;
    }

    try {
        return strpos(ini_get('disable_functions'), $function) === false;
    } catch (Exception $e) {
        return false;
    }
}

/**
 * Check if the current OS is Windows.
 *
 * @return bool
 */
function is_windows()
{
    return stripos(PHP_OS, 'WIN') === 0;
}

if (array_get($_GET, 'phpinfo') === '') {
    phpinfo();
    exit();
}

//
// Give the requested data if the request is from AJAX.
//
if (array_get($_SERVER, 'HTTP_X_REQUESTED_WITH') === 'XMLHttpRequest'
    || array_get($_GET, 'execute') === 'php') {
    try {
        $data = [
            'installerVersion' => $installerVersion,
            'minPhpVersion' => $minPhpVersion,
            'phpVersion' => parse_php_version(),
            'phpFullVersion' => PHP_VERSION,
            'phpIniPath' => php_ini_loaded_file(),
            'path' => __DIR__,
            'file' => __FILE__,
            'htaccess' => file_exists(__DIR__.'/.htaccess') && file_exists(__DIR__.'/public/.htaccess'),
            'windows' => is_windows(),
        ];

        $step = 'check';

        $writable = is_writable(__DIR__) && is_writable(__DIR__.'/public');

        $requirements = [
            'php' => version_compare(PHP_VERSION, $minPhpVersion, '>='),
            'writable' => $writable,
            'function-symlink' => has_function('symlink'),
            'rewrite' => isset($validInstallationUrlRewrite),
        ];

        $extracted = file_exists(__DIR__.'/vendor');

        foreach ($requiredExtensions as $extension) {
            $requirements['extension-'.$extension] = extension_loaded($extension);
        }

        $data['requirements'] = $requirements;

        $data['compatible'] = ! in_array(false, $requirements, true);
        $data['downloaded'] = file_exists(__DIR__.'/exiloncms.zip');
        $data['extracted'] = $extracted;

        $action = request_input('action');

        if (request_method() !== 'POST') {
            send_json_response($data);
        }

        if ($action === 'download') {
            // Get the latest release from GitHub
            $githubRepo = 'Exilon-Studios/ExilonCMS';
            $githubApiUrl = 'https://api.github.com/repos/'.$githubRepo.'/releases/latest';

            $json = read_url($githubApiUrl);
            $release = json_decode($json);

            if (! $release) {
                throw new RuntimeException('The response from GitHub API is not a valid JSON.');
            }

            $tagName = $release->tag_name;
            $version = ltrim($tagName, 'v');
            $data['version'] = $version;
            $data['tagName'] = $tagName;

            // Find the FULL CMS zip asset (not installer, not update package)
            $zipAsset = null;
            foreach ($release->assets ?? [] as $asset) {
                // Must match exiloncms-vX.Y.Z.zip or exiloncms-X.Y.Z.zip pattern (full package)
                if (preg_match('/^exiloncms-?v?[0-9]+\.[0-9]+\.[0-9]+\.zip$/', $asset->name)) {
                    $zipAsset = $asset;
                    break;
                }
            }

            if (! $zipAsset) {
                throw new RuntimeException('No CMS zip file found in release assets.');
            }

            $downloadUrl = $zipAsset->browser_download_url;
            $expectedSize = $zipAsset->size;
            $zipFile = __DIR__.'/exiloncms.zip';

            $needDownload = true;
            $forceDownload = request_input('force') === 'true';

            if (file_exists($zipFile) && ! $forceDownload) {
                if (filesize($zipFile) === $expectedSize) {
                    // Verify the zip is valid
                    $test = new ZipArchive;
                    if ($test->open($zipFile) === true) {
                        $test->close();
                        $needDownload = false;
                    } else {
                        unlink($zipFile);
                    }
                } else {
                    unlink($zipFile);
                }
            }

            if ($needDownload) {
                // Download directly (this may take time, so ensure PHP timeout is high enough)
                download_file($downloadUrl, $zipFile);

                if (! file_exists($zipFile)) {
                    throw new RuntimeException('The file was not downloaded.');
                }

                if (filesize($zipFile) !== $expectedSize) {
                    unlink($zipFile);
                    throw new RuntimeException('Downloaded file size mismatch.');
                }

                // Verify the downloaded zip is valid
                $test = new ZipArchive;
                if ($test->open($zipFile) !== true) {
                    unlink($zipFile);
                    throw new RuntimeException('Downloaded zip file is corrupted.');
                }
                $test->close();
            }

            $data['downloading'] = false;
            $data['downloaded'] = true;
            send_json_response($data);
        }

        if ($action === 'extract') {
            $zipFile = __DIR__.'/exiloncms.zip';

            if (! file_exists($zipFile)) {
                throw new RuntimeException('CMS file not downloaded.');
            }

            // === IMPORTANT: Create .env FIRST, before extracting CMS files ===
            $envFile = __DIR__.'/.env';
            $envExample = __DIR__.'/.env.example';

            // Create storage directories required by Laravel (will be preserved during extraction)
            $storageDirs = [
                __DIR__.'/storage/framework',
                __DIR__.'/storage/framework/cache',
                __DIR__.'/storage/framework/sessions',
                __DIR__.'/storage/framework/views',
                __DIR__.'/storage/logs',
                __DIR__.'/bootstrap/cache',
            ];
            foreach ($storageDirs as $dir) {
                if (! is_dir($dir)) {
                    mkdir($dir, 0755, true);
                }
            }

            // If .env.example will be extracted, wait for it. Otherwise create from template.
            if (! file_exists($envExample)) {
                // Create a minimal .env file before extraction
                // IMPORTANT: Use file sessions, not database sessions, to avoid chicken-and-egg problem
                $key = 'base64:'.base64_encode(random_bytes(32));
                file_put_contents($envFile, "APP_KEY=$key\nAPP_DEBUG=true\nAPP_URL=http://localhost\nDB_CONNECTION=sqlite\nDB_DATABASE=database/database.sqlite\nSESSION_DRIVER=file\n");
            }

            $zip = new ZipArchive;
            $status = $zip->open($zipFile);

            if ($status !== true) {
                throw new RuntimeException('Unable to open zip: '.$status.'.');
            }

            // Extract files one by one to fix backslash paths
            $fileCount = $zip->numFiles;
            for ($i = 0; $i < $fileCount; $i++) {
                $stat = $zip->statIndex($i);
                $filePath = $stat['name'];

                // Fix Windows backslashes in paths
                $filePath = str_replace('\\', '/', $filePath);

                // Skip files outside the target directory (security)
                if (strpos($filePath, '../') !== false || strpos($filePath, '..\\') !== false) {
                    continue;
                }

                // Remove 'exiloncms/' prefix to extract at root level
                if (strpos($filePath, 'exiloncms/') === 0) {
                    $filePath = substr($filePath, strlen('exiloncms/'));
                }

                // Skip if empty path (root directory)
                if ($filePath === '' || $filePath === 'exiloncms') {
                    continue;
                }

                $targetPath = __DIR__.'/'.$filePath;

                if (substr($filePath, -1) === '/') {
                    // Directory
                    if (! is_dir($targetPath)) {
                        mkdir($targetPath, 0755, true);
                    }
                } else {
                    // File
                    $dir = dirname($targetPath);
                    if (! is_dir($dir)) {
                        mkdir($dir, 0755, true);
                    }

                    $content = $zip->getFromIndex($i);
                    if ($content === false) {
                        $zip->close();
                        throw new RuntimeException("Failed to extract file: {$filePath}");
                    }

                    file_put_contents($targetPath, $content);
                }
            }

            $zip->close();
            unlink($zipFile);

            // === CRITICAL: Fix index.php files for servers where DocumentRoot is not public/ ===
            // Create proper Laravel bootstrap files

            // 1. Fix public/index.php - must contain Laravel bootstrap directly
            $publicIndexContent = '<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define(\'LARAVEL_START\', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.\'/../storage/framework/maintenance.php\')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.\'/../vendor/autoload.php\';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.\'/../bootstrap/app.php\';

$app->handleRequest(Request::capture());
';
            file_put_contents(__DIR__.'/public/index.php', $publicIndexContent);

            // 2. Create root index.php - same as public/index.php for servers where DocumentRoot is root
            file_put_contents(__DIR__.'/index.php', $publicIndexContent);

            // Now that files are extracted, ensure .env is properly set up
            if (! file_exists($envFile) && file_exists($envExample)) {
                copy($envExample, $envFile);
                // Add SESSION_DRIVER=file to avoid chicken-and-egg with database sessions
                file_put_contents($envFile, "\nSESSION_DRIVER=file\n", FILE_APPEND);
            }

            // Generate APP_KEY if not set and ensure file sessions
            if (file_exists($envFile)) {
                $envContent = file_get_contents($envFile);

                // Ensure we use file sessions (database sessions require migrations first)
                if (! str_contains($envContent, 'SESSION_DRIVER=')) {
                    $envContent .= "\nSESSION_DRIVER=file\n";
                    file_put_contents($envFile, $envContent);
                } else {
                    $envContent = preg_replace('/^SESSION_DRIVER=.*$/m', 'SESSION_DRIVER=file', $envContent, -1, $count);
                    if ($count > 0) {
                        file_put_contents($envFile, $envContent);
                    }
                }

                // Re-read after potentially modifying
                $envContent = file_get_contents($envFile);

                // Check if APP_KEY is missing or empty
                if (! str_contains($envContent, 'APP_KEY=') || preg_match('/^APP_KEY=$/m', $envContent)) {
                    $key = 'base64:'.base64_encode(random_bytes(32));
                    $envContent = preg_replace('/^APP_KEY=.*$/m', 'APP_KEY='.$key, $envContent, -1, $count);
                    if ($count === 0) {
                        $envContent .= "\nAPP_KEY=$key\n";
                    }
                    file_put_contents($envFile, $envContent);
                }

                // === CRITICAL: Verify vendor/ exists (should be included in CMS ZIP) ===
                if (! is_dir(__DIR__.'/vendor')) {
                    throw new RuntimeException('vendor/ directory missing! The CMS ZIP should include all dependencies. Please download the full package (exiloncms-v1.3.16.zip) instead of the update package.');
                }

                // === NOTE: Migrations are NOT run here - they will be run by the web wizard ===
                // Like Azuriom, we let the InstallController handle migrations via Artisan::call()
                // This avoids issues with php-fpm vs php-cli on different hosting platforms
                // The web wizard will run Artisan::call('migrate', ['--force' => true]) in pure PHP
            }

            $data['extracted'] = true;
            send_json_response($data);
        }

        if ($action === 'install') {
            $envFile = __DIR__.'/.env';
            $envExample = __DIR__.'/.env.example';

            if (! file_exists($envFile) && file_exists($envExample)) {
                copy($envExample, $envFile);
            }

            file_put_contents(__DIR__.'/installed.json', json_encode([
                'installed_at' => date('Y-m-d H:i:s'),
                'version' => request_input('version', 'unknown'),
            ]));

            $data['installed'] = true;
            send_json_response($data);
        }

        send_json_response('Unexpected action: '.$action, 403);
    } catch (Throwable $t) {
        send_json_response(['message' => $t->getMessage()], 500);
    }
}

?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Installation - ExilonCMS</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif;
      background: #000000;
      height: 100vh;
      display: flex;
      overflow: hidden;
    }

    /* Left side - branding */
    .branding {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 60px;
      background: #0a0a0a;
      position: relative;
      overflow: hidden;
    }

    /* Subtle grid pattern */
    .branding::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: 50px 50px;
    }

    /* Subtle glow */
    .branding::after {
      content: '';
      position: absolute;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%);
      top: -200px;
      left: -200px;
    }

    .branding-content {
      position: relative;
      z-index: 1;
    }

    .logo {
      width: 64px;
      height: 64px;
      background: #111111;
      border-radius: 14px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(255,255,255,0.1);
    }

    h1 {
      font-size: 48px;
      font-weight: 600;
      color: #ffffff;
      margin: 0 0 12px 0;
      letter-spacing: -1.5px;
    }

    .tagline {
      font-size: 15px;
      color: #666666;
      margin: 0 0 36px 0;
      max-width: 320px;
      line-height: 1.5;
    }

    /* Steps indicator */
    .steps {
      display: flex;
      gap: 8px;
    }

    .step-indicator {
      width: 24px;
      height: 4px;
      border-radius: 2px;
      background: #ffffff;
    }

    .step-indicator.inactive {
      background: #333333;
    }

    .step-text {
      color: #666666;
      font-size: 12px;
      margin-top: 12px;
    }

    /* Right side - installer */
    .installer {
      flex: 0 0 400px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 60px 48px;
      background: #000000;
      border-left: 1px solid rgba(255,255,255,0.05);
      overflow-y: auto;
    }

    .installer-content {
      max-width: 300px;
      margin: 0 auto;
      width: 100%;
    }

    h2 {
      font-size: 22px;
      font-weight: 500;
      color: #ffffff;
      margin: 0 0 6px 0;
      letter-spacing: -0.5px;
    }

    .subtitle {
      color: #666666;
      font-size: 13px;
      margin: 0 0 32px 0;
    }

    /* Status items */
    .status-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      border-radius: 6px;
      margin-bottom: 8px;
      background: #0a0a0a;
      border: 1px solid rgba(255,255,255,0.05);
    }

    .status-item.success {
      background: rgba(34, 197, 94, 0.08);
      border-color: rgba(34, 197, 94, 0.15);
    }

    .status-item.error {
      background: rgba(239, 68, 68, 0.08);
      border-color: rgba(239, 68, 68, 0.15);
    }

    .status-label {
      color: #888888;
      font-size: 12px;
      font-weight: 500;
    }

    .status-value {
      font-size: 12px;
      font-weight: 500;
    }

    .status-value.ok {
      color: #22c55e;
    }

    .status-value.fail {
      color: #ef4444;
    }

    /* Button */
    .btn {
      width: 100%;
      padding: 12px;
      background: #ffffff;
      border: none;
      border-radius: 6px;
      color: #000000;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 24px;
    }

    .btn:hover:not(:disabled) {
      background: #f0f0f0;
    }

    .btn:disabled {
      background: #1a1a1a;
      color: #666666;
      cursor: not-allowed;
      opacity: 0.6;
    }

    /* Loading state */
    .loading {
      text-align: center;
      padding: 20px 0;
    }

    .spinner {
      width: 24px;
      height: 24px;
      border: 2px solid rgba(255,255,255,0.1);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 12px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading-text {
      color: #666666;
      font-size: 13px;
    }

    /* Error message */
    .error-message {
      background: rgba(239, 68, 68, 0.08);
      border: 1px solid rgba(239, 68, 68, 0.15);
      color: #ef4444;
      padding: 12px;
      border-radius: 6px;
      font-size: 12px;
      margin-top: 16px;
    }

    /* Success message */
    .success-message {
      text-align: center;
      padding: 20px 0;
    }

    .success-icon {
      width: 48px;
      height: 48px;
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }

    .success-title {
      color: #22c55e;
      font-size: 18px;
      font-weight: 500;
      margin-bottom: 8px;
    }

    .success-text {
      color: #666666;
      font-size: 13px;
    }

    /* Responsive */
    @media (max-width: 900px) {
      .branding {
        display: none !important;
      }
      .installer {
        flex: 1 !important;
        padding: 32px 24px !important;
      }
      .installer-content {
        max-width: 100%;
      }
    }
  </style>
</head>
<body>
  <!-- Left side - branding -->
  <div class="branding">
    <div class="branding-content">
      <div class="logo">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
      <h1>ExilonCMS</h1>
      <p class="tagline">Modern CMS for gaming communities</p>

      <div class="steps">
        <div class="step-indicator" id="step1"></div>
        <div class="step-indicator inactive" id="step2"></div>
        <div class="step-indicator inactive" id="step3"></div>
      </div>
      <p class="step-text" id="stepText">Téléchargement</p>
    </div>
  </div>

  <!-- Right side - installer -->
  <div class="installer">
    <div class="installer-content">
      <h2 id="title">Installation</h2>
      <p class="subtitle" id="subtitle">Configuration de votre site</p>

      <div id="statusList">
        <div class="status-item <?php echo version_compare(PHP_VERSION, '8.2', '>=') ? 'success' : 'error'; ?>">
          <span class="status-label">PHP Version</span>
          <span class="status-value <?php echo version_compare(PHP_VERSION, '8.2', '>=') ? 'ok' : 'fail'; ?>">
            <?php echo PHP_VERSION; ?>
          </span>
        </div>

        <div class="status-item <?php echo is_writable(__DIR__) && is_writable(__DIR__.'/public') ? 'success' : 'error'; ?>">
          <span class="status-label">Permissions</span>
          <span class="status-value <?php echo is_writable(__DIR__) && is_writable(__DIR__.'/public') ? 'ok' : 'fail'; ?>">
            <?php echo is_writable(__DIR__) && is_writable(__DIR__.'/public') ? 'OK' : 'Error'; ?>
          </span>
        </div>

        <?php foreach ($requiredExtensions as $ext) { ?>
        <div class="status-item <?php echo extension_loaded($ext) ? 'success' : 'error'; ?>">
          <span class="status-label"><?php echo $ext; ?></span>
          <span class="status-value <?php echo extension_loaded($ext) ? 'ok' : 'fail'; ?>">
            <?php echo extension_loaded($ext) ? 'OK' : 'Missing'; ?>
          </span>
        </div>
        <?php } ?>
      </div>

      <?php if (version_compare(PHP_VERSION, '8.2', '>=') && is_writable(__DIR__) && is_writable(__DIR__.'/public') && empty(array_filter($requiredExtensions, fn ($ext) => ! extension_loaded($ext)))) { ?>
      <button class="btn" id="startBtn" onclick="startInstall()">
        Commencer l'installation
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14" />
          <path d="M12 5l7 7-7 7" />
        </svg>
      </button>
      <?php } else { ?>
      <p style="color: #ef4444; font-size: 12px; margin-top: 16px;">Veuillez corriger les erreurs ci-dessus avant de continuer.</p>
      <?php } ?>

      <div id="status"></div>
    </div>
  </div>

  <script>
    // Use /installer as API endpoint to avoid conflicts with CMS routes
    const apiUrl = '/installer?execute=php';
    const finalApiUrl = apiUrl;

    function updateSteps(step, text) {
      for (let i = 1; i <= 3; i++) {
        const el = document.getElementById('step' + i);
        if (el) {
          el.classList.toggle('inactive', i > step);
        }
      }
      const stepText = document.getElementById('stepText');
      if (stepText) stepText.textContent = text;
    }

    async function startInstall() {
      const startBtn = document.getElementById('startBtn');
      const status = document.getElementById('status');
      const statusList = document.getElementById('statusList');
      const title = document.getElementById('title');
      const subtitle = document.getElementById('subtitle');

      startBtn.disabled = true;
      statusList.style.display = 'none';

      try {
        // Download step
        updateSteps(1, 'Téléchargement en cours...');
        title.textContent = 'Téléchargement';
        subtitle.textContent = 'Récupération des fichiers';
        status.innerHTML = '<div class="loading"><div class="spinner"></div><p class="loading-text">Téléchargement depuis GitHub...</p></div>';

        const response = await fetch(finalApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify({ action: 'download' })
        });

        const data = await response.json();

        if (data.downloaded) {
          // Extract step
          updateSteps(2, 'Extraction en cours...');
          title.textContent = 'Extraction';
          subtitle.textContent = 'Décompression des fichiers';
          status.innerHTML = '<div class="loading"><div class="spinner"></div><p class="loading-text">Extraction des fichiers...</p></div>';
          await extractInstall(data.version);
        } else {
          throw new Error(data.message || 'Download failed');
        }
      } catch (e) {
        console.error('Error:', e);
        status.innerHTML = '<div class="error-message">' + e.message + '</div>';
        startBtn.disabled = false;
        statusList.style.display = 'block';
      }
    }

    async function extractInstall(version) {
      const status = document.getElementById('status');

      try {
        const response = await fetch(finalApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify({ action: 'extract', version })
        });
        const data = await response.json();

        if (data.extracted) {
          await finalizeInstall(version);
        } else {
          throw new Error(data.message || 'Extraction failed');
        }
      } catch (e) {
        console.error('Extract error:', e);
        status.innerHTML = '<div class="error-message">' + e.message + '</div>';
      }
    }

    async function finalizeInstall(version) {
      const status = document.getElementById('status');
      const title = document.getElementById('title');
      const subtitle = document.getElementById('subtitle');

      updateSteps(3, 'Prêt');
      title.textContent = 'Fichiers extraits';
      subtitle.textContent = 'Configuration requise';
      status.innerHTML = '<div class="success-message"><div class="success-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><polyline points="20 6 9 17 4 12" /></svg></div><p class="success-title">Fichiers téléchargés !</p><p class="success-text">Redirection vers la configuration...</p></div>';

      // Redirect to CMS installation wizard
      setTimeout(() => window.location.href = '/wizard', 2000);
    }
  </script>
</body>
</html>
