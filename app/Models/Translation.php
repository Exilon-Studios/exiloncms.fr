<?php

namespace MCCMS\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Translation extends Model
{
    use HasFactory;

    protected $fillable = [
        'group',
        'key',
        'locale',
        'value',
    ];

    /**
     * Get a translation by group, key and locale.
     */
    public static function get(string $group, string $key, string $locale, ?string $default = null): ?string
    {
        return static::query()
            ->where('group', $group)
            ->where('key', $key)
            ->where('locale', $locale)
            ->value('value') ?? $default;
    }

    /**
     * Set a translation.
     */
    public static function set(string $group, string $key, string $locale, string $value): void
    {
        static::query()->updateOrCreate(
            [
                'group' => $group,
                'key' => $key,
                'locale' => $locale,
            ],
            [
                'value' => $value,
            ]
        );
    }

    /**
     * Get all translations for a group.
     */
    public static function getGroup(string $group, string $locale): array
    {
        return static::query()
            ->where('group', $group)
            ->where('locale', $locale)
            ->pluck('value', 'key')
            ->toArray();
    }

    /**
     * Get all groups.
     */
    public static function getGroups(): array
    {
        return static::query()
            ->select('group')
            ->distinct()
            ->pluck('group')
            ->sort()
            ->toArray();
    }

    /**
     * Get all available locales.
     */
    public static function getLocales(): array
    {
        return static::query()
            ->select('locale')
            ->distinct()
            ->pluck('locale')
            ->sort()
            ->toArray();
    }
}
