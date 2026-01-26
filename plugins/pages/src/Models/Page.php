<?php

namespace ExilonCMS\Plugins\Pages\Models;

use ExilonCMS\Models\Traits\Attachable;
use ExilonCMS\Models\Traits\Loggable;
use ExilonCMS\Models\User;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property string $content
 * @property string|null $excerpt
 * @property bool $is_enabled
 * @property int $user_id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property \Illuminate\Support\Collection|\ExilonCMS\Models\Role[] $roles
 */
class Page extends Model
{
    use Attachable;
    use Loggable;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'excerpt',
        'is_enabled',
        'user_id',
    ];

    protected $casts = [
        'is_enabled' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function roles()
    {
        return $this->belongsToMany('ExilonCMS\Models\Role', 'page_roles', 'page_id', 'role_id');
    }

    public function scopeEnabled($query)
    {
        return $query->where('is_enabled', true);
    }

    public function getUrlAttribute(): string
    {
        return route('pages.show', $this->slug);
    }
}
