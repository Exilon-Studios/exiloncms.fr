<?php

namespace ShopPlugin\Models;

use ExilonCMS\Models\Model;
use ExilonCMS\Models\User;
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

    /**
     * Deliver items to the user.
     * This will execute server commands via ExilonLink.
     */
    public function deliver(): void
    {
        // Create order
        $order = Order::create([
            'user_id' => $this->user_id,
            'payment_id' => $this->id,
            'total' => $this->price,
            'status' => 'completed',
        ]);

        // Process each payment item
        foreach ($this->items as $paymentItem) {
            // Create order item
            OrderItem::create([
                'order_id' => $order->id,
                'item_id' => $paymentItem->item_id,
                'quantity' => $paymentItem->quantity,
                'price' => $paymentItem->price,
            ]);

            // Deliver item to user via server bridge
            $this->deliverItem($paymentItem);
        }

        // Deduct user money if payment was made with virtual currency
        if ($this->gateway_type === 'azuriom') {
            $this->user->decrement('money', $this->price);
        }
    }

    /**
     * Deliver a single item to the user.
     * This will send commands to the game server via ExilonLink.
     */
    protected function deliverItem(PaymentItem $paymentItem): void
    {
        $item = $paymentItem->item;
        $user = $this->user;

        // Execute server commands if configured
        if ($item->commands) {
            $server = $this->getServerBridge();

            if ($server) {
                foreach ($item->commands as $command) {
                    // Replace placeholders
                    $command = str_replace(
                        ['{player}', '{uuid}', '{id}', '{quantity}'],
                        [$user->name, $user->game_id, $user->id, $paymentItem->quantity],
                        $command
                    );

                    $server->sendCommand($command);
                }
            }
        }

        // Add items to user inventory if applicable
        if ($item->type === 'item' && $item->give_item) {
            // Add to user's inventory
            // This depends on your game implementation
        }
    }

    /**
     * Get the server bridge for command execution.
     */
    protected function getServerBridge()
    {
        // Get the active server from settings
        $serverId = setting('exilonlink_server_id');

        if (! $serverId) {
            return null;
        }

        return \ShopPlugin\Services\ServerBridgeFactory::create($serverId);
    }
}
