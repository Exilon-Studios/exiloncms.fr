<?php

namespace ShopPlugin\Models;

use ExilonCMS\Models\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * PaymentItem represents an item in a payment.
 */
class PaymentItem extends Model
{
    protected $fillable = [
        'payment_id',
        'item_id',
        'name',
        'price',
        'quantity',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    /**
     * Get the payment this item belongs to.
     */
    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }

    /**
     * Get the item being purchased.
     */
    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }
}
