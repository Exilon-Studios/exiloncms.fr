<?php

namespace ExilonCMS\Plugins\Shop\Models;

use ExilonCMS\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Payment represents a payment transaction.
 */
class Payment extends Model
{
    protected $fillable = [
        'user_id',
        'gateway_id',
        'gateway_type',
        'price',
        'currency',
        'status',
        'transaction_id',
        'failure_reason',
        'completed_at',
        'failed_at',
        'refunded_at',
        'chargeback_at',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'completed_at' => 'datetime',
        'failed_at' => 'datetime',
        'refunded_at' => 'datetime',
        'chargeback_at' => 'datetime',
    ];

    /**
     * Payment statuses.
     */
    public const STATUS_PENDING = 'pending';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_FAILED = 'failed';
    public const STATUS_REFUNDED = 'refunded';
    public const STATUS_CHARGEBACK = 'chargeback';

    /**
     * Get the user who made the payment.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the gateway used for this payment.
     */
    public function gateway(): BelongsTo
    {
        return $this->belongsTo(Gateway::class);
    }

    /**
     * Get the payment items.
     */
    public function items(): HasMany
    {
        return $this->hasMany(PaymentItem::class);
    }

    /**
     * Get the order associated with this payment.
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Scope to get payments by status.
     */
    public function scopeWithStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to get pending payments.
     */
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    /**
     * Scope to get completed payments.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', self::STATUS_COMPLETED);
    }

    /**
     * Check if payment is pending.
     */
    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    /**
     * Check if payment is completed.
     */
    public function isCompleted(): bool
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    /**
     * Check if payment is failed.
     */
    public function isFailed(): bool
    {
        return $this->status === self::STATUS_FAILED;
    }
}
