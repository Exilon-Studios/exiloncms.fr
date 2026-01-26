<?php

namespace ShopPlugin\Payment;

use Illuminate\Http\Request;
use ShopPlugin\Models\Gateway;
use ShopPlugin\Models\Payment;

abstract class PaymentMethod
{
    /**
     * The payment gateway configuration.
     */
    protected Gateway $gateway;

    /**
     * Create a new payment method instance.
     */
    public function __construct(?Gateway $gateway = null)
    {
        $this->gateway = $gateway ?? new Gateway();
    }

    /**
     * Get the payment method id.
     */
    abstract public function getId(): string;

    /**
     * Get the payment method display name.
     */
    abstract public function getName(): string;

    /**
     * Start a new payment with this method.
     * Should return a response (redirect, view, etc.) to initiate the payment.
     *
     * @param \ShopPlugin\Cart\Cart $cart The shopping cart
     * @param float $amount The payment amount
     * @param string $currency ISO 4217 currency code
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    abstract public function startPayment($cart, float $amount, string $currency);

    /**
     * Handle a payment notification from the payment gateway.
     *
     * @param \Illuminate\Http\Request $request The webhook request
     * @param string|null $paymentId The payment ID from the gateway
     * @return \Illuminate\Http\Response
     */
    abstract public function handleNotification(Request $request, ?string $paymentId);

    /**
     * Get the view for the gateway configuration in admin.
     */
    public function getConfigView(): string
    {
        return 'shop::admin.gateways.config';
    }

    /**
     * Get validation rules for the gateway configuration.
     */
    public function getConfigRules(): array
    {
        return [];
    }

    /**
     * Get the payment method image URL.
     */
    public function getImage(): string
    {
        return asset('plugins/shop/img/payment.png');
    }

    /**
     * Check if this payment method supports subscriptions.
     */
    public function supportsSubscriptions(): bool
    {
        return false;
    }

    /**
     * Create a new pending payment record.
     */
    protected function createPayment($cart, float $amount, string $currency, ?string $transactionId = null): Payment
    {
        return Payment::create([
            'user_id' => auth()->id(),
            'price' => $amount,
            'currency' => $currency,
            'gateway_id' => $this->gateway->id,
            'gateway_type' => $this->getId(),
            'status' => 'pending',
            'transaction_id' => $transactionId,
        ]);
    }

    /**
     * Process a successful payment and deliver items.
     */
    protected function processPayment(Payment $payment, string $transactionId): \Illuminate\Http\Response
    {
        $payment->update([
            'status' => 'completed',
            'transaction_id' => $transactionId,
            'completed_at' => now(),
        ]);

        // Deliver items to user
        $payment->deliver();

        return response()->json(['status' => 'success']);
    }

    /**
     * Process a failed payment.
     */
    protected function failPayment(Payment $payment, string $transactionId, string $reason = ''): \Illuminate\Http\Response
    {
        $payment->update([
            'status' => 'failed',
            'transaction_id' => $transactionId,
            'failed_at' => now(),
            'failure_reason' => $reason,
        ]);

        return response()->json(['status' => 'failed'], 400);
    }

    /**
     * Process a refund.
     */
    protected function processRefund(Payment $payment): \Illuminate\Http\Response
    {
        $payment->update([
            'status' => 'refunded',
            'refunded_at' => now(),
        ]);

        return response()->json(['status' => 'refunded']);
    }

    /**
     * Verify webhook signature to prevent fraud.
     */
    protected function verifySignature(Request $request): bool
    {
        return true; // Override in specific payment methods
    }
}
