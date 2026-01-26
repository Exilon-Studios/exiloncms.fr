<?php

namespace ExilonCMS\Plugins\Releases\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReleaseChange extends Model
{
    use HasFactory;

    protected $fillable = [
        'release_id',
        'type',
        'category',
        'description',
        'order',
        'breaking',
    ];

    protected $casts = [
        'breaking' => 'boolean',
        'order' => 'integer',
    ];

    public function release(): BelongsTo
    {
        return $this->belongsTo(Release::class);
    }

    // Types: added, changed, deprecated, removed, fixed, security
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeBreaking($query)
    {
        return $query->where('breaking', true);
    }
}
