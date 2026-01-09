<?php

use ExilonCMS\Http\Controllers\Auth\LoginController;
use ExilonCMS\Http\Controllers\DashboardController;
use ExilonCMS\Http\Controllers\FallbackController;
use ExilonCMS\Http\Controllers\HomeController;
use ExilonCMS\Http\Controllers\InstallController;
use ExilonCMS\Http\Controllers\NotificationController;
use ExilonCMS\Http\Controllers\PostCommentController;
use ExilonCMS\Http\Controllers\PostController;
use ExilonCMS\Http\Controllers\PostLikeController;
use ExilonCMS\Http\Controllers\ProfileController;
use ExilonCMS\Http\Controllers\UserController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

// ============================================================
// INSTALLER ROUTES (Must be before auth middleware)
// ============================================================
Route::middleware(['web'])->group(function () {
    Route::get('/install', [InstallController::class, 'showWelcomeWeb'])->name('install.welcome');
    Route::get('/install/requirements', [InstallController::class, 'showRequirementsWeb'])->name('install.requirements');
    Route::post('/install/requirements', [InstallController::class, 'checkRequirementsWeb'])->name('install.requirements.check');
    Route::get('/install/database', [InstallController::class, 'showDatabaseWeb'])->name('install.database');
    Route::post('/install/database', [InstallController::class, 'configureDatabaseWeb'])->name('install.database.save');
    Route::get('/install/admin', [InstallController::class, 'showAdminWeb'])->name('install.admin');
    Route::post('/install/admin', [InstallController::class, 'createAdminWeb'])->name('install.admin.save');
    Route::get('/install/complete', [InstallController::class, 'showCompleteWeb'])->name('install.complete');
});

Route::get('/', [HomeController::class, 'index'])->name('home');

// User Dashboard (for non-admin users)
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware('auth')
    ->name('dashboard');

// Authentication Routes (Inertia)
use ExilonCMS\Http\Controllers\Auth\RegisterController;
Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

Route::middleware(['registration'])->group(function () {
    Route::get('/register', [RegisterController::class, 'showRegistrationForm'])->name('register');
    Route::post('/register', [RegisterController::class, 'register']);
});

Route::prefix('user')->group(function () {
    Route::middleware('throttle:oauth')->group(function () {
        Route::get('/login/callback', [LoginController::class, 'handleProviderCallback'])->name('login.callback');
    });

    Route::prefix('/2fa')->name('login.')->group(function () {
        Route::get('/', [LoginController::class, 'showCodeForm'])->name('2fa');
        Route::post('/', [LoginController::class, 'verifyCode'])->name('2fa-verify')->middleware('throttle:two-factor');
    });
});

// Password Confirmation Routes
Route::middleware('auth')->group(function () {
    Route::get('/user/confirm-password', [LoginController::class, 'showConfirmPasswordForm'])->name('password.confirm');
    Route::post('/user/confirm-password', [LoginController::class, 'confirmPassword']);
});

Route::prefix('users')->name('users.')->middleware('auth')->group(function () {
    Route::get('/search', [UserController::class, 'search'])->name('search');
});

Route::post('/profile/theme', [ProfileController::class, 'theme'])->name('profile.theme');

Route::prefix('profile')->name('profile.')->middleware('auth')->group(function () {
    Route::get('/', [ProfileController::class, 'index'])->name('index');

    Route::post('/email', [ProfileController::class, 'updateEmail'])->name('email');
    Route::post('/password', [ProfileController::class, 'updatePassword'])->name('password');
    Route::post('/name', [ProfileController::class, 'updateName'])->name('name');
    Route::post('/avatar', [ProfileController::class, 'uploadAvatar'])->name('avatar');
    Route::delete('/avatar', [ProfileController::class, 'deleteAvatar'])->name('avatar.delete');

    Route::prefix('discord')->name('discord.')->group(function () {
        Route::get('/link', [ProfileController::class, 'linkDiscord'])->name('link');
        Route::get('/callback', [ProfileController::class, 'discordCallback'])->name('callback');
        Route::post('/unlink', [ProfileController::class, 'unlinkDiscord'])->name('unlink');
    });

    Route::prefix('2fa')->name('2fa.')->group(function () {
        Route::get('/', [ProfileController::class, 'show2fa'])->name('index');
        Route::get('/codes', [ProfileController::class, 'download2faCodes'])->name('codes');

        Route::post('/enable', [ProfileController::class, 'enable2fa'])->name('enable');
        Route::post('/disable', [ProfileController::class, 'disable2fa'])->name('disable');
    });

    Route::prefix('delete')->name('delete.')->group(function () {
        Route::get('/', [ProfileController::class, 'showDelete'])->name('index');

        Route::post('/send', [ProfileController::class, 'sendDelete'])->name('send');
        Route::get('/confirm', [ProfileController::class, 'showDeleteConfirm'])->name('confirm')
            ->middleware('signed');
        Route::post('/confirm', [ProfileController::class, 'confirmDelete'])
            ->middleware('signed');
    });

    Route::post('/money/transfer', [ProfileController::class, 'transferMoney'])->name('transfer-money');
});

Route::prefix('notifications')->name('notifications.')->middleware('auth')->group(function () {
    Route::get('/', [NotificationController::class, 'index'])->name('index');
    Route::post('/{notification}/read', [NotificationController::class, 'markAsRead'])->name('read');
    Route::post('/read', [NotificationController::class, 'markAllAsRead'])->name('read.all');
});

// Posts routes (alias for /news)
Route::redirect('/posts', '/news', 301);
Route::get('/posts/{post:slug}', [PostController::class, 'show'])->name('posts.show');

Route::prefix('news')->name('posts.')->group(function () {
    Route::get('/', [PostController::class, 'index'])->name('index');
    Route::get('/{post:slug}', [PostController::class, 'show'])->name('show');

    Route::prefix('/{post}/like')->middleware('auth')->group(function () {
        Route::post('/', [PostLikeController::class, 'addLike'])->name('like');
        Route::delete('/', [PostLikeController::class, 'removeLike'])->name('dislike');
    });
});

Route::resource('posts.comments', PostCommentController::class)
    ->middleware(['auth', 'verified'])->only(['store', 'destroy']);

// Puck Editor routes
Route::middleware(['auth', 'puck.edit'])->prefix('edit')->name('puck.')->group(function () {
    Route::get('/', [HomeController::class, 'edit'])->name('index');
    Route::post('/save', [HomeController::class, 'saveEdit'])->name('save');
});

Route::get('/{path}', [FallbackController::class, 'get'])->where('path', '.*')->name('pages.show')->fallback();
