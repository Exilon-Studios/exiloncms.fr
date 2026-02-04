<?php

namespace ExilonCMS\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class PluginDisableCommand extends Command
{
    protected $signature = 'plugin:disable {plugin*}';

    protected $description = 'Disable one or more plugins';

    public function handle()
    {
        $plugins = $this->argument('plugin');

        // Get enabled plugins from file
        $enabledPlugins = $this->getEnabledPlugins();
        $disabledCount = 0;

        foreach ($plugins as $plugin) {
            if (in_array($plugin, $enabledPlugins, true)) {
                $enabledPlugins = array_values(array_filter($enabledPlugins, fn ($p) => $p !== $plugin));
                $this->info("Disabled: {$plugin}");
                $disabledCount++;
            } else {
                $this->warn("Plugin '{$plugin}' is not enabled");
            }
        }

        // Save to file
        $this->saveEnabledPlugins($enabledPlugins);

        // Clear caches
        $this->call('cache:clear');

        $this->info("{$disabledCount} plugin(s) disabled. Cache cleared.");

        return 0;
    }

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
}
