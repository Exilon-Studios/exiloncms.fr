<?php

namespace ExilonCMS\Classes\Extension;

use ExilonCMS\Models\Invoice;
use ExilonCMS\Models\User;
use Illuminate\View\View;

/**
 * Payment Gateway base class
 * Inspired by Paymenter's gateway system
 */
abstract class Gateway extends Extension
{
    /**
     * Pay the given invoice with the given total amount.
     *
     * @param  mixed  $total
     * @return View|string
     */
    abstract public function pay(Invoice $invoice, $total);

    /**
     * Handle webhook requests from the payment provider
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function webhook($request)
    {
        return response()->json(['message' => 'Webhook received'], 200);
    }

    /**
     * Check if gateway supports billing agreements (recurring payments)
     */
    public function supportsBillingAgreements(): bool
    {
        return false;
    }

    /**
     * Create a billing agreement for the given user
     *
     * @return View|string
     */
    public function createBillingAgreement(User $user)
    {
        throw new \Exception('Billing agreements not supported by this gateway');
    }

    /**
     * Cancel the billing agreement
     *
     * @param  mixed  $billingAgreement
     */
    public function cancelBillingAgreement($billingAgreement): bool
    {
        throw new \Exception('Billing agreements not supported by this gateway');
    }

    /**
     * Charge the billing agreement for the given invoice and amount
     *
     * @param  mixed  $total
     * @param  mixed  $billingAgreement
     * @return bool
     */
    public function charge(Invoice $invoice, $total, $billingAgreement)
    {
        throw new \Exception('Billing agreements not supported by this gateway');
    }
}
