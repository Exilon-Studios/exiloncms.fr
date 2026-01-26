<?php

use Illuminate\Support\Facades\Route;
use ExilonCMS\Plugins\Pages\Http\Controllers\Public\PageController;

Route::prefix('pages')->name('pages.')->group(function () {
    Route::get('/', [PageController::class, 'index'])->name('index');
    Route::get('/{slug}', [PageController::class, 'show'])->name('show');
});
