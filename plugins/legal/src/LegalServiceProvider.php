<?php

namespace ExilonCMS\Plugins\Legal;

use ExilonCMS\Models\Permission;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class LegalServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__.'/../routes/web.php');
        $this->loadRoutesFrom(__DIR__.'/../routes/admin.php');
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'legal');
        $this->loadMigrationsFrom(__DIR__.'/../database/migrations');

        Permission::registerPermissions([
            'legal.manage' => 'Manage legal pages',
        ]);

        Route::bind('legalPage', function ($value) {
            return \ExilonCMS\Plugins\Legal\Models\LegalPage::findOrFail($value);
        });
    }
}
