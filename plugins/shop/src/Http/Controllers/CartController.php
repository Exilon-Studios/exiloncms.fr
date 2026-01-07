<?php

namespace ExilonCMS\Plugins\Shop\Http\Controllers;

use ExilonCMS\Plugins\Shop\Models\CartItem;
use ExilonCMS\Plugins\Shop\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class CartController
{
    /**
     * Get all cart items for the current user.
     */
    public function index(): JsonResponse
    {
        $cartItems = CartItem::with('item')
            ->where('user_id', Auth::id())
            ->get();

        $total = $cartItems->sum('subtotal');

        return response()->json([
            'items' => $cartItems,
            'total' => $total,
        ]);
    }

    /**
     * Add an item to the cart.
     */
    public function add(Request $request): JsonResponse
    {
        $request->validate([
            'item_id' => 'required|exists:shop_items,id',
            'quantity' => 'nullable|integer|min:1|max:99',
        ]);

        $item = Item::findOrFail($request->item_id);
        $quantity = $request->quantity ?? 1;

        $cartItem = CartItem::where('user_id', Auth::id())
            ->where('item_id', $item->id)
            ->first();

        if ($cartItem) {
            $cartItem->quantity += $quantity;
            if ($cartItem->quantity > 99) {
                $cartItem->quantity = 99;
            }
            $cartItem->calculateSubtotal();
        } else {
            $cartItem = CartItem::create([
                'user_id' => Auth::id(),
                'item_id' => $item->id,
                'quantity' => min($quantity, 99),
                'subtotal' => $item->price * min($quantity, 99),
            ]);
        }

        return response()->json([
            'message' => 'Article ajouté au panier',
            'cart_item' => $cartItem->load('item'),
        ]);
    }

    /**
     * Update cart item quantity.
     */
    public function update(Request $request, CartItem $cartItem): JsonResponse
    {
        // Verify ownership
        if ($cartItem->user_id !== Auth::id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $request->validate([
            'quantity' => 'required|integer|min:1|max:99',
        ]);

        $cartItem->quantity = $request->quantity;
        $cartItem->calculateSubtotal();

        return response()->json([
            'message' => 'Panier mis à jour',
            'cart_item' => $cartItem->load('item'),
        ]);
    }

    /**
     * Remove item from cart.
     */
    public function remove(CartItem $cartItem): JsonResponse
    {
        // Verify ownership
        if ($cartItem->user_id !== Auth::id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $cartItem->delete();

        return response()->json([
            'message' => 'Article supprimé du panier',
        ]);
    }

    /**
     * Clear all items from cart.
     */
    public function clear(): JsonResponse
    {
        CartItem::where('user_id', Auth::id())->delete();

        return response()->json([
            'message' => 'Panier vidé',
        ]);
    }
}
