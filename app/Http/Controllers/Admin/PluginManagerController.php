<?php

namespace ExilonCMS\Http\Controllers\Admin;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Models\PluginInstalled;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Inertia\Inertia;
use ZipArchive;

class PluginManagerController extends Controller
{
    public function index()
    {
        $plugins = PluginInstalled::orderBy('name')->get()->map(fn ($plugin) => [
            'id' => $plugin->id,
            'plugin_id' => $plugin->plugin_id,
            'name' => $plugin->name,
            'version' => $plugin->version,
            'type' => $plugin->type,
            'is_enabled' => $plugin->is_enabled,
            'source' => $plugin->source,
            'is_installed' => $plugin->isInstalled(),
            'has_update' => $plugin->hasUpdate(),
        ]);

        $installedPlugins = $plugins->where('type', 'plugin')->values();
        $installedThemes = $plugins->where('type', 'theme')->values();

        // Scan for local plugins not in database
        $localPlugins = $this->scanLocalPlugins();
        $localThemes = $this->scanLocalThemes();

        return Inertia::render('Admin/PluginManager/Index', [
            'installedPlugins' => $installedPlugins,
            'installedThemes' => $installedThemes,
            'localPlugins' => $localPlugins,
            'localThemes' => $localThemes,
        ]);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:zip|max:10240', // 10MB max
            'type' => 'required|in:plugin,theme',
        ]);

        $file = $request->file('file');
        $type = $request->input('type');

        // Create temp directory
        $tempDir = storage_path('app/temp/'.Str::uuid());
        File::makeDirectory($tempDir, 0755, true);

        try {
            // Extract ZIP
            $zip = new ZipArchive;
            $zip->open($file->getRealPath());
            $zip->extractTo($tempDir);
            $zip->close();

            // Validate structure
            $validationResult = $this->validatePluginStructure($tempDir, $type);
            if (! $validationResult['valid']) {
                File::deleteDirectory($tempDir);

                return back()->with('error', $validationResult['error']);
            }

            $pluginId = $validationResult['plugin_id'];
            $config = $validationResult['config'];

            // Check if already installed
            $existing = PluginInstalled::where('plugin_id', $pluginId)->first();

            // Move to destination
            $destination = $type === 'theme'
                ? resource_path("views/themes/{$pluginId}")
                : base_path("plugins/{$pluginId}");

            if (is_dir($destination)) {
                File::deleteDirectory($destination);
            }

            File::moveDirectory($tempDir, $destination);

            // Update or create database record
            if ($existing) {
                $existing->update([
                    'name' => $config['name'] ?? $pluginId,
                    'version' => $config['version'] ?? '1.0.0',
                    'source' => 'upload',
                ]);
            } else {
                PluginInstalled::create([
                    'plugin_id' => $pluginId,
                    'name' => $config['name'] ?? $pluginId,
                    'version' => $config['version'] ?? '1.0.0',
                    'type' => $type,
                    'source' => 'upload',
                    'is_enabled' => true,
                ]);
            }

            // Clear caches
            Artisan::call('cache:clear');
            Artisan::call('config:clear');

            return back()->with('success', ucfirst($type).' uploaded and installed successfully!');

        } catch (\Exception $e) {
            File::deleteDirectory($tempDir);

            return back()->with('error', 'Error uploading plugin: '.$e->getMessage());
        }
    }

    public function toggle(Request $request, PluginInstalled $plugin)
    {
        if ($plugin->is_enabled) {
            $plugin->disable();
            $message = 'Plugin disabled.';
        } else {
            $plugin->enable();
            $message = 'Plugin enabled.';
        }

        Artisan::call('cache:clear');

        return back()->with('success', $message);
    }

    public function delete(PluginInstalled $plugin)
    {
        try {
            // Delete files
            if ($plugin->type === 'plugin') {
                $path = $plugin->getPluginPath();
            } else {
                $path = $plugin->getThemePath();
            }

            if (is_dir($path)) {
                File::deleteDirectory($path);
            }

            // Delete database record
            $plugin->delete();

            Artisan::call('cache:clear');

            return back()->with('success', 'Plugin deleted successfully.');

        } catch (\Exception $e) {
            return back()->with('error', 'Error deleting plugin: '.$e->getMessage());
        }
    }

    protected function validatePluginStructure(string $path, string $type): array
    {
        // Look for plugin.json or theme.json
        $configFile = $path.'/plugin.json';
        if (! file_exists($configFile)) {
            return ['valid' => false, 'error' => 'Missing plugin.json file'];
        }

        $config = json_decode(file_get_contents($configFile), true);
        if (! isset($config['id']) && ! isset($config['plugin_id'])) {
            return ['valid' => false, 'error' => 'Invalid plugin.json: missing id'];
        }

        $pluginId = $config['id'] ?? $config['plugin_id'];

        // Validate plugin_id format (alphanumeric, dashes, underscores only)
        if (! preg_match('/^[a-z0-9_-]+$/', $pluginId)) {
            return ['valid' => false, 'error' => 'Invalid plugin ID format. Use only lowercase letters, numbers, dashes, and underscores.'];
        }

        return ['valid' => true, 'plugin_id' => $pluginId, 'config' => $config];
    }

    protected function scanLocalPlugins(): array
    {
        $pluginsPath = base_path('plugins');
        if (! is_dir($pluginsPath)) {
            return [];
        }

        $plugins = [];
        $directories = File::directories($pluginsPath);

        foreach ($directories as $directory) {
            $pluginId = basename($directory);
            $configFile = $directory.'/plugin.json';

            if (file_exists($configFile)) {
                $config = json_decode(file_get_contents($configFile), true);
                $installed = PluginInstalled::where('plugin_id', $pluginId)->first();

                $plugins[] = [
                    'id' => $pluginId,
                    'name' => $config['name'] ?? $pluginId,
                    'version' => $config['version'] ?? '1.0.0',
                    'description' => $config['description'] ?? '',
                    'installed' => $installed !== null,
                    'enabled' => $installed?->is_enabled ?? false,
                ];
            }
        }

        return $plugins;
    }

    protected function scanLocalThemes(): array
    {
        $themesPath = resource_path('views/themes');
        if (! is_dir($themesPath)) {
            return [];
        }

        $themes = [];
        $directories = File::directories($themesPath);

        foreach ($directories as $directory) {
            $themeId = basename($directory);
            $installed = PluginInstalled::where('plugin_id', $themeId)->first();

            $themes[] = [
                'id' => $themeId,
                'name' => ucfirst($themeId).' Theme',
                'installed' => $installed !== null,
                'enabled' => $installed?->is_enabled ?? false,
            ];
        }

        return $themes;
    }
}
