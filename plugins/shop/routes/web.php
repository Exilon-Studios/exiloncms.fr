<?php

use Illuminate\Support\Facades\Route;
use ExilonCMS\Plugins\Shop\Http\Controllers\ShopController;

Route::middleware(['web', 'auth'])
    ->prefix('dashboard')
    ->group(function () {
        Route::get('/shop', [ShopController::class, 'index'])->name('dashboard.shop');
        Route::get('/orders', [ShopController::class, 'orders'])->name('dashboard.orders');
        Route::get('/invoices', [ShopController::class, 'invoices'])->name('dashboard.invoices');
    });
