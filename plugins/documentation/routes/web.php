<?php

use ExilonCMS\Plugins\Documentation\Controllers\DocumentationController;
use Illuminate\Support\Facades\Route;

// Documentation routes - middleware pour vérifier si le plugin est activé
// Note: PluginServiceProvider automatically adds prefix based on plugin ID (e.g., /documentation)
Route::middleware(['documentation.enabled'])->name('docs.')->group(function () {
    // Root route - redirect to default locale
    Route::get('/', function () {
        $defaultLocale = setting('documentation.default_locale', 'fr');

        return redirect()->route('docs.locale', ['locale' => $defaultLocale]);
    })->name('index');

    // Locale-specific routes
    Route::prefix('{locale}')->name('locale.')->group(function () {
        // Locale index page
        Route::get('/', [DocumentationController::class, 'index'])
            ->name('index');

        // Category view
        Route::get('/{category}', [DocumentationController::class, 'category'])
            ->name('category');

        // Page view
        Route::get('/{category}/{page}', [DocumentationController::class, 'page'])
            ->name('page');
    });

    // Page content API (for dynamic loading)
    Route::get('/api/{locale}/{category}/{page}/content', [DocumentationController::class, 'content'])
        ->name('content');

    // Search API
    Route::get('/search/{locale?}', [DocumentationController::class, 'search'])
        ->name('search');
});
