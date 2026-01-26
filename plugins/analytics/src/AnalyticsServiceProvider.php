<?php

namespace ExilonCMS\Plugins\Analytics;

use ExilonCMS\Models\Permission;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class AnalyticsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(
            __DIR__.'/../config/analytics.php',
            'analytics'
        );
    }

    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__.'/../routes/web.php');
        $this->loadRoutesFrom(__DIR__.'/../routes/admin.php');
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'analytics');
        $this->loadMigrationsFrom(__DIR__.'/../database/migrations');

        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__.'/../config/analytics.php' => config_path('analytics.php'),
            ], 'analytics-config');
        }

        Permission::registerPermissions([
            'analytics.view' => 'View analytics dashboard',
            'analytics.export' => 'Export analytics data',
        ]);

        Route::bind('analyticsEvent', function ($value) {
            return \ExilonCMS\Plugins\Analytics\Models\AnalyticsEvent::findOrFail($value);
        });
    }
}
