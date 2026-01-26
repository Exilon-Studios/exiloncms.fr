<?php

use Illuminate\Support\Facades\Route;
use ShopPlugin\Controllers\PaymentWebhookController;

/*
|--------------------------------------------------------------------------
| Shop Webhook Routes
|--------------------------------------------------------------------------
| These routes handle payment gateway webhooks.
| No authentication is required as gateways need to send notifications.
*/

Route::prefix('{gateway}')->name('webhook.')->group(function () {
    // Webhook endpoint for payment notifications
    Route::post('/', [PaymentWebhookController::class, 'handle'])->name('notification');

    // Payment success/cancel redirects
    Route::get('/success/{payment}', [PaymentWebhookController::class, 'success'])->name('success');
    Route::get('/cancel/{payment}', [PaymentWebhookController::class, 'cancel'])->name('cancel');
    Route::get('/failure/{payment}', [PaymentWebhookController::class, 'failure'])->name('failure');
});
