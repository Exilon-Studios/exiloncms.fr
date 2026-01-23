<?php

/*
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ExilonCMS</title>
</head>
<body style="font-family: sans-serif; text-align: center; margin-top: 1rem">
<h1>ExilonCMS - PHP Installation Issue</h1>
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
 * ExilonCMS Standalone Installer
 *
 * This file downloads and installs ExilonCMS from GitHub Releases.
 * It can be removed after installation is complete.
 *
 * @package ExilonCMS
 * @author Exilon Studios
 */

$installerVersion = '1.0.0';
$minPhpVersion = '8.2';

$requiredExtensions = [
    'bcmath', 'ctype', 'json', 'mbstring', 'openssl', 'PDO', 'tokenizer', 'xml', 'xmlwriter', 'curl', 'fileinfo', 'zip',
];

$githubRepo = 'Exilon-Studios/ExilonCMS';
$githubApiUrl = 'https://api.github.com/repos/' . $githubRepo . '/releases/latest';

set_error_handler(function ($level, $message, $file = 'unknown', $line = 0) {
    http_response_code(500);
    exit(json_encode(['message' => "A fatal error occurred: {$message} ({$file}:{$line})"]));
});

//
// Helper Functions
//

function parse_php_version()
{
    preg_match('/^(\d+)\.(\d+)/', PHP_VERSION, $matches);
    return count($matches) > 2 ? "{$matches[1]}.{$matches[2]}" : PHP_VERSION;
}

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

function request_method()
{
    return strtoupper(array_get($_SERVER, 'REQUEST_METHOD', 'GET'));
}

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

function send_json($data = null, $status = 200)
{
    if ($data === null && $status === 200) {
        $status = 204;
    }
    if ($status !== 200) {
        http_response_code($status);
    }
    header('Content-Type: application/json; charset=utf-8');
    if ($data === null) {
        exit();
    }
    exit(json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}

function read_url($url, $curlOptions = null)
{
    $ch = curl_init($url);
    $defaults = [
        CURLOPT_CONNECTTIMEOUT => 30,
        CURLOPT_TIMEOUT => 120,
        CURLOPT_HTTPHEADER => [
            'User-Agent: ExilonCMS Installer/1.0',
            'Accept: application/vnd.github.v3+json',
        ],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
    ];
    curl_setopt_array($ch, $defaults);
    if ($curlOptions !== null) {
        curl_setopt_array($ch, $curlOptions);
    }
    $response = curl_exec($ch);
    $errno = curl_errno($ch);
    if ($errno || $response === false) {
        $error = curl_error($ch);
        curl_close($ch);
        throw new RuntimeException("cURL error {$errno}: {$error}");
    }
    $statusCode = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);
    if ($statusCode >= 400) {
        throw new RuntimeException("HTTP code {$statusCode} returned for '{$url}'.", $statusCode);
    }
    return $response;
}

function download_file($url, $path)
{
    $fp = fopen($path, 'wb+');
    if ($fp === false) {
        throw new RuntimeException("Cannot open file: {$path}");
    }
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_CONNECTTIMEOUT => 30,
        CURLOPT_TIMEOUT => 300,
        CURLOPT_HTTPHEADER => [
            'User-Agent: ExilonCMS Installer/1.0',
        ],
        CURLOPT_FILE => $fp,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
    ]);
    $result = curl_exec($ch);
    $errno = curl_errno($ch);
    fclose($fp);
    curl_close($ch);
    if ($errno || $result === false) {
        throw new RuntimeException('Failed to download file: ' . curl_error($ch));
    }
    return true;
}

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

function is_windows()
{
    return stripos(PHP_OS, 'WIN') === 0;
}

function is_installed()
{
    return file_exists(__DIR__ . '/.env') || file_exists(__DIR__ . '/installed.json');
}

//
// API Endpoints
//

$isAjax = array_get($_SERVER, 'HTTP_X_REQUESTED_WITH') === 'XMLHttpRequest' || array_get($_GET, 'execute') === 'php';

if ($isAjax) {
    try {
        $baseDir = __DIR__;

        // Basic system info
        $data = [
            'installerVersion' => $installerVersion,
            'minPhpVersion' => $minPhpVersion,
            'phpVersion' => parse_php_version(),
            'phpFullVersion' => PHP_VERSION,
            'phpIniPath' => php_ini_loaded_file(),
            'path' => $baseDir,
            'windows' => is_windows(),
            'installed' => is_installed(),
        ];

        // Check requirements
        $requirements = [
            'php' => version_compare(PHP_VERSION, $minPhpVersion, '>='),
            'writable' => is_writable($baseDir),
            'function-symlink' => has_function('symlink'),
            'function-shell-exec' => has_function('shell_exec'),
            'function-exec' => has_function('exec'),
        ];

        foreach ($requiredExtensions as $extension) {
            $requirements['extension-' . $extension] = extension_loaded($extension);
        }

        $data['requirements'] = $requirements;
        $data['compatible'] = ! in_array(false, $requirements, true);
        $data['downloaded'] = file_exists($baseDir . '/exiloncms.zip');
        $data['extracted'] = file_exists($baseDir . '/vendor');

        $action = request_input('action');

        if (request_method() !== 'POST') {
            send_json($data);
        }

        // Handle POST actions
        switch ($action) {
            case 'check':
                send_json($data);

            case 'download':
                // Fetch latest release info from GitHub
                $json = read_url($githubApiUrl);
                $release = json_decode($json, true);

                if (! $release) {
                    throw new RuntimeException('Invalid response from GitHub API');
                }

                $tagName = $release['tag_name'];
                $version = ltrim($tagName, 'v');
                $data['version'] = $version;
                $data['tagName'] = $tagName;
                $data['releaseName'] = $release['name'] ?? $tagName;
                $data['releaseNotes'] = $release['body'] ?? '';

                // Find the CMS zip asset (not installer)
                $zipAsset = null;
                foreach ($release['assets'] ?? [] as $asset) {
                    if (str_ends_with($asset['name'], '.zip') && ! str_contains($asset['name'], 'installer')) {
                        $zipAsset = $asset;
                        break;
                    }
                }

                if (! $zipAsset) {
                    throw new RuntimeException('No CMS zip file found in release assets');
                }

                $downloadUrl = $zipAsset['browser_download_url'];
                $expectedSize = $zipAsset['size'];
                $zipFile = $baseDir . '/exiloncms.zip';

                // Download if not exists or size mismatch
                $needDownload = true;
                if (file_exists($zipFile)) {
                    if (filesize($zipFile) === $expectedSize) {
                        $needDownload = false;
                    } else {
                        unlink($zipFile);
                    }
                }

                if ($needDownload) {
                    $data['downloading'] = true;
                    send_json($data);

                    download_file($downloadUrl, $zipFile);

                    if (! file_exists($zipFile)) {
                        throw new RuntimeException('Failed to download CMS file');
                    }

                    if (filesize($zipFile) !== $expectedSize) {
                        unlink($zipFile);
                        throw new RuntimeException('Downloaded file size mismatch');
                    }
                }

                $data['downloading'] = false;
                $data['downloaded'] = true;
                send_json($data);

            case 'extract':
                $zipFile = $baseDir . '/exiloncms.zip';

                if (! file_exists($zipFile)) {
                    throw new RuntimeException('CMS file not downloaded');
                }

                $zip = new ZipArchive();
                $status = $zip->open($zipFile);

                if ($status !== true) {
                    throw new RuntimeException("Failed to open zip archive: error code {$status}");
                }

                // Extract to current directory
                if (! $zip->extractTo($baseDir)) {
                    $zip->close();
                    throw new RuntimeException('Failed to extract zip archive');
                }

                $zip->close();

                // Clean up zip file
                unlink($zipFile);

                $data['extracted'] = true;
                send_json($data);

            case 'install':
                // Step 1: Create .env file
                $envFile = $baseDir . '/.env';
                $envExample = $baseDir . '/.env.example';

                if (! file_exists($envFile) && file_exists($envExample)) {
                    $envContent = file_get_contents($envExample);
                    file_put_contents($envFile, $envContent);
                }

                // Step 2: Generate app key
                if (function_exists('shell_exec')) {
                    shell_exec('cd ' . escapeshellarg($baseDir) . ' && php artisan key:generate --force 2>&1');
                }

                // Step 3: Create installed.json
                file_put_contents($baseDir . '/installed.json', json_encode([
                    'installed_at' => date('Y-m-d H:i:s'),
                    'version' => request_input('version', 'unknown'),
                ]));

                $data['installed'] = true;
                send_json($data);

            default:
                send_json(['message' => 'Unexpected action: ' . $action], 403);
        }

    } catch (Throwable $t) {
        send_json(['message' => $t->getMessage()], 500);
    }
}

//
// Serve the installer UI
//

// Redirect to app if already installed
if (is_installed()) {
    // Try to redirect to the installed app
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' ? 'https' : 'http';
    $host = array_get($_SERVER, 'HTTP_HOST', 'localhost');
    $path = array_get($_SERVER, 'REQUEST_URI', '');

    header('Location: ' . $protocol . '://' . $host . str_replace('/index.php', '', $path) . '/install/complete?from_installer=true');
    exit;
}

?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Installation - ExilonCMS</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚀</text></svg>" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    #app { width: 100%; max-width: 1200px; margin: 2rem; }
    .loader { text-align: center; color: white; }
    .spinner { width: 50px; height: 50px; border: 4px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem; }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div id="app">
    <div class="loader">
      <div class="spinner"></div>
      <p>Chargement de l'installateur...</p>
    </div>
  </div>
  <script>
    window.EXILONCMS_INSTALLER = {
      apiUrl: window.location.pathname + '?execute=php',
      version: '<?php echo $installerVersion; ?>',
      minPhpVersion: '<?php echo $minPhpVersion; ?>',
    };
  </script>
  <script type="module" src="https://cdn.jsdelivr.net/npm/@exiloncms/installer@1.0.0/assets/index.js"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@exiloncms/installer@1.0.0/assets/index.css">
</body>
</html>
