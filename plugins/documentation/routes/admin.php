<?php

use ExilonCMS\Plugins\Documentation\Controllers\Admin\DocumentationController as AdminDocumentationController;
use Illuminate\Support\Facades\Route;

// Admin documentation management
// Routes are already prefixed with /admin/plugins/documentation by PluginServiceProvider
Route::name('admin.plugins.documentation.')->group(function () {
    // Dashboard
    Route::get('/', [AdminDocumentationController::class, 'index'])->name('index');

    // Configuration (use 'settings' to avoid conflict with generic plugin config route)
    Route::get('/settings', [AdminDocumentationController::class, 'config'])->name('config');
    Route::put('/settings', [AdminDocumentationController::class, 'updateConfig'])->name('config.update');

    // Browse documentation files (IDE editor)
    Route::get('/browse/{locale?}', [AdminDocumentationController::class, 'browse'])->name('browse');

    // Create new page (from IDE)
    Route::post('/', [AdminDocumentationController::class, 'store'])->name('store');

    // Create new category/folder
    Route::post('/category', [AdminDocumentationController::class, 'storeCategory'])->name('category.store');

    // Delete page
    Route::delete('/{locale}/{category}/{page}', [AdminDocumentationController::class, 'destroy'])
        ->name('destroy');

    // File tree API
    Route::get('/tree/{locale?}', [AdminDocumentationController::class, 'fileTree'])
        ->name('tree');

    // Reorder items (categories and pages)
    Route::post('/reorder', [AdminDocumentationController::class, 'reorder'])
        ->name('reorder');

    // Cache management
    Route::prefix('cache')->name('cache.')->group(function () {
        Route::get('/', [AdminDocumentationController::class, 'cache'])->name('index');
        Route::post('/clear', [AdminDocumentationController::class, 'clearCache'])->name('clear');
        Route::post('/warm', [AdminDocumentationController::class, 'warmCache'])->name('warm');
    });

    // IDE editor routes
    Route::post('/file-content', [AdminDocumentationController::class, 'fileContent'])->name('file-content');
    Route::post('/save-content', [AdminDocumentationController::class, 'saveContent'])->name('save-content');

    // Locale management
    Route::post('/create-locale', [AdminDocumentationController::class, 'createLocale'])->name('create-locale');
    Route::post('/duplicate-locale', [AdminDocumentationController::class, 'duplicateLocale'])->name('duplicate-locale');

    // Delete file/folder by path
    Route::post('/delete', [AdminDocumentationController::class, 'deleteByPath'])->name('delete');
});
