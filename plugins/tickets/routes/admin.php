<?php

use ExilonCMS\Plugins\Tickets\Controllers\Admin\TicketsController;
use ExilonCMS\Plugins\Tickets\Controllers\Admin\CategoryController;
use Illuminate\Support\Facades\Route;

// Admin ticket management
// Routes are already prefixed with /admin/tickets by PluginServiceProvider
Route::name('admin.tickets.')->group(function () {
    Route::get('/', [TicketsController::class, 'index'])->name('index');
    Route::get('/settings', [TicketsController::class, 'settings'])->name('settings');
    Route::put('/settings', [TicketsController::class, 'updateSettings'])->name('settings.update');

    // Categories
    Route::prefix('categories')->name('categories.')->group(function () {
        Route::get('/', [CategoryController::class, 'index'])->name('index');
        Route::get('/create', [CategoryController::class, 'create'])->name('create');
        Route::post('/', [CategoryController::class, 'store'])->name('store');
        Route::get('/{id}/edit', [CategoryController::class, 'edit'])->name('edit');
        Route::put('/{id}', [CategoryController::class, 'update'])->name('update');
        Route::delete('/{id}', [CategoryController::class, 'destroy'])->name('destroy');
    });
});
