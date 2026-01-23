<?php

namespace ExilonCMS\Models;

use ExilonCMS\Models\Traits\Loggable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $resource_id
 * @property int $user_id
 * @property int $rating
 * @property string|null $comment
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property \ExilonCMS\Models\Resource $resource
 * @property \ExilonCMS\Models\User $user
 */
class ResourceReview extends Model
{
    use HasFactory;
    use Loggable;

    /**
     * The actions to that should be automatically logged.
     *
     * @var array<int, string>
     */
    protected static array $logEvents = ['created', 'updated', 'deleted'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'resource_id',
        'user_id',
        'rating',
        'comment',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'rating' => 'int',
        'resource_id' => 'int',
        'user_id' => 'int',
    ];

    protected static function booted(): void
    {
        static::created(function (self $review) {
            $review->resource->recalculateRating();
        });

        static::updated(function (self $review) {
            $review->resource->recalculateRating();
        });

        static::deleted(function (self $review) {
            $review->resource->recalculateRating();
        });
    }

    /**
     * Get the resource that owns the review.
     */
    public function resource(): BelongsTo
    {
        return $this->belongsTo(Resource::class);
    }

    /**
     * Get the user that owns the review.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope to order by rating.
     */
    public function scopeOrderByRating($query)
    {
        return $query->orderByDesc('rating');
    }
}
