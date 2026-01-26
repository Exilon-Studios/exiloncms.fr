<?php

use Illuminate\Support\Facades\Route;
use ShopPlugin\Http\Controllers\ShopController;
use ShopPlugin\Http\Controllers\CartController;

// Shop routes
Route::get('/', [ShopController::class, 'index'])->name('shop.index');
Route::get('/category/{category}', [ShopController::class, 'category'])->name('shop.category');
Route::get('/item/{item}', [ShopController::class, 'show'])->name('shop.show');

// Cart routes
Route::prefix('cart')->name('cart.')->group(function () {
    Route::get('/', [CartController::class, 'index'])->name('index');
    Route::post('/add/{item}', [CartController::class, 'add'])->name('add');
    Route::post('/remove/{itemId}', [CartController::class, 'remove'])->name('remove');
    Route::post('/clear', [CartController::class, 'clear'])->name('clear');
});

// Order routes
Route::prefix('orders')->name('orders.')->middleware('auth')->group(function () {
    Route::get('/', [ShopController::class, 'orders'])->name('index');
    Route::get('/{order}', [ShopController::class, 'order'])->name('show');
});
