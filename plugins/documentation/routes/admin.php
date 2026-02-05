<?php

use ExilonCMS\Plugins\Documentation\Controllers\Admin\DocumentationController as AdminDocumentationController;
use Illuminate\Support\Facades\Route;

// Admin documentation management
// Routes are already prefixed with /admin/plugins/documentation by PluginServiceProvider
Route::name('plugins.documentation.')->group(function () {
    // Dashboard
    Route::get('/', [AdminDocumentationController::class, 'index'])->name('index');

    // Configuration (use 'settings' to avoid conflict with generic plugin config route)
    Route::get('/settings', [AdminDocumentationController::class, 'config'])->name('config');
    Route::put('/settings', [AdminDocumentationController::class, 'updateConfig'])->name('config.update');

    // Browse documentation files
    Route::get('/browse/{locale?}', [AdminDocumentationController::class, 'browse'])->name('browse');

    // Create new page
    Route::get('/create', [AdminDocumentationController::class, 'create'])->name('create');
    Route::post('/', [AdminDocumentationController::class, 'store'])->name('store');

    // Edit documentation page
    Route::get('/edit/{locale}/{category}/{page}', [AdminDocumentationController::class, 'edit'])
        ->name('edit');
    Route::put('/edit/{locale}/{category}/{page}', [AdminDocumentationController::class, 'update'])
        ->name('update');

    // Delete page
    Route::delete('/{locale}/{category}/{page}', [AdminDocumentationController::class, 'destroy'])
        ->name('destroy');

    // File tree API
    Route::get('/tree/{locale?}', [AdminDocumentationController::class, 'fileTree'])
        ->name('tree');

    // Cache management
    Route::prefix('cache')->name('cache.')->group(function () {
        Route::get('/', [AdminDocumentationController::class, 'cache'])->name('index');
        Route::post('/clear', [AdminDocumentationController::class, 'clearCache'])->name('clear');
        Route::post('/warm', [AdminDocumentationController::class, 'warmCache'])->name('warm');
    });
});
