<?php

namespace ExilonCMS\Policies;

use ExilonCMS\Models\Role;
use ExilonCMS\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class RolePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can update the role.
     */
    public function update(User $user, Role $role): bool
    {
        // User can update roles with power >= their own power (higher number = lower priority)
        // Or if they are an admin
        return $user->role->power >= $role->power || $user->role->is_admin;
    }

    /**
     * Determine whether the user can delete the role.
     */
    public function delete(User $user, Role $role): bool
    {
        // User can delete roles with power >= their own power (higher number = lower priority)
        // Or if they are an admin
        return $user->role->power >= $role->power || $user->role->is_admin;
    }
}
