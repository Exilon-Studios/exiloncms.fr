<?php

namespace ExilonCMS\Console\Commands;

use ExilonCMS\Classes\Plugin\PluginLoader;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class PluginListCommand extends Command
{
    protected $signature = 'plugin:list';

    protected $description = 'List all installed plugins';

    public function handle(PluginLoader $loader): int
    {
        $pluginsPath = base_path('plugins');

        if (! File::exists($pluginsPath)) {
            $this->warn('No plugins directory found.');

            return self::SUCCESS;
        }

        $pluginDirectories = File::directories($pluginsPath);

        if (empty($pluginDirectories)) {
            $this->warn('No plugins found.');

            return self::SUCCESS;
        }

        $this->info('Installed Plugins:');
        $this->newLine();

        // Get enabled plugins from file
        $enabledPlugins = $this->getEnabledPlugins();

        $tableData = [];

        foreach ($pluginDirectories as $pluginPath) {
            $pluginJsonPath = $pluginPath.'/plugin.json';

            if (! File::exists($pluginJsonPath)) {
                $tableData[] = [
                    basename($pluginPath),
                    '<fg=red>No plugin.json</fg>',
                    '-',
                    '-',
                ];

                continue;
            }

            try {
                $config = json_decode(File::get($pluginJsonPath), true);

                $pluginId = $config['id'] ?? null;
                $isEnabled = $pluginId && in_array($pluginId, $enabledPlugins, true);
                $status = $isEnabled
                    ? '<fg=green>✓ Active</fg>'
                    : '<fg=yellow>✗ Inactive</fg>';

                $tableData[] = [
                    $config['name'] ?? basename($pluginPath),
                    $config['version'] ?? '-',
                    $config['description'] ?? '-',
                    $status,
                ];
            } catch (\Exception $e) {
                $tableData[] = [
                    basename($pluginPath),
                    '<fg=red>Error</fg>',
                    $e->getMessage(),
                    '-',
                ];
            }
        }

        $this->table(
            ['Plugin', 'Version', 'Description', 'Status'],
            $tableData
        );

        $this->newLine();
        $this->info(sprintf('Total: %d plugin(s)', count($tableData)));

        return self::SUCCESS;
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
}
