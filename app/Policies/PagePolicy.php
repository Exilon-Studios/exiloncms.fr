<?php

namespace ExilonCMS\Policies;

use ExilonCMS\Models\User;
use ExilonCMS\Plugins\Pages\Models\Page;
use Illuminate\Auth\Access\HandlesAuthorization;

class PagePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the page.
     */
    public function view(?User $user, Page $page): bool
    {
        abort_if(! $page->is_enabled, 404);

        if ($page->isRestricted()) {
            return $user !== null && $page->roles->contains($user->role);
        }

        return true;
    }
}
