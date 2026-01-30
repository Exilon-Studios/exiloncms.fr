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
