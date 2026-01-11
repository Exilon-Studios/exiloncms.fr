<?php

use ExilonCMS\Http\Controllers\InstallController;
use Illuminate\Support\Facades\Route;

// Installation routes - only accessible when APP_KEY is the temporary key
Route::middleware([
    \ExilonCMS\Http\Middleware\EncryptCookies::class,
    \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
    \Illuminate\Session\Middleware\StartSession::class,
    \Illuminate\View\Middleware\ShareErrorsFromSession::class,
])->group(function () {
    Route::get('/install', [InstallController::class, 'index'])->name('install.index');
    Route::post('/install', [InstallController::class, 'install'])->name('install.submit');
});
