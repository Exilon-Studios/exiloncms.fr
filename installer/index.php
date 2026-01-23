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
 *
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
 *
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
 *
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
 *
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
 *
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

            // Find the CMS zip asset (not the installer)
            $zipAsset = null;
            foreach ($release->assets ?? [] as $asset) {
                if (str_ends_with($asset->name, '.zip') && ! str_contains($asset->name, 'installer')) {
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
            if (file_exists($zipFile)) {
                if (filesize($zipFile) === $expectedSize) {
                    $needDownload = false;
                } else {
                    unlink($zipFile);
                }
            }

            if ($needDownload) {
                $data['downloading'] = true;
                send_json_response($data);

                download_file($downloadUrl, $zipFile);

                if (! file_exists($zipFile)) {
                    throw new RuntimeException('The file was not downloaded.');
                }

                if (filesize($zipFile) !== $expectedSize) {
                    unlink($zipFile);
                    throw new RuntimeException('Downloaded file size mismatch.');
                }
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

            $zip = new ZipArchive();
            $status = $zip->open($zipFile);

            if ($status !== true) {
                throw new RuntimeException('Unable to open zip: '.$status.'.');
            }

            if (! $zip->extractTo(__DIR__)) {
                $zip->close();
                throw new RuntimeException('Unable to extract zip');
            }

            $zip->close();
            unlink($zipFile);

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
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚀</text></svg>" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Installation - ExilonCMS</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .installer {
      background: white;
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
      max-width: 900px;
      width: 100%;
      margin: 1rem;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
      border-radius: 16px 16px 0 0;
      color: white;
    }
    .header h1 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }
    .header p {
      opacity: 0.9;
      font-size: 0.95rem;
    }
    .content {
      padding: 2rem;
    }
    .info {
      background: #f3f4f6;
      border-radius: 8px;
      padding: 1rem;
      margin: 1rem 0;
      font-size: 0.875rem;
    }
    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0.5rem 0;
      padding: 0.5rem;
      background: white;
      border-radius: 6px;
    }
    .info-item span:first-child {
      font-weight: 500;
      color: #374151;
    }
    .ok {
      color: #10b981;
      font-weight: 600;
    }
    .error {
      color: #ef4444;
      font-weight: 600;
    }
    .btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      width: 100%;
      text-align: center;
      font-weight: 500;
      transition: opacity 0.2s;
    }
    .btn:hover:not(:disabled) {
      opacity: 0.9;
    }
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    #status {
      margin-top: 1rem;
    }
    .loading {
      text-align: center;
      padding: 2rem;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e5e7eb;
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .step {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background: #f9fafb;
      border-radius: 8px;
      margin: 0.5rem 0;
    }
    .step.done {
      color: #10b981;
      background: #ecfdf5;
    }
    .step.active {
      color: #667eea;
      background: #eef2ff;
    }
    .step.pending {
      color: #9ca3af;
    }
    .step-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .error-message {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #991b1b;
      padding: 1rem;
      border-radius: 8px;
      margin-top: 1rem;
    }
  </style>
</head>
<body>
  <div class="installer">
    <div class="header">
      <h1>🚀 Installation d'ExilonCMS</h1>
      <p>Cet installateur va télécharger et configurer ExilonCMS sur votre serveur.</p>
    </div>
    <div class="content">
      <div class="info">
        <h3 style="margin-bottom: 1rem; color: #374151;">Vérification des prérequis</h3>
        <div class="info-item">
          <span>PHP Version:</span>
          <span class="<?php echo version_compare(PHP_VERSION, '8.2', '>=') ? 'ok' : 'error'; ?>">
            <?php echo PHP_VERSION; ?>
          </span>
        </div>
        <div class="info-item">
          <span>Permissions:</span>
          <span class="<?php echo is_writable(__DIR__) && is_writable(__DIR__.'/public') ? 'ok' : 'error'; ?>">
            <?php echo is_writable(__DIR__) && is_writable(__DIR__.'/public') ? 'OK' : 'Error'; ?>
          </span>
        </div>
        <?php foreach ($requiredExtensions as $ext): ?>
        <div class="info-item">
          <span><?php echo $ext; ?>:</span>
          <span class="<?php echo extension_loaded($ext) ? 'ok' : 'error'; ?>">
            <?php echo extension_loaded($ext) ? 'OK' : 'Missing'; ?>
          </span>
        </div>
        <?php endforeach; ?>
      </div>
      <?php if (version_compare(PHP_VERSION, '8.2', '>=') && is_writable(__DIR__) && is_writable(__DIR__.'/public') && empty(array_filter($requiredExtensions, fn($ext) => !extension_loaded($ext)))): ?>
      <button class="btn" id="startBtn" onclick="startInstall()">Commencer l'installation</button>
      <?php else: ?>
      <p style="color: #ef4444; text-align: center; font-weight: 500;">Veuillez corriger les erreurs ci-dessus avant de continuer.</p>
      <?php endif; ?>
      <div id="status"></div>
    </div>
  </div>
  <script>
    const apiUrl = window.location.href.includes('public')
      ? window.location.pathname.replace('/public/', '/?execute=php')
      : (window.location.pathname + (window.location.pathname.includes('?') ? '&' : '?') + 'execute=php');

    // Ensure we have proper URL format
    const finalApiUrl = apiUrl.startsWith('/') ? apiUrl : '/' + apiUrl;

    console.log('API URL:', finalApiUrl);

    async function startInstall() {
      const startBtn = document.getElementById('startBtn');
      const status = document.getElementById('status');
      startBtn.disabled = true;

      try {
        // First, test the API connection
        console.log('Testing API connection...');
        const testResponse = await fetch(finalApiUrl, {
          method: 'GET',
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });

        console.log('Test response status:', testResponse.status);
        const testData = await testResponse.json();
        console.log('Test data:', testData);

        if (!testData.compatible) {
          throw new Error('System requirements not met');
        }

        // Start download
        status.innerHTML = '<div class="loading"><div class="spinner"></div><p>Téléchargement en cours...</p></div>';

        const response = await fetch(finalApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify({ action: 'download' })
        });

        console.log('Download response status:', response.status);
        const data = await response.json();
        console.log('Download data:', data);

        if (data.downloading) {
          // Wait for download to complete, then call extract
          await pollForComplete(data.version);
        } else if (data.downloaded) {
          await extractInstall(data.version || testData.version);
        } else {
          throw new Error(data.message || 'Download failed');
        }
      } catch (e) {
        console.error('Error:', e);
        status.innerHTML = '<div class="error-message"><strong>Erreur:</strong> ' + e.message + '</div>';
        startBtn.disabled = false;
      }
    }

    async function pollForComplete(version) {
      const status = document.getElementById('status');
      let attempts = 0;
      const maxAttempts = 60;

      const poll = async () => {
        attempts++;
        const response = await fetch(finalApiUrl, {
          method: 'GET',
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });
        const data = await response.json();

        if (data.downloaded && !data.downloading) {
          await extractInstall(version);
        } else if (attempts < maxAttempts) {
          setTimeout(poll, 1000);
        } else {
          throw new Error('Download timeout');
        }
      };

      await poll();
    }

    async function extractInstall(version) {
      const status = document.getElementById('status');
      status.innerHTML = '<div class="loading"><div class="spinner"></div><p>Extraction en cours...</p></div>';

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
        const status = document.getElementById('status');
        status.innerHTML = '<div class="error-message"><strong>Erreur:</strong> ' + e.message + '</div>';
      }
    }

    async function finalizeInstall(version) {
      const status = document.getElementById('status');
      status.innerHTML = '<div class="loading"><div class="spinner"></div><p>Configuration finale...</p></div>';

      try {
        const response = await fetch(finalApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify({ action: 'install', version })
        });
        const data = await response.json();

        if (data.installed) {
          status.innerHTML = '<div style="text-align: center;"><h2 style="color: #10b981; margin-bottom: 1rem;">✓ Installation terminée !</h2><p>Redirection vers votre site...</p></div>';
          setTimeout(() => window.location.href = '/', 3000);
        } else {
          throw new Error(data.message || 'Installation failed');
        }
      } catch (e) {
        console.error('Finalize error:', e);
        status.innerHTML = '<div class="error-message"><strong>Erreur:</strong> ' + e.message + '</div>';
      }
    }
  </script>
</body>
</html>
