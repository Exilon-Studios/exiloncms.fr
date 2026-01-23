<?php

namespace ExilonCMS\Models;

use ExilonCMS\Models\Traits\Loggable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $resource_id
 * @property string $version
 * @property string $title
 * @property string|null $description
 * @property string $download_url
 * @property int $downloads
 * @property \Carbon\Carbon|null $published_at
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property \ExilonCMS\Models\Resource $resource
 */
class ResourceUpdate extends Model
{
    use HasFactory;
    use Loggable;

    /**
     * The actions to that should be automatically logged.
     *
     * @var array<int, string>
     */
    protected static array $logEvents = ['created', 'deleted'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'resource_id',
        'version',
        'title',
        'description',
        'download_url',
        'downloads',
        'published_at',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'resource_id' => 'int',
        'downloads' => 'int',
        'published_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the resource that owns the update.
     */
    public function resource(): BelongsTo
    {
        return $this->belongsTo(Resource::class);
    }

    /**
     * Scope to only include published updates.
     */
    public function scopePublished($query)
    {
        return $query->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    /**
     * Scope to order by version.
     */
    public function scopeOrderByVersion($query)
    {
        return $query->orderByDesc('version');
    }

    /**
     * Check if the update is published.
     */
    public function isPublished(): bool
    {
        return $this->published_at !== null && $this->published_at->isPast();
    }

    /**
     * Increment the download count.
     */
    public function incrementDownloads(): void
    {
        $this->increment('downloads');
    }

    /**
     * Publish the update.
     */
    public function publish(): void
    {
        $this->update(['published_at' => now()]);
    }
}
