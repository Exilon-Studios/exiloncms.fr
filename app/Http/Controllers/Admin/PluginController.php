<?php

namespace ExilonCMS\Http\Controllers\Admin;

use ExilonCMS\Classes\Plugin\PluginLoader;
use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PluginController extends Controller
{
    public function __construct(
        private PluginLoader $pluginLoader,
    ) {}

    /**
     * Display all plugins with their status.
     */
    public function index()
    {
        $plugins = $this->pluginLoader->getPluginsMeta();

        // Get enabled plugins from file
        $enabledPlugins = collect($this->getEnabledPlugins())->flip()->toArray();

        // Add enabled status to each plugin
        $plugins = collect($plugins)->map(function ($plugin) use ($enabledPlugins) {
            return [
                'id' => $plugin['id'],
                'name' => $plugin['name'],
                'version' => $plugin['version'],
                'description' => $plugin['description'],
                'author' => $plugin['author'],
                'enabled' => isset($enabledPlugins[$plugin['id']]),
                'has_routes' => File::exists($plugin['path'].'/routes/web.php'),
                'has_admin_routes' => File::exists($plugin['path'].'/routes/admin.php'),
                'has_migrations' => File::exists($plugin['path'].'/database/migrations'),
                'has_settings' => File::exists($plugin['path'].'/config/config.php'),
            ];
        })->sortBy('name')->values();

        return Inertia::render('Admin/Plugins/Index', [
            'plugins' => $plugins,
        ]);
    }

    /**
     * Toggle plugin enabled status.
     */
    public function toggle(Request $request, string $plugin)
    {
        $pluginsMeta = $this->pluginLoader->getPluginsMeta();
        $pluginData = $pluginsMeta[$plugin] ?? null;

        if (! $pluginData) {
            return redirect()->route('admin.plugins.index')->with('error', trans('admin.plugins.not_found'));
        }

        $enabledPlugins = $this->getEnabledPlugins();

        if (in_array($plugin, $enabledPlugins, true)) {
            // Disable plugin
            $enabledPlugins = array_values(array_filter($enabledPlugins, fn ($p) => $p !== $plugin));

            // Save to file
            $this->saveEnabledPlugins($enabledPlugins);

            // Clear plugin cache to force rediscovery
            $this->pluginLoader->clearCache();
            $this->clearPluginsCache();

            Log::info("Plugin disabled: {$plugin}");

            return redirect()->route('admin.plugins.index')->with('success', trans('admin.plugins.disabled', ['name' => $pluginData['name']]));
        } else {
            // Enable plugin
            $enabledPlugins[] = $plugin;
            $enabledPlugins = array_values(array_unique($enabledPlugins));

            // Run migrations if they exist
            if (File::exists($pluginData['path'].'/database/migrations')) {
                Artisan::call('migrate', ['--force' => true]);
            }

            // Save to file
            $this->saveEnabledPlugins($enabledPlugins);

            // Clear plugin cache to force rediscovery
            $this->pluginLoader->clearCache();
            $this->clearPluginsCache();

            Log::info("Plugin enabled: {$plugin}");

            return redirect()->route('admin.plugins.index')->with('success', trans('admin.plugins.enabled', ['name' => $pluginData['name']]));
        }
    }

    /**
     * Get plugin configuration.
     */
    public function config(string $plugin)
    {
        $pluginsMeta = $this->pluginLoader->getPluginsMeta();
        $pluginData = $pluginsMeta[$plugin] ?? null;

        if (! $pluginData) {
            abort(404);
        }

        $configFile = $pluginData['path'].'/config/config.php';

        if (! File::exists($configFile)) {
            return redirect()->route('admin.plugins.index')->with('error', 'This plugin has no configuration options.');
        }

        $config = require $configFile;

        // Get current values from settings
        $settings = collect($config)->mapWithKeys(function ($option, $key) use ($plugin) {
            $settingKey = "{$plugin}.{$key}";
            $value = setting($settingKey, $option['default'] ?? null);

            return [$key => $value];
        })->toArray();

        return Inertia::render('Admin/Plugins/Config', [
            'plugin' => $pluginData,
            'config' => $config,
            'settings' => $settings,
        ]);
    }

    /**
     * Update plugin configuration.
     */
    public function update(Request $request, string $plugin)
    {
        $pluginsMeta = $this->pluginLoader->getPluginsMeta();
        $pluginData = $pluginsMeta[$plugin] ?? null;

        if (! $pluginData) {
            abort(404);
        }

        $configFile = $pluginData['path'].'/config/config.php';

        if (! File::exists($configFile)) {
            return redirect()->route('admin.plugins.index')->with('error', 'This plugin has no configuration options.');
        }

        $config = require $configFile;

        // Validate and save each setting
        foreach ($request->input('settings', []) as $key => $value) {
            if (! isset($config[$key])) {
                continue;
            }

            $settingKey = "{$plugin}.{$key}";

            // Store the value
            Setting::updateOrCreate(
                ['name' => $settingKey],
                ['value' => is_array($value) ? json_encode($value) : $value]
            );
        }

        return redirect()->route('admin.plugins.index')->with('success', 'Configuration saved successfully.');
    }

    /**
     * Delete plugin.
     */
    public function destroy(Request $request, string $plugin)
    {
        $pluginsMeta = $this->pluginLoader->getPluginsMeta();
        $pluginData = $pluginsMeta[$plugin] ?? null;

        if (! $pluginData) {
            return redirect()->route('admin.plugins.index')->with('error', trans('admin.plugins.not_found'));
        }

        // Disable plugin first
        $enabledPlugins = array_values(array_filter(
            $this->getEnabledPlugins(),
            fn ($p) => $p !== $plugin
        ));

        $this->saveEnabledPlugins($enabledPlugins);

        // Delete plugin directory
        File::deleteDirectory($pluginData['path']);

        // Clear caches
        $this->pluginLoader->clearCache();
        $this->clearPluginsCache();

        Log::info("Plugin deleted: {$plugin}");

        return redirect()->route('admin.plugins.index')
            ->with('success', trans('admin.plugins.deleted', ['name' => $pluginData['name']]));
    }

    /**
     * Get enabled plugins from plugins.json file
     */
    protected function getEnabledPlugins(): array
    {
        $pluginsFile = base_path('plugins/plugins.json');

        if (! File::exists($pluginsFile)) {
            return [];
        }

        $content = File::get($pluginsFile);
        $plugins = json_decode($content, true);

        if (! is_array($plugins)) {
            return [];
        }

        return array_filter($plugins, fn ($plugin) => is_string($plugin) && ! empty($plugin));
    }

    /**
     * Save enabled plugins to plugins.json file
     */
    protected function saveEnabledPlugins(array $plugins): void
    {
        $pluginsFile = base_path('plugins/plugins.json');
        $pluginsDir = dirname($pluginsFile);

        // Ensure plugins directory exists
        if (! File::exists($pluginsDir)) {
            File::makeDirectory($pluginsDir, 0755, true);
        }

        // Encode as JSON array with pretty print
        $content = json_encode(array_values(array_unique($plugins)), JSON_PRETTY_PRINT);

        File::put($pluginsFile, $content);
    }

    /**
     * Clear plugins cache
     */
    protected function clearPluginsCache(): void
    {
        $cacheFile = base_path('bootstrap/cache/plugins.php');

        if (File::exists($cacheFile)) {
            File::delete($cacheFile);
        }

        // Clear Laravel cache
        \Illuminate\Support\Facades\Cache::forget('settings');
        \Illuminate\Support\Facades\Cache::forget('plugins');

        // Clear OPCache
        if (function_exists('opcache_reset')) {
            opcache_reset();
        }
    }
}
