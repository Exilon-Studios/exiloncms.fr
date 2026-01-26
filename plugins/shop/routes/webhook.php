<?php

use Illuminate\Support\Facades\Route;
use ExilonCMS\Plugins\Shop\Controllers\PaymentWebhookController;

// Payment webhook endpoints for each gateway
Route::post('/tebex/{paymentId?}', [PaymentWebhookController::class, 'handleTebex'])->name('shop.webhook.tebex');
Route::post('/paypal/{paymentId?}', [PaymentWebhookController::class, 'handlePayPal'])->name('shop.webhook.paypal');
Route::post('/stripe/{paymentId?}', [PaymentWebhookController::class, 'handleStripe'])->name('shop.webhook.stripe');
