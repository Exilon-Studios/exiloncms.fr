<?php

namespace ShopPlugin\Controllers\Admin;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Models\User;
use ShopPlugin\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    /**
     * Display a listing of payments.
     */
    public function index(Request $request)
    {
        $query = Payment::with(['user', 'gateway', 'items'])
            ->orderBy('created_at', 'desc');

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Filter by gateway
        if ($request->has('gateway') && $request->gateway) {
            $query->where('gateway_type', $request->gateway);
        }

        // Filter by user
        if ($request->has('user') && $request->user) {
            $query->where('user_id', $request->user);
        }

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('transaction_id', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        $payments = $query->paginate(20);

        return inertia('Shop/Admin/Payments/Index', [
            'payments' => $payments->through(fn ($payment) => [
                'id' => $payment->id,
                'user' => [
                    'id' => $payment->user->id,
                    'name' => $payment->user->name,
                    'email' => $payment->user->email,
                ],
                'gateway' => [
                    'type' => $payment->gateway_type,
                    'name' => $payment->gateway?->name,
                ],
                'price' => $payment->price,
                'currency' => $payment->currency,
                'status' => $payment->status,
                'transaction_id' => $payment->transaction_id,
                'created_at' => $payment->created_at,
                'completed_at' => $payment->completed_at,
            ]),
            'filters' => $request->only(['status', 'gateway', 'user', 'search']),
            'statuses' => [
                'pending' => 'En attente',
                'completed' => 'Complété',
                'failed' => 'Échoué',
                'refunded' => 'Remboursé',
                'chargeback' => 'Chargeback',
            ],
        ]);
    }

    /**
     * Display the specified payment.
     */
    public function show(Payment $payment)
    {
        $payment->load(['user', 'gateway', 'items.item', 'order']);

        return inertia('Shop/Admin/Payments/Show', [
            'payment' => [
                'id' => $payment->id,
                'user' => [
                    'id' => $payment->user->id,
                    'name' => $payment->user->name,
                    'email' => $payment->user->email,
                    'game_id' => $payment->user->game_id,
                ],
                'gateway' => [
                    'type' => $payment->gateway_type,
                    'name' => $payment->gateway?->name,
                ],
                'price' => $payment->price,
                'currency' => $payment->currency,
                'status' => $payment->status,
                'transaction_id' => $payment->transaction_id,
                'failure_reason' => $payment->failure_reason,
                'created_at' => $payment->created_at,
                'completed_at' => $payment->completed_at,
                'failed_at' => $payment->failed_at,
                'refunded_at' => $payment->refunded_at,
                'chargeback_at' => $payment->chargeback_at,
            ],
            'items' => $payment->items->map(fn ($item) => [
                'id' => $item->id,
                'name' => $item->name,
                'price' => $item->price,
                'quantity' => $item->quantity,
                'item' => [
                    'id' => $item->item->id,
                    'name' => $item->item->name,
                ],
            ]),
            'order' => $payment->order ? [
                'id' => $payment->order->id,
                'status' => $payment->order->status,
            ] : null,
        ]);
    }

    /**
     * Refund the specified payment.
     */
    public function refund(Payment $payment)
    {
        abort_if($payment->status !== 'completed', 400, 'Seuls les paiements complétés peuvent être remboursés.');

        $payment->update([
            'status' => 'refunded',
            'refunded_at' => now(),
        ]);

        return back()->with('success', 'Paiement remboursé avec succès.');
    }

    /**
     * Get payment statistics.
     */
    public function stats()
    {
        $stats = [
            'total' => Payment::count(),
            'pending' => Payment::where('status', 'pending')->count(),
            'completed' => Payment::where('status', 'completed')->count(),
            'failed' => Payment::where('status', 'failed')->count(),
            'refunded' => Payment::where('status', 'refunded')->count(),
            'revenue' => Payment::where('status', 'completed')->sum('price'),
            'revenue_this_month' => Payment::where('status', 'completed')
                ->whereMonth('created_at', now()->month)
                ->sum('price'),
        ];

        return response()->json($stats);
    }
}
