<?php

use ExilonCMS\Plugins\Pages\Http\Controllers\Public\PageController;
use Illuminate\Support\Facades\Route;

Route::prefix('pages')->name('pages.')->group(function () {
    Route::get('/', [PageController::class, 'index'])->name('index');
    Route::get('/{slug}', [PageController::class, 'show'])->name('show');
});
