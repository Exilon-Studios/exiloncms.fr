<?php

namespace ExilonCMS\Console\Commands;

use ExilonCMS\Models\PluginInstalled;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class PluginUninstallCommand extends Command
{
    protected $signature = 'plugin:uninstall {name}
        {--force : Force uninstall without confirmation}
        {--cleanup : Remove plugin files and database records}';

    protected $description = 'Uninstall a plugin and optionally remove it';

    public function handle(): int
    {
        $pluginName = $this->argument('name');

        $plugin = PluginInstalled::where('name', $pluginName)->first();

        if (!$plugin) {
            $this->error("Plugin '{$pluginName}' is not installed.");
            return self::FAILURE;
        }

        $this->info("Uninstalling plugin: {$pluginName}");
        $this->newLine();

        if (!$this->option('force') && !$this->confirm("Are you sure you want to uninstall '{$pluginName}'?")) {
            $this->info('Operation cancelled.');
            return self::SUCCESS;
        }

        try {
            // Disable the plugin
            $this->task("Disabling plugin", function () use ($plugin) {
                $plugin->disable();
                return true;
            });

            // Optionally clean up database
            if ($this->option('cleanup')) {
                $this->task("Removing from database", function () use ($plugin) {
                    $plugin->delete();
                    return true;
                });

                $pluginPath = $plugin->getPluginPath();

                if (is_dir($pluginPath)) {
                    $this->task("Removing plugin files", function () use ($pluginPath) {
                        // Recursively delete plugin directory
                        $this->deleteDirectory($pluginPath);
                        return true;
                    });
                }
            }

            $this->call('cache:clear');

            $this->newLine();
            $this->info("✓ Plugin '{$pluginName}' uninstalled successfully!");

            return self::SUCCESS;
        } catch (\Exception $e) {
            $this->error("Failed to uninstall plugin: {$e->getMessage()}");
            return self::FAILURE;
        }
    }

    protected function deleteDirectory(string $dir): void
    {
        $files = array_diff(scandir($dir), ['.', '..']);

        foreach ($files as $file) {
            $path = $dir . '/' . $file;

            if (is_dir($path)) {
                $this->deleteDirectory($path);
            } else {
                unlink($path);
            }
        }

        rmdir($dir);
    }
}
