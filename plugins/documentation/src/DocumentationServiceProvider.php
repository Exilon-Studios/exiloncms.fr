<?php

namespace ExilonCMS\Plugins\Documentation;

use ExilonCMS\Plugins\Documentation\Middleware\DocumentationEnabled;
use Illuminate\Support\ServiceProvider;

/**
 * Service Provider pour le plugin Documentation
 */
class DocumentationServiceProvider extends ServiceProvider
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
        // Enregistrer le middleware
        $router = $this->app['router'];
        $router->aliasMiddleware('documentation.enabled', DocumentationEnabled::class);
    }
}
