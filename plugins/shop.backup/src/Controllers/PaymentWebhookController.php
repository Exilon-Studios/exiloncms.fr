<?php

namespace ExilonCMS\Plugins\Shop\Controllers;

use ExilonCMS\Plugins\Shop\Payment\PaymentManager;
use Illuminate\Http\Request;

class PaymentWebhookController
{
    public function __construct(
        private PaymentManager $paymentManager
    ) {}

    public function handleTebex(Request $request, ?string $paymentId)
    {
        $gateway = $this->paymentManager->getGateway('tebex');

        if (! $gateway) {
            abort(404, 'Tebex gateway not configured');
        }

        $paymentMethod = $this->paymentManager->getPaymentMethod('tebex', $gateway);

        return $paymentMethod->handleNotification($request, $paymentId);
    }

    public function handlePayPal(Request $request, ?string $paymentId)
    {
        // TODO: Implement PayPal webhook handling
        return response()->json(['status' => 'not_implemented'], 501);
    }

    public function handleStripe(Request $request, ?string $paymentId)
    {
        // TODO: Implement Stripe webhook handling
        return response()->json(['status' => 'not_implemented'], 501);
    }
}
