<?php

use ExilonCMS\Plugins\Shop\Controllers\CartController;
use ExilonCMS\Plugins\Shop\Controllers\OrderController;
use ExilonCMS\Plugins\Shop\Controllers\ShopController;
use Illuminate\Support\Facades\Route;

// Shop public routes
Route::middleware([])->name('shop.')->group(function () {
    Route::get('/', [ShopController::class, 'index'])->name('index');
    Route::get('/category/{id}', [ShopController::class, 'category'])->name('category');
    Route::get('/item/{id}', [ShopController::class, 'show'])->name('show');

    // Authenticated routes
    Route::middleware('auth')->group(function () {
        Route::get('/cart', [CartController::class, 'index'])->name('cart');
        Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
        Route::delete('/cart/{id}', [CartController::class, 'remove'])->name('cart.remove');
        Route::post('/cart/clear', [CartController::class, 'clear'])->name('cart.clear');
        Route::get('/checkout', [OrderController::class, 'checkout'])->name('checkout');
        Route::post('/checkout', [OrderController::class, 'process'])->name('checkout.process');
        Route::get('/orders', [OrderController::class, 'index'])->name('orders');
        Route::get('/orders/{id}', [OrderController::class, 'show'])->name('orders.show');
    });
});
