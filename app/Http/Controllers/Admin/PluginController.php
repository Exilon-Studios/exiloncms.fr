<?php

namespace ExilonCMS\Http\Controllers\Admin;

use ExilonCMS\ExilonCMS;
use ExilonCMS\Extensions\Plugin\PluginManager;
use ExilonCMS\Extensions\UpdateManager;
use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Models\ActionLog;
use ExilonCMS\Models\Setting;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Throwable;

class PluginController extends Controller
{
    /**
     * The extension manager.
     */
    private PluginManager $plugins;

    /**
     * Create a new controller instance.
     */
    public function __construct(PluginManager $plugins)
    {
        $this->plugins = $plugins;
    }

    /**
     * Display a listing of the extensions.
     */
    public function index()
    {
        return Inertia::render('Admin/Plugins/Index', [
            'plugins' => $this->plugins->findPluginsDescriptions(),
            'availablePlugins' => $this->plugins->getOnlinePlugins(),
            'pluginsUpdates' => $this->plugins->getPluginsToUpdate(),
        ]);
    }

    public function config(string $plugin)
    {
        $description = $this->plugins->findDescription($plugin);

        if ($description === null) {
            abort(404);
        }

        // Get plugin configuration from settings
        $pluginConfig = setting('plugins.config.'.$plugin, []);

        return Inertia::render('Admin/Plugins/Config', [
            'plugin' => $description,
            'config' => $pluginConfig,
        ]);
    }

    public function updateConfig(Request $request, string $plugin)
    {
        $description = $this->plugins->findDescription($plugin);

        if ($description === null) {
            abort(404);
        }

        // Validate and save plugin configuration
        $config = $request->validate([
            // Add plugin-specific validation rules here
            // For now, we'll accept all config
        ]);

        // Save plugin configuration to settings
        Setting::updateSettings('plugins.config.'.$plugin, $config);

        return to_route('admin.plugins.index')
            ->with('success', trans('admin.plugins.config_saved'));
    }

    public function reload()
    {
        $response = to_route('admin.plugins.index');

        try {
            app(UpdateManager::class)->forceFetchMarketplace();
        } catch (Exception $e) {
            return $response->with('error', trans('messages.status.error', [
                'error' => $e->getMessage(),
            ]));
        }

        return $response->with('success', trans('admin.plugins.reloaded'));
    }

    public function enable(string $plugin)
    {
        try {
            if (! $this->plugins->isSupportedByGame($plugin)) {
                return to_route('admin.plugins.index')
                    ->with('error', trans('admin.plugins.requirements.game', [
                        'game' => game()->name(),
                    ]));
            }

            $missing = $this->plugins->getMissingRequirements($plugin);

            if ($missing === 'exiloncms' || $missing === 'azuriom' || $missing === 'api') {
                return to_route('admin.plugins.index')
                    ->with('error', trans('admin.plugins.requirements.'.$missing, [
                        'version' => ExilonCMS::apiVersion(),
                    ]));
            }

            if ($missing !== null) {
                return to_route('admin.plugins.index')
                    ->with('error', trans('admin.plugins.requirements.plugin', [
                        'plugin' => $missing,
                    ]));
            }

            $this->plugins->enable($plugin);
        } catch (Throwable $t) {
            report($t);

            return to_route('admin.plugins.index')
                ->with('error', trans('messages.status.error', [
                    'error' => $t->getMessage(),
                ]));
        }

        // Log action BEFORE purging cache to ensure user is still authenticated
        ActionLog::log('plugins.enabled', data: ['plugin' => $plugin]);

        $response = to_route('admin.plugins.index')
            ->with('success', trans('admin.plugins.enabled'));

        $this->plugins->purgeInternalCache();

        return $response;
    }

    public function disable(string $plugin)
    {
        $this->plugins->disable($plugin);

        // Log action BEFORE purging cache to ensure user is still authenticated
        ActionLog::log('plugins.disabled', data: ['plugin' => $plugin]);

        $response = to_route('admin.plugins.index')
            ->with('success', trans('admin.plugins.disabled'));

        $this->plugins->purgeInternalCache();

        return $response;
    }

    public function update(string $plugin)
    {
        $description = $this->plugins->findDescription($plugin);

        try {
            // Use plugin ID (extension_id) instead of apiId for install method
            if ($description !== null) {
                $this->plugins->install($plugin);
            }
        } catch (Throwable $t) {
            return to_route('admin.plugins.index')
                ->with('error', trans('messages.status.error', [
                    'error' => $t->getMessage(),
                ]));
        }

        $response = to_route('admin.plugins.index')
            ->with('success', trans('admin.plugins.updated'));

        $this->plugins->purgeInternalCache();

        return $response;
    }

    public function download(string $pluginId)
    {
        try {
            // If pluginId is numeric, find the extension_id from marketplace
            if (is_numeric($pluginId)) {
                $plugins = app(UpdateManager::class)->getPlugins(true);
                $plugin = collect($plugins)->firstWhere('id', $pluginId);

                if (! $plugin) {
                    throw new Exception('Plugin not found in marketplace');
                }

                $pluginId = $plugin['extension_id'];
            }

            $this->plugins->install($pluginId);
        } catch (Throwable $t) {
            report($t);

            return to_route('admin.plugins.index')
                ->with('error', trans('messages.status.error', [
                    'error' => $t->getMessage(),
                ]));
        }

        return to_route('admin.plugins.index')
            ->with('success', trans('admin.plugins.installed'));
    }

    public function delete(string $plugin)
    {
        if ($this->plugins->isEnabled($plugin)) {
            return to_route('admin.plugins.index')
                ->with('error', trans('admin.plugins.delete_enabled'));
        }

        $this->plugins->delete($plugin);

        return to_route('admin.plugins.index')
            ->with('success', trans('admin.plugins.deleted'));
    }
}
