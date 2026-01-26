<?php

namespace ExilonCMS\Plugins\Docs\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DocumentCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'icon',
        'order',
        'color',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class, 'category_id')->ordered();
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order')->orderBy('name');
    }
}
