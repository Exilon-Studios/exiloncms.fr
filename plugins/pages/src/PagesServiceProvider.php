<?php

namespace ExilonCMS\Plugins\Pages;

use ExilonCMS\Models\Permission;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class PagesServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__.'/../routes/web.php');
        $this->loadRoutesFrom(__DIR__.'/../routes/admin.php');
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'pages');
        $this->loadMigrationsFrom(__DIR__.'/../database/migrations');

        Permission::registerPermissions([
            'pages.create' => 'Create pages',
            'pages.edit' => 'Edit pages',
            'pages.delete' => 'Delete pages',
            'pages.manage' => 'Manage all pages',
        ]);

        Route::bind('page', function ($value) {
            return \ExilonCMS\Plugins\Pages\Models\Page::where('slug', $value)->firstOrFail();
        });
    }
}
