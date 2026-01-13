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
 * Based on Azuriom's installer approach.
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
        if ($requestContent && isset($requestContent[$key])) {
            return $requestContent[$key];
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
            $json = read_url('https://api.github.com/repos/Exilon-Studios/ExilonCMS/releases/latest');
            $response = json_decode($json);

            if (! $response) {
                throw new RuntimeException('The response from GitHub API is not a valid JSON.');
            }

            // Find the CMS zip asset (look for exiloncms-full.zip)
            $zipAsset = null;
            foreach ($response->assets as $asset) {
                if ($asset->name === 'exiloncms-full.zip') {
                    $zipAsset = $asset;
                    break;
                }
            }

            if (! $zipAsset) {
                throw new RuntimeException('exiloncms-full.zip not found in release assets.');
            }

            $file = __DIR__.'/exiloncms.zip';
            $needDownload = true;

            if (file_exists($file)) {
                if (filesize($file) === $zipAsset->size) {
                    $needDownload = false;
                } else {
                    unlink($file);
                }
            }

            if ($needDownload) {
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

            // Check if files are in a subdirectory
            $dirs = glob(__DIR__.'/*', GLOB_ONLYDIR);
            $cmsDir = null;

            foreach ($dirs as $dir) {
                $basename = basename($dir);
                if (preg_match('/^exiloncms-v[\d.]+$/', $basename) &&
                    is_dir($dir.'/app') && file_exists($dir.'/artisan')) {
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
                    $relativePath = $iterator->getSubPathName();
                    $destPath = __DIR__.'/'.$relativePath;

                    // Let CMS files overwrite installer files (especially .htaccess)
                    if ($relativePath === 'index.php') {
                        // Don't overwrite installer's index.php during extraction
                        // (it will be deleted at the end)
                        continue;
                    }

                    if ($item->isDir()) {
                        if (! is_dir($destPath)) {
                            mkdir($destPath, 0755, true);
                        }
                    } else {
                        copy($item->getPathname(), $destPath);
                    }
                }

                // Remove the subdirectory
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

            // Create required Laravel directories
            $requiredDirs = [
                'storage/framework',
                'storage/framework/cache',
                'storage/framework/sessions',
                'storage/framework/views',
                'storage/logs',
                'bootstrap/cache',
            ];

            foreach ($requiredDirs as $dir) {
                $path = __DIR__.'/'.$dir;
                if (! is_dir($path)) {
                    mkdir($path, 0755, true);
                }
            }

            // Create minimal .env file
            $envContent = <<<ENV
APP_NAME="ExilonCMS"
APP_ENV=production
APP_KEY=base64:hmU1T3OuvHdi5t1wULI8Xp7geI+JIWGog9pBCNxslY8=
APP_DEBUG=false
APP_URL=http://localhost

LOG_CHANNEL=stack
LOG_LEVEL=debug

DB_CONNECTION=sqlite

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120
ENV;

            file_put_contents(__DIR__.'/.env', $envContent);

            // Create SQLite database
            $dbDir = __DIR__.'/database';
            if (! is_dir($dbDir)) {
                mkdir($dbDir, 0755, true);
            }
            $dbFile = $dbDir.'/database.sqlite';
            if (! file_exists($dbFile)) {
                touch($dbFile);
            }

            // Delete installer's index.php so CMS can take over
            if (file_exists(__FILE__)) {
                unlink(__FILE__);
            }

            // Note: public/ and .htaccess were already overwritten by CMS extraction
            // No need to manually delete them

            send_json_response([
                'success' => true,
                'redirect' => '/install',
                'message' => 'ExilonCMS installed successfully! Redirecting...'
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

    html, body {
      height: 100%;
      overflow: hidden;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
      background: #000000;
      display: flex;
    }

    .split-container {
      display: flex;
      width: 100%;
      height: 100vh;
    }

    /* Left side - branding */
    .left-side {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 60px;
      background: #0a0a0a;
      position: relative;
      overflow: hidden;
    }

    .grid-pattern {
      position: absolute;
      inset: 0;
      background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: 50px 50px;
    }

    .glow {
      position: absolute;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%);
      top: -200px;
      left: -200px;
    }

    .logo-section {
      position: relative;
      z-index: 1;
    }

    .logo-icon {
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

    .logo-icon svg {
      width: 28px;
      height: 28px;
    }

    .logo-section h1 {
      font-size: 48px;
      font-weight: 600;
      color: #ffffff;
      margin: 0 0 12px 0;
      letter-spacing: -1.5px;
    }

    .logo-section p {
      font-size: 15px;
      color: #666666;
      margin: 0 0 36px 0;
      max-width: 320px;
      line-height: 1.5;
    }

    .steps {
      display: flex;
      gap: 8px;
    }

    .step {
      width: 24px;
      height: 4px;
      border-radius: 2px;
      background: #ffffff;
    }

    .step.inactive {
      background: #333333;
    }

    .step-text {
      color: #666666;
      font-size: 12px;
      margin-top: 12px;
    }

    /* Right side - requirements */
    .right-side {
      flex: 0 0 480px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 60px 48px;
      background: #000000;
      border-left: 1px solid rgba(255,255,255,0.05);
    }

    .right-content {
      max-width: 380px;
      width: 100%;
    }

    .right-content h2 {
      font-size: 22px;
      font-weight: 500;
      color: #ffffff;
      margin: 0 0 6px 0;
      letter-spacing: -0.5px;
    }

    .right-content p {
      color: #666666;
      font-size: 15px;
      margin: 0 0 32px 0;
    }

    .requirements {
      margin-bottom: 24px;
    }

    .requirement-item {
      display: flex;
      align-items: center;
      padding: 12px 14px;
      margin-bottom: 8px;
      background: #0a0a0a;
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 6px;
    }

    .requirement-item:last-child {
      margin-bottom: 0;
    }

    .requirement-icon {
      width: 18px;
      height: 18px;
      margin-left: 12px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      flex-shrink: 0;
    }

    .requirement-icon.success {
      background: rgba(34, 197, 94, 0.15);
      color: #22c55e;
    }

    .requirement-icon.error {
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
    }

    .requirement-text {
      flex: 1;
      font-size: 15px;
      color: #888888;
    }

    .button {
      width: 100%;
      padding: 12px;
      background: #ffffff;
      color: #000000;
      border: none;
      border-radius: 6px;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .button:hover:not(:disabled) {
      background: #f0f0f0;
    }

    .button:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .progress {
      display: none;
      margin-top: 20px;
    }

    .progress-bar {
      width: 100%;
      height: 4px;
      background: rgba(255,255,255,0.1);
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: 12px;
    }

    .progress-fill {
      height: 100%;
      background: #ffffff;
      width: 0%;
      transition: width 0.3s;
    }

    .progress-text {
      text-align: center;
      font-size: 13px;
      color: #666666;
      display: none;
    }

    .error {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      padding: 12px 14px;
      border-radius: 6px;
      margin-top: 20px;
      font-size: 14px;
      display: none;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .success {
      background: rgba(34, 197, 94, 0.1);
      color: #22c55e;
      padding: 12px 14px;
      border-radius: 6px;
      margin-top: 20px;
      font-size: 14px;
      display: none;
      border: 1px solid rgba(34, 197, 94, 0.2);
    }

    @media (max-width: 900px) {
      .left-side {
        display: none !important;
      }
      .right-side {
        flex: 1 !important;
        padding: 32px 24px !important;
      }
    }
  </style>
</head>
<body>
  <div class="split-container">
    <!-- Left side - branding -->
    <div class="left-side">
      <div class="grid-pattern"></div>
      <div class="glow"></div>

      <div class="logo-section">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <h1>ExilonCMS</h1>
        <p>Modern CMS for gaming communities</p>

        <div class="steps">
          <div class="step"></div>
        </div>
        <p class="step-text">Installation d'ExilonCMS</p>
      </div>
    </div>

    <!-- Right side - requirements -->
    <div class="right-side">
      <div class="right-content">
        <h2>System Requirements</h2>
        <p>Checking your server compatibility...</p>

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
          Télécharger et Installer
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>
      </div>
    </div>
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
            <div class="requirement-text">${req.label}</div>
            <div class="requirement-icon ${passed ? 'success' : 'error'}">
              ${passed ? '✓' : '✗'}
            </div>
          </div>
        `;
      }).join('');

      if (data.compatible) {
        installBtn.disabled = false;
      } else {
        showError('Certains prérequis ne sont pas remplis. Veuillez contacter votre hébergeur.');
      }

      if (data.extracted) {
        installBtn.textContent = 'Déjà installé ! Redirection...';
        setTimeout(() => {
          window.location.href = '/install';
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
        progressText.textContent = 'Téléchargement depuis GitHub (~15 MB)...';
        progressFill.style.width = '20%';

        const response = await fetch('?execute=php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'download' })
        });

        progressFill.style.width = '60%';
        progressText.textContent = 'Extraction des fichiers...';

        const result = await response.json();

        progressFill.style.width = '80%';
        progressText.textContent = 'Configuration en cours...';

        if (!response.ok) {
          throw new Error(result.message || 'Erreur lors de l\'installation');
        }

        progressFill.style.width = '100%';
        progressText.textContent = 'Installation terminée !';

        successDiv.style.display = 'block';
        successDiv.textContent = result.message || 'ExilonCMS a été installé avec succès !';

        setTimeout(() => {
          const redirectUrl = result.redirect || '/install';
          window.location.href = redirectUrl;
        }, 1500);

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
