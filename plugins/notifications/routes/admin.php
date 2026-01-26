<?php

use ExilonCMS\Plugins\Notifications\Http\Controllers\Admin\NotificationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'can:notifications.manage'])->group(function () {
    Route::get('/', [NotificationController::class, 'index'])->name('index');
    Route::get('/channels', [NotificationController::class, 'channels'])->name('channels');
    Route::get('/templates', [NotificationController::class, 'templates'])->name('templates');
    Route::get('/templates/create', [NotificationController::class, 'createTemplate'])->name('templates.create');
    Route::post('/templates', [NotificationController::class, 'storeTemplate'])->name('templates.store');
    Route::get('/templates/{template}/edit', [NotificationController::class, 'editTemplate'])->name('templates.edit');
    Route::put('/templates/{template}', [NotificationController::class, 'updateTemplate'])->name('templates.update');
    Route::post('/send', [NotificationController::class, 'send'])->name('send');
});
