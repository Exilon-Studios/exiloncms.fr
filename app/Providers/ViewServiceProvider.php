<?php

namespace MCCMS\Providers;

use MCCMS\Http\View\Composers\AdminLayoutComposer;
use MCCMS\Http\View\Composers\NavbarComposer;
use MCCMS\Http\View\Composers\NotificationComposer;
use MCCMS\Http\View\Composers\ServerComposer;
use MCCMS\View\ThemeViewFinder;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class ViewServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $this->app->bind('view.finder', function ($app) {
            return new ThemeViewFinder($app['files'], $app['config']['view.paths']);
        });

        Blade::if('plugin', fn ($expression) => plugins()->isEnabled($expression));
        Blade::if('route', fn ($expression) => Route::is($expression));

        // View composers disabled - using Inertia.js with HandleInertiaRequests middleware instead
        // View::composer('*', ServerComposer::class);
        // View::composer('*', NotificationComposer::class);
        // View::composer('elements.navbar', NavbarComposer::class);
        // View::composer('admin.layouts.admin', AdminLayoutComposer::class);
    }
}
