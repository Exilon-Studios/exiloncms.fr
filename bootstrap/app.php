<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Route;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            Route::middleware(['web', 'auth', 'admin'])
                ->prefix('admin')
                ->name('admin.')
                ->group(base_path('routes/admin.php'));
        }
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \ExilonCMS\Http\Middleware\RedirectIfNotInstalled::class,
            \ExilonCMS\Http\Middleware\CheckForMaintenanceSettings::class,
            \ExilonCMS\Http\Middleware\SetLocale::class,
            \ExilonCMS\Http\Middleware\HandleInertiaRequests::class,
        ]);

        // Register middleware aliases
        $middleware->alias([
            'login.socialite' => \ExilonCMS\Http\Middleware\SocialiteLogin::class,
            'captcha' => \ExilonCMS\Http\Middleware\VerifyCaptcha::class,
            'admin' => \ExilonCMS\Http\Middleware\AdminAuthenticate::class,
            'admin.access' => \ExilonCMS\Http\Middleware\AdminAuthenticate::class,
            'registration' => \ExilonCMS\Http\Middleware\CheckRegistrationStatus::class,
            'puck.edit' => \ExilonCMS\Http\Middleware\CanEditWithPuck::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
