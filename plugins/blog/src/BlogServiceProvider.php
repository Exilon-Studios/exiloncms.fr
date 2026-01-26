<?php

namespace ExilonCMS\Plugins\Blog;

use ExilonCMS\Models\Permission;
use Illuminate\Support\ServiceProvider;

class BlogServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Load routes
        $this->loadRoutesFrom(__DIR__.'/../routes/web.php');
        $this->loadRoutesFrom(__DIR__.'/../routes/admin.php');

        // Load views
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'blog');

        // Load migrations
        $this->loadMigrationsFrom(__DIR__.'/../database/migrations');

        // Publish assets
        $this->publishes([
            __DIR__.'/../resources/js' => resource_path('js/plugins/blog'),
        ], 'blog-assets');

        // Register permissions
        Permission::registerPermissions([
            'blog.posts.create' => 'Create blog posts',
            'blog.posts.edit' => 'Edit blog posts',
            'blog.posts.delete' => 'Delete blog posts',
            'blog.categories.manage' => 'Manage blog categories',
            'blog.tags.manage' => 'Manage blog tags',
            'blog.comments.moderate' => 'Moderate blog comments',
        ]);

        // Merge configuration
        $this->mergeConfigFrom(__DIR__.'/../config/blog.php', 'blog');
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Get the services provided by the provider.
     *
     * @return array<int, string>
     */
    public function provides(): array
    {
        return [];
    }
}
