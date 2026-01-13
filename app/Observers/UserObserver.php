<?php

namespace ExilonCMS\Observers;

use ExilonCMS\Models\User;
use ExilonCMS\Services\NotificationService;

/**
 * User Observer
 *
 * Handles automatic notifications when users are created or modified
 */
class UserObserver
{
    protected NotificationService $notification;

    public function __construct(NotificationService $notification)
    {
        $this->notification = $notification;
    }

    /**
     * Handle the User "created" event.
     */
    public function created(User $user): void
    {
        // Skip if this is the first user (during installation)
        if ($user->id === 1) {
            return;
        }

        // Skip if created during seeders (check if running in console)
        if (app()->runningInConsole()) {
            return;
        }

        // Notify admins about new user
        $this->notification->newUserRegistered($user);
    }

    /**
     * Handle the User "deleted" event.
     */
    public function deleted(User $user): void
    {
        // Notify admins about user deletion
        // Note: User model already handles this via ActionLog
    }
}
