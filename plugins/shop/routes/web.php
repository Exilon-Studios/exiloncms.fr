<?php

use Illuminate\Support\Facades\Route;
use ExilonCMS\Plugins\Shop\Http\Controllers\ShopController;

Route::prefix('shop')
    ->middleware(['web', 'auth'])
    ->group(function () {
        Route::get('/', [ShopController::class, 'index'])->name('shop.index');
        Route::get('/orders', [ShopController::class, 'orders'])->name('shop.orders');
        Route::get('/invoices', [ShopController::class, 'invoices'])->name('shop.invoices');
    });
