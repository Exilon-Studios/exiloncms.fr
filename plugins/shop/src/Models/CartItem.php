<?php

namespace ExilonCMS\Plugins\Shop\Models;

use ExilonCMS\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    protected $table = 'shop_cart_items';

    protected $fillable = [
        'user_id',
        'item_id',
        'quantity',
        'subtotal',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'subtotal' => 'decimal:2',
    ];

    /**
     * Get the user that owns the cart item.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the item for the cart item.
     */
    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id');
    }

    /**
     * Calculate subtotal based on item price and quantity.
     */
    public function calculateSubtotal(): void
    {
        if ($this->item) {
            $this->subtotal = $this->item->price * $this->quantity;
            $this->save();
        }
    }
}
