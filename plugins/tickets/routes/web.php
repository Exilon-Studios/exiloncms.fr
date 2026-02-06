<?php

use ExilonCMS\Plugins\Tickets\Controllers\TicketsController;
use ExilonCMS\Plugins\Tickets\Controllers\Admin\TicketsController as AdminTicketsController;
use Illuminate\Support\Facades\Route;

// Tickets public routes
Route::middleware('auth')->name('tickets.')->group(function () {
    Route::get('/', [TicketsController::class, 'index'])->name('index');
    Route::get('/create', [TicketsController::class, 'create'])->name('create');
    Route::post('/', [TicketsController::class, 'store'])->name('store');
    Route::get('/{id}', [TicketsController::class, 'show'])->name('show');
});

// Admin tickets management
Route::name('admin.tickets.')->group(function () {
    Route::get('/', [AdminTicketsController::class, 'index'])->name('index');
    Route::get('/{id}', [AdminTicketsController::class, 'show'])->name('show');
    Route::post('/{id}/respond', [AdminTicketsController::class, 'respond'])->name('respond');
    Route::put('/{id}/status', [AdminTicketsController::class, 'updateStatus'])->name('update.status');
    Route::delete('/{id}', [AdminTicketsController::class, 'destroy'])->name('destroy');
});
