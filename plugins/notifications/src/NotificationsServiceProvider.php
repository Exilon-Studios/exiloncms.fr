<?php

namespace ExilonCMS\Plugins\Notifications;

use ExilonCMS\Models\Permission;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class NotificationsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton('notification', function () {
            return new \ExilonCMS\Plugins\Notifications\Services\NotificationService();
        });
    }

    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__.'/../routes/web.php');
        $this->loadRoutesFrom(__DIR__.'/../routes/admin.php');
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'notifications');
        $this->loadMigrationsFrom(__DIR__.'/../database/migrations');

        if ($this->app->runningInConsole()) {
            $this->commands([
                \ExilonCMS\Plugins\Notifications\Console\SendPendingNotifications::class,
            ]);
        }

        Permission::registerPermissions([
            'notifications.manage' => 'Manage notification channels and logs',
            'notifications.templates.manage' => 'Manage notification templates',
            'notifications.send' => 'Send notifications to users',
        ]);

        Route::bind('notificationChannel', function ($value) {
            return \ExilonCMS\Plugins\Notifications\Models\NotificationChannel::findOrFail($value);
        });

        Route::bind('notificationTemplate', function ($value) {
            return \ExilonCMS\Plugins\Notifications\Models\NotificationTemplate::findOrFail($value);
        });
    }
}
