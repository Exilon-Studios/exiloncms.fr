<?php

namespace ExilonCMS\Plugins\Legal\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $type
 * @property string $locale
 * @property string $title
 * @property string $content
 * @property bool $is_enabled
 * @property string $last_modified_by
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class LegalPage extends Model
{
    const TYPE_PRIVACY = 'privacy';
    const TYPE_TERMS = 'terms';
    const TYPE_COOKIES = 'cookies';
    const TYPE_REFUND = 'refund';

    protected $fillable = [
        'type',
        'locale',
        'title',
        'content',
        'is_enabled',
        'last_modified_by',
    ];

    protected $casts = [
        'is_enabled' => 'boolean',
    ];

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopeForLocale($query, string $locale)
    {
        return $query->where('locale', $locale);
    }

    public function scopeEnabled($query)
    {
        return $query->where('is_enabled', true);
    }

    public function getUrlAttribute(): string
    {
        return route('legal.show', $this->type);
    }

    public function getTypeLabelAttribute(): string
    {
        return match ($this->type) {
            self::TYPE_PRIVACY => 'Privacy Policy',
            self::TYPE_TERMS => 'Terms of Service',
            self::TYPE_COOKIES => 'Cookie Policy',
            self::TYPE_REFUND => 'Refund Policy',
            default => 'Unknown',
        };
    }
}
