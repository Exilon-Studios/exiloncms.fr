<?php

use ExilonCMS\Plugins\Tickets\Controllers\Admin\TicketsController;
use Illuminate\Support\Facades\Route;

// Admin ticket management
// Routes are prefixed with /admin/plugins/tickets by PluginServiceProvider
Route::name('admin.plugins.tickets.')->group(function () {
    Route::get('/', [TicketsController::class, 'index'])->name('index');
    Route::get('/settings', [TicketsController::class, 'settings'])->name('settings');
    Route::put('/settings', [TicketsController::class, 'updateSettings'])->name('settings.update');

    // Categories (placeholder - using same controller for now)
    Route::get('/categories', [TicketsController::class, 'index'])->name('categories.index');
});
