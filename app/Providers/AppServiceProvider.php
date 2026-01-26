<?php

namespace ExilonCMS\Providers;

use ExilonCMS\Extensions\ExtensionFileLoader;
use ExilonCMS\Models\User;
use ExilonCMS\Plugins\Pages\Models\Page;
use ExilonCMS\Plugins\Blog\Models\Post;
use ExilonCMS\Notifications\AlertNotificationChannel;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Illuminate\Translation\Translator;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Override translator to use our own FileLoader for translating extensions
        $loader = new ExtensionFileLoader($this->app['files'], $this->app['path.lang']);
        $translator = new Translator($loader, $this->app['config']['app.locale']);
        $translator->setFallback($this->app['config']['app.fallback_locale']);

        $this->app->instance('translator', $translator);

        // Enforce MorphMap aliases
        Relation::enforceMorphMap([
            'user' => User::class,
            'page' => Page::class,
            'post' => Post::class,
        ]);

        // Only accept JSON for API resources
        JsonResource::withoutWrapping();
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Default string length for MySQL
        Schema::defaultStringLength(191);

        // Pagination
        Paginator::useBootstrap();

        // Gate::after(function ($user, $ability) {
        //     return $user->hasRole(Role::ADMIN_ROLE);
        // });

        // Gates
        Gate::define('admin.dashboard', fn (User $user) => true);
        Gate::define('admin.settings', fn (User $user) => $user->isAdmin());
        Gate::define('admin.translations', fn (User $user) => $user->isAdmin());
        Gate::define('admin.languages', fn (User $user) => $user->isAdmin());
        Gate::define('admin.users', fn (User $user) => $user->isAdmin());
        Gate::define('admin.roles', fn (User $user) => $user->isAdmin());
        Gate::define('admin.pages', fn (User $user) => $user->isAdmin());
        Gate::define('admin.posts', fn (User $user) => $user->isAdmin());
        Gate::define('admin.servers', fn (User $user) => $user->isAdmin());
        Gate::define('admin.bans', fn (User $user) => $user->isAdmin());
        Gate::define('admin.plugins', fn (User $user) => $user->isAdmin());
        Gate::define('admin.themes', fn (User $user) => $user->isAdmin());
        Gate::define('admin.navbar', fn (User $user) => $user->isAdmin());
        Gate::define('admin.socials', fn (User $user) => $user->isAdmin());
        Gate::define('admin.images', fn (User $user) => $user->isAdmin());
        Gate::define('admin.logs', fn (User $user) => $user->isAdmin());
        Gate::define('admin.update', fn (User $user) => $user->isAdmin());
        Gate::define('admin.redirects', fn (User $user) => $user->isAdmin());
        Gate::define('admin.resources.view', fn (User $user) => $user->isAdmin());
        Gate::define('admin.resources.moderate', fn (User $user) => $user->isAdmin());
        Gate::define('admin.resources.edit', fn (User $user) => $user->isAdmin());
        Gate::define('admin.resources.delete', fn (User $user) => $user->isAdmin());
        Gate::define('admin.resources.settings', fn (User $user) => $user->isAdmin());

        // Notifications
        Notification::extend('alert', function ($app) {
            return new AlertNotificationChannel();
        });
    }
}
