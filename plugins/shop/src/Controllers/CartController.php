<?php

namespace ExilonCMS\Plugins\Shop\Controllers;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Plugins\Shop\Models\CartItem;
use ExilonCMS\Plugins\Shop\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    /**
     * Get cart items for the current user
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        if (! $user) {
            return response()->json([
                'items' => [],
                'total' => 0,
            ]);
        }

        $cartItems = CartItem::where('user_id', $user->id)
            ->with('item')
            ->get();

        $items = $cartItems->map(function ($cartItem) {
            return [
                'id' => $cartItem->id,
                'item_id' => $cartItem->item_id,
                'item' => [
                    'id' => $cartItem->item->id,
                    'name' => $cartItem->item->name,
                    'slug' => $cartItem->item->slug,
                    'price' => $cartItem->item->price,
                    'image' => $cartItem->item->image,
                ],
                'quantity' => $cartItem->quantity,
                'subtotal' => $cartItem->quantity * $cartItem->item->price,
            ];
        });

        $total = $cartItems->sum(function ($cartItem) {
            return $cartItem->quantity * $cartItem->item->price;
        });

        return response()->json([
            'items' => $items,
            'total' => $total,
        ]);
    }

    /**
     * Add item to cart
     */
    public function add(Request $request, $itemId)
    {
        $user = Auth::user();

        if (! $user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $item = Item::active()->findOrFail($itemId);

        $cartItem = CartItem::where('user_id', $user->id)
            ->where('item_id', $itemId)
            ->first();

        if ($cartItem) {
            $cartItem->quantity = min($cartItem->quantity + 1, 99);
            $cartItem->save();
        } else {
            CartItem::create([
                'user_id' => $user->id,
                'item_id' => $itemId,
                'quantity' => 1,
            ]);
        }

        return response()->json(['success' => true]);
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();

        if (! $user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $cartItem = CartItem::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $quantity = (int) $request->input('quantity', 1);

        if ($quantity < 1 || $quantity > 99) {
            return response()->json(['error' => 'Invalid quantity'], 422);
        }

        $cartItem->quantity = $quantity;
        $cartItem->save();

        return response()->json(['success' => true]);
    }

    /**
     * Remove item from cart
     */
    public function remove(Request $request, $id)
    {
        $user = Auth::user();

        if (! $user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $cartItem = CartItem::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $cartItem->delete();

        return response()->json(['success' => true]);
    }

    /**
     * Clear all items from cart
     */
    public function clear(Request $request)
    {
        $user = Auth::user();

        if (! $user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        CartItem::where('user_id', $user->id)->delete();

        return response()->json(['success' => true]);
    }
}
