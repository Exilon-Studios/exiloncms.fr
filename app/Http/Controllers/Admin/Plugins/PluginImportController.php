<?php

namespace ExilonCMS\Http\Controllers\Admin\Plugins;

use ExilonCMS\Classes\Plugin\PluginLoader;
use ExilonCMS\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use ZipArchive;

/**
 * Plugin Import Controller
 *
 * Handles plugin installation via ZIP file upload.
 * Validates plugin structure and installs automatically.
 */
class PluginImportController extends Controller
{
    public function __construct(
        private PluginLoader $pluginLoader,
    ) {}

    /**
     * Show the plugin import page.
     */
    public function show()
    {
        return Inertia::render('Admin/Plugins/Import');
    }

    /**
     * Import a plugin from a ZIP file.
     */
    public function import(Request $request)
    {
        $request->validate([
            'zip' => 'required|file|mimes:zip|max:10240', // 10MB max
            'auto_enable' => 'boolean',
        ]);

        $zipFile = $request->file('zip');
        $autoEnable = $request->boolean('auto_enable', true);

        // Create temporary extraction directory
        $tempDir = storage_path('app/temp/plugin_'.uniqid());
        File::ensureDirectoryExists($tempDir);

        try {
            // Extract ZIP file
            $zip = new ZipArchive;
            $openResult = $zip->open($zipFile->getRealPath());

            if ($openResult !== true) {
                throw new \Exception("Failed to open ZIP file (error code: {$openResult})");
            }

            $zip->extractTo($tempDir);
            $zip->close();

            // Validate plugin structure
            $pluginData = $this->validatePluginStructure($tempDir);
            $pluginId = $pluginData['id'];
            $pluginPath = base_path("plugins/{$pluginId}");

            // Check if plugin already exists
            if (File::exists($pluginPath)) {
                // Backup existing plugin
                $backupPath = storage_path("app/backups/plugins/{$pluginId}_".date('Y-m-d_His'));
                File::copyDirectory($pluginPath, $backupPath);
                File::deleteDirectory($pluginPath);
                Log::info("Plugin backed up to: {$backupPath}");
            }

            // Move plugin to final location
            File::moveDirectory($tempDir, $pluginPath);

            // Register plugin in composer autoload if needed
            $this->registerPluginAutoload($pluginId, $pluginPath);

            // Clear all caches
            Artisan::call('cache:clear');
            Artisan::call('config:clear');
            Artisan::call('route:clear');

            // Clear plugin loader cache
            $this->pluginLoader->clearCache();

            // Run migrations if they exist
            $migrationsPath = "{$pluginPath}/database/migrations";
            if (File::exists($migrationsPath) && count(File::files($migrationsPath)) > 0) {
                Artisan::call('migrate', ['--force' => true]);
                Log::info("Migrations run for plugin: {$pluginId}");
            }

            // Auto-enable plugin if requested
            if ($autoEnable) {
                $enabledPlugins = collect(setting('enabled_plugins', []));
                if (! $enabledPlugins->contains($pluginId)) {
                    $enabledPlugins->push($pluginId);
                    \ExilonCMS\Models\Setting::updateOrCreate(
                        ['name' => 'enabled_plugins'],
                        ['value' => json_encode($enabledPlugins->unique()->values()->toArray())]
                    );
                    Log::info("Plugin enabled: {$pluginId}");
                }
            }

            return redirect()->route('admin.plugins.index')
                ->with('success', trans('admin.plugins.imported', ['name' => $pluginData['name']]));

        } catch (\Exception $e) {
            // Clean up temp directory
            File::deleteDirectory($tempDir);

            Log::error("Plugin import failed: {$e->getMessage()}", [
                'exception' => $e,
            ]);

            return redirect()->back()
                ->with('error', 'Plugin import failed: '.$e->getMessage());
        }
    }

    /**
     * Validate plugin structure and extract metadata.
     *
     * @param  string  $extractPath
     * @return array Plugin metadata
     * @throws \Exception
     */
    protected function validatePluginStructure(string $extractPath): array
    {
        // Check for plugin.json first
        $manifestPath = $extractPath.'/plugin.json';
        $pluginClassPath = null;

        if (File::exists($manifestPath)) {
            $manifest = json_decode(File::get($manifestPath), true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \Exception('Invalid plugin.json: '.json_last_error_msg());
            }

            if (empty($manifest['id'])) {
                throw new \Exception('plugin.json must contain an "id" field');
            }

            return [
                'id' => $manifest['id'],
                'name' => $manifest['name'] ?? $manifest['id'],
                'version' => $manifest['version'] ?? '1.0.0',
                'description' => $manifest['description'] ?? '',
                'author' => $manifest['author'] ?? '',
            ];
        }

        // Fallback: Look for plugin class with #[PluginMeta] attribute
        // Expected structure: plugins/{pluginId}/src/{PluginId}Plugin.php or similar
        $dirs = File::directories($extractPath);

        if (empty($dirs)) {
            throw new \Exception('Invalid plugin structure: no directories found');
        }

        // If there's only one directory, it might be the plugin itself
        if (count($dirs) === 1) {
            $singleDir = $dirs[0];
            $subDirs = File::directories($singleDir);

            // Check if src directory exists
            $srcPath = $singleDir.'/src';
            if (File::exists($srcPath)) {
                // Look for PHP files in src
                $phpFiles = File::files($srcPath);
                foreach ($phpFiles as $file) {
                    if ($file->getExtension() === 'php') {
                        $content = File::get($file->getRealPath());
                        // Check if it uses PluginMeta attribute
                        if (str_contains($content, 'PluginMeta') || str_contains($content, 'extends Plugin')) {
                            $pluginId = basename($singleDir);
                            return [
                                'id' => $pluginId,
                                'name' => ucfirst($pluginId),
                                'version' => '1.0.0',
                                'description' => '',
                                'author' => '',
                            ];
                        }
                    }
                }
            }
        }

        // Check each directory for plugin structure
        foreach ($dirs as $dir) {
            $dirName = basename($dir);

            // Skip common non-plugin directories
            if (in_array($dirName, ['__MACOSX', '.', '..'])) {
                continue;
            }

            // Check for src directory
            $srcPath = $dir.'/src';
            if (File::exists($srcPath)) {
                $phpFiles = File::files($srcPath);
                foreach ($phpFiles as $file) {
                    if ($file->getExtension() === 'php') {
                        $content = File::get($file->getRealPath());
                        if (str_contains($content, 'PluginMeta') || str_contains($content, 'extends Plugin')) {
                            return [
                                'id' => $dirName,
                                'name' => ucfirst($dirName),
                                'version' => '1.0.0',
                                'description' => '',
                                'author' => '',
                            ];
                        }
                    }
                }
            }
        }

        throw new \Exception('Invalid plugin structure: no plugin.json or plugin class found with #[PluginMeta] attribute');
    }

    /**
     * Register plugin in composer autoload if needed.
     */
    protected function registerPluginAutoload(string $pluginId, string $pluginPath): void
    {
        $composerPath = base_path('composer.json');
        $composer = json_decode(File::get($composerPath), true);

        $namespace = "ExilonCMS\\Plugins\\{$pluginId}";
        $srcPath = "plugins/{$pluginId}/src";

        // Check if namespace already exists
        $psr4 = $composer['autoload']['psr-4'] ?? [];

        if (! isset($psr4[$namespace])) {
            // Add namespace to composer.json
            $psr4[$namespace."\\"] = $srcPath;
            $composer['autoload']['psr-4'] = $psr4;

            File::put($composerPath, json_encode($composer, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

            // Run composer dump-autoload
            Artisan::call('composer:dump-autoload');
            Log::info("Added namespace {$namespace} to composer autoload");
        }
    }

    /**
     * Delete a plugin (with backup option).
     */
    public function destroy(Request $request, string $plugin)
    {
        $request->validate([
            'backup' => 'boolean',
        ]);

        $pluginsMeta = $this->pluginLoader->getPluginsMeta();
        $pluginData = $pluginsMeta[$plugin] ?? null;

        if (! $pluginData) {
            return redirect()->route('admin.plugins.index')
                ->with('error', trans('admin.plugins.not_found'));
        }

        $pluginPath = $pluginData['path'];

        // Disable plugin first
        $enabledPlugins = collect(setting('enabled_plugins', []))
            ->filter(fn ($p) => $p !== $plugin)
            ->values()
            ->toArray();

        \ExilonCMS\Models\Setting::updateOrCreate(
            ['name' => 'enabled_plugins'],
            ['value' => json_encode($enabledPlugins)]
        );

        // Create backup if requested
        if ($request->boolean('backup')) {
            $backupPath = storage_path("app/backups/plugins/{$plugin}_".date('Y-m-d_His'));
            File::copyDirectory($pluginPath, $backupPath);
            Log::info("Plugin backed up to: {$backupPath}");
        }

        // Delete plugin directory
        File::deleteDirectory($pluginPath);

        // Clear caches
        Artisan::call('cache:clear');
        $this->pluginLoader->clearCache();

        Log::info("Plugin deleted: {$plugin}");

        return redirect()->route('admin.plugins.index')
            ->with('success', trans('admin.plugins.deleted', ['name' => $pluginData['name']]));
    }

    /**
     * Download a plugin backup.
     */
    public function downloadBackup(string $filename)
    {
        $backupPath = storage_path("app/backups/plugins/{$filename}");

        if (! File::exists($backupPath)) {
            abort(404);
        }

        return response()->download($backupPath)->deleteFileAfterSend();
    }

    /**
     * List available backups.
     */
    public function listBackups()
    {
        $backupDir = storage_path('app/backups/plugins');
        File::ensureDirectoryExists($backupDir);

        $backups = collect(File::directories($backupDir))
            ->map(fn ($path) => [
                'name' => basename($path),
                'path' => $path,
                'size' => $this->directorySize($path),
                'created' => filectime($path),
            ])
            ->sortByDesc('created')
            ->values();

        return response()->json($backups);
    }

    /**
     * Calculate directory size.
     */
    protected function directorySize(string $path): int
    {
        $size = 0;
        foreach (File::allFiles($path) as $file) {
            $size += $file->getSize();
        }

        return $size;
    }
}
