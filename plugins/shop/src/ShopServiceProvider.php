<?php

namespace ExilonCMS\Plugins\Shop;

use Illuminate\Support\ServiceProvider;

class ShopServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        $this->loadMigrationsFrom(__DIR__.'/database/migrations');

        $this->loadViewsFrom(__DIR__.'/resources/views', 'shop');

        $this->publishes([
            __DIR__.'/config/config.php' => config_path('shop.php'),
        ], 'shop-config');
    }
}
