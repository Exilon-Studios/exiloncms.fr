<?php

namespace ExilonCMS\Providers;

use ExilonCMS\Extensions\ExtensionFileLoader;
use ExilonCMS\Models\Page;
use ExilonCMS\Models\Post;
use ExilonCMS\Models\User;
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
        Gate::define('admin.settings', [User::class, 'canAdminSettings']);
        Gate::define('admin.translations', [User::class, 'canAdminTranslations']);
        Gate::define('admin.languages', [User::class, 'canAdminLanguages']);
        Gate::define('admin.users', [User::class, 'canAdminUsers']);
        Gate::define('admin.roles', [User::class, 'canAdminRoles']);
        Gate::define('admin.pages', [User::class, 'canAdminPages']);
        Gate::define('admin.posts', [User::class, 'canAdminPosts']);
        Gate::define('admin.servers', [User::class, 'canAdminServers']);
        Gate::define('admin.bans', [User::class, 'canAdminBans']);
        Gate::define('admin.plugins', [User::class, 'canAdminPlugins']);
        Gate::define('admin.themes', [User::class, 'canAdminThemes']);
        Gate::define('admin.navbar', [User::class, 'canAdminNavbar']);
        Gate::define('admin.socials', [User::class, 'canAdminSocials']);
        Gate::define('admin.images', [User::class, 'canAdminImages']);
        Gate::define('admin.logs', [User::class, 'canAdminLogs']);

        // Notifications
        Notification::extend('alert', function ($app) {
            return new AlertNotificationChannel();
        });
    }
}
