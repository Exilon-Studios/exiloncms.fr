<?php

use ExilonCMS\Plugins\Votes\Http\Controllers\Admin\VoteRewardController;
use ExilonCMS\Plugins\Votes\Http\Controllers\Admin\VoteSiteController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'can:votes.manage'])->group(function () {
    // Vote Sites
    Route::prefix('sites')->name('sites.')->group(function () {
        Route::get('/', [VoteSiteController::class, 'index'])->name('index');
        Route::get('/create', [VoteSiteController::class, 'create'])->name('create');
        Route::post('/', [VoteSiteController::class, 'store'])->name('store');
        Route::get('/{site}/edit', [VoteSiteController::class, 'edit'])->name('edit');
        Route::put('/{site}', [VoteSiteController::class, 'update'])->name('update');
        Route::delete('/{site}', [VoteSiteController::class, 'destroy'])->name('destroy');
        Route::post('/{site}/toggle', [VoteSiteController::class, 'toggle'])->name('toggle');
    });

    // Vote Rewards
    Route::prefix('rewards')->name('rewards.')->group(function () {
        Route::get('/', [VoteRewardController::class, 'index'])->name('index');
        Route::get('/create', [VoteRewardController::class, 'create'])->name('create');
        Route::post('/', [VoteRewardController::class, 'store'])->name('store');
        Route::get('/{reward}/edit', [VoteRewardController::class, 'edit'])->name('edit');
        Route::put('/{reward}', [VoteRewardController::class, 'update'])->name('update');
        Route::delete('/{reward}', [VoteRewardController::class, 'destroy'])->name('destroy');
        Route::post('/{reward}/toggle', [VoteRewardController::class, 'toggle'])->name('toggle');
    });
});
