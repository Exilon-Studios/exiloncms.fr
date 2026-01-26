<?php

use ExilonCMS\Plugins\Blog\Http\Controllers\Public\CategoryController as PublicCategoryController;
use ExilonCMS\Plugins\Blog\Http\Controllers\Public\PostController as PublicPostController;
use ExilonCMS\Plugins\Blog\Http\Controllers\Public\TagController as PublicTagController;
use Illuminate\Support\Facades\Route;

// Public blog routes
Route::prefix('blog')->name('blog.')->group(function () {
    Route::get('/', [PublicPostController::class, 'index'])->name('index');
    Route::get('/{post:slug}', [PublicPostController::class, 'show'])->name('show');

    // Category routes
    Route::prefix('categories')->name('categories.')->group(function () {
        Route::get('/', [PublicCategoryController::class, 'index'])->name('index');
        Route::get('/{category:slug}', [PublicCategoryController::class, 'show'])->name('show');
    });

    // Tag routes
    Route::prefix('tags')->name('tags.')->group(function () {
        Route::get('/', [PublicTagController::class, 'index'])->name('index');
        Route::get('/{tag:slug}', [PublicTagController::class, 'show'])->name('show');
    });
});
