<?php

namespace ExilonCMS\Http\Controllers\Admin;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Extensions\Plugin\PluginLoader;
use ExilonCMS\Extensions\Theme\ThemeLoader;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PluginController extends Controller
{
    public function __construct(
        private PluginLoader $pluginLoader,
        private ThemeLoader $themeLoader,
    ) {
    }

    /**
     * Display all plugins with their status.
     */
    public function index()
    {
        $plugins = $this->pluginLoader->getPlugins();

        // Get enabled plugins from settings
        $enabledPlugins = collect(setting('enabled_plugins', []))->flip()->toArray();

        // Add enabled status to each plugin
        $plugins = collect($plugins)->map(function ($plugin) use ($enabledPlugins) {
            return [
                ...$plugin,
                'enabled' => isset($enabledPlugins[$plugin['id']]),
                'has_routes' => File::exists($plugin['path'].'/routes/web.php'),
                'has_admin_routes' => File::exists($plugin['path'].'/routes/admin.php'),
                'has_migrations' => File::exists($plugin['path'].'/database/migrations'),
                'has_settings' => File::exists($plugin['path'].'/config'),
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
        $pluginData = $this->pluginLoader->getPlugin($plugin);

        if (! $pluginData) {
            return back()->with('error', trans('admin.plugins.not_found'));
        }

        $enabledPlugins = collect(setting('enabled_plugins', []));

        if ($enabledPlugins->contains($plugin)) {
            // Disable plugin
            $enabledPlugins = $enabledPlugins->filter(fn ($p) => $p !== $plugin)->values()->toArray();

            // Save to settings BEFORE returning
            setting(['enabled_plugins' => $enabledPlugins]);

            // Clear cache to reload plugins
            Artisan::call('cache:clear');

            Log::info("Plugin disabled: {$plugin}");

            return back()->with('success', trans('admin.plugins.disabled', ['name' => $pluginData['name']]));
        } else {
            // Enable plugin
            $enabledPlugins->push($plugin);
            $enabledPlugins = $enabledPlugins->unique()->values()->toArray();

            // Run migrations if they exist
            if (File::exists($pluginData['path'].'/database/migrations')) {
                Artisan::call('migrate', ['--force' => true]);
            }

            // Save to settings BEFORE returning
            setting(['enabled_plugins' => $enabledPlugins]);

            // Clear cache to reload plugins
            Artisan::call('cache:clear');

            Log::info("Plugin enabled: {$plugin}");

            return back()->with('success', trans('admin.plugins.enabled', ['name' => $pluginData['name']]));
        }
    }

    /**
     * Get plugin configuration.
     */
    public function config(string $plugin)
    {
        $pluginData = $this->pluginLoader->getPlugin($plugin);

        if (! $pluginData) {
            abort(404);
        }

        $configFile = $pluginData['path'].'/config/config.php';

        if (! File::exists($configFile)) {
            return back()->with('error', trans('admin.plugins.no_config'));
        }

        // TODO: Load and display plugin configuration
        return Inertia::render('Admin/Plugins/Config', [
            'plugin' => $pluginData,
        ]);
    }

    /**
     * Delete plugin.
     */
    public function destroy(Request $request, string $plugin)
    {
        $pluginData = $this->pluginLoader->getPlugin($plugin);

        if (! $pluginData) {
            return back()->with('error', trans('admin.plugins.not_found'));
        }

        // Disable plugin first
        $enabledPlugins = collect(setting('enabled_plugins', []))
            ->filter(fn ($p) => $p !== $plugin)
            ->values()
            ->toArray();
        setting(['enabled_plugins' => $enabledPlugins]);

        // Delete plugin directory
        File::deleteDirectory($pluginData['path']);

        Log::info("Plugin deleted: {$plugin}");

        return redirect()->route('admin.plugins.index')
            ->with('success', trans('admin.plugins.deleted', ['name' => $pluginData['name']]));
    }
}
