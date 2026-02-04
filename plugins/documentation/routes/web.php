<?php

use ExilonCMS\Plugins\Documentation\Controllers\DocumentationController;
use Illuminate\Support\Facades\Route;

// Documentation routes - middleware pour vérifier si le plugin est activé
Route::middleware(['documentation.enabled'])->prefix('docs')->name('docs.')->group(function () {
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

// Default locale redirect
Route::get('/docs/{locale}', function ($locale) {
    return redirect()->route('docs.index', ['locale' => $locale]);
})->name('docs.locale');
