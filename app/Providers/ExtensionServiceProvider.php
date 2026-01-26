<?php

namespace ExilonCMS\Providers;

use Exception;
use ExilonCMS\Extensions\Plugin\PluginServiceProvider;
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

        // Register plugin and theme service providers
        $this->app->register(PluginServiceProvider::class);
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

        try {
            $repository = $this->app->make(SettingsRepository::class);
            $repository->set($this->loadSettings());
        } catch (Exception) {
            //
        }
    }

    /**
     * Load settings from database.
     */
    protected function loadSettings(): array
    {
        return Setting::all()->pluck('value', 'name')->all();
    }
}
