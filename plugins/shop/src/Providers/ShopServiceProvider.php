<?php

namespace ShopPlugin\Providers;

use ExilonCMS\Extensions\Plugin\BasePluginServiceProvider;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;

class ShopServiceProvider extends BasePluginServiceProvider
{
    protected string $pluginId = 'shop';

    protected string $pluginPath = __DIR__ . '/../../';

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
        $this->app->singleton(\ShopPlugin\Payment\PaymentManager::class);
    }

    /**
     * Register plugin routes.
     */
    protected function loadPluginRoutes(): void
    {
        // Public web routes
        $webRoutesFile = $this->pluginPath . '/routes/web.php';
        if (File::exists($webRoutesFile)) {
            Route::middleware(['web', 'auth'])
                ->prefix('shop')
                ->group($webRoutesFile);
        }

        // Admin routes
        $adminRoutesFile = $this->pluginPath . '/routes/admin.php';
        if (File::exists($adminRoutesFile)) {
            Route::middleware(['web', 'auth', 'can:admin.access'])
                ->prefix('admin')
                ->group($adminRoutesFile);
        }

        // Payment webhook routes (no auth required)
        $webhookRoutesFile = $this->pluginPath . '/routes/webhook.php';
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
        $migrationsPath = $this->pluginPath . '/database/migrations';

        if (File::exists($migrationsPath) && $this->app->runningInConsole()) {
            $this->loadMigrationsFrom($migrationsPath);
        }
    }

    /**
     * Load plugin views.
     */
    protected function loadPluginViews(): void
    {
        $viewsPath = $this->pluginPath . '/resources/views';

        if (File::exists($viewsPath)) {
            $this->loadViewsFrom($viewsPath, 'shop');
        }
    }

    /**
     * Register payment manager and payment methods.
     */
    protected function registerPaymentManager(): void
    {
        $paymentManager = $this->app->make(\ShopPlugin\Payment\PaymentManager::class);

        // Register built-in payment methods
        $paymentManager->registerPaymentMethod('tebex', \ShopPlugin\Payment\Method\TebexMethod::class);
        $paymentManager->registerPaymentMethod('paypal', \ShopPlugin\Payment\Method\PayPalMethod::class);
        $paymentManager->registerPaymentMethod('stripe', \ShopPlugin\Payment\Method\StripeMethod::class);
    }
}
