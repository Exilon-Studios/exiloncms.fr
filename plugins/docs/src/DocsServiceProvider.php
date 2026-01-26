<?php

namespace ExilonCMS\Plugins\Docs;

use Illuminate\Support\ServiceProvider;

class DocsServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__.'/../routes/web.php');
        $this->loadRoutesFrom(__DIR__.'/../routes/admin.php');

        $this->loadViewsFrom(__DIR__.'/../resources/views', 'docs');
        $this->loadMigrationsFrom(__DIR__.'/../database/migrations');

        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__.'/../resources/js' => public_path('vendor/docs'),
            ], ['docs', 'docs-assets']);
        }
    }

    public function register(): void
    {
        //
    }
}
