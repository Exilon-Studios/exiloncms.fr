<?php

namespace ExilonCMS\Plugins\Shop\Providers;

use ExilonCMS\Extensions\Plugin\BasePluginServiceProvider;
use ExilonCMS\Plugins\Shop\Http\Controllers\ShopController;
use Illuminate\Support\Facades\Route;

class ShopServiceProvider extends BasePluginServiceProvider
{
    public function register(): void
    {
        $configPath = plugin_path('shop/config/shop.php');

        // Only merge config if the file exists
        if (file_exists($configPath)) {
            $this->mergeConfigFrom($configPath, 'shop');
        }
    }

    public function boot(): void
    {
        $this->loadViews();
        $this->loadTranslations();
        $this->loadMigrations();
        $this->loadRoutes(); // Auto-load routes from routes/web.php

        // Admin routes for managing the shop
        $this->registerAdminRoutes(function () {
            Route::prefix('shop')
                ->group(function () {
                    Route::get('/', [ShopController::class, 'index'])->name('admin.shop.index');
                    Route::get('/create', [ShopController::class, 'create'])->name('admin.shop.create');
                    Route::post('/', [ShopController::class, 'store'])->name('admin.shop.store');
                    Route::get('/{shop}', [ShopController::class, 'edit'])->name('admin.shop.edit');
                    Route::put('/{shop}', [ShopController::class, 'update'])->name('admin.shop.update');
                    Route::delete('/{shop}', [ShopController::class, 'destroy'])->name('admin.shop.destroy');
                });
        });
    }
}
