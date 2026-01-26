<?php

use ExilonCMS\Plugins\Legal\Http\Controllers\Public\LegalController;
use Illuminate\Support\Facades\Route;

Route::prefix('legal')->name('legal.')->group(function () {
    Route::get('/', [LegalController::class, 'index'])->name('index');
    Route::get('/{type}', [LegalController::class, 'show'])->name('show');
});
