<?php

namespace ExilonCMS\Contracts\Plugins;

/**
 * Notification Hook Contract
 *
 * Plugins can implement this to:
 * - Add notification channels (Email, SMS, Push, Discord, etc.)
 * - Add notification types
 * - Add notification templates
 *
 * Example implementation in plugin.json:
 * "hooks": {
 *   "notifications": {
 *     "channels": ["DiscordWebhook", "TelegramBot", "TwilioSMS"],
 *     "types": ["shop.order_completed", "server.offline"]
 *   }
 * }
 */
interface NotificationHook
{
    /**
     * Register notification channels.
     *
     * @return array<string, callable>
     */
    public function registerNotificationChannels(): array;

    /**
     * Register custom notification types.
     *
     * @return array<string, array{label: string, icon: string, category: string}>
     */
    public function registerNotificationTypes(): array;

    /**
     * Send notification through custom channel.
     *
     * @param string $channel
     * @param \ExilonCMS\Models\User $user
     * @param array $data
     * @return bool
     */
    public function sendNotification(string $channel, $user, array $data): bool;

    /**
     * Get notification template.
     *
     * @param string $type
     * @param string $locale
     * @return array{subject: string, body: string, html: string}
     */
    public function getNotificationTemplate(string $type, string $locale): array;

    /**
     * Validate notification configuration.
     *
     * @param string $channel
     * @return array{valid: bool, error?: string}
     */
    public function validateNotificationConfig(string $channel): array;
}
