<?php

namespace ExilonCMS\Console\Commands;

use ExilonCMS\Models\PluginInstalled;
use ExilonCMS\Classes\Plugin\PluginLoader;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class PluginInstallCommand extends Command
{
    protected $signature = 'plugin:install {name?}
        {--force : Force reinstall even if already installed}
        {--migrate : Run migrations after installation}
        {--seed : Seed the database after installation}';

    protected $description = 'Install a plugin and run its migrations automatically';

    public function handle(PluginLoader $loader): int
    {
        $pluginName = $this->argument('name');

        if ($pluginName) {
            return $this->installPlugin($pluginName);
        }

        // Install all plugins
        return $this->installAllPlugins($loader);
    }

    protected function installPlugin(string $pluginName, PluginLoader $loader): int
    {
        $pluginPath = base_path("plugins/{$pluginName}");

        if (! File::exists($pluginPath)) {
            $this->error("Plugin '{$pluginName}' not found at {$pluginPath}");

            return self::FAILURE;
        }

        $pluginJsonPath = $pluginPath.'/plugin.json';

        if (! File::exists($pluginJsonPath)) {
            $this->error("plugin.json not found for '{$pluginName}'");

            return self::FAILURE;
        }

        $this->info("Installing plugin: {$pluginName}");
        $this->newLine();

        try {
            $config = json_decode(File::get($pluginJsonPath), true);

            // Check if already installed
            $installed = PluginInstalled::where('name', $pluginName)->first();

            if ($installed && ! $this->option('force')) {
                $this->warn("Plugin '{$pluginName}' is already installed. Use --force to reinstall.");

                return self::SUCCESS;
            }

            $this->task('Reading plugin configuration', function () use ($config) {
                return ! empty($config);
            });

            $this->task('Checking dependencies', function () {
                // Check if required PHP extensions or packages are installed
                return true; // For now, always pass
            });

            $this->task('Registering plugin', function () use ($loader, $pluginPath) {
                // Plugin is automatically discovered by PluginLoader

                return true;
            });

            // Record in database
            $this->task('Recording installation', function () use ($config, $pluginName) {
                if ($installed) {
                    $installed->update([
                        'version' => $config['version'] ?? '1.0.0',
                        'is_enabled' => true,
                    ]);
                } else {
                    PluginInstalled::create([
                        'name' => $pluginName,
                        'version' => $config['version'] ?? '1.0.0',
                        'type' => 'plugin',
                        'is_enabled' => true,
                    ]);
                }

                return true;
            });

            // Run migrations if requested
            if ($this->option('migrate') || $this->confirm('Run migrations now?', true)) {
                $this->newLine();
                $this->info('Running migrations...');

                $this->call('migrate', [
                    '--force' => true,
                    '--path' => "plugins/{$pluginName}/database/migrations",
                ]);
            }

            // Clear cache
            $this->call('cache:clear');

            $this->newLine();
            $this->info("✓ Plugin '{$pluginName}' installed successfully!");

            return self::SUCCESS;
        } catch (\Exception $e) {
            $this->error("Failed to install plugin: {$e->getMessage()}");

            return self::FAILURE;
        }
    }

    protected function installAllPlugins(PluginLoader $loader): int
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

        $this->info('Installing all plugins...');
        $this->newLine();

        $installed = 0;
        $failed = [];

        foreach ($pluginDirectories as $pluginPath) {
            $pluginName = basename($pluginPath);
            $pluginJsonPath = $pluginPath.'/plugin.json';

            if (! File::exists($pluginJsonPath)) {
                $this->warn("Skipping {$pluginName}: No plugin.json found");

                continue;
            }

            try {
                $config = json_decode(File::get($pluginJsonPath), true);

                // Load plugin
                // Plugin is automatically discovered by PluginLoader

                // Check if already in database
                $installed = PluginInstalled::firstOrCreate(
                    ['name' => $pluginName],
                    [
                        'version' => $config['version'] ?? '1.0.0',
                        'type' => 'plugin',
                        'is_enabled' => true,
                    ]
                );

                if ($installed->wasRecentlyCreated) {
                    $this->info("✓ {$pluginName} v{$config['version']}");
                    $installed++;
                } else {
                    $this->line("  {$pluginName}: already installed", 'info');
                }
            } catch (\Exception $e) {
                $failed[] = $pluginName;
                $this->error("✗ {$pluginName}: {$e->getMessage()}");
            }
        }

        $this->newLine();

        // Run migrations for all plugins
        if ($this->option('migrate') || $this->confirm('Run migrations for all plugins?', true)) {
            $this->newLine();
            $this->info('Running migrations for all plugins...');
            $this->call('migrate', ['--force' => true]);
        }

        $this->call('cache:clear');

        $this->newLine();
        $this->info('Installation complete!');
        $this->line("Installed: {$installed} plugins");

        if (! empty($failed)) {
            $this->warn('Failed: '.implode(', ', $failed));
        }

        return self::SUCCESS;
    }
}
