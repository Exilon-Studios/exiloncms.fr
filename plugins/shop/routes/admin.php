<?php

use ExilonCMS\Plugins\Shop\Controllers\Admin\ShopController;
use Illuminate\Support\Facades\Route;

// Shop management - PluginServiceProvider adds 'admin/plugins/shop' prefix
Route::get('/', [ShopController::class, 'index'])->name('shop.index');
Route::get('/items', [ShopController::class, 'items'])->name('shop.items');
Route::get('/items/create', [ShopController::class, 'createItem'])->name('shop.items.create');
Route::post('/items', [ShopController::class, 'storeItem'])->name('shop.items.store');
Route::get('/items/{item}/edit', [ShopController::class, 'editItem'])->name('shop.items.edit');
Route::put('/items/{item}', [ShopController::class, 'updateItem'])->name('shop.items.update');
Route::delete('/items/{item}', [ShopController::class, 'deleteItem'])->name('shop.items.delete');

Route::get('/categories', [ShopController::class, 'categories'])->name('shop.categories');
Route::get('/categories/create', [ShopController::class, 'createCategory'])->name('shop.categories.create');
Route::post('/categories', [ShopController::class, 'storeCategory'])->name('shop.categories.store');
Route::get('/categories/{category}/edit', [ShopController::class, 'editCategory'])->name('shop.categories.edit');
Route::put('/categories/{category}', [ShopController::class, 'updateCategory'])->name('shop.categories.update');
Route::delete('/categories/{category}', [ShopController::class, 'deleteCategory'])->name('shop.categories.delete');

Route::get('/orders', [ShopController::class, 'orders'])->name('shop.orders');
Route::get('/orders/{order}', [ShopController::class, 'showOrder'])->name('shop.orders.show');

Route::get('/gateways', [ShopController::class, 'gateways'])->name('shop.gateways');
Route::get('/gateways/create', [ShopController::class, 'createGateway'])->name('shop.gateways.create');
Route::post('/gateways', [ShopController::class, 'storeGateway'])->name('shop.gateways.store');
Route::get('/gateways/{gateway}/edit', [ShopController::class, 'editGateway'])->name('shop.gateways.edit');
Route::put('/gateways/{gateway}', [ShopController::class, 'updateGateway'])->name('shop.gateways.update');
Route::delete('/gateways/{gateway}', [ShopController::class, 'deleteGateway'])->name('shop.gateways.delete');
