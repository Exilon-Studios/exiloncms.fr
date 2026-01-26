<?php

use Illuminate\Support\Facades\Route;
use ExilonCMS\Plugins\Pages\Http\Controllers\Admin\PageController;

Route::middleware(['auth', 'can:pages.manage'])->group(function () {
    Route::get('/', [PageController::class, 'index'])->name('index');
    Route::get('/create', [PageController::class, 'create'])->name('create');
    Route::post('/', [PageController::class, 'store'])->name('store');
    Route::get('/{page}/edit', [PageController::class, 'edit'])->name('edit');
    Route::put('/{page}', [PageController::class, 'update'])->name('update');
    Route::delete('/{page}', [PageController::class, 'destroy'])->name('destroy');
    Route::post('/{page}/toggle', [PageController::class, 'toggle'])->name('toggle');
});
