<?php

use ExilonCMS\Http\Controllers\InstallController;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Support\Facades\Route;

// ============================================================
// INSTALLATION ROUTES (CSRF DISABLED)
// ============================================================
Route::middleware([
    \ExilonCMS\Http\Middleware\EncryptCookies::class,
    \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
    \Illuminate\Session\Middleware\StartSession::class,
    \Illuminate\View\Middleware\ShareErrorsFromSession::class,
])->withoutMiddleware([VerifyCsrfToken::class])->group(function () {

    // ============================================================
    // Simple one-page installer
    // ============================================================
    Route::get('/install', [InstallController::class, 'showRequirementsWeb'])->name('install.index');
    Route::post('/install', [InstallController::class, 'install'])->name('install.submit');

    // ============================================================
    // Multi-step web installer
    // ============================================================
    Route::get('/install/requirements', [InstallController::class, 'showRequirementsWeb'])->name('install.requirements');
    Route::post('/install/requirements', [InstallController::class, 'checkRequirementsWeb'])->name('install.requirements.check');

    Route::get('/install/database', [InstallController::class, 'showDatabaseWeb'])->name('install.database');
    Route::post('/install/database', [InstallController::class, 'configureDatabaseWeb'])->name('install.database.save');

    Route::get('/install/mode', [InstallController::class, 'showModeWeb'])->name('install.mode');
    Route::post('/install/mode', [InstallController::class, 'saveModeWeb'])->name('install.mode.save');

    Route::get('/install/admin', [InstallController::class, 'showAdminWeb'])->name('install.admin');
    Route::post('/install/admin', [InstallController::class, 'createAdminWeb'])->name('install.admin.save');

    Route::get('/install/complete', [InstallController::class, 'showCompleteWeb'])->name('install.complete');

    // Post-installation redirect (bypasses middleware checks)
    Route::get('/install/installed', [InstallController::class, 'installed'])->name('install.installed');

    // Download latest release from GitHub
    Route::post('/install/download', [InstallController::class, 'downloadLatestRelease'])->name('install.download');
});
