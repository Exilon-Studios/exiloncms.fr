<?php

use ExilonCMS\Http\Controllers\InstallController;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Support\Facades\Route;

// ============================================================
// INSTALLATION WIZARD ROUTES (CSRF DISABLED)
// ============================================================
Route::middleware([
    \ExilonCMS\Http\Middleware\EncryptCookies::class,
    \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
    \Illuminate\Session\Middleware\StartSession::class,
    \Illuminate\View\Middleware\ShareErrorsFromSession::class,
])->withoutMiddleware([VerifyCsrfToken::class])->group(function () {

    // ============================================================
    // Installation Wizard (after standalone installer extracts CMS)
    // ============================================================

    // Welcome / Requirements page (shows PHP version, extensions, etc.)
    Route::get('/install', [InstallController::class, 'index'])->name('install.index');
    Route::post('/install', [InstallController::class, 'install'])->name('install.submit');

    // Database configuration
    Route::get('/wizard', [InstallController::class, 'showDatabaseWeb'])->name('install.database');
    Route::post('/wizard', [InstallController::class, 'configureDatabaseWeb'])->name('install.database.save');

    // Database configuration (alternative route)
    Route::get('/wizard/database', [InstallController::class, 'showDatabaseWeb'])->name('install.database.alt');

    // Installation mode selection
    Route::get('/wizard/mode', [InstallController::class, 'showModeWeb'])->name('install.mode');
    Route::post('/wizard/mode', [InstallController::class, 'saveModeWeb'])->name('install.mode.save');

    // Plugin and theme selection
    Route::get('/wizard/extensions', [InstallController::class, 'showExtensionsWeb'])->name('install.extensions');
    Route::post('/wizard/extensions', [InstallController::class, 'saveExtensionsWeb'])->name('install.extensions.save');

    // Admin user creation
    Route::get('/wizard/admin', [InstallController::class, 'showAdminWeb'])->name('install.admin');
    Route::post('/wizard/admin', [InstallController::class, 'createAdminWeb'])->name('install.admin.save');

    // Installation complete
    Route::get('/wizard/complete', [InstallController::class, 'showCompleteWeb'])->name('install.complete');

    // Post-installation redirect (bypasses middleware checks)
    Route::get('/wizard/installed', [InstallController::class, 'installed'])->name('install.installed');

    // Download latest release from GitHub
    Route::post('/install/download', [InstallController::class, 'downloadLatestRelease'])->name('install.download');
});
