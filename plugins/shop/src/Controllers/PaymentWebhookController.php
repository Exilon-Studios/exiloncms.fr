<?php

namespace ShopPlugin\Controllers;

use ExilonCMS\Http\Controllers\Controller;
use ShopPlugin\Models\Payment;
use ShopPlugin\Payment\PaymentManager;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentWebhookController extends Controller
{
    private PaymentManager $paymentManager;

    public function __construct(PaymentManager $paymentManager)
    {
        $this->paymentManager = $paymentManager;
    }

    /**
     * Handle webhook notification from payment gateway.
     */
    public function handle(Request $request, string $gateway)
    {
        Log::info('Payment webhook received', [
            'gateway' => $gateway,
            'payload' => $request->all(),
        ]);

        // Get payment method
        $paymentMethod = $this->paymentManager->getPaymentMethod($gateway);

        if (! $paymentMethod) {
            Log::error('Unknown payment gateway', ['gateway' => $gateway]);
            return response()->json(['error' => 'Unknown gateway'], 404);
        }

        // Get payment ID from request (varies by gateway)
        $paymentId = $request->input('payment_id')
            ?? $request->input('custom_id')
            ?? $request->input('transaction_id')
            ?? null;

        try {
            return $paymentMethod->handleNotification($request, $paymentId);
        } catch (\Exception $e) {
            Log::error('Payment webhook error', [
                'gateway' => $gateway,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json(['error' => 'Processing error'], 500);
        }
    }

    /**
     * Handle successful payment redirect.
     */
    public function success(Request $request, Payment $payment)
    {
        // The payment should already be processed by the webhook
        // This is just a redirect for the user
        return redirect()->route('shop.orders.show', $payment->order_id)
            ->with('success', 'Paiement réussi ! Votre commande est en cours de traitement.');
    }

    /**
     * Handle cancelled payment redirect.
     */
    public function cancel(Request $request, Payment $payment)
    {
        return redirect()->route('shop.checkout')
            ->with('info', 'Paiement annulé. Vous pouvez réessayer quand vous voulez.');
    }

    /**
     * Handle failed payment redirect.
     */
    public function failure(Request $request, Payment $payment)
    {
        return redirect()->route('shop.checkout')
            ->with('error', 'Le paiement a échoué. Veuillez réessayer ou contacter le support.');
    }
}
