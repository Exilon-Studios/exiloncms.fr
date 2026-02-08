<?php

use ExilonCMS\Plugins\Shop\Controllers\Admin\ShopController;
use Illuminate\Support\Facades\Route;

// Admin shop management
// Routes are prefixed with /admin/plugins/shop by PluginServiceProvider
Route::name('admin.plugins.shop.')->group(function () {
    Route::get('/', [ShopController::class, 'index'])->name('index');
    Route::get('/settings', [ShopController::class, 'settings'])->name('settings');
    Route::put('/settings', [ShopController::class, 'updateSettings'])->name('settings.update');

    // Items (placeholder routes - using same controller for now)
    Route::get('/items', [ShopController::class, 'index'])->name('items.index');

    // Categories (placeholder routes - using same controller for now)
    Route::get('/categories', [ShopController::class, 'index'])->name('categories.index');

    // Orders (placeholder routes - using same controller for now)
    Route::get('/orders', [ShopController::class, 'index'])->name('orders.index');
});
