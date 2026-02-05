<?php

use ExilonCMS\Plugins\Documentation\Controllers\DocumentationController;
use Illuminate\Support\Facades\Route;

// Documentation routes - middleware pour vérifier si le plugin est activé
// Note: PluginServiceProvider automatically adds prefix based on plugin ID (e.g., /documentation)
Route::middleware(['documentation.enabled'])->name('docs.')->group(function () {
    // Index page
    Route::get('/', [DocumentationController::class, 'index'])->name('index');

    // Locale-specific routes
    Route::prefix('{locale}')->group(function () {
        // Category view
        Route::get('/{category}', [DocumentationController::class, 'category'])
            ->name('category');

        // Page view
        Route::get('/{category}/{page}', [DocumentationController::class, 'page'])
            ->name('page');

        // Page content API (for dynamic loading)
        Route::get('/api/{category}/{page}/content', [DocumentationController::class, 'content'])
            ->name('content');
    });

    // Search API (locale-agnostic)
    Route::get('/search/{locale?}', [DocumentationController::class, 'search'])
        ->name('search');
});
