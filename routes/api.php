<?php

use ExilonCMS\Http\Controllers\Api\AuthController;
use ExilonCMS\Http\Controllers\Api\DocumentationController;
use ExilonCMS\Http\Controllers\Api\ExilonLinkController;
use ExilonCMS\Http\Controllers\Api\FeedController;
use ExilonCMS\Http\Controllers\Api\PostController;
use ExilonCMS\Http\Controllers\Api\PublicResourceController;
use ExilonCMS\Http\Controllers\Api\ServerController;
use Illuminate\Support\Facades\Route;

Route::name('api.')->group(function () {
    Route::apiResource('posts', PostController::class)->only(['index', 'show']);
    Route::apiResource('servers', ServerController::class)->only(['index']);

    // Public resources API routes (for external installations)
    Route::prefix('resources')->name('resources.')->group(function () {
        Route::get('/', [PublicResourceController::class, 'index'])->name('index');
        Route::get('/stats', [PublicResourceController::class, 'stats'])->name('stats');
        Route::get('/tag/{tag}', [PublicResourceController::class, 'searchByTag'])->name('tag');
        Route::get('/{id}', [PublicResourceController::class, 'show'])->name('show');
    });
});

Route::prefix('/auth')->name('auth.')->group(function () {
    Route::post('/authenticate', [AuthController::class, 'authenticate'])->name('authenticate');
    Route::post('/verify', [AuthController::class, 'verify'])->name('verify');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});

/*
|--------------------------------------------------------------------------
| ExilonLink API Routes (v1)
|--------------------------------------------------------------------------
| These routes handle communication between the CMS and ExilonLink server plugins.
| Authentication is done via API key in X-ExilonLink-Key header.
*/
Route::prefix('v1/exilonlink')->group(function () {
    // Server information (requires API key)
    Route::get('/server', [ExilonLinkController::class, 'server']);

    // Player information
    Route::get('/players', [ExilonLinkController::class, 'players']);
    Route::get('/players/{uuid}', [ExilonLinkController::class, 'player']);
    Route::post('/players/{uuid}/command', [ExilonLinkController::class, 'playerCommand']);

    // Server commands
    Route::post('/command', [ExilonLinkController::class, 'command']);

    // Sync player data from server
    Route::post('/sync', [ExilonLinkController::class, 'sync']);

    // Get pending command queue
    Route::post('/queue', [ExilonLinkController::class, 'queue']);

    // Register a new server (first setup)
    Route::post('/register', [ExilonLinkController::class, 'register']);
});

// Legacy AzLink routes (deprecated - use v1/exilonlink instead)
Route::prefix('/azlink')->middleware('server.token')->group(function () {
    Route::get('/', [ServerController::class, 'status'])->name('azlink');
    Route::post('/', [ServerController::class, 'fetch']);
    Route::get('/user/{user}', [ServerController::class, 'user']);
    Route::post('/user/{user}/money/add', [ServerController::class, 'addMoney']);
    Route::post('/user/{user}/money/remove', [ServerController::class, 'removeMoney']);
    Route::post('/user/{user}/money/set', [ServerController::class, 'setMoney']);
    Route::post('/register', [ServerController::class, 'register']);
    Route::post('/email', [ServerController::class, 'updateEmail']);
    Route::post('/password', [ServerController::class, 'updatePassword']);
});

Route::get('/rss', [FeedController::class, 'rss'])->name('feeds.rss');
Route::get('/atom', [FeedController::class, 'atom'])->name('feeds.atom');

// Documentation API routes
Route::prefix('docs')->name('docs.')->group(function () {
    Route::get('/{locale}/tree', [DocumentationController::class, 'fileTree'])->name('tree');
});
