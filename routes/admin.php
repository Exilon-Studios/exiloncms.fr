<?php

use ExilonCMS\Http\Controllers\Admin\ActionLogController;
use ExilonCMS\Http\Controllers\Admin\AdminController;
use ExilonCMS\Http\Controllers\Admin\BanController;
use ExilonCMS\Http\Controllers\Admin\CompanySettingsController;
use ExilonCMS\Http\Controllers\Admin\DatabaseManagerController;
use ExilonCMS\Http\Controllers\Admin\Documentation\DocumentationController;
use ExilonCMS\Http\Controllers\Admin\IntegrationsController;
use ExilonCMS\Http\Controllers\Admin\LanguageController;
use ExilonCMS\Http\Controllers\Admin\NavbarController;
use ExilonCMS\Http\Controllers\Admin\NotificationManagerController;
use ExilonCMS\Http\Controllers\Admin\OnboardingController;
use ExilonCMS\Http\Controllers\Admin\DashboardWidgetController;
use ExilonCMS\Http\Controllers\Admin\PluginController;
use ExilonCMS\Http\Controllers\Admin\Plugins\PluginConfigController;
use ExilonCMS\Http\Controllers\Admin\Plugins\PluginImportController;
use ExilonCMS\Http\Controllers\Admin\RedirectController;
use ExilonCMS\Http\Controllers\Admin\RoleController;
use ExilonCMS\Http\Controllers\Admin\ServerController;
use ExilonCMS\Http\Controllers\Admin\SettingsController;
use ExilonCMS\Http\Controllers\Admin\SocialLinkController;
use ExilonCMS\Http\Controllers\Admin\ThemeController;
use ExilonCMS\Http\Controllers\Admin\ThemeSettingsController;
use ExilonCMS\Http\Controllers\Admin\UpdateController;
use ExilonCMS\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', [AdminController::class, 'index'])->name('dashboard');

// ============================================================
// DASHBOARD WIDGETS ROUTES
// ============================================================
Route::prefix('widgets')->name('widgets.')->middleware('can:admin.dashboard')->group(function () {
    Route::get('/', [DashboardWidgetController::class, 'index'])->name('index');
    Route::get('/position/{position}', [DashboardWidgetController::class, 'getByPosition'])->name('by-position');
    Route::get('/layout', [DashboardWidgetController::class, 'getUserLayout'])->name('layout');
    Route::post('/layout', [DashboardWidgetController::class, 'saveUserLayout'])->name('layout.save');
    Route::get('/{widgetId}', [DashboardWidgetController::class, 'show'])->name('show');
    Route::post('/cache/clear', [DashboardWidgetController::class, 'clearCache'])->name('cache.clear');
});

// ============================================================
// ONBOARDING ROUTES
// ============================================================
Route::prefix('onboarding')->name('onboarding.')->group(function () {
    Route::get('/', [OnboardingController::class, 'index'])->name('index');
    Route::post('/{step}', [OnboardingController::class, 'saveStep'])->name('save');
    Route::post('/{step}/skip', [OnboardingController::class, 'skipStep'])->name('skip');
    Route::post('/complete', [OnboardingController::class, 'complete'])->name('complete');
});

Route::prefix('theme-settings')->name('theme-settings.')->middleware('can:admin.settings')->group(function () {
    Route::get('/', [ThemeSettingsController::class, 'index'])->name('index');
    Route::post('/update', [ThemeSettingsController::class, 'update'])->name('update');
});

// ============================================================
// THEME MANAGEMENT ROUTES
// ============================================================
Route::prefix('themes')->name('themes.')->middleware('can:admin.settings')->group(function () {
    Route::get('/', [ThemeController::class, 'index'])->name('index');
    Route::post('/{themeId}/activate', [ThemeController::class, 'activate'])->name('activate');
    Route::post('/deactivate', [ThemeController::class, 'deactivate'])->name('deactivate');
    Route::post('/{themeId}/toggle', [ThemeController::class, 'toggleEnabled'])->name('toggle');
    Route::post('/{themeId}/publish', [ThemeController::class, 'publishAssets'])->name('publish');
    Route::get('/preview/{themeId}', [ThemeController::class, 'preview'])->name('preview');
    Route::get('/exit-preview', [ThemeController::class, 'exitPreview'])->name('exit-preview');
});

// ============================================================
// PLUGIN MANAGEMENT ROUTES
// ============================================================
Route::prefix('plugins')->name('plugins.')->middleware('can:admin.settings')->group(function () {
    Route::get('/', [PluginController::class, 'index'])->name('index');
    Route::get('/import', [PluginImportController::class, 'show'])->name('import.show');
    Route::post('/import', [PluginImportController::class, 'import'])->name('import');
    Route::get('/backups', [PluginImportController::class, 'listBackups'])->name('backups');
    Route::get('/backups/{filename}/download', [PluginImportController::class, 'downloadBackup'])->name('backups.download');
    Route::post('/{plugin}/toggle', [PluginController::class, 'toggle'])->name('toggle');
    Route::get('/{plugin}/config', [PluginConfigController::class, 'edit'])->name('config');
    Route::post('/{plugin}/config', [PluginConfigController::class, 'update'])->name('update');
    Route::delete('/{plugin}/config', [PluginConfigController::class, 'clear'])->name('config.clear');
    Route::delete('/{plugin}', [PluginImportController::class, 'destroy'])->name('destroy');
});

Route::prefix('settings')->name('settings.')->middleware('can:admin.settings')->group(function () {
    Route::get('/', [SettingsController::class, 'index'])->name('index');
    Route::post('/update', [SettingsController::class, 'update'])->name('update');

    Route::get('/general', [SettingsController::class, 'general'])->name('general');
    Route::post('/general/update', [SettingsController::class, 'updateGeneral'])->name('general.update');

    Route::get('/company', [CompanySettingsController::class, 'get'])->name('company');
    Route::post('/company/update', [CompanySettingsController::class, 'update'])->name('company.update');
    Route::get('/company/api', [CompanySettingsController::class, 'api'])->name('company.api');

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

    Route::get('/home', [SettingsController::class, 'home'])->name('settings.home');
    Route::post('/home/update', [SettingsController::class, 'updateSeo'])->name('settings.home.update');

    Route::get('/auth', [SettingsController::class, 'auth'])->name('auth');
    Route::post('/auth/update', [SettingsController::class, 'updateAuth'])->name('auth.update');

    Route::get('/mail', [SettingsController::class, 'mail'])->name('mail');
    Route::post('/mail/update', [SettingsController::class, 'updateMail'])->name('mail.update');
    Route::post('/mail/test', [SettingsController::class, 'sendTestMail'])->name('mail.send');

    Route::get('/integrations', [IntegrationsController::class, 'index'])->name('integrations');
    Route::post('/integrations/update', [IntegrationsController::class, 'update'])->name('integrations.update');
    Route::post('/integrations/test', [IntegrationsController::class, 'testWebhook'])->name('integrations.test');

    Route::get('/payments', [SettingsController::class, 'payments'])->name('payments');
    Route::post('/payments/update', [SettingsController::class, 'updatePayments'])->name('payments.update');

    Route::get('/maintenance', [SettingsController::class, 'maintenance'])->name('maintenance');
    Route::post('/maintenance/update', [SettingsController::class, 'updateMaintenance'])->name('maintenance.update');
});

Route::prefix('users')->name('users.')->middleware('can:admin.users')->group(function () {
    Route::post('/{user}/verify', [UserController::class, 'verifyEmail'])->name('verify');
    Route::post('/{user}/2fa', [UserController::class, 'disable2fa'])->name('2fa');
    Route::post('/{user}/password/force', [UserController::class, 'forcePasswordChange'])->name('force-password');
    Route::post('/{user}/discord/unlink', [UserController::class, 'unlinkDiscord'])->name('discord.unlink');
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

Route::resource('redirects', RedirectController::class)->except('show')->middleware('can:admin.redirects');

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

Route::prefix('notifications')->name('notifications.')->middleware('can:admin.users')->group(function () {
    Route::get('/', [NotificationManagerController::class, 'index'])->name('index');
    Route::get('/create', [NotificationManagerController::class, 'create'])->name('create');
    Route::post('/', [NotificationManagerController::class, 'store'])->name('store');
    Route::delete('/{notification}', [NotificationManagerController::class, 'destroy'])->name('destroy');
});

Route::prefix('database')->name('database.')->middleware('can:admin.settings')->group(function () {
    Route::get('/', [DatabaseManagerController::class, 'index'])->name('index');
    Route::get('/tables', [DatabaseManagerController::class, 'tables'])->name('tables');
    Route::post('/backup', [DatabaseManagerController::class, 'backup'])->name('backup');
    Route::get('/backup/{filename}', [DatabaseManagerController::class, 'download'])->name('download');
    Route::delete('/backup/{filename}', [DatabaseManagerController::class, 'deleteBackup'])->name('delete-backup');
    Route::post('/restore', [DatabaseManagerController::class, 'restore'])->name('restore');
    Route::get('/export', [DatabaseManagerController::class, 'export'])->name('export');
    Route::get('/export/sqlite', [DatabaseManagerController::class, 'exportSqlite'])->name('export.sqlite');
    Route::post('/import', [DatabaseManagerController::class, 'import'])->name('import');
    Route::post('/optimize', [DatabaseManagerController::class, 'optimize'])->name('optimize');
    Route::post('/truncate', [DatabaseManagerController::class, 'truncate'])->name('truncate');
});

// ============================================================
// DOCUMENTATION EDITOR ROUTES
// ============================================================
Route::prefix('editor')->name('editor.')->middleware('can:admin.settings')->group(function () {
    Route::get('/', [DocumentationController::class, 'editor'])->name('index');
    Route::get('/file/{locale}/{category}/{page}', [DocumentationController::class, 'editFile'])->name('file');
    Route::put('/file/{locale}/{category}/{page}', [DocumentationController::class, 'saveFile'])->name('save');
    Route::post('/file/{locale}/{category}/{page}', [DocumentationController::class, 'saveFile'])->name('save');
});

Route::fallback([AdminController::class, 'fallback']);
