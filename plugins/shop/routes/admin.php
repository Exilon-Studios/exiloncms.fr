<?php

use Illuminate\Support\Facades\Route;
use ExilonCMS\Plugins\Shop\Controllers\Admin\ShopController;

// Shop management
Route::get('/shop', [ShopController::class, 'index'])->name('shop.index');
Route::get('/shop/items', [ShopController::class, 'items'])->name('shop.items');
Route::get('/shop/items/create', [ShopController::class, 'createItem'])->name('shop.items.create');
Route::post('/shop/items', [ShopController::class, 'storeItem'])->name('shop.items.store');
Route::get('/shop/items/{item}/edit', [ShopController::class, 'editItem'])->name('shop.items.edit');
Route::put('/shop/items/{item}', [ShopController::class, 'updateItem'])->name('shop.items.update');
Route::delete('/shop/items/{item}', [ShopController::class, 'deleteItem'])->name('shop.items.delete');

Route::get('/shop/categories', [ShopController::class, 'categories'])->name('shop.categories');
Route::get('/shop/categories/create', [ShopController::class, 'createCategory'])->name('shop.categories.create');
Route::post('/shop/categories', [ShopController::class, 'storeCategory'])->name('shop.categories.store');
Route::get('/shop/categories/{category}/edit', [ShopController::class, 'editCategory'])->name('shop.categories.edit');
Route::put('/shop/categories/{category}', [ShopController::class, 'updateCategory'])->name('shop.categories.update');
Route::delete('/shop/categories/{category}', [ShopController::class, 'deleteCategory'])->name('shop.categories.delete');

Route::get('/shop/orders', [ShopController::class, 'orders'])->name('shop.orders');
Route::get('/shop/orders/{order}', [ShopController::class, 'showOrder'])->name('shop.orders.show');

Route::get('/shop/gateways', [ShopController::class, 'gateways'])->name('shop.gateways');
Route::get('/shop/gateways/create', [ShopController::class, 'createGateway'])->name('shop.gateways.create');
Route::post('/shop/gateways', [ShopController::class, 'storeGateway'])->name('shop.gateways.store');
Route::get('/shop/gateways/{gateway}/edit', [ShopController::class, 'editGateway'])->name('shop.gateways.edit');
Route::put('/shop/gateways/{gateway}', [ShopController::class, 'updateGateway'])->name('shop.gateways.update');
Route::delete('/shop/gateways/{gateway}', [ShopController::class, 'deleteGateway'])->name('shop.gateways.delete');
