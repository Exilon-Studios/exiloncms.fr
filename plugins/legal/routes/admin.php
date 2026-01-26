<?php

use Illuminate\Support\Facades\Route;
use ExilonCMS\Plugins\Legal\Http\Controllers\Admin\LegalPageController;

Route::middleware(['auth', 'can:legal.manage'])->group(function () {
    Route::get('/', [LegalPageController::class, 'index'])->name('index');
    Route::get('/{page}/edit', [LegalPageController::class, 'edit'])->name('edit');
    Route::put('/{page}', [LegalPageController::class, 'update'])->name('update');
    Route::post('/create-default', [LegalPageController::class, 'createDefault'])->name('create-default');
});
