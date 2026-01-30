<?php

namespace ExilonCMS\Contracts\Plugins;

/**
 * Payment Gateway Hook Contract
 *
 * Plugins can implement this to add payment methods:
 * - PayPal, Stripe, etc.
 * - Custom payment gateways
 * - Virtual currency (game money)
 *
 * Example implementation in plugin.json:
 * "hooks": {
 *   "payments": {
 *     "gateways": ["PayPalGateway", "StripeGateway"],
 *     "currencies": ["credits", "coins"]
 *   }
 * }
 */
interface PaymentGatewayHook
{
    /**
     * Register payment gateways.
     *
     * @return array<string, array{label: string, icon: string, class: string}>
     */
    public function registerPaymentGateways(): array;

    /**
     * Process payment.
     *
     * @return array{success: bool, transaction_id?: string, error?: string}
     */
    public function processPayment(string $gateway, array $payload): array;

    /**
     * Verify payment webhook/callback.
     */
    public function verifyPaymentWebhook(string $gateway, array $payload): bool;

    /**
     * Get payment gateway configuration form.
     *
     * @return array{fields: array, validation: array}
     */
    public function getGatewayConfig(string $gateway): array;

    /**
     * Get payment gateway fee.
     */
    public function getGatewayFee(string $gateway, float $amount): float;

    /**
     * Refund payment.
     */
    public function refundPayment(string $transactionId, ?float $amount = null): bool;
}
