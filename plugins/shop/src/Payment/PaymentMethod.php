<?php

namespace ExilonCMS\Plugins\Shop\Payment;

use ExilonCMS\Models\User;
use ExilonCMS\Plugins\Shop\Models\Gateway;
use ExilonCMS\Plugins\Shop\Models\Item;
use ExilonCMS\Plugins\Shop\Models\Order;
use ExilonCMS\Plugins\Shop\Models\OrderItem;
use ExilonCMS\Plugins\Shop\Models\Payment;
use ExilonCMS\Plugins\Shop\Models\PaymentItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
        $this->gateway = $gateway ?? new Gateway;
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
     * @param  mixed  $cart  The shopping cart
     * @param  float  $amount  The payment amount
     * @param  string  $currency  ISO 4217 currency code
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    abstract public function startPayment($cart, float $amount, string $currency);

    /**
     * Handle a payment notification from the payment gateway.
     *
     * @param  \Illuminate\Http\Request  $request  The webhook request
     * @param  string|null  $paymentId  The payment ID from the gateway
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

        // Create order and deliver items
        $this->createOrderAndDeliver($payment);

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

    /**
     * Create order and deliver items to user.
     */
    protected function createOrderAndDeliver(Payment $payment): void
    {
        // Create order
        $order = Order::create([
            'user_id' => $payment->user_id,
            'payment_id' => $payment->id,
            'total' => $payment->price,
            'status' => 'completed',
        ]);

        // Process each payment item
        foreach ($payment->items as $paymentItem) {
            // Create order item
            OrderItem::create([
                'order_id' => $order->id,
                'item_id' => $paymentItem->item_id,
                'quantity' => $paymentItem->quantity,
                'price' => $paymentItem->price,
            ]);

            // Deliver item to user
            $this->deliverItem($paymentItem, $payment->user);
        }
    }

    /**
     * Deliver a single item to the user.
     */
    protected function deliverItem(PaymentItem $paymentItem, User $user): void
    {
        $item = $paymentItem->item;

        // Execute delivery based on item type
        match ($item->type) {
            Item::TYPE_CURRENCY => $user->increment('money', $item->price),
            Item::TYPE_RANK => $this->giveRole($user, $item),
            Item::TYPE_COMMAND => $this->executeCommands($user, $item, $paymentItem->quantity),
            default => null,
        };
    }

    /**
     * Give role to user.
     */
    protected function giveRole(User $user, Item $item): void
    {
        if (! $item->role_id) {
            return;
        }

        // Check if user already has this role
        $existing = DB::table('role_user')
            ->where('user_id', $user->id)
            ->where('role_id', $item->role_id)
            ->first();

        if (! $existing) {
            DB::table('role_user')->insert([
                'user_id' => $user->id,
                'role_id' => $item->role_id,
            ]);
        }
    }

    /**
     * Execute server commands for item delivery.
     */
    protected function executeCommands(User $user, Item $item, int $quantity): void
    {
        if (! $item->commands) {
            return;
        }

        // TODO: Implement server command execution via ExilonLink or RCON
        // foreach ($item->commands as $command) {
        //     $command = str_replace(
        //         ['{player}', '{uuid}', '{id}', '{quantity}'],
        //         [$user->name, $user->uuid, $user->id, $quantity],
        //         $command
        //     );
        //     // Execute command
        // }
    }
}
