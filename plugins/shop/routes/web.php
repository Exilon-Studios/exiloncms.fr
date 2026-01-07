<?php

use Illuminate\Support\Facades\Route;
use ExilonCMS\Plugins\Shop\Http\Controllers\ShopController;
use ExilonCMS\Plugins\Shop\Http\Controllers\CartController;

// Public shop page - accessible to everyone
Route::middleware(['web'])
    ->group(function () {
        Route::get('/shop', [ShopController::class, 'index'])->name('shop.index');
        Route::get('/shop/category/{slug}', [ShopController::class, 'category'])->name('shop.category');
        Route::get('/shop/product/{slug}', [ShopController::class, 'show'])->name('shop.show');
    });

// Cart routes - require authentication
Route::middleware(['web', 'auth'])
    ->group(function () {
        Route::get('/cart', [CartController::class, 'index'])->name('cart.items');
        Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
        Route::post('/cart/{cartItem}', [CartController::class, 'update'])->name('cart.update');
        Route::delete('/cart/{cartItem}', [CartController::class, 'remove'])->name('cart.remove');
        Route::delete('/cart', [CartController::class, 'clear'])->name('cart.clear');
    });

// Protected routes - require authentication
Route::middleware(['web', 'auth'])
    ->prefix('dashboard')
    ->group(function () {
        Route::get('/orders', [ShopController::class, 'orders'])->name('dashboard.orders');
        Route::get('/invoices', [ShopController::class, 'invoices'])->name('dashboard.invoices');
    });
