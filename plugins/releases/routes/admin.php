<?php

use ExilonCMS\Plugins\Releases\Http\Controllers\Admin\ReleaseController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin/releases')
    ->middleware(['web', 'auth', 'admin'])
    ->group(function () {
        Route::name('admin.releases.')->group(function () {
            Route::get('/', [ReleaseController::class, 'index'])->name('index');
            Route::get('/create', [ReleaseController::class, 'create'])->name('create');
            Route::post('/', [ReleaseController::class, 'store'])->name('store');
            Route::get('/{release}', [ReleaseController::class, 'show'])->name('show');
            Route::get('/{release}/edit', [ReleaseController::class, 'edit'])->name('edit');
            Route::put('/{release}', [ReleaseController::class, 'update'])->name('update');
            Route::delete('/{release}', [ReleaseController::class, 'destroy'])->name('destroy');
        });
    });
