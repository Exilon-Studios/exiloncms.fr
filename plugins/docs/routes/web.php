<?php

use Illuminate\Support\Facades\Route;

Route::prefix('docs')->group(function () {
    Route::get('/', function () {
        return redirect()->route('docs.show', ['slug' => 'introduction']);
    })->name('docs.index');

    Route::get('/{slug}', function ($slug) {
        return inertia('Docs/Show', [
            'slug' => $slug,
        ]);
    })->name('docs.show');

    Route::get('/category/{slug}', function ($slug) {
        return inertia('Docs/Category', [
            'slug' => $slug,
        ]);
    })->name('docs.category');
});
