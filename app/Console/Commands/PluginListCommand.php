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

                $isLoaded = isset($config['id']) && $loader->hasPlugin($config['id']);
                $status = $isLoaded
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
}
