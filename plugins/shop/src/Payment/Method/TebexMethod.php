<?php

namespace ExilonCMS\Plugins\Shop\Payment;

use ExilonCMS\Plugins\Shop\Models\Gateway;
use ExilonCMS\Plugins\Shop\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

/**
 * Tebex (formerly Buycraft) payment gateway.
 * This is the official payment platform for FiveM servers.
 */
class TebexMethod extends PaymentMethod
{
    protected string $id = 'tebex';

    protected string $name = 'Tebex';

    /**
     * Tebex API endpoints.
     */
    private const API_BASE = 'https://plugin.tebex.io';

    private const CHECKOUT_URL = 'https://checkout.tebex.io';

    /**
     * Get the payment method ID.
     */
    public function getId(): string
    {
        return $this->id;
    }

    /**
     * Get the payment method display name.
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * Start a new payment by redirecting to Tebex checkout.
     */
    public function startPayment($cart, float $amount, string $currency)
    {
        $payment = $this->createPayment($cart, $amount, $currency);

        // Redirect to Tebex checkout with basket
        $serverKey = $this->gateway->config['secret_key'] ?? '';
        $basketUrl = $this->createBasketUrl($payment, $cart, $serverKey);

        return redirect()->away($basketUrl);
    }

    /**
     * Handle Tebex webhook notification.
     */
    public function handleNotification(Request $request, ?string $paymentId)
    {
        // Verify the request is from Tebex
        if (! $this->verifySignature($request)) {
            abort(403, 'Invalid signature');
        }

        $type = $request->input('type');

        return match ($type) {
            'payment' => $this->handlePayment($request),
            'payment.reversed' => $this->handleRefund($request),
            'payment.chargeback' => $this->handleChargeback($request),
            default => response()->json(['status' => 'unknown'], 200),
        };
    }

    /**
     * Get the payment method image.
     */
    public function getImage(): string
    {
        return asset('plugins/shop/img/tebex.svg');
    }

    /**
     * Get validation rules for gateway config.
     */
    public function getConfigRules(): array
    {
        return [
            'secret_key' => ['required', 'string'],
            'server_key' => ['required', 'string'],
            'server_id' => ['required', 'integer'],
        ];
    }

    /**
     * Get config view for admin panel.
     */
    public function getConfigView(): string
    {
        return 'shop::admin.gateways.tebex';
    }

    /**
     * Create Tebex basket URL for checkout.
     */
    protected function createBasketUrl(Payment $payment, $cart, string $serverKey): string
    {
        // Build basket with items
        $items = [];

        foreach ($cart->items as $cartItem) {
            $items[] = [
                'package' => [
                    'id' => $cartItem->item->tebex_package_id ?? null,
                    'name' => $cartItem->item->name,
                    'price' => $cartItem->item->price,
                    'quantity' => $cartItem->quantity,
                ],
            ];
        }

        // Create basket via API
        $response = Http::withHeaders([
            'X-Tebex-Secret' => $serverKey,
        ])->post(self::API_BASE.'/basket', [
            'complete_url' => route('shop.payments.success', $payment->id),
            'cancel_url' => route('shop.payments.cancel', $payment->id),
            'username' => auth()->user()->name,
            'player_id' => auth()->user()->game_id,
            'items' => $items,
        ]);

        if (! $response->successful()) {
            throw new \RuntimeException('Failed to create Tebex basket');
        }

        $basket = $response->json();

        // Store basket ID for later matching
        $payment->update([
            'transaction_id' => $basket['id'],
        ]);

        return self::CHECKOUT_URL.'/basket/'.$basket['id'];
    }

    /**
     * Handle payment notification from Tebex.
     */
    protected function handlePayment(Request $request)
    {
        $transactionId = $request->input('transaction_id');
        $basketId = $request->input('basket_id');
        $status = $request->input('status');

        $payment = Payment::where('transaction_id', $basketId)->first();

        if (! $payment) {
            return response()->json(['error' => 'Payment not found'], 404);
        }

        if ($status === 'complete') {
            return $this->processPayment($payment, $transactionId);
        }

        return $this->failPayment($payment, $transactionId, 'Payment not complete');
    }

    /**
     * Handle refund notification.
     */
    protected function handleRefund(Request $request)
    {
        $transactionId = $request->input('transaction_id');

        $payment = Payment::where('transaction_id', $transactionId)->first();

        if (! $payment) {
            return response()->json(['error' => 'Payment not found'], 404);
        }

        return $this->processRefund($payment);
    }

    /**
     * Handle chargeback notification.
     */
    protected function handleChargeback(Request $request)
    {
        $transactionId = $request->input('transaction_id');

        $payment = Payment::where('transaction_id', $transactionId)->first();

        if (! $payment) {
            return response()->json(['error' => 'Payment not found'], 404);
        }

        $payment->update([
            'status' => 'chargeback',
            'chargeback_at' => now(),
        ]);

        return response()->json(['status' => 'chargeback']);
    }

    /**
     * Verify Tebex webhook signature.
     */
    protected function verifySignature(Request $request): bool
    {
        $signature = $request->header('X-Tebex-Signature');
        $payload = $request->getContent();

        // Get secret key from gateway config
        $secretKey = $this->gateway->config['secret_key'] ?? '';

        if (empty($secretKey)) {
            return false;
        }

        // Compute HMAC signature
        $expectedSignature = hash_hmac('sha256', $payload, $secretKey);

        return hash_equals($expectedSignature, $signature);
    }

    /**
     * Get basket information from Tebex API.
     */
    public function getBasketInfo(string $basketId): ?array
    {
        $serverKey = $this->gateway->config['secret_key'] ?? '';

        $response = Http::withHeaders([
            'X-Tebex-Secret' => $serverKey,
        ])->get(self::API_BASE."/basket/{$basketId}");

        return $response->successful() ? $response->json() : null;
    }

    /**
     * Get server information from Tebex API.
     */
    public function getServerInfo(): ?array
    {
        $serverKey = $this->gateway->config['secret_key'] ?? '';

        $response = Http::withHeaders([
            'X-Tebex-Secret' => $serverKey,
        ])->get(self::API_BASE.'/server');

        return $response->successful() ? $response->json() : null;
    }

    /**
     * Get packages from Tebex server.
     */
    public function getPackages(): array
    {
        $serverKey = $this->gateway->config['secret_key'] ?? '';

        $response = Http::withHeaders([
            'X-Tebex-Secret' => $serverKey,
        ])->get(self::API_BASE.'/server/packages');

        return $response->successful() ? $response->json('data', []) : [];
    }

    /**
     * Sync packages from Tebex to local database.
     */
    public function syncPackages(): int
    {
        $packages = $this->getPackages();
        $synced = 0;

        foreach ($packages as $package) {
            Item::updateOrCreate(
                ['tebex_id' => $package['id']],
                [
                    'name' => $package['name'],
                    'description' => $package['description'] ?? '',
                    'price' => $package['price'],
                    'image' => $package['image'] ?? null,
                    'category_id' => null,
                    'tebex_package_id' => $package['id'],
                ]
            );
            $synced++;
        }

        return $synced;
    }
}
