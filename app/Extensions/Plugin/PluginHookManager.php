<?php

namespace ExilonCMS\Extensions\Plugin;

use ExilonCMS\Contracts\Plugins\AuthenticationHook;
use ExilonCMS\Contracts\Plugins\MediaHook;
use ExilonCMS\Contracts\Plugins\NotificationHook;
use ExilonCMS\Contracts\Plugins\PaymentGatewayHook;
use ExilonCMS\Contracts\Plugins\SearchHook;
use ExilonCMS\Contracts\Plugins\UserExtensionHook;

/**
 * Plugin Hook Manager
 *
 * Central registry for all plugin hooks/integrations.
 * Manages authentication, media, search, notifications, payments, user extensions.
 *
 * This makes the CMS EXTREMELY modular - plugins can extend ANY part of the system!
 */
class PluginHookManager
{
    /**
     * Registered authentication hooks.
     *
     * @var array<string, AuthenticationHook>
     */
    protected static array $authHooks = [];

    /**
     * Registered media hooks.
     *
     * @var array<string, MediaHook>
     */
    protected static array $mediaHooks = [];

    /**
     * Registered search hooks.
     *
     * @var array<string, SearchHook>
     */
    protected static array $searchHooks = [];

    /**
     * Registered notification hooks.
     *
     * @var array<string, NotificationHook>
     */
    protected static array $notificationHooks = [];

    /**
     * Registered payment gateway hooks.
     *
     * @var array<string, PaymentGatewayHook>
     */
    protected static array $paymentHooks = [];

    /**
     * Registered user extension hooks.
     *
     * @var array<string, UserExtensionHook>
     */
    protected static array $userHooks = [];

    /**
     * Register an authentication hook.
     */
    public static function registerAuthHook(string $pluginId, AuthenticationHook $hook): void
    {
        static::$authHooks[$pluginId] = $hook;
    }

    /**
     * Register a media hook.
     */
    public static function registerMediaHook(string $pluginId, MediaHook $hook): void
    {
        static::$mediaHooks[$pluginId] = $hook;
    }

    /**
     * Register a search hook.
     */
    public static function registerSearchHook(string $pluginId, SearchHook $hook): void
    {
        static::$searchHooks[$pluginId] = $hook;
    }

    /**
     * Register a notification hook.
     */
    public static function registerNotificationHook(string $pluginId, NotificationHook $hook): void
    {
        static::$notificationHooks[$pluginId] = $hook;
    }

    /**
     * Register a payment gateway hook.
     */
    public static function registerPaymentHook(string $pluginId, PaymentGatewayHook $hook): void
    {
        static::$paymentHooks[$pluginId] = $hook;
    }

    /**
     * Register a user extension hook.
     */
    public static function registerUserHook(string $pluginId, UserExtensionHook $hook): void
    {
        static::$userHooks[$pluginId] = $hook;
    }

    // ============================================================
    // AUTH HOOKS METHODS
    // ============================================================

    /**
     * Get all auth providers from plugins.
     */
    public static function getAuthProviders(): array
    {
        $providers = [];

        foreach (static::$authHooks as $pluginId => $hook) {
            $providers = array_merge($providers, $hook->registerAuthProviders());
        }

        return $providers;
    }

    /**
     * Get all 2FA methods from plugins.
     */
    public static function getTwoFactorMethods(): array
    {
        $methods = [];

        foreach (static::$authHooks as $pluginId => $hook) {
            $methods = array_merge($methods, $hook->registerTwoFactorMethods());
        }

        return $methods;
    }

    /**
     * Validate credentials using plugin hooks.
     */
    public static function validateCredentials(string $pluginId, array $credentials): array
    {
        if (! isset(static::$authHooks[$pluginId])) {
            return ['success' => false, 'error' => 'Auth hook not found'];
        }

        return static::$authHooks[$pluginId]->validateCredentials($credentials);
    }

    /**
     * Get user profile from external source.
     */
    public static function getUserProfile(string $provider, string $token): array
    {
        foreach (static::$authHooks as $hook) {
            try {
                $result = $hook->getUserProfile($provider, $token);
                if (! empty($result)) {
                    return $result;
                }
            } catch (\Exception $e) {
                // Try next hook
            }
        }

        return [];
    }

    // ============================================================
    // MEDIA HOOKS METHODS
    // ============================================================

    /**
     * Get all storage drivers from plugins.
     */
    public static function getStorageDrivers(): array
    {
        $drivers = [];

        foreach (static::$mediaHooks as $pluginId => $hook) {
            $drivers = array_merge($drivers, $hook->registerStorageDrivers());
        }

        return $drivers;
    }

    /**
     * Get all image filters from plugins.
     */
    public static function getImageFilters(): array
    {
        $filters = [];

        foreach (static::$mediaHooks as $pluginId => $hook) {
            $filters = array_merge($filters, $hook->registerImageFilters());
        }

        return $filters;
    }

    /**
     * Process uploaded image using plugin hooks.
     */
    public static function processUpload(string $pluginId, string $imagePath, array $options = []): string
    {
        if (! isset(static::$mediaHooks[$pluginId])) {
            return $imagePath;
        }

        return static::$mediaHooks[$pluginId]->processUpload($imagePath, $options);
    }

    /**
     * Delete image using plugin hooks.
     */
    public static function deleteImage(string $pluginId, string $imagePath): bool
    {
        if (! isset(static::$mediaHooks[$pluginId])) {
            return false;
        }

        return static::$mediaHooks[$pluginId]->deleteImage($imagePath);
    }

    /**
     * Get image URL from plugin CDN.
     */
    public static function getImageUrl(string $pluginId, string $imagePath): string
    {
        if (! isset(static::$mediaHooks[$pluginId])) {
            return $imagePath;
        }

        return static::$mediaHooks[$pluginId]->getImageUrl($imagePath);
    }

    // ============================================================
    // SEARCH HOOKS METHODS
    // ============================================================

    /**
     * Get all searchable types from plugins.
     */
    public static function getSearchableTypes(): array
    {
        $types = [];

        foreach (static::$searchHooks as $pluginId => $hook) {
            $types = array_merge($types, $hook->registerSearchableTypes());
        }

        return $types;
    }

    /**
     * Perform search across all plugins.
     */
    public static function search(string $query, int $limit = 20, array $types = []): array
    {
        $results = [];

        foreach (static::$searchHooks as $pluginId => $hook) {
            try {
                $pluginResults = $hook->search($types ?: ['all'], $query, $limit);
                $results = array_merge($results, $pluginResults);
            } catch (\Exception $e) {
                \Log::error("Search error in plugin {$pluginId}", [
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return $results;
    }

    // ============================================================
    // NOTIFICATION HOOKS METHODS
    // ============================================================

    /**
     * Get all notification channels from plugins.
     */
    public static function getNotificationChannels(): array
    {
        $channels = [];

        foreach (static::$notificationHooks as $pluginId => $hook) {
            $channels = array_merge($channels, $hook->registerNotificationChannels());
        }

        return $channels;
    }

    /**
     * Send notification using plugin hook.
     */
    public static function sendNotification(string $pluginId, string $channel, $user, array $data): bool
    {
        if (! isset(static::$notificationHooks[$pluginId])) {
            return false;
        }

        return static::$notificationHooks[$pluginId]->sendNotification($channel, $user, $data);
    }

    // ============================================================
    // PAYMENT HOOKS METHODS
    // ============================================================

    /**
     * Get all payment gateways from plugins.
     */
    public static function getPaymentGateways(): array
    {
        $gateways = [];

        foreach (static::$paymentHooks as $pluginId => $hook) {
            $gateways = array_merge($gateways, $hook->registerPaymentGateways());
        }

        return $gateways;
    }

    /**
     * Process payment using plugin gateway.
     */
    public static function processPayment(string $pluginId, string $gateway, array $payload): array
    {
        if (! isset(static::$paymentHooks[$pluginId])) {
            return ['success' => false, 'error' => 'Payment hook not found'];
        }

        return static::$paymentHooks[$pluginId]->processPayment($gateway, $payload);
    }

    /**
     * Verify payment webhook.
     */
    public static function verifyPaymentWebhook(string $pluginId, string $gateway, array $payload): bool
    {
        if (! isset(static::$paymentHooks[$pluginId])) {
            return false;
        }

        return static::$paymentHooks[$pluginId]->verifyPaymentWebhook($gateway, $payload);
    }

    // ============================================================
    // USER EXTENSION HOOKS METHODS
    // ============================================================

    /**
     * Get all custom user fields from plugins.
     */
    public static function getUserFields(): array
    {
        $fields = [];

        foreach (static::$userHooks as $pluginId => $hook) {
            $fields = array_merge($fields, $hook->registerUserFields());
        }

        return $fields;
    }

    /**
     * Get all profile sections from plugins.
     */
    public static function getProfileSections(): array
    {
        $sections = [];

        foreach (static::$userHooks as $pluginId => $hook) {
            $sections = array_merge($sections, $hook->registerProfileSections());
        }

        return $sections;
    }

    /**
     * Get all user actions from plugins.
     */
    public static function getUserActions(): array
    {
        $actions = [];

        foreach (static::$userHooks as $pluginId => $hook) {
            $actions = array_merge($actions, $hook->registerUserActions());
        }

        return $actions;
    }

    /**
     * Get custom user data from plugins.
     */
    public static function getUserData($user): array
    {
        $data = [];

        foreach (static::$userHooks as $pluginId => $hook) {
            try {
                $pluginData = $hook->getUserData($user);
                $data = array_merge($data, $pluginData);
            } catch (\Exception $e) {
                \Log::error("Error getting user data from plugin {$pluginId}", [
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return $data;
    }

    /**
     * Clear all hooks for a specific plugin.
     */
    public static function clearPluginHooks(string $pluginId): void
    {
        unset(static::$authHooks[$pluginId]);
        unset(static::$mediaHooks[$pluginId]);
        unset(static::$searchHooks[$pluginId]);
        unset(static::$notificationHooks[$pluginId]);
        unset(static::$paymentHooks[$pluginId]);
        unset(static::$userHooks[$pluginId]);
    }

    /**
     * Clear all registered hooks.
     */
    public static function clearAllHooks(): void
    {
        static::$authHooks = [];
        static::$mediaHooks = [];
        static::$searchHooks = [];
        static::$notificationHooks = [];
        static::$paymentHooks = [];
        static::$userHooks = [];
    }

    /**
     * Get all registered hooks (for debugging).
     */
    public static function getAllHooks(): array
    {
        return [
            'auth' => array_keys(static::$authHooks),
            'media' => array_keys(static::$mediaHooks),
            'search' => array_keys(static::$searchHooks),
            'notifications' => array_keys(static::$notificationHooks),
            'payments' => array_keys(static::$paymentHooks),
            'user' => array_keys(static::$userHooks),
        ];
    }
}
