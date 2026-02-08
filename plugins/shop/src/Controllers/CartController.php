<?php

namespace ExilonCMS\Plugins\Shop\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController
{
    public function index()
    {
        $cartItems = Auth::user()
            ? Auth::user()->cartItems()->with('item')->get()
            : collect([]);

        return Inertia::render('Shop/Cart', [
            'cartItems' => $cartItems,
        ]);
    }

    public function add(Request $request)
    {
        $request->validate([
            'item_id' => 'required|integer|exists:shop_items,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $user = Auth::user();
        if (! $user) {
            return redirect()->route('login')->with('error', 'You must be logged in to add items to cart.');
        }

        $cartItem = \ExilonCMS\Plugins\Shop\Models\CartItem::where('user_id', $user->id)
            ->where('item_id', $request->item_id)
            ->first();

        if ($cartItem) {
            $cartItem->increment('quantity', $request->quantity);
        } else {
            \ExilonCMS\Plugins\Shop\Models\CartItem::create([
                'user_id' => $user->id,
                'item_id' => $request->item_id,
                'quantity' => $request->quantity,
            ]);
        }

        return redirect()->back()->with('success', 'Item added to cart.');
    }

    public function remove($id)
    {
        $user = Auth::user();
        if (! $user) {
            return redirect()->route('login');
        }

        $cartItem = \ExilonCMS\Plugins\Shop\Models\CartItem::where('user_id', $user->id)
            ->where('id', $id)
            ->firstOrFail();

        $cartItem->delete();

        return redirect()->back()->with('success', 'Item removed from cart.');
    }

    public function clear()
    {
        $user = Auth::user();
        if (! $user) {
            return redirect()->route('login');
        }

        $user->cartItems()->delete();

        return redirect()->back()->with('success', 'Cart cleared.');
    }
}
