<?php

use ExilonCMS\Http\Controllers\Admin\ActionLogController;
use ExilonCMS\Http\Controllers\Admin\AdminController;
use ExilonCMS\Http\Controllers\Admin\BanController;
use ExilonCMS\Http\Controllers\Admin\CompanySettingsController;
use ExilonCMS\Http\Controllers\Admin\DatabaseManagerController;
use ExilonCMS\Http\Controllers\Admin\ExtensionUpdateController;
use ExilonCMS\Http\Controllers\Admin\ImageController;
use ExilonCMS\Http\Controllers\Admin\IntegrationsController;
use ExilonCMS\Http\Controllers\Admin\LanguageController;
// Core Page and Post controllers removed - replaced by plugins
use ExilonCMS\Http\Controllers\Admin\MarketplaceController;
use ExilonCMS\Http\Controllers\Admin\NavbarController;
use ExilonCMS\Http\Controllers\Admin\NotificationManagerController;
use ExilonCMS\Http\Controllers\Admin\OnboardingController;
use ExilonCMS\Http\Controllers\Admin\PluginController;
use ExilonCMS\Http\Controllers\Admin\RedirectController;
use ExilonCMS\Http\Controllers\Admin\ResourceController;
use ExilonCMS\Http\Controllers\Admin\ResourceInstallController;
use ExilonCMS\Http\Controllers\Admin\RoleController;
// Translation controller removed - replaced by Translations plugin
use ExilonCMS\Http\Controllers\Admin\ServerController;
use ExilonCMS\Http\Controllers\Admin\SettingsController;
use ExilonCMS\Http\Controllers\Admin\SocialLinkController;
use ExilonCMS\Http\Controllers\Admin\ThemeController;
// LegalPage controller removed - replaced by Legal plugin
use ExilonCMS\Http\Controllers\Admin\ThemeSettingsController;
use ExilonCMS\Http\Controllers\Admin\UpdateController;
use ExilonCMS\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', [AdminController::class, 'index'])->name('dashboard');

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
    Route::post('/{plugin}/toggle', [PluginController::class, 'toggle'])->name('toggle');
    Route::get('/{plugin}/config', [PluginController::class, 'config'])->name('config');
    Route::delete('/{plugin}', [PluginController::class, 'destroy'])->name('destroy');
});

// ============================================================
// MARKETPLACE SSO INTEGRATION
// ============================================================
Route::prefix('marketplace')->name('marketplace.')->middleware('can:admin.settings')->group(function () {
    Route::get('/', [MarketplaceController::class, 'index'])->name('index');
    Route::post('/connect', [MarketplaceController::class, 'connect'])->name('connect');
    Route::post('/disconnect', [MarketplaceController::class, 'disconnect'])->name('disconnect');
    Route::get('/install/{itemId}', [MarketplaceController::class, 'install'])->name('install');
    Route::post('/sync', [MarketplaceController::class, 'sync'])->name('sync');
});

Route::prefix('settings')->name('settings.')->middleware('can:admin.settings')->group(function () {
    Route::get('/', [SettingsController::class, 'index'])->name('index');
    Route::post('/update', [SettingsController::class, 'update'])->name('update');

    // Separate pages for each setting category
    Route::get('/general', [SettingsController::class, 'general'])->name('general');
    Route::post('/general/update', [SettingsController::class, 'updateGeneral'])->name('general.update');

    Route::get('/company', [CompanySettingsController::class, 'get'])->name('company');
    Route::post('/company/update', [CompanySettingsController::class, 'update'])->name('company.update');
    Route::get('/company/api', [CompanySettingsController::class, 'api'])->name('company.api');

    // Legal pages routes removed - replaced by Legal plugin

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

    // Extension updates
    Route::prefix('extensions')->name('extensions.')->group(function () {
        Route::get('/', [ExtensionUpdateController::class, 'index'])->name('index');
        Route::post('/check', [ExtensionUpdateController::class, 'check'])->name('check');
        Route::post('/notify', [ExtensionUpdateController::class, 'sendNotification'])->name('notify');
    });
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

// Pages and Posts routes removed - replaced by Pages and Blog plugins
Route::resource('images', ImageController::class)->except('show')->middleware('can:admin.images');
Route::resource('redirects', RedirectController::class)->except('show')->middleware('can:admin.redirects');

// Page and Post attachment routes removed - replaced by plugins
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

// Translations routes removed - replaced by Translations plugin

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
// RESOURCES / MARKETPLACE ADMIN ROUTES
// ============================================================
Route::prefix('resources')->name('resources.')->group(function () {
    // Pending resources (moderation)
    Route::get('/pending', [ResourceController::class, 'pending'])->name('pending')->middleware('can:admin.resources.moderate');
    Route::post('/{resource}/approve', [ResourceController::class, 'approve'])->name('approve')->middleware('can:admin.resources.moderate');
    Route::post('/{resource}/reject', [ResourceController::class, 'reject'])->name('reject')->middleware('can:admin.resources.moderate');
    Route::post('/{resource}/archive', [ResourceController::class, 'archive'])->name('archive')->middleware('can:admin.resources.moderate');

    // Seller management
    Route::get('/sellers', [ResourceController::class, 'sellerRequests'])->name('sellers')->middleware('can:admin.resources.moderate');
    Route::post('/sellers/{user}/verify', [ResourceController::class, 'verifySeller'])->name('sellers.verify')->middleware('can:admin.resources.moderate');
    Route::post('/sellers/{user}/revoke', [ResourceController::class, 'revokeSeller'])->name('sellers.revoke')->middleware('can:admin.resources.moderate');
    Route::delete('/sellers/{user}', [ResourceController::class, 'removeSeller'])->name('sellers.remove')->middleware('can:admin.resources.moderate');

    // All resources management
    Route::get('/', [ResourceController::class, 'index'])->name('index')->middleware('can:admin.resources.view');
    Route::get('/{resource}', [ResourceController::class, 'show'])->name('show')->middleware('can:admin.resources.view');
    Route::post('/{resource}/stats', [ResourceController::class, 'updateStats'])->name('stats')->middleware('can:admin.resources.edit');

    // Marketplace settings
    Route::get('/settings', [ResourceController::class, 'settings'])->name('settings')->middleware('can:admin.resources.settings');
    Route::post('/settings', [ResourceController::class, 'updateSettings'])->name('settings.update')->middleware('can:admin.resources.settings');

    // External resources installation from API
    Route::prefix('external')->name('external.')->group(function () {
        Route::get('/install', [ResourceInstallController::class, 'index'])->name('install')->middleware('can:admin.resources.settings');
        Route::post('/install/{resourceId}', [ResourceInstallController::class, 'install'])->name('install.resource')->middleware('can:admin.resources.settings');
        Route::post('/sync', [ResourceInstallController::class, 'sync'])->name('sync')->middleware('can:admin.resources.settings');
    });
});

Route::fallback([AdminController::class, 'fallback']);
