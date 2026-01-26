<?php

namespace ShopPlugin\Models;

use ExilonCMS\Models\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * OrderItem represents an item in an order.
 */
class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'item_id',
        'quantity',
        'price',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    /**
     * Get the order this item belongs to.
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get the item.
     */
    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }
}
