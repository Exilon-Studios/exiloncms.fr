<?php

namespace ExilonCMS\Plugins\Releases;

use Illuminate\Support\ServiceProvider;

class ReleasesServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__.'/../routes/web.php');
        $this->loadRoutesFrom(__DIR__.'/../routes/admin.php');

        $this->loadViewsFrom(__DIR__.'/../resources/views', 'releases');
        $this->loadMigrationsFrom(__DIR__.'/../database/migrations');

        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__.'/../resources/js' => public_path('vendor/releases'),
            ], ['releases', 'releases-assets']);
        }
    }

    public function register(): void
    {
        //
    }
}
