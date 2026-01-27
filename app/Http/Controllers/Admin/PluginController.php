<?php

namespace ExilonCMS\Http\Controllers\Admin;

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
    public function toggle(Request $request, string $id)
    {
        $plugin = $this->pluginLoader->getPlugin($id);

        if (! $plugin) {
            return back()->with('error', trans('admin.plugins.not_found'));
        }

        $enabledPlugins = collect(setting('enabled_plugins', []));

        if ($enabledPlugins->contains($id)) {
            // Disable plugin
            $enabledPlugins = $enabledPlugins->filter(fn ($p) => $p !== $id)->values()->toArray();

            Log::info("Plugin disabled: {$id}");

            return back()->with('success', trans('admin.plugins.disabled', ['name' => $plugin['name']]));
        } else {
            // Enable plugin
            $enabledPlugins->push($id);
            $enabledPlugins = $enabledPlugins->unique()->values()->toArray();

            // Run migrations if they exist
            if (File::exists($plugin['path'].'/database/migrations')) {
                Artisan::call('migrate', ['--force' => true]);
            }

            Log::info("Plugin enabled: {$id}");

            return back()->with('success', trans('admin.plugins.enabled', ['name' => $plugin['name']]));
        }

        // Save to settings
        setting(['enabled_plugins' => $enabledPlugins]);
    }

    /**
     * Get plugin configuration.
     */
    public function config(string $id)
    {
        $plugin = $this->pluginLoader->getPlugin($id);

        if (! $plugin) {
            abort(404);
        }

        $configFile = $plugin['path'].'/config/config.php';

        if (! File::exists($configFile)) {
            return back()->with('error', trans('admin.plugins.no_config'));
        }

        // TODO: Load and display plugin configuration
        return Inertia::render('Admin/Plugins/Config', [
            'plugin' => $plugin,
        ]);
    }

    /**
     * Delete plugin.
     */
    public function destroy(Request $request, string $id)
    {
        $plugin = $this->pluginLoader->getPlugin($id);

        if (! $plugin) {
            return back()->with('error', trans('admin.plugins.not_found'));
        }

        // Disable plugin first
        $enabledPlugins = collect(setting('enabled_plugins', []))
            ->filter(fn ($p) => $p !== $id)
            ->values()
            ->toArray();
        setting(['enabled_plugins' => $enabledPlugins]);

        // Delete plugin directory
        File::deleteDirectory($plugin['path']);

        Log::info("Plugin deleted: {$id}");

        return redirect()->route('admin.plugins.index')
            ->with('success', trans('admin.plugins.deleted', ['name' => $plugin['name']]));
    }
}
