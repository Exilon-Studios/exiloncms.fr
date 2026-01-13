<?php

namespace ExilonCMS\Services;

use ExilonCMS\Models\Notification;
use ExilonCMS\Models\Setting;
use ExilonCMS\Models\User;
use ExilonCMS\Models\Role;

/**
 * Central notification service
 *
 * Handles creating notifications for users and sending webhook notifications
 */
class NotificationService
{
    protected DiscordWebhookService $discord;

    public function __construct(DiscordWebhookService $discord)
    {
        $this->discord = $discord;
    }

    /**
     * Check if a webhook event is enabled.
     */
    protected function isDiscordEventEnabled(string $event): bool
    {
        return (bool) setting("webhooks.discord.events.{$event}", false)
            && (bool) setting('webhooks.discord.enabled', false);
    }

    /**
     * Get the Discord webhook URL.
     */
    protected function getDiscordWebhookUrl(): ?string
    {
        return setting('webhooks.discord.url');
    }

    /**
     * Send a notification to admins.
     *
     * @param string $content Notification content
     * @param string $level Notification level (info, success, warning, danger)
     * @param string|null $link Optional link
     * @param int|null $authorId Optional author ID
     * @return int Number of admins notified
     */
    public function notifyAdmins(string $content, string $level = 'info', ?string $link = null, ?int $authorId = null): int
    {
        $adminRole = Role::where('is_admin', true)->first();

        if (!$adminRole) {
            return 0;
        }

        $admins = User::where('role_id', $adminRole->id)->get();

        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'author_id' => $authorId,
                'level' => $level,
                'content' => $content,
                'link' => $link,
            ]);
        }

        return $admins->count();
    }

    /**
     * Notify when a new user registers.
     */
    public function newUserRegistered(User $user): void
    {
        // Send in-app notification to admins
        $this->notifyAdmins(
            content: "Nouvel utilisateur : **{$user->name}** ({$user->email})",
            level: 'info',
            link: '/admin/users/' . $user->id
        );

        // Send Discord webhook if enabled
        if ($this->isDiscordEventEnabled('new_user')) {
            $webhookUrl = $this->getDiscordWebhookUrl();
            if ($webhookUrl) {
                $this->discord->sendNewUserNotification(
                    webhookUrl: $webhookUrl,
                    userName: $user->name,
                    userEmail: $user->email,
                    userAvatar: $user->getAvatar()
                );
            }
        }
    }

    /**
     * Notify when a new order is placed.
     */
    public function newOrderPlaced(int $orderId, string $userName, float $total, array $items = []): void
    {
        // Send in-app notification to admins
        $this->notifyAdmins(
            content: "Nouvelle commande #{$orderId} de **{$userName}** d'un montant de **{$total}€**",
            level: 'success',
            link: '/admin/shop/orders/' . $orderId
        );

        // Send Discord webhook if enabled
        if ($this->isDiscordEventEnabled('new_order')) {
            $webhookUrl = $this->getDiscordWebhookUrl();
            if ($webhookUrl) {
                $this->discord->sendNewOrderNotification(
                    webhookUrl: $webhookUrl,
                    orderId: (string) $orderId,
                    userName: $userName,
                    total: $total,
                    items: $items
                );
            }
        }
    }

    /**
     * Notify when server comes online.
     */
    public function serverOnline(string $serverName, int $playerCount = 0, int $maxPlayers = 0): void
    {
        // Send in-app notification to admins
        $message = "Le serveur **{$serverName}** est en ligne";
        if ($playerCount > 0) {
            $message .= " ({$playerCount}/{$maxPlayers} joueurs)";
        }

        $this->notifyAdmins(
            content: $message,
            level: 'success'
        );

        // Send Discord webhook if enabled
        if ($this->isDiscordEventEnabled('server_online')) {
            $webhookUrl = $this->getDiscordWebhookUrl();
            if ($webhookUrl) {
                $this->discord->sendServerStatusNotification(
                    webhookUrl: $webhookUrl,
                    serverName: $serverName,
                    isOnline: true,
                    playerCount: $playerCount,
                    maxPlayers: $maxPlayers > 0 ? $maxPlayers : null
                );
            }
        }
    }

    /**
     * Notify when server goes offline.
     */
    public function serverOffline(string $serverName): void
    {
        // Send in-app notification to admins
        $this->notifyAdmins(
            content: "Le serveur **{$serverName}** est hors ligne !",
            level: 'danger'
        );

        // Send Discord webhook if enabled
        if ($this->isDiscordEventEnabled('server_offline')) {
            $webhookUrl = $this->getDiscordWebhookUrl();
            if ($webhookUrl) {
                $this->discord->sendServerStatusNotification(
                    webhookUrl: $webhookUrl,
                    serverName: $serverName,
                    isOnline: false
                );
            }
        }
    }

    /**
     * Send a security alert.
     */
    public function securityAlert(string $title, string $description, ?string $ipAddress = null, ?int $userId = null): void
    {
        // Send in-app notification to admins
        $content = "🚨 **{$title}**\n\n{$description}";
        $this->notifyAdmins(
            content: $content,
            level: 'danger',
            link: $userId ? '/admin/users/' . $userId : null
        );

        // Send Discord webhook if enabled
        if ($this->isDiscordEventEnabled('security_alert')) {
            $webhookUrl = $this->getDiscordWebhookUrl();
            if ($webhookUrl) {
                $this->discord->sendSecurityAlert(
                    webhookUrl: $webhookUrl,
                    title: $title,
                    description: $description,
                    ipAddress: $ipAddress
                );
            }
        }
    }

    /**
     * Notify about system updates.
     */
    public function systemUpdate(string $component, string $version, string $description = ''): void
    {
        // Send in-app notification to admins
        $this->notifyAdmins(
            content: "Mise à jour disponible : **{$component}** v{$version}\n\n{$description}",
            level: 'info'
        );

        // Send Discord webhook if enabled
        if ($this->isDiscordEventEnabled('system_update')) {
            $webhookUrl = $this->getDiscordWebhookUrl();
            if ($webhookUrl) {
                $this->discord->sendUpdateNotification(
                    webhookUrl: $webhookUrl,
                    component: $component,
                    version: $version,
                    description: $description
                );
            }
        }
    }

    /**
     * Create a notification for a specific user.
     */
    public function notifyUser(int $userId, string $content, string $level = 'info', ?string $link = null): void
    {
        Notification::create([
            'user_id' => $userId,
            'level' => $level,
            'content' => $content,
            'link' => $link,
        ]);
    }
}
