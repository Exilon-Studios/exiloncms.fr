<?php

namespace ExilonCMS\Http\Controllers\Admin\Plugins;

use ExilonCMS\Classes\Plugin\PluginLoader;
use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

/**
 * Generic Plugin Configuration Controller
 *
 * Handles configuration for plugins using the getConfigFields() method
 * from the Plugin base class. This provides automatic configuration UI.
 */
class PluginConfigController extends Controller
{
    public function __construct(
        private PluginLoader $pluginLoader,
    ) {}

    /**
     * Show the configuration page for a plugin.
     */
    public function edit(Request $request, string $plugin)
    {
        $pluginInstance = $this->pluginLoader->getPlugin($plugin);

        if (! $pluginInstance) {
            return redirect()->route('admin.plugins.index')
                ->with('error', trans('admin.plugins.not_found'));
        }

        // Get config fields from plugin
        $configFields = $pluginInstance->getConfigFields();

        if (empty($configFields)) {
            return redirect()->route('admin.plugins.index')
                ->with('info', 'This plugin has no configuration options.');
        }

        // Get current values from settings
        $settings = [];
        foreach ($configFields as $field) {
            $settingKey = "plugin.{$plugin}.{$field['name']}";
            $settings[$field['name']] = setting($settingKey, $field['default'] ?? null);
        }

        $pluginsMeta = $this->pluginLoader->getPluginsMeta();
        $pluginData = $pluginsMeta[$plugin] ?? null;

        return Inertia::render('Admin/Plugins/Config/Edit', [
            'plugin' => array_merge($pluginData ?? [], [
                'id' => $plugin,
                'name' => $pluginInstance->getName(),
                'description' => $pluginInstance->getDescription(),
                'version' => $pluginInstance->getVersion(),
            ]),
            'configFields' => $configFields,
            'settings' => $settings,
        ]);
    }

    /**
     * Update the configuration for a plugin.
     */
    public function update(Request $request, string $plugin)
    {
        $pluginInstance = $this->pluginLoader->getPlugin($plugin);

        if (! $pluginInstance) {
            abort(404);
        }

        $configFields = collect($pluginInstance->getConfigFields())->keyBy('name');

        $validated = [];
        $validationRules = [];

        // Build validation rules from config fields
        foreach ($configFields as $field) {
            if (isset($field['validation'])) {
                $validationRules["settings.{$field['name']}"] = $field['validation'];
            } elseif (isset($field['required']) && $field['required']) {
                $validationRules["settings.{$field['name']}"] = 'required';
            }
        }

        // Validate request
        $validatedData = $request->validate($validationRules);

        // Save each setting
        foreach ($request->input('settings', []) as $key => $value) {
            if (! $configFields->has($key)) {
                continue;
            }

            $field = $configFields->get($key);
            $settingKey = "plugin.{$plugin}.{$key}";

            // Process value based on field type
            $processedValue = $this->processFieldValue($value, $field);

            Setting::updateOrCreate(
                ['name' => $settingKey],
                ['value' => $processedValue]
            );
        }

        return redirect()->back()
            ->with('success', trans('admin.plugins.config_saved'));
    }

    /**
     * Process a field value based on its type.
     *
     * @param  mixed  $value
     * @param  array  $field
     * @return mixed
     */
    protected function processFieldValue(mixed $value, array $field): mixed
    {
        $type = $field['type'] ?? 'text';

        return match ($type) {
            'checkbox', 'boolean', 'toggle' => (bool) $value,
            'number', 'integer' => is_numeric($value) ? (int) $value : 0,
            'float', 'decimal' => is_numeric($value) ? (float) $value : 0.0,
            'array', 'json', 'multiselect' => is_array($value) ? json_encode($value) : $value,
            default => $value,
        };
    }

    /**
     * Clear all settings for a plugin.
     *
     * @param  string  $plugin
     * @return \Illuminate\Http\RedirectResponse
     */
    public function clear(string $plugin)
    {
        Setting::where('name', 'like', "plugin.{$plugin}.%")->delete();

        return redirect()->back()
            ->with('success', trans('admin.plugins.config_cleared'));
    }
}
