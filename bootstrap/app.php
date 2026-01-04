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
            \MCCMS\Http\Middleware\CheckForMaintenanceSettings::class,
            \MCCMS\Http\Middleware\SetLocale::class,
            \MCCMS\Http\Middleware\HandleInertiaRequests::class,
        ]);

        // Register middleware aliases
        $middleware->alias([
            'login.socialite' => \MCCMS\Http\Middleware\SocialiteLogin::class,
            'captcha' => \MCCMS\Http\Middleware\VerifyCaptcha::class,
            'admin' => \MCCMS\Http\Middleware\AdminAuthenticate::class,
            'registration' => \MCCMS\Http\Middleware\CheckRegistrationStatus::class,
            'puck.edit' => \MCCMS\Http\Middleware\CanEditWithPuck::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
