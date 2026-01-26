<?php

use Illuminate\Support\Facades\Route;
use ShopPlugin\Controllers\Admin\GatewayController;
use ShopPlugin\Controllers\Admin\PaymentController;

/*
|--------------------------------------------------------------------------
| Shop Admin Routes
|--------------------------------------------------------------------------
*/

Route::prefix('shop')->name('shop.')->group(function () {
    // Gateways
    Route::prefix('gateways')->name('gateways.')->group(function () {
        Route::get('/', [GatewayController::class, 'index'])->name('index');
        Route::get('/create', [GatewayController::class, 'create'])->name('create');
        Route::post('/', [GatewayController::class, 'store'])->name('store');
        Route::get('/{gateway}/edit', [GatewayController::class, 'edit'])->name('edit');
        Route::put('/{gateway}', [GatewayController::class, 'update'])->name('update');
        Route::delete('/{gateway}', [GatewayController::class, 'destroy'])->name('destroy');
        Route::post('/{gateway}/test', [GatewayController::class, 'test'])->name('test');
        Route::post('/{gateway}/sync', [GatewayController::class, 'syncPackages'])->name('sync');
    });

    // Payments
    Route::prefix('payments')->name('payments.')->group(function () {
        Route::get('/', [PaymentController::class, 'index'])->name('index');
        Route::get('/{payment}', [PaymentController::class, 'show'])->name('show');
        Route::post('/{payment}/refund', [PaymentController::class, 'refund'])->name('refund');
        Route::get('/stats', [PaymentController::class, 'stats'])->name('stats');
    });
});
