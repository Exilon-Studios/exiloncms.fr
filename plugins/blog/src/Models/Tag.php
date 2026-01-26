<?php

namespace ExilonCMS\Plugins\Blog\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'color',
    ];

    /**
     * Get the posts with this tag.
     */
    public function posts(): BelongsToMany
    {
        return $this->belongsToMany(Post::class, 'blog_post_tag')
            ->withTimestamps();
    }

    /**
     * Get the URL of the tag.
     */
    public function url(): string
    {
        return route('blog.tag', $this->slug);
    }

    /**
     * Scope to search tags.
     */
    public function scopeSearch($query, $term)
    {
        return $query->where('name', 'like', "%{$term}%");
    }
}
