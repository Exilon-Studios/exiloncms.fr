<?php

namespace MCCMS\Models;

use MCCMS\Models\Traits\HasUser;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $post_id
 * @property int $author_id
 * @property \Carbon\Carbon $created_at
 * @property \MCCMS\Models\Post $post
 * @property \MCCMS\Models\User $author
 */
class Like extends Model
{
    use HasFactory;
    use HasUser;

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The user key associated with this model.
     */
    protected string $userKey = 'author_id';

    /**
     * Get the post of this like.
     */
    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    /**
     * Get the author of this like.
     */
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
