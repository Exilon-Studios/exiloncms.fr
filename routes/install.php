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

    // Start with database configuration (requirements step removed)
    Route::get('/wizard', [InstallController::class, 'showDatabaseWeb'])->name('install.index');
    Route::post('/wizard', [InstallController::class, 'install'])->name('install.submit');

    // Database configuration
    Route::get('/wizard/database', [InstallController::class, 'showDatabaseWeb'])->name('install.database');
    Route::post('/wizard/database', [InstallController::class, 'configureDatabaseWeb'])->name('install.database.save');

    // Installation mode selection
    Route::get('/wizard/mode', [InstallController::class, 'showModeWeb'])->name('install.mode');
    Route::post('/wizard/mode', [InstallController::class, 'saveModeWeb'])->name('install.mode.save');

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
