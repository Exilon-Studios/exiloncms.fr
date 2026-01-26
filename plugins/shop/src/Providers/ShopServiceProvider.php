<?php

namespace ExilonCMS\Plugins\Shop\Providers;

use ExilonCMS\Extensions\Plugin\BasePluginServiceProvider;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;

class ShopServiceProvider extends BasePluginServiceProvider
{
    protected string $pluginId = 'shop';

    protected string $pluginPath = __DIR__.'/../../';

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        parent::boot();

        $this->loadPluginRoutes();
        $this->loadPluginMigrations();
        $this->loadPluginViews();
        $this->registerPaymentManager();
    }

    /**
     * Register plugin services.
     */
    public function register(): void
    {
        $this->app->singleton(\ExilonCMS\Plugins\Shop\Payment\PaymentManager::class);
    }

    /**
     * Register plugin routes.
     */
    protected function loadPluginRoutes(): void
    {
        // Public web routes
        $webRoutesFile = $this->pluginPath.'/routes/web.php';
        if (File::exists($webRoutesFile)) {
            Route::middleware(['web', 'auth'])
                ->prefix('shop')
                ->group($webRoutesFile);
        }

        // Admin routes
        $adminRoutesFile = $this->pluginPath.'/routes/admin.php';
        if (File::exists($adminRoutesFile)) {
            Route::middleware(['web', 'auth', 'can:admin.access'])
                ->prefix('admin')
                ->group($adminRoutesFile);
        }

        // Payment webhook routes (no auth required)
        $webhookRoutesFile = $this->pluginPath.'/routes/webhook.php';
        if (File::exists($webhookRoutesFile)) {
            Route::middleware(['web'])
                ->prefix('shop/webhook')
                ->group($webhookRoutesFile);
        }
    }

    /**
     * Register plugin migrations.
     */
    protected function loadPluginMigrations(): void
    {
        $migrationsPath = $this->pluginPath.'/database/migrations';

        if (File::exists($migrationsPath) && $this->app->runningInConsole()) {
            $this->loadMigrationsFrom($migrationsPath);
        }
    }

    /**
     * Load plugin views.
     */
    protected function loadPluginViews(): void
    {
        $viewsPath = $this->pluginPath.'/resources/views';

        if (File::exists($viewsPath)) {
            $this->loadViewsFrom($viewsPath, 'shop');
        }
    }

    /**
     * Register payment manager and payment methods.
     */
    protected function registerPaymentManager(): void
    {
        $paymentManager = $this->app->make(\ExilonCMS\Plugins\Shop\Payment\PaymentManager::class);

        // Register built-in payment methods
        $paymentManager->registerPaymentMethod('tebex', \ExilonCMS\Plugins\Shop\Payment\Method\TebexMethod::class);
    }
}
