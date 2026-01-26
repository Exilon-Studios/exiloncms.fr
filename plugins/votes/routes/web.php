<?php

use ExilonCMS\Plugins\Votes\Http\Controllers\Public\VoteController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth'])->group(function () {
    Route::prefix('votes')->name('votes.')->group(function () {
        Route::get('/', [VoteController::class, 'index'])->name('index');
        Route::post('/{site}', [VoteController::class, 'store'])->name('store');
        Route::get('/callback/{site}', [VoteController::class, 'callback'])->name('callback');
    });
});
