<?php

namespace Themes\Saazy;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Blade;

class SaazyServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Load theme views
        $this->loadViewsFrom(__DIR__.'/resources/views', 'saazy');

        // Load theme translations
        $this->loadTranslationsFrom(__DIR__.'/resources/lang', 'saazy');

        // Load theme routes
        $this->loadRoutesFrom(__DIR__.'/routes/web.php');

        // Publish theme assets
        $this->publishes([
            __DIR__.'/resources/js' => public_path('themes/saazy/js'),
            __DIR__.'/resources/css' => public_path('themes/saazy/css'),
            __DIR__.'/resources/images' => public_path('themes/saazy/images'),
        ], 'saazy-assets');

        // Register theme components
        Blade::component('saazy::layouts.app', \Themes\Saazy\View\Components\AppLayout::class);
        Blade::component('saazy::components.hero', \Themes\Saazy\View\Components\Hero::class);
        Blade::component('saazy::components.features', \Themes\Saazy\View\Components\Features::class);
        Blade::component('saazy::components.testimonials', \Themes\Saazy\View\Components\Testimonials::class);
        Blade::component('saazy::components.faq', \Themes\Saazy\View\Components\Faq::class);
        Blade::component('saazy::components.cta', \Themes\Saazy\View\Components\Cta::class);
    }
}
