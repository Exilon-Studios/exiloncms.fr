<?php

namespace ExilonCMS\Models;

use ExilonCMS\Models\Traits\Loggable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $resource_id
 * @property int $buyer_id
 * @property string $transaction_id
 * @property float $amount
 * @property string $currency
 * @property string $payment_method
 * @property string $status
 * @property string|null $receipt_url
 * @property \Carbon\Carbon|null $purchased_at
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property \ExilonCMS\Models\Resource $resource
 * @property \ExilonCMS\Models\User $buyer
 */
class ResourcePurchase extends Model
{
    use HasFactory;
    use Loggable;

    /**
     * The actions to that should be automatically logged.
     *
     * @var array<int, string>
     */
    protected static array $logEvents = ['created', 'updated'];

    /**
     * The payment methods.
     */
    public const PAYMENT_METHODS = ['stripe', 'paypal', 'wallet'];

    /**
     * The purchase statuses.
     */
    public const STATUSES = ['pending', 'completed', 'failed', 'refunded'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'resource_id',
        'buyer_id',
        'transaction_id',
        'amount',
        'currency',
        'payment_method',
        'status',
        'receipt_url',
        'purchased_at',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'resource_id' => 'int',
        'buyer_id' => 'int',
        'amount' => 'float',
        'purchased_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $purchase) {
            if ($purchase->transaction_id === null) {
                $purchase->transaction_id = 'RES_'.strtoupper(Str::random(16));
            }
        });

        static::updated(function (self $purchase) {
            if ($purchase->isDirty('status') && $purchase->status === 'completed') {
                if ($purchase->purchased_at === null) {
                    $purchase->purchased_at = now();
                }
            }
        });
    }

    /**
     * Get the resource that was purchased.
     */
    public function resource(): BelongsTo
    {
        return $this->belongsTo(Resource::class);
    }

    /**
     * Get the buyer who made the purchase.
     */
    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    /**
     * Scope to only include completed purchases.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope to only include pending purchases.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Check if the purchase is completed.
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Check if the purchase is pending.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if the purchase is failed.
     */
    public function isFailed(): bool
    {
        return $this->status === 'failed';
    }

    /**
     * Check if the purchase is refunded.
     */
    public function isRefunded(): bool
    {
        return $this->status === 'refunded';
    }

    /**
     * Get the formatted amount.
     */
    public function getFormattedAmountAttribute(): string
    {
        return number_format($this->amount, 2, ',', ' ').' '.$this->currency;
    }

    /**
     * Mark the purchase as completed.
     */
    public function markAsCompleted(): void
    {
        $this->update([
            'status' => 'completed',
            'purchased_at' => now(),
        ]);
    }

    /**
     * Mark the purchase as failed.
     */
    public function markAsFailed(): void
    {
        $this->update(['status' => 'failed']);
    }

    /**
     * Mark the purchase as refunded.
     */
    public function markAsRefunded(): void
    {
        $this->update(['status' => 'refunded']);
    }
}
