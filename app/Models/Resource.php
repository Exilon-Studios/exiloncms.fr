<?php

namespace ExilonCMS\Models;

use ExilonCMS\Models\Traits\HasImage;
use ExilonCMS\Models\Traits\Loggable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property int $author_id
 * @property string $title
 * @property string $slug
 * @property string $description
 * @property string|null $content
 * @property string $type
 * @property string $status
 * @property string $pricing_type
 * @property float $price
 * @property string $currency
 * @property string $version
 * @property string|null $download_url
 * @property string|null $demo_url
 * @property string|null $repository_url
 * @property string|null $thumbnail
 * @property array|null $screenshots
 * @property array|null $tags
 * @property int $downloads
 * @property int $views
 * @property int $likes_count
 * @property float $rating
 * @property int $reviews_count
 * @property \Carbon\Carbon|null $approved_at
 * @property int|null $approved_by
 * @property string|null $rejection_reason
 * @property \Carbon\Carbon|null $published_at
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property \Carbon\Carbon|null $deleted_at
 * @property \ExilonCMS\Models\User $author
 * @property \ExilonCMS\Models\User|null $approvedBy
 * @property \Illuminate\Support\Collection|\ExilonCMS\Models\ResourceReview[] $reviews
 * @property \Illuminate\Support\Collection|\ExilonCMS\Models\ResourcePurchase[] $purchases
 * @property \Illuminate\Support\Collection|\ExilonCMS\Models\ResourceUpdate[] $updates
 */
class Resource extends Model
{
    use HasFactory;
    use HasImage;
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
        'title',
        'slug',
        'description',
        'content',
        'type',
        'status',
        'pricing_type',
        'price',
        'currency',
        'version',
        'download_url',
        'demo_url',
        'repository_url',
        'thumbnail',
        'screenshots',
        'tags',
        'downloads',
        'views',
        'likes_count',
        'rating',
        'reviews_count',
        'approved_at',
        'approved_by',
        'rejection_reason',
        'published_at',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'screenshots' => 'array',
        'tags' => 'array',
        'price' => 'float',
        'downloads' => 'int',
        'views' => 'int',
        'likes_count' => 'int',
        'rating' => 'float',
        'reviews_count' => 'int',
        'approved_at' => 'datetime',
        'published_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * The column of the image attribute.
     */
    protected string $imageKey = 'thumbnail';

    /**
     * The resource types.
     */
    public const TYPES = ['plugin', 'theme'];

    /**
     * The resource statuses.
     */
    public const STATUSES = ['pending', 'approved', 'rejected', 'archived'];

    /**
     * The pricing types.
     */
    public const PRICING_TYPES = ['free', 'paid'];

    protected static function booted(): void
    {
        static::creating(function (self $resource) {
            if ($resource->slug === null) {
                $resource->slug = Str::slug($resource->title);
            }

            // Auto-approve if author is verified seller
            if ($resource->author->isSellerVerified() && $resource->status === 'pending') {
                $resource->status = 'approved';
                $resource->approved_at = now();
                $resource->approved_by = $resource->author_id;
            }
        });

        static::updating(function (self $resource) {
            if ($resource->isDirty('title') && $resource->slug === null) {
                $resource->slug = Str::slug($resource->title);
            }
        });

        static::addGlobalScope('withAuthor', function ($query) {
            $query->with('author');
        });
    }

    /**
     * Get the author of this resource.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Get the admin who approved this resource.
     */
    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Get the reviews for this resource.
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(ResourceReview::class);
    }

    /**
     * Get the purchases for this resource.
     */
    public function purchases(): HasMany
    {
        return $this->hasMany(ResourcePurchase::class);
    }

    /**
     * Get the updates for this resource.
     */
    public function updates(): HasMany
    {
        return $this->hasMany(ResourceUpdate::class)->orderBy('published_at', 'desc');
    }

    /**
     * Scope to only include published resources.
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'approved')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    /**
     * Scope to only include plugins.
     */
    public function scopePlugins($query)
    {
        return $query->where('type', 'plugin');
    }

    /**
     * Scope to only include themes.
     */
    public function scopeThemes($query)
    {
        return $query->where('type', 'theme');
    }

    /**
     * Scope to only include free resources.
     */
    public function scopeFree($query)
    {
        return $query->where('pricing_type', 'free');
    }

    /**
     * Scope to only include paid resources.
     */
    public function scopePaid($query)
    {
        return $query->where('pricing_type', 'paid');
    }

    /**
     * Scope to filter by type.
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope to search resources.
     */
    public function scopeSearch($query, string $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%")
                ->orWhere('tags', 'like', "%{$search}%");
        });
    }

    /**
     * Scope to filter by tags.
     */
    public function scopeWithTags($query, array $tags)
    {
        return $query->where(function ($q) use ($tags) {
            foreach ($tags as $tag) {
                $q->orWhere('tags', 'like', "%{$tag}%");
            }
        });
    }

    /**
     * Scope to order by popularity.
     */
    public function scopeOrderByPopularity($query)
    {
        return $query->orderByDesc('downloads');
    }

    /**
     * Scope to order by rating.
     */
    public function scopeOrderByRating($query)
    {
        return $query->orderByDesc('rating');
    }

    /**
     * Scope to order by latest.
     */
    public function scopeOrderByLatest($query)
    {
        return $query->orderByDesc('created_at');
    }

    /**
     * Check if the resource is published.
     */
    public function isPublished(): bool
    {
        return $this->status === 'approved'
            && $this->published_at !== null
            && $this->published_at->isPast();
    }

    /**
     * Check if the resource is pending approval.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if the resource is approved.
     */
    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    /**
     * Check if the resource is rejected.
     */
    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    /**
     * Check if the resource is free.
     */
    public function isFree(): bool
    {
        return $this->pricing_type === 'free' || $this->price === 0;
    }

    /**
     * Check if a user has purchased this resource.
     */
    public function hasPurchased(?User $user): bool
    {
        if ($user === null) {
            return false;
        }

        if ($this->isFree()) {
            return true;
        }

        if ($this->author_id === $user->id) {
            return true;
        }

        return $this->purchases()
            ->where('buyer_id', $user->id)
            ->where('status', 'completed')
            ->exists();
    }

    /**
     * Check if a user can review this resource.
     */
    public function canBeReviewedBy(?User $user): bool
    {
        if ($user === null) {
            return false;
        }

        if ($this->author_id === $user->id) {
            return false;
        }

        return $this->hasPurchased($user) &&
            !$this->reviews()->where('user_id', $user->id)->exists();
    }

    /**
     * Increment the download count.
     */
    public function incrementDownloads(): void
    {
        $this->increment('downloads');
    }

    /**
     * Increment the view count.
     */
    public function incrementViews(): void
    {
        $this->increment('views');
    }

    /**
     * Recalculate the rating.
     */
    public function recalculateRating(): void
    {
        $avgRating = $this->reviews()->avg('rating');
        $reviewsCount = $this->reviews()->count();

        $this->update([
            'rating' => round($avgRating ?: 0, 1),
            'reviews_count' => $reviewsCount,
        ]);
    }

    /**
     * Approve the resource.
     */
    public function approve(int $adminId): void
    {
        $this->update([
            'status' => 'approved',
            'approved_at' => now(),
            'approved_by' => $adminId,
            'published_at' => $this->published_at ?? now(),
            'rejection_reason' => null,
        ]);
    }

    /**
     * Reject the resource.
     */
    public function reject(string $reason): void
    {
        $this->update([
            'status' => 'rejected',
            'rejection_reason' => $reason,
            'approved_at' => null,
            'approved_by' => null,
        ]);
    }

    /**
     * Archive the resource.
     */
    public function archive(): void
    {
        $this->update(['status' => 'archived']);
    }

    /**
     * Get the formatted price.
     */
    public function getFormattedPriceAttribute(): string
    {
        if ($this->isFree()) {
            return 'Gratuit';
        }

        return number_format($this->price, 2, ',', ' ') . ' ' . $this->currency;
    }

    /**
     * Get the URL for this resource.
     */
    public function getUrlAttribute(): string
    {
        return route('resources.show', $this->slug);
    }

    /**
     * Get the download URL for this resource.
     */
    public function getDownloadUrlAttribute(): string
    {
        return route('resources.download', $this->slug);
    }
}
