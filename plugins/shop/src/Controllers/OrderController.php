<?php

namespace ExilonCMS\Plugins\Shop\Controllers;

use ExilonCMS\Plugins\Shop\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * Order Controller
 * Handles order viewing and checkout
 */
class OrderController
{
    /**
     * Display user's orders
     */
    public function index()
    {
        $orders = Auth::user()->orders()->latest()->paginate(10);

        return inertia('Shop/Orders', [
            'orders' => $orders,
        ]);
    }

    /**
     * Display a specific order
     */
    public function show($id)
    {
        $order = Auth::user()->orders()->findOrFail($id);

        return inertia('Shop/OrderDetail', [
            'order' => $order,
        ]);
    }

    /**
     * Display checkout page
     */
    public function checkout()
    {
        $cart = Auth::user()->cart;

        if (! $cart || $cart->items->isEmpty()) {
            return redirect()->route('shop.index')
                ->with('error', 'Your cart is empty.');
        }

        return inertia('Shop/Checkout', [
            'cart' => $cart->load('items.item'),
        ]);
    }

    /**
     * Process checkout
     */
    public function process(Request $request)
    {
        $request->validate([
            'payment_method' => 'required|string',
            'shipping_address' => 'required|string',
        ]);

        // TODO: Implement payment processing
        return redirect()->route('shop.orders.show', ['id' => 1])
            ->with('success', 'Order placed successfully!');
    }
}
