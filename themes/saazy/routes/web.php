<?php

use Illuminate\Support\Facades\Route;
use Themes\Saazy\Http\Controllers\HomeController;

/*
|--------------------------------------------------------------------------
| Theme Routes
|--------------------------------------------------------------------------
*/

// Theme homepage
Route::get('/', [HomeController::class, 'index'])->name('theme.home');

// Theme pages (can be extended)
Route::prefix('pages')->group(function () {
    Route::get('/{slug}', [HomeController::class, 'page'])->name('theme.page');
});
