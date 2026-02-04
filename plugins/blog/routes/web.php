<?php

use ExilonCMS\Plugins\Blog\Http\Controllers\Public\CategoryController as PublicCategoryController;
use ExilonCMS\Plugins\Blog\Http\Controllers\Public\PostController as PublicPostController;
use ExilonCMS\Plugins\Blog\Http\Controllers\Public\TagController as PublicTagController;
use Illuminate\Support\Facades\Route;

// Public blog routes (prefix is added by PluginServiceProvider)
Route::get('/', [PublicPostController::class, 'index'])->name('index');
Route::get('/{post:slug}', [PublicPostController::class, 'show'])->name('show');

// Category routes
Route::prefix('categories')->group(function () {
    Route::get('/', [PublicCategoryController::class, 'index'])->name('categories.index');
    Route::get('/{category:slug}', [PublicCategoryController::class, 'show'])->name('categories.show');
});

// Tag routes
Route::prefix('tags')->group(function () {
    Route::get('/', [PublicTagController::class, 'index'])->name('tags.index');
    Route::get('/{tag:slug}', [PublicTagController::class, 'show'])->name('tags.show');
});
