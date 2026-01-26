<?php

namespace ExilonCMS\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string $description
 * @property string $version
 * @property string $author
 * @property string $thumbnail
 * @property bool $is_active
 * @property bool $is_enabled
 * @property string $type
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Theme extends Model
{
    const TYPE_GAMING = 'gaming';
    const TYPE_BLOG = 'blog';
    const TYPE_ECOMMERCE = 'ecommerce';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'version',
        'author',
        'thumbnail',
        'is_active',
        'is_enabled',
        'type',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_enabled' => 'boolean',
    ];

    /**
     * Scope to get only enabled themes.
     */
    public function scopeEnabled($query)
    {
        return $query->where('is_enabled', true);
    }

    /**
     * Scope to get the active theme.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get the active theme.
     */
    public static function getActive(): ?self
    {
        return Cache::remember('active_theme', now()->addDay(), function () {
            return static::active()->enabled()->first();
        });
    }

    /**
     * Activate this theme and deactivate all others.
     */
    public function activate(): void
    {
        static::where('is_active', true)->update(['is_active' => false]);
        $this->update(['is_active' => true]);
        Cache::forget('active_theme');
    }

    /**
     * Deactivate this theme.
     */
    public function deactivate(): void
    {
        $this->update(['is_active' => false]);
        Cache::forget('active_theme');
    }

    /**
     * Get theme type label.
     */
    public function getTypeLabel(): string
    {
        return match ($this->type) {
            self::TYPE_GAMING => 'Gaming',
            self::TYPE_BLOG => 'Blog',
            self::TYPE_ECOMMERCE => 'E-commerce',
            default => 'Unknown',
        };
    }

    /**
     * Get the theme's CSS path.
     */
    public function getCssPath(): string
    {
        return "themes/{$this->slug}/assets/css/style.css";
    }

    /**
     * Get the theme's views path.
     */
    public function getViewsPath(): string
    {
        return resource_path("views/themes/{$this->slug}");
    }
}
