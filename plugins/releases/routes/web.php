<?php

use Illuminate\Support\Facades\Route;

Route::prefix('releases')->group(function () {
    Route::get('/', function () {
        return inertia('Releases/Index');
    })->name('releases.index');

    Route::get('/{version}', function ($version) {
        return inertia('Releases/Show', [
            'version' => $version,
        ]);
    })->name('releases.show');

    Route::get('/feed/rss', function () {
        // RSS feed for releases
        return response()->json(['message' => 'RSS feed coming soon']);
    })->name('releases.rss');
});
