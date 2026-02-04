<?php

namespace ExilonCMS\Helpers;

use ExilonCMS\Attributes\ExtensionMeta;
use ExilonCMS\Classes\Extension\Gateway;
use ExilonCMS\Models\Invoice;
use ExilonCMS\Models\InvoiceTransaction;
use ExilonCMS\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Log;
use ReflectionClass;

/**
 * Extension Helper
 * Manages extensions and payment gateways
 * Inspired by Paymenter's ExtensionHelper
 */
class ExtensionHelper
{
    /**
     * Get all extensions of a specific type
     *
     * @param  string|null  $type  'gateway', 'server', etc.
     * @return array
     */
    public static function getExtensions($type = null)
    {
        $extensions = self::getAvailableExtensions();

        if ($type) {
            $type = strtolower($type);

            return array_filter($extensions, fn ($extension) => $extension['type'] === $type);
        }

        return $extensions;
    }

    /**
     * Get extension instance
     *
     * @param  string  $type
     * @param  string  $extension
     * @param  array  $config
     * @return object
     */
    public static function getExtension($type, $extension, $config = [])
    {
        $class = '\\ExilonCMS\\Extensions\\'.ucfirst($type).'s\\'.$extension.'\\'.$extension;

        if (! class_exists($class)) {
            throw new \Exception("Extension \"{$class}\" not found");
        }

        return new $class($config);
    }

    /**
     * Get extension config fields
     *
     * @return array
     */
    public static function getConfig($type, $extension, $config = [])
    {
        if (empty($config)) {
            // Load config from database if needed
            $config = [];
        }

        return self::getExtension($type, $extension, $config)->getConfig($config);
    }

    /**
     * Check if extension has a specific function
     *
     * @param  object  $extension
     * @param  string  $function
     */
    public static function hasFunction($extension, $function)
    {
        return method_exists(self::getExtension($extension->type ?? 'gateway', $extension->extension ?? $extension, $extension->config ?? []), $function);
    }

    /**
     * Call an extension method
     *
     * @param  mixed  $extension
     * @param  string  $function
     * @param  array  $args
     * @param  bool  $mayFail
     */
    public static function call($extension, $function, $args = [], $mayFail = false)
    {
        try {
            $instance = self::getExtension(
                $extension->type ?? 'gateway',
                $extension->extension ?? $extension,
                $extension->config ?? []
            );

            if (! method_exists($instance, $function)) {
                throw new \Exception("Function {$function} not found");
            }

            return $instance->$function(...$args);
        } catch (\Exception $e) {
            if (! $mayFail) {
                throw $e;
            }
            Log::warning("Extension call failed: {$e->getMessage()}");
        }
    }

    /**
     * Get all available extensions from filesystem
     *
     * @return array
     */
    public static function getAvailableExtensions()
    {
        $extensions = [];
        $classmap = require base_path('vendor/composer/autoload_classmap.php');

        foreach ($classmap as $class => $path) {
            if (strpos($class, 'ExilonCMS\\Extensions\\') !== 0) {
                continue;
            }

            // Example: ExilonCMS\Extensions\Gateways\Stripe\Stripe
            $parts = explode('\\', $class);

            // Must have: ExilonCMS, Extensions, <Type>s, <Name>, <Class>
            if (count($parts) < 5) {
                continue;
            }

            $typePlural = $parts[2];
            $type = strtolower(rtrim($typePlural, 's'));
            $name = $parts[3];

            // Only add main extension class (class name matches folder)
            if ($parts[4] !== $name) {
                continue;
            }

            if (! file_exists($path) || ! class_exists($class)) {
                continue;
            }

            $extensions[] = [
                'name' => $name,
                'type' => $type,
                'meta' => self::getMeta($class),
                'class' => $class,
            ];
        }

        return $extensions;
    }

    /**
     * Get extension metadata from PHP 8 attribute
     *
     * @param  string  $class
     * @return object|null
     */
    public static function getMeta($class)
    {
        try {
            $reflection = new ReflectionClass($class);
            $attributes = $reflection->getAttributes(ExtensionMeta::class);

            if (empty($attributes)) {
                return null;
            }

            return $attributes[0]->newInstance();
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Convert settings collection to array
     *
     * @param  mixed  $settings
     * @return array
     */
    public static function settingsToArray($settings)
    {
        if (is_array($settings)) {
            return $settings;
        }

        $settingsArray = [];

        if ($settings instanceof Collection) {
            foreach ($settings as $setting) {
                $key = $setting->key ?? $setting->name ?? null;
                $value = $setting->value ?? null;
                if ($key && $value !== null) {
                    $settingsArray[$key] = $value;
                }
            }
        }

        return $settingsArray;
    }

    // ==================== PAYMENT METHODS ====================

    /**
     * Initiate payment for an invoice
     *
     * @param  mixed  $gateway
     * @return mixed
     */
    public static function pay($gateway, Invoice $invoice)
    {
        $gatewayInstance = is_object($gateway) && $gateway instanceof Gateway
            ? $gateway
            : self::getExtension('gateway', $gateway);

        return $gatewayInstance->pay($invoice, $invoice->remaining ?? $invoice->total);
    }

    /**
     * Add payment to invoice
     *
     * @param  Invoice|int  $invoice
     * @param  string  $gateway
     * @param  float  $amount
     * @param  float|null  $fee
     * @param  string|null  $transactionId
     * @param  string  $status
     * @return InvoiceTransaction
     */
    public static function addPayment(
        $invoice,
        $gateway,
        $amount,
        $fee = null,
        $transactionId = null,
        $status = 'succeeded'
    ) {
        if (is_numeric($invoice)) {
            $invoice = Invoice::findOrFail($invoice);
        }

        $data = [
            'gateway' => $gateway,
            'amount' => $amount,
            'status' => $status,
        ];

        if ($fee !== null) {
            $data['fee'] = $fee;
        }

        if ($transactionId) {
            $data['transaction_id'] = $transactionId;
        }

        return $invoice->transactions()->create($data);
    }

    /**
     * Add processing payment
     *
     * @return InvoiceTransaction
     */
    public static function addProcessingPayment($invoice, $gateway, $amount, $fee = null, $transactionId = null)
    {
        return self::addPayment($invoice, $gateway, $amount, $fee, $transactionId, 'processing');
    }

    /**
     * Add failed payment
     *
     * @return InvoiceTransaction
     */
    public static function addFailedPayment($invoice, $gateway, $amount, $fee = null, $transactionId = null)
    {
        return self::addPayment($invoice, $gateway, $amount, $fee, $transactionId, 'failed');
    }

    /**
     * Update payment fee
     *
     * @param  string  $transactionId
     * @param  float  $fee
     * @return InvoiceTransaction
     */
    public static function addPaymentFee($transactionId, $fee)
    {
        $transaction = InvoiceTransaction::where('transaction_id', $transactionId)->firstOrFail();
        $transaction->fee = $fee;
        $transaction->save();

        return $transaction;
    }

    /**
     * Get available payment gateways for checkout
     *
     * @param  float  $total
     * @param  string  $currency
     * @return array
     */
    public static function getCheckoutGateways($total, $currency)
    {
        $gateways = [];

        foreach (self::getExtensions('gateway') as $gateway) {
            $gateways[] = $gateway;
        }

        return $gateways;
    }

    /**
     * Handle webhook from payment gateway
     *
     * @param  string  $gateway
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public static function handleWebhook($gateway, $request)
    {
        return self::getExtension('gateway', $gateway)->webhook($request);
    }

    // ==================== BILLING AGREEMENTS ====================

    /**
     * Get gateways that support billing agreements
     *
     * @return array
     */
    public static function getBillingAgreementGateways()
    {
        $gateways = [];

        foreach (self::getExtensions('gateway') as $gateway) {
            $instance = self::getExtension('gateway', $gateway['name']);

            if ($instance->supportsBillingAgreements()) {
                $gateways[] = $gateway;
            }
        }

        return $gateways;
    }

    /**
     * Create billing agreement
     *
     * @param  string  $gateway
     * @return mixed
     */
    public static function createBillingAgreement(User $user, $gateway)
    {
        return self::getExtension('gateway', $gateway)->createBillingAgreement($user);
    }

    /**
     * Charge billing agreement
     *
     * @param  string  $gateway
     * @param  mixed  $billingAgreement
     * @return bool
     */
    public static function chargeBillingAgreement(Invoice $invoice, $gateway, $billingAgreement)
    {
        return self::getExtension('gateway', $gateway)->charge($invoice, $invoice->remaining ?? $invoice->total, $billingAgreement);
    }

    // ==================== MIGRATION HELPERS ====================

    /**
     * Run migrations for a specific extension
     *
     * @param  string  $path
     * @return void
     */
    public static function runMigrations($path)
    {
        $migrator = app('migrator');

        try {
            $migrator->run(base_path($path));
            Log::info("Migrations run for: {$path}");
        } catch (\Exception $e) {
            Log::error("Migration failed for {$path}: {$e->getMessage()}");
            throw $e;
        }
    }

    /**
     * Rollback migrations for a specific extension
     *
     * @param  string  $path
     * @return void
     */
    public static function rollbackMigrations($path)
    {
        $migrationFiles = glob(base_path($path.'/*.php'));

        if (empty($migrationFiles)) {
            return;
        }

        // Sort and reverse for correct rollback order
        usort($migrationFiles, fn ($a, $b) => strcmp(basename($a), basename($b)));
        $migrationFiles = array_reverse($migrationFiles);

        foreach ($migrationFiles as $file) {
            $migrationName = basename($file, '.php');
            try {
                $migration = require_once $file;

                if (method_exists($migration, 'down') &&
                    \DB::table('migrations')->where('migration', $migrationName)->exists()) {
                    $migration->down();
                    \DB::table('migrations')->where('migration', $migrationName)->delete();
                }
            } catch (\Exception $e) {
                Log::error("Rollback failed for {$migrationName}: {$e->getMessage()}");
            }
        }
    }
}
