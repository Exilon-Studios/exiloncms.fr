<?php

use ExilonCMS\Plugins\Shop\Controllers\Admin\ShopController;
use ExilonCMS\Plugins\Shop\Controllers\Admin\ItemController;
use ExilonCMS\Plugins\Shop\Controllers\Admin\CategoryController;
use ExilonCMS\Plugins\Shop\Controllers\Admin\OrderController;
use Illuminate\Support\Facades\Route;

// Admin shop management
// Routes are already prefixed with /admin/shop by PluginServiceProvider
Route::name('admin.shop.')->group(function () {
    Route::get('/', [ShopController::class, 'index'])->name('index');
    Route::get('/settings', [ShopController::class, 'settings'])->name('settings');
    Route::put('/settings', [ShopController::class, 'updateSettings'])->name('settings.update');

    // Items
    Route::prefix('items')->name('items.')->group(function () {
        Route::get('/', [ItemController::class, 'index'])->name('index');
        Route::get('/create', [ItemController::class, 'create'])->name('create');
        Route::post('/', [ItemController::class, 'store'])->name('store');
        Route::get('/{id}/edit', [ItemController::class, 'edit'])->name('edit');
        Route::put('/{id}', [ItemController::class, 'update'])->name('update');
        Route::delete('/{id}', [ItemController::class, 'destroy'])->name('destroy');
    });

    // Categories
    Route::prefix('categories')->name('categories.')->group(function () {
        Route::get('/', [CategoryController::class, 'index'])->name('index');
        Route::get('/create', [CategoryController::class, 'create'])->name('create');
        Route::post('/', [CategoryController::class, 'store'])->name('store');
        Route::get('/{id}/edit', [CategoryController::class, 'edit'])->name('edit');
        Route::put('/{id}', [CategoryController::class, 'update'])->name('update');
        Route::delete('/{id}', [CategoryController::class, 'destroy'])->name('destroy');
    });

    // Orders
    Route::prefix('orders')->name('orders.')->group(function () {
        Route::get('/', [OrderController::class, 'index'])->name('index');
        Route::get('/{id}', [OrderController::class, 'show'])->name('show');
        Route::put('/{id}/status', [OrderController::class, 'updateStatus'])->name('update.status');
        Route::delete('/{id}', [OrderController::class, 'destroy'])->name('destroy');
    });
});
