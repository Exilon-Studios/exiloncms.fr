<?php

use ExilonCMS\Plugins\Analytics\Http\Controllers\Admin\AnalyticsController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'can:analytics.view'])->group(function () {
    Route::get('/', [AnalyticsController::class, 'index'])->name('index');
    Route::get('/events', [AnalyticsController::class, 'events'])->name('events');
    Route::post('/export', [AnalyticsController::class, 'export'])->name('export');
});
