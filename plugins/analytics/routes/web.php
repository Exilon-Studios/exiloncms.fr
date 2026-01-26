<?php

use Illuminate\Support\Facades\Route;
use ExilonCMS\Plugins\Analytics\Http\Controllers\TrackingController;

Route::middleware('web')->group(function () {
    Route::post('/api/analytics/track', [TrackingController::class, 'track'])->name('analytics.track');
    Route::get('/api/analytics/page-views', [TrackingController::class, 'getPageViews'])->name('analytics.page-views');
});
