<?php

/*
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ExilonCMS</title>
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
 * @author ExilonCMS
 */

$installerVersion = '1.0.0';
$minPhpVersion = '8.2';

$requiredExtensions = [
    'bcmath', 'ctype', 'json', 'mbstring', 'openssl', 'PDO', 'tokenizer', 'xml', 'curl', 'fileinfo', 'zip',
];

set_error_handler(function ($level, $message, $file = 'unknown', $line = 0) {
    http_response_code(500);
    exit(json_encode(['message' => "A fatal error occurred: {$message} ({$file}:{$line})"]));
});

//
// Helper functions
//

function parse_php_version()
{
    preg_match('/^(\d+)\.(\d+)/', PHP_VERSION, $matches);

    if (count($matches) > 2) {
        return "{$matches[1]}.{$matches[2]}";
    }

    return PHP_VERSION;
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

function request_url()
{
    $scheme = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' ? 'https' : 'http';
    $host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : $_SERVER['SERVER_NAME'];
    $path = ! empty($_SERVER['REQUEST_URI']) ? explode('?', $_SERVER['REQUEST_URI'])[0] : '';

    return "{$scheme}://{$host}{$path}";
}

$requestContent = null;

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

function read_url($url, $curlOptions = null)
{
    $ch = curl_init($url);

    curl_setopt_array($ch, [
        CURLOPT_CONNECTTIMEOUT => 150,
        CURLOPT_HTTPHEADER => [
            'User-Agent: ExilonCMS Installer v1',
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

    curl_close($ch);

    return $response;
}

function download_file($url, $path)
{
    return read_url($url, [CURLOPT_FILE => fopen($path, 'wb+')]);
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

if (array_get($_GET, 'phpinfo') === '') {
    phpinfo();
    exit();
}

//
// AJAX API
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

        $writable = is_writable(__DIR__) && is_writable(__DIR__.'/public');

        $requirements = [
            'php' => version_compare(PHP_VERSION, $minPhpVersion, '>='),
            'writable' => $writable,
            'function-symlink' => has_function('symlink'),
        ];

        $extracted = file_exists(__DIR__.'/app') || file_exists(__DIR__.'/vendor');

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
            $json = read_url('https://api.github.com/repos/Exilon-Studios/ExilonCMS/releases/latest');

            $response = json_decode($json);

            if (! $response) {
                throw new RuntimeException('The response from GitHub API is not a valid JSON.');
            }

            // Find the zip asset
            $zipAsset = null;
            foreach ($response->assets as $asset) {
                if (str_ends_with($asset->name, '.zip') && strpos($asset->name, 'installer') === false) {
                    $zipAsset = $asset;
                    break;
                }
            }

            if (! $zipAsset) {
                throw new RuntimeException('No zip file found in the latest release.');
            }

            $file = __DIR__.'/exiloncms.zip';
            $needDownload = true;

            if (file_exists($file)) {
                // Check if the file size matches
                if (filesize($file) === $zipAsset->size) {
                    $needDownload = false;
                } else {
                    unlink($file);
                }
            }

            if ($needDownload) {
                // Download with progress tracking
                download_file($zipAsset->browser_download_url, $file);
            }

            if (! file_exists($file)) {
                throw new RuntimeException('The file was not downloaded.');
            }

            // Extract the zip
            $zip = new ZipArchive();

            if (($status = $zip->open($file)) !== true) {
                throw new RuntimeException('Unable to open zip: '.$status.'.');
            }

            if (! $zip->extractTo(__DIR__)) {
                throw new RuntimeException('Unable to extract zip');
            }

            $zip->close();

            // Delete the zip file
            unlink($file);

            // Check if files are in a subdirectory (exiloncms-vX.X.X/)
            $dirs = glob(__DIR__.'/*', GLOB_ONLYDIR);
            $cmsDir = null;

            foreach ($dirs as $dir) {
                $basename = basename($dir);

                // Check if this is the CMS directory (contains app/vendor/config)
                if (preg_match('/^exiloncms-v[\d.]+$/', $basename) &&
                    is_dir($dir.'/app') && is_dir($dir.'/vendor')) {
                    $cmsDir = $dir;
                    break;
                }
            }

            // Move files from subdirectory to root
            if ($cmsDir !== null) {
                $iterator = new RecursiveIteratorIterator(
                    new RecursiveDirectoryIterator($cmsDir, RecursiveDirectoryIterator::SKIP_DOTS),
                    RecursiveIteratorIterator::SELF_FIRST
                );

                foreach ($iterator as $item) {
                    $destPath = __DIR__.'/'.$iterator->getSubPathName();

                    if ($item->isDir()) {
                        if (! is_dir($destPath)) {
                            mkdir($destPath, 0755, true);
                        }
                    } else {
                        copy($item->getPathname(), $destPath);
                    }
                }

                // Remove the now-empty subdirectory
                $it = new RecursiveDirectoryIterator($cmsDir, RecursiveDirectoryIterator::SKIP_DOTS);
                $files = new RecursiveIteratorIterator($it, RecursiveIteratorIterator::CHILD_FIRST);

                foreach ($files as $file) {
                    if ($file->isDir()) {
                        rmdir($file->getPathname());
                    } else {
                        unlink($file->getPathname());
                    }
                }

                rmdir($cmsDir);
            }

            // Delete the install.php file itself
            if (file_exists(__DIR__.'/install.php')) {
                unlink(__DIR__.'/install.php');
            }

            // Don't delete the public folder anymore - it's part of the CMS!
            // The installer's public folder only contained a redirect file

            send_json_response([
                'success' => true,
                'message' => 'ExilonCMS has been installed successfully!'
            ]);
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
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .container {
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      max-width: 600px;
      width: 100%;
      padding: 40px;
    }

    .logo {
      text-align: center;
      margin-bottom: 30px;
    }

    .logo h1 {
      font-size: 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .logo p {
      color: #666;
      margin-top: 10px;
    }

    .requirements {
      margin: 30px 0;
    }

    .requirement-item {
      display: flex;
      align-items: center;
      padding: 12px;
      border-bottom: 1px solid #f0f0f0;
    }

    .requirement-item:last-child {
      border-bottom: none;
    }

    .requirement-icon {
      width: 24px;
      height: 24px;
      margin-right: 12px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }

    .requirement-icon.success {
      background: #10b981;
      color: white;
    }

    .requirement-icon.error {
      background: #ef4444;
      color: white;
    }

    .requirement-text {
      flex: 1;
      font-size: 14px;
      color: #333;
    }

    .button {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      margin-top: 20px;
    }

    .button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }

    .button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .progress {
      display: none;
      margin-top: 20px;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: #f0f0f0;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      width: 0%;
      transition: width 0.3s;
    }

    .progress-text {
      text-align: center;
      margin-top: 10px;
      font-size: 14px;
      color: #666;
    }

    .error {
      background: #fee;
      color: #c33;
      padding: 12px;
      border-radius: 8px;
      margin-top: 20px;
      font-size: 14px;
      display: none;
    }

    .success {
      background: #efe;
      color: #3c3;
      padding: 12px;
      border-radius: 8px;
      margin-top: 20px;
      font-size: 14px;
      display: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <h1>🚀 ExilonCMS</h1>
      <p>Installation rapide et facile</p>
    </div>

    <div class="requirements" id="requirements">
      <!-- Requirements will be loaded here -->
    </div>

    <div class="error" id="error"></div>
    <div class="success" id="success"></div>

    <div class="progress" id="progress">
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
      </div>
      <div class="progress-text" id="progressText">Téléchargement en cours...</div>
    </div>

    <button class="button" id="installBtn" disabled>
      Installer ExilonCMS
    </button>
  </div>

  <script>
    let data = null;

    async function loadData() {
      try {
        const response = await fetch('?execute=php');
        data = await response.json();
        renderRequirements();
      } catch (error) {
        showError('Impossible de communiquer avec le serveur: ' + error.message);
      }
    }

    function renderRequirements() {
      const container = document.getElementById('requirements');
      const installBtn = document.getElementById('installBtn');

      const requirements = [
        { key: 'php', label: `PHP ${data.minPhpVersion}+ (actuel: ${data.phpFullVersion})` },
        { key: 'writable', label: 'Permissions d\'écriture' },
        { key: 'extension-bcmath', label: 'Extension BCMath' },
        { key: 'extension-ctype', label: 'Extension CType' },
        { key: 'extension-json', label: 'Extension JSON' },
        { key: 'extension-mbstring', label: 'Extension MBString' },
        { key: 'extension-openssl', label: 'Extension OpenSSL' },
        { key: 'extension-PDO', label: 'Extension PDO' },
        { key: 'extension-tokenizer', label: 'Extension Tokenizer' },
        { key: 'extension-xml', label: 'Extension XML' },
        { key: 'extension-curl', label: 'Extension Curl' },
        { key: 'extension-fileinfo', label: 'Extension FileInfo' },
        { key: 'extension-zip', label: 'Extension Zip' },
      ];

      container.innerHTML = requirements.map(req => {
        const passed = data.requirements[req.key];
        return `
          <div class="requirement-item">
            <div class="requirement-icon ${passed ? 'success' : 'error'}">
              ${passed ? '✓' : '✗'}
            </div>
            <div class="requirement-text">${req.label}</div>
          </div>
        `;
      }).join('');

      if (data.compatible) {
        installBtn.disabled = false;
      } else {
        showError('Certains prérequis ne sont pas remplis. Veuillez contacter votre hébergeur.');
      }

      // Already installed?
      if (data.extracted) {
        installBtn.textContent = 'Déjà installé ! Redirection...';
        setTimeout(() => {
          window.location.href = window.location.href.replace('install.php', '');
        }, 2000);
      }
    }

    async function install() {
      const installBtn = document.getElementById('installBtn');
      const progress = document.getElementById('progress');
      const progressFill = document.getElementById('progressFill');
      const progressText = document.getElementById('progressText');
      const errorDiv = document.getElementById('error');
      const successDiv = document.getElementById('success');

      installBtn.disabled = true;
      progress.style.display = 'block';
      errorDiv.style.display = 'none';

      try {
        progressText.textContent = 'Téléchargement depuis GitHub (~27 MB)...';
        progressFill.style.width = '30%';

        const response = await fetch('?execute=php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'download' })
        });

        progressFill.style.width = '80%';
        progressText.textContent = 'Extraction des fichiers...';

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Erreur lors de l\'installation');
        }

        progressFill.style.width = '100%';
        progressText.textContent = 'Installation terminée !';

        successDiv.style.display = 'block';
        successDiv.textContent = result.message || 'ExilonCMS a été installé avec succès !';

        setTimeout(() => {
          window.location.href = window.location.href.replace('install.php', '');
        }, 2000);

      } catch (error) {
        showError('Erreur lors de l\'installation: ' + error.message);
        installBtn.disabled = false;
        progress.style.display = 'none';
      }
    }

    function showError(message) {
      const errorDiv = document.getElementById('error');
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
    }

    document.getElementById('installBtn').addEventListener('click', install);

    loadData();
  </script>
</body>
</html>
