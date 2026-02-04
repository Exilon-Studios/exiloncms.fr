<?php

namespace ExilonCMS\Providers;

use Exception;
use ExilonCMS\Extensions\Theme\ThemeServiceProvider;
use ExilonCMS\Models\Setting;
use ExilonCMS\Support\SettingsRepository;
use Illuminate\Support\ServiceProvider;

class ExtensionServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(SettingsRepository::class);

        // Register theme service provider
        // Plugin service provider is registered in bootstrap/app.php
        $this->app->register(ThemeServiceProvider::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        if (! is_installed()) {
            return;
        }

        // Debug: Log database state at boot start
        $logFile = storage_path('logs/boot_debug.log');
        $debug = date('Y-m-d H:i:s').' - BOOT START - DB enabled_plugins: ';
        try {
            $dbValue = \Illuminate\Support\Facades\DB::table('settings')->where('name', 'enabled_plugins')->value('value');
            $debug .= $dbValue."\n";
        } catch (\Exception $e) {
            $debug .= 'ERROR: '.$e->getMessage()."\n";
        }
        file_put_contents($logFile, $debug, FILE_APPEND);

        try {
            $repository = $this->app->make(SettingsRepository::class);
            $loadedSettings = $this->loadSettings();
            $repository->set($loadedSettings);

            // Debug: Log what was loaded
            $debugLoaded = date('Y-m-d H:i:s').' - LOADED SETTINGS - enabled_plugins: '.json_encode($loadedSettings['enabled_plugins'] ?? 'NOT SET')."\n";
            file_put_contents($logFile, $debugLoaded, FILE_APPEND);
        } catch (Exception) {
            //
        }

        // Debug: Log database state at boot end
        $debug2 = date('Y-m-d H:i:s').' - BOOT END - DB enabled_plugins: ';
        try {
            $dbValue2 = \Illuminate\Support\Facades\DB::table('settings')->where('name', 'enabled_plugins')->value('value');
            $debug2 .= $dbValue2."\n";
        } catch (\Exception $e) {
            $debug2 .= 'ERROR: '.$e->getMessage()."\n";
        }
        file_put_contents($logFile, $debug2, FILE_APPEND);
    }

    /**
     * Load settings from database.
     */
    protected function loadSettings(): array
    {
        $settings = Setting::all()->mapWithKeys(fn ($setting) => [
            $setting->name => $setting->getAttribute('value'),
        ])->all();

        // Debug: log enabled_plugins value
        if (isset($settings['enabled_plugins'])) {
            $logFile = storage_path('logs/settings_debug.log');
            $debug = date('Y-m-d H:i:s').' - enabled_plugins: '.json_encode($settings['enabled_plugins']).' (type: '.gettype($settings['enabled_plugins']).')'."\n";
            file_put_contents($logFile, $debug, FILE_APPEND);
        }

        return $settings;
    }
}
