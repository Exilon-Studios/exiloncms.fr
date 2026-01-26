<?php

namespace ExilonCMS\Policies;

use ExilonCMS\Models\User;
use ExilonCMS\Plugins\Blog\Models\Comment;
use Illuminate\Auth\Access\HandlesAuthorization;

class CommentPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can create comments.
     */
    public function create(User $user): bool
    {
        return $user->can('comments.create');
    }

    /**
     * Determine whether the user can delete the comment.
     */
    public function delete(User $user, Comment $comment): bool
    {
        return $user->is($comment->user) || $user->can('comments.delete.other');
    }
}
