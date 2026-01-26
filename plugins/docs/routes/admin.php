<?php

use ExilonCMS\Plugins\Docs\Http\Controllers\Admin\DocumentCategoryController;
use ExilonCMS\Plugins\Docs\Http\Controllers\Admin\DocumentController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin/docs')
    ->middleware(['web', 'auth', 'admin'])
    ->group(function () {
        Route::name('admin.docs.')->group(function () {
            // Documents
            Route::get('/', [DocumentController::class, 'index'])->name('index');
            Route::get('/create', [DocumentController::class, 'create'])->name('create');
            Route::post('/', [DocumentController::class, 'store'])->name('store');
            Route::get('/{document}', [DocumentController::class, 'show'])->name('show');
            Route::get('/{document}/edit', [DocumentController::class, 'edit'])->name('edit');
            Route::put('/{document}', [DocumentController::class, 'update'])->name('update');
            Route::delete('/{document}', [DocumentController::class, 'destroy'])->name('destroy');

            // Categories
            Route::prefix('categories')->name('categories.')->group(function () {
                Route::get('/', [DocumentCategoryController::class, 'index'])->name('index');
                Route::get('/create', [DocumentCategoryController::class, 'create'])->name('create');
                Route::post('/', [DocumentCategoryController::class, 'store'])->name('store');
                Route::get('/{category}/edit', [DocumentCategoryController::class, 'edit'])->name('edit');
                Route::put('/{category}', [DocumentCategoryController::class, 'update'])->name('update');
                Route::delete('/{category}', [DocumentCategoryController::class, 'destroy'])->name('destroy');
            });
        });
    });
