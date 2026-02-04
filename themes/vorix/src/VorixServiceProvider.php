<?php

namespace ExilonCMS\Themes\Vorix;

use ExilonCMS\Models\Permission;
use Illuminate\Support\ServiceProvider;

class VorixServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Load views
        $this->loadViewsFrom(__DIR__.'/../../resources/views', 'vorix');

        // Load translations
        $this->loadTranslationsFrom(__DIR__.'/../../resources/lang', 'vorix');

        // Publish assets
        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__.'/../../resources/assets' => public_path('themes/vorix/assets'),
            ], ['vorix-theme', 'assets']);
        }

        // Register theme permissions if needed
        // Permission::registerPermissions([
        //     'theme.vorix.use' => 'Use Vorix theme',
        // ]);
    }
}