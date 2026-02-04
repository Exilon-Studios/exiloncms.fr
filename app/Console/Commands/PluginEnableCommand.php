<?php

namespace ExilonCMS\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class PluginEnableCommand extends Command
{
    protected $signature = 'plugin:enable {plugin*}';

    protected $description = 'Enable one or more plugins';

    public function handle()
    {
        $plugins = $this->argument('plugin');

        // Get enabled plugins from file
        $enabledPlugins = $this->getEnabledPlugins();
        $enabledCount = 0;

        foreach ($plugins as $plugin) {
            // Validate plugin exists
            $pluginPath = base_path("plugins/{$plugin}");
            if (! File::exists($pluginPath)) {
                $this->warn("Plugin '{$plugin}' does not exist");
                continue;
            }

            if (! in_array($plugin, $enabledPlugins, true)) {
                $enabledPlugins[] = $plugin;
                $this->info("Enabled: {$plugin}");
                $enabledCount++;

                // Run migrations if they exist
                if (is_dir($pluginPath . '/database/migrations')) {
                    $this->call('migrate', ['--force' => true]);
                    $this->info("  Ran migrations for {$plugin}");
                }
            } else {
                $this->warn("Plugin '{$plugin}' is already enabled");
            }
        }

        // Save to file
        $this->saveEnabledPlugins($enabledPlugins);

        // Clear caches
        $this->call('cache:clear');

        $this->info("{$enabledCount} plugin(s) enabled. Cache cleared.");

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
