<?php

namespace ShopPlugin\Payment;

use Illuminate\Support\Collection;
use Illuminate\Support\Manager;
use ShopPlugin\Models\Gateway;

class PaymentManager
{
    /**
     * The registered payment methods.
     */
    protected Collection $paymentMethods;

    /**
     * Create a new payment manager instance.
     */
    public function __construct()
    {
        $this->paymentMethods = collect([
            'tebex' => \ShopPlugin\Payment\Method\TebexMethod::class,
            'paypal' => \ShopPlugin\Payment\Method\PayPalMethod::class,
            'stripe' => \ShopPlugin\Payment\Method\StripeMethod::class,
        ]);
    }

    /**
     * Get all payment methods.
     */
    public function getPaymentMethods(): Collection
    {
        return $this->paymentMethods;
    }

    /**
     * Get a payment method by type.
     */
    public function getPaymentMethod(string $type, ?Gateway $gateway = null): ?PaymentMethod
    {
        $class = $this->paymentMethods->get($type);

        if (! $class) {
            return null;
        }

        return app($class, $gateway ? ['gateway' => $gateway] : []);
    }

    /**
     * Get a payment method or fail.
     */
    public function getPaymentMethodOrFail(string $type, ?Gateway $gateway = null): PaymentMethod
    {
        abort_if(! $this->hasPaymentMethod($type), 404, "Payment method '{$type}' not found.");

        return $this->getPaymentMethod($type, $gateway);
    }

    /**
     * Check if a payment method exists.
     */
    public function hasPaymentMethod(string $type): bool
    {
        return $this->paymentMethods->has($type);
    }

    /**
     * Register a new payment method.
     */
    public function registerPaymentMethod(string $id, string $class): void
    {
        $this->paymentMethods->put($id, $class);
    }

    /**
     * Get all active gateways from database.
     */
    public function getActiveGateways(): Collection
    {
        return Gateway::where('is_active', true)->get();
    }

    /**
     * Get a gateway by type.
     */
    public function getGateway(string $type): ?Gateway
    {
        return Gateway::where('type', $type)->where('is_active', true)->first();
    }

    /**
     * Create a payment for a cart.
     */
    public function createPayment(\ShopPlugin\Cart\Cart $cart, string $gatewayType): Payment
    {
        $gateway = $this->getGateway($gatewayType);

        abort_if(! $gateway, 400, "Payment gateway '{$gatewayType}' is not active.");

        $paymentMethod = $this->getPaymentMethod($gatewayType, $gateway);

        return $paymentMethod->createPayment($cart, $cart->total(), 'USD');
    }
}
