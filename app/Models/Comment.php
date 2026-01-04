<?php

namespace ExilonCMS\Models;

use ExilonCMS\Models\Traits\HasMarkdown;
use ExilonCMS\Models\Traits\HasUser;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\HtmlString;

/**
 * @property int $id
 * @property int $post_id
 * @property int $author_id
 * @property string $content
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property \ExilonCMS\Models\Post $post
 * @property \ExilonCMS\Models\User $author
 */
class Comment extends Model
{
    use HasFactory;
    use HasMarkdown;
    use HasUser;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'content',
    ];

    /**
     * The user key associated with this model.
     */
    protected string $userKey = 'author_id';

    /**
     * Get the post of this comment.
     */
    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    /**
     * Get the author of this comment.
     */
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function parseContent(): HtmlString
    {
        return $this->parseMarkdown('content', true);
    }
}
