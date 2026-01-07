<?php

use ExilonCMS\Http\Controllers\Admin\ActionLogController;
use ExilonCMS\Http\Controllers\Admin\AdminController;
use ExilonCMS\Http\Controllers\Admin\BanController;
use ExilonCMS\Http\Controllers\Admin\ImageController;
use ExilonCMS\Http\Controllers\Admin\LanguageController;
use ExilonCMS\Http\Controllers\Admin\NavbarController;
use ExilonCMS\Http\Controllers\Admin\PageAttachmentController;
use ExilonCMS\Http\Controllers\Admin\PageController;
use ExilonCMS\Http\Controllers\Admin\PluginController;
use ExilonCMS\Http\Controllers\Admin\PostAttachmentController;
use ExilonCMS\Http\Controllers\Admin\PostController;
use ExilonCMS\Http\Controllers\Admin\RedirectController;
use ExilonCMS\Http\Controllers\Admin\RoleController;
use ExilonCMS\Http\Controllers\Admin\ServerController;
use ExilonCMS\Http\Controllers\Admin\SettingsController;
use ExilonCMS\Http\Controllers\Admin\SocialLinkController;
use ExilonCMS\Http\Controllers\Admin\ThemeController;
use ExilonCMS\Http\Controllers\Admin\ThemeSettingsController;
use ExilonCMS\Http\Controllers\Admin\TranslationController;
use ExilonCMS\Http\Controllers\Admin\UpdateController;
use ExilonCMS\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', [AdminController::class, 'index'])->name('dashboard');

Route::prefix('theme-settings')->name('theme-settings.')->middleware('can:admin.settings')->group(function () {
    Route::get('/', [ThemeSettingsController::class, 'index'])->name('index');
    Route::post('/update', [ThemeSettingsController::class, 'update'])->name('update');
});

Route::prefix('settings')->name('settings.')->middleware('can:admin.settings')->group(function () {
    Route::get('/', [SettingsController::class, 'index'])->name('index');
    Route::post('/update', [SettingsController::class, 'update'])->name('update');

    // Separate pages for each setting category
    Route::get('/general', [SettingsController::class, 'general'])->name('general');
    Route::post('/general/update', [SettingsController::class, 'updateGeneral'])->name('general.update');

    Route::get('/security', [SettingsController::class, 'security'])->name('security');
    Route::post('/security/update', [SettingsController::class, 'updateSecurity'])->name('security.update');

    Route::post('/cache/clear', [SettingsController::class, 'clearCache'])->name('cache.clear');
    Route::post('/cache/optimize', [SettingsController::class, 'optimizeCache'])->name('cache.optimize');
    Route::post('/cache/advanced/enable', [SettingsController::class, 'enableAdvancedCache'])->name('cache.advanced.enable');
    Route::post('/cache/advanced/clear', [SettingsController::class, 'disableAdvancedCache'])->name('cache.advanced.clear');

    Route::get('/performance', [SettingsController::class, 'performance'])->name('performance');
    Route::post('/performance/update', [SettingsController::class, 'updatePerformance'])->name('performance.update');
    Route::get('/storage/link', [SettingsController::class, 'linkStorage'])->name('link-storage');
    Route::get('/migrate', [SettingsController::class, 'migrate'])->name('migrate');

    Route::get('/home', [SettingsController::class, 'home'])->name('home');
    Route::post('/home/update', [SettingsController::class, 'updateSeo'])->name('home.update');

    Route::get('/auth', [SettingsController::class, 'auth'])->name('auth');
    Route::post('/auth/update', [SettingsController::class, 'updateAuth'])->name('auth.update');

    Route::get('/mail', [SettingsController::class, 'mail'])->name('mail');
    Route::post('/mail/update', [SettingsController::class, 'updateMail'])->name('mail.update');
    Route::post('/mail/test', [SettingsController::class, 'sendTestMail'])->name('mail.send');

    Route::get('/maintenance', [SettingsController::class, 'maintenance'])->name('maintenance');
    Route::post('/maintenance/update', [SettingsController::class, 'updateMaintenance'])->name('maintenance.update');
});

Route::prefix('users')->name('users.')->middleware('can:admin.users')->group(function () {
    Route::post('/{user}/verify', [UserController::class, 'verifyEmail'])->name('verify');
    Route::post('/{user}/2fa', [UserController::class, 'disable2fa'])->name('2fa');
    Route::post('/{user}/password/force', [UserController::class, 'forcePasswordChange'])->name('force-password');
    Route::post('/{user}/discord/unlink', [UserController::class, 'unlinkDiscord'])->name('discord.unlink');
});

Route::prefix('themes')->name('themes.')->middleware('can:admin.themes')->group(function () {
    Route::get('/', [ThemeController::class, 'index'])->name('index');
    Route::post('/reload', [ThemeController::class, 'reload'])->name('reload');
    Route::post('/change/{theme?}', [ThemeController::class, 'changeTheme'])->name('change');
    Route::prefix('/{theme}/config')->group(function () {
        Route::get('/', [ThemeController::class, 'edit'])->name('edit');
        Route::post('/', [ThemeController::class, 'config'])->name('config');
    });
    Route::post('/{theme}/update', [ThemeController::class, 'update'])->name('update');
    Route::post('/{themeId}/download', [ThemeController::class, 'download'])->name('download');
    Route::delete('/{theme}', [ThemeController::class, 'delete'])->name('delete');
});

Route::prefix('plugins')->name('plugins.')->middleware('can:admin.plugins')->group(function () {
    Route::get('/', [PluginController::class, 'index'])->name('index');
    Route::post('/reload', [PluginController::class, 'reload'])->name('reload');
    Route::get('/{plugin}/config', [PluginController::class, 'config'])->name('config');
    Route::post('/{plugin}/config', [PluginController::class, 'updateConfig'])->name('config.update');
    Route::post('/{plugin}/enable', [PluginController::class, 'enable'])->name('enable');
    Route::post('/{plugin}/disable', [PluginController::class, 'disable'])->name('disable');
    Route::post('/{plugin}/update', [PluginController::class, 'update'])->name('update');
    Route::post('/{pluginId}/download', [PluginController::class, 'download'])->name('download');
    Route::delete('/{plugin}', [PluginController::class, 'delete'])->name('delete');
});

Route::prefix('updates')->name('update.')->middleware('can:admin.update')->group(function () {
    Route::get('/', [UpdateController::class, 'index'])->name('index');
    Route::get('/version', [UpdateController::class, 'version'])->name('version');
    Route::post('/fetch', [UpdateController::class, 'fetch'])->name('fetch');
    Route::post('/download', [UpdateController::class, 'download'])->name('download');
    Route::post('/install', [UpdateController::class, 'install'])->name('install');
});

Route::resource('navbar-elements', NavbarController::class)->except('show')->middleware('can:admin.navbar');
Route::post('/navbar-elements/order', [NavbarController::class, 'updateOrder'])->name('navbar-elements.update-order')->middleware('can:admin.navbar');

Route::resource('social-links', SocialLinkController::class)->except('show');
Route::post('/social-links/order', [SocialLinkController::class, 'updateOrder'])->name('social-links.update-order');

Route::resource('users', UserController::class)->except('show')->middleware(['can:admin.users', 'throttle:20,1']);
Route::post('/users/notify', [UserController::class, 'notify'])->name('users.notify.all')->middleware('can:admin.users');
Route::post('/users/{user}/notify', [UserController::class, 'notify'])->name('users.notify')->middleware('can:admin.users');
Route::resource('roles', RoleController::class)->except('show')->middleware('can:admin.roles');
Route::post('/roles/power', [RoleController::class, 'updatePower'])->name('roles.update-power')->middleware('can:admin.roles');
Route::post('/roles/settings', [RoleController::class, 'updateSettings'])->name('roles.settings')->middleware('can:admin.roles');

Route::resource('bans', BanController::class)->only('index')->middleware('can:admin.users');
Route::resource('users.bans', BanController::class)->only(['store', 'destroy'])->middleware('can:admin.users');

Route::resource('pages', PageController::class)->except('show')->middleware('can:admin.pages');
Route::get('pages/{page}/puck-editor', [PageController::class, 'puckEditor'])->name('pages.puck-editor')->middleware('can:admin.pages.puck-edit');
Route::resource('posts', PostController::class)->except('show')->middleware('can:admin.posts');
Route::resource('images', ImageController::class)->except('show')->middleware('can:admin.images');
Route::resource('redirects', RedirectController::class)->except('show')->middleware('can:admin.redirects');

Route::resource('pages.attachments', PageAttachmentController::class)->only('store');
Route::resource('posts.attachments', PostAttachmentController::class)->only('store');
Route::post('pages/attachments/{pendingId}', [PageAttachmentController::class, 'pending'])->name('pages.attachments.pending');
Route::post('posts/attachments/{pendingId}', [PostAttachmentController::class, 'pending'])->name('posts.attachments.pending');

Route::resource('servers', ServerController::class)->except('show');
Route::post('/servers/{server}/verify/azlink', [ServerController::class, 'verifyAzLink'])->name('servers.verify-azlink');
Route::post('/servers/default', [ServerController::class, 'changeDefault'])->name('servers.change-default');

Route::post('logs/clear', [ActionLogController::class, 'clear'])->name('logs.clear')->middleware('can:admin.logs');
Route::resource('logs', ActionLogController::class)->only(['index', 'show'])->middleware('can:admin.logs');

Route::prefix('languages')->name('languages.')->middleware('can:admin.settings')->group(function () {
    Route::get('/', function () {
        return redirect()->route('admin.translations.index');
    })->name('index');
    Route::post('/', [LanguageController::class, 'store'])->name('store');
    Route::get('/{locale}/edit', [LanguageController::class, 'edit'])->name('edit');
    Route::post('/{locale}/update', [LanguageController::class, 'update'])->name('update');
});

Route::prefix('translations')->name('translations.')->middleware('can:admin.settings')->group(function () {
    Route::get('/', [TranslationController::class, 'index'])->name('index');
    Route::post('/', [TranslationController::class, 'store'])->name('store');
    Route::post('/import', [TranslationController::class, 'import'])->name('import');
    Route::delete('/{group}/{key}/{locale}', [TranslationController::class, 'destroy'])->name('destroy');
});

Route::fallback([AdminController::class, 'fallback']);
