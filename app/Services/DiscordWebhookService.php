<?php

namespace ExilonCMS\Services;

use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Discord Webhook Service
 *
 * Sends notifications to Discord via webhooks
 */
class DiscordWebhookService
{
    /**
     * Send a message to a Discord webhook.
     *
     * @param  string  $webhookUrl  The Discord webhook URL
     * @param  string  $content  The message content
     * @param  string|null  $title  Optional embed title
     * @param  string|null  $description  Optional embed description
     * @param  int|null  $color  Optional embed color (decimal)
     * @param  array|null  $fields  Optional embed fields
     * @param  string|null  $authorName  Optional author name
     * @param  string|null  $authorIcon  Optional author icon URL
     * @param  string|null  $thumbnail  Optional thumbnail URL
     * @return bool True if successful, false otherwise
     */
    public function send(
        string $webhookUrl,
        string $content,
        ?string $title = null,
        ?string $description = null,
        ?int $color = null,
        ?array $fields = null,
        ?string $authorName = null,
        ?string $authorIcon = null,
        ?string $thumbnail = null
    ): bool {
        if (empty($webhookUrl)) {
            return false;
        }

        $payload = [
            'content' => $content,
        ];

        // Add embed if any additional fields are provided
        if ($title || $description || $color || $fields || $authorName || $thumbnail) {
            $embed = [];

            if ($title) {
                $embed['title'] = $title;
            }

            if ($description) {
                $embed['description'] = $description;
            }

            if ($color !== null) {
                $embed['color'] = $color;
            }

            if ($fields && ! empty($fields)) {
                $embed['fields'] = $fields;
            }

            if ($authorName) {
                $embed['author'] = [
                    'name' => $authorName,
                ];
                if ($authorIcon) {
                    $embed['author']['icon_url'] = $authorIcon;
                }
            }

            if ($thumbnail) {
                $embed['thumbnail'] = [
                    'url' => $thumbnail,
                ];
            }

            // Add timestamp
            $embed['timestamp'] = now()->toIso8601String();

            $payload['embeds'] = [$embed];
        }

        try {
            $response = Http::timeout(10)->post($webhookUrl, $payload);

            if ($response->successful()) {
                return true;
            }

            Log::warning('Discord webhook failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return false;
        } catch (Exception $e) {
            Log::error('Discord webhook error', [
                'message' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Get a colored embed based on notification level.
     */
    public function getLevelColor(string $level): int
    {
        return match ($level) {
            'success' => 5763719, // Green
            'warning' => 16705372, // Yellow/Orange
            'danger', 'error' => 15548997, // Red
            'info' => 5793266, // Blue
            default => 5793266,
        };
    }

    /**
     * Send a notification embed.
     */
    public function sendNotification(
        string $webhookUrl,
        string $title,
        string $description,
        string $level = 'info',
        ?array $fields = null,
        ?string $thumbnail = null
    ): bool {
        return $this->send(
            webhookUrl: $webhookUrl,
            content: '',
            title: $title,
            description: $description,
            color: $this->getLevelColor($level),
            fields: $fields,
            thumbnail: $thumbnail
        );
    }

    /**
     * Send a new user notification.
     */
    public function sendNewUserNotification(
        string $webhookUrl,
        string $userName,
        string $userEmail,
        ?string $userAvatar = null
    ): bool {
        return $this->sendNotification(
            webhookUrl: $webhookUrl,
            title: '👤 Nouvel utilisateur',
            description: "**{userName}** vient de s'inscrire !\n\nEmail: `{userEmail}`",
            level: 'success',
            thumbnail: $userAvatar
        );
    }

    /**
     * Send a new order notification.
     */
    public function sendNewOrderNotification(
        string $webhookUrl,
        string $orderId,
        string $userName,
        float $total,
        array $items = []
    ): bool {
        $fields = [
            [
                'name' => 'Commande',
                'value' => "#{$orderId}",
                'inline' => true,
            ],
            [
                'name' => 'Client',
                'value' => $userName,
                'inline' => true,
            ],
            [
                'name' => 'Total',
                'value' => number_format($total, 2).' €',
                'inline' => true,
            ],
        ];

        if (! empty($items)) {
            $itemsList = collect($items)->take(3)->map(function ($item) {
                return "- {$item['name']} x{$item['quantity']}";
            })->implode("\n");

            if (count($items) > 3) {
                $itemsList .= "\n... et ".(count($items) - 3).' autres';
            }

            $fields[] = [
                'name' => 'Articles',
                'value' => $itemsList,
                'inline' => false,
            ];
        }

        return $this->sendNotification(
            webhookUrl: $webhookUrl,
            title: '🛒 Nouvelle commande',
            description: 'Une nouvelle commande a été passée sur la boutique.',
            level: 'success',
            fields: $fields
        );
    }

    /**
     * Send a server status notification.
     */
    public function sendServerStatusNotification(
        string $webhookUrl,
        string $serverName,
        bool $isOnline,
        ?int $playerCount = null,
        ?int $maxPlayers = null
    ): bool {
        $status = $isOnline ? '🟢 En ligne' : '🔴 Hors ligne';
        $level = $isOnline ? 'success' : 'danger';

        $description = "Le serveur **{$serverName}** est maintenant {$status}.";

        if ($playerCount !== null && $maxPlayers !== null) {
            $description .= "\n\n**Joueurs:** {$playerCount}/{$maxPlayers}";
        }

        return $this->sendNotification(
            webhookUrl: $webhookUrl,
            title: "🖥️ Serveur {$serverName}",
            description: $description,
            level: $level
        );
    }

    /**
     * Send a security alert notification.
     */
    public function sendSecurityAlert(
        string $webhookUrl,
        string $title,
        string $description,
        ?string $ipAddress = null,
        ?string $userAgent = null
    ): bool {
        $fields = [];

        if ($ipAddress) {
            $fields[] = [
                'name' => 'Adresse IP',
                'value' => "`{$ipAddress}`",
                'inline' => true,
            ];
        }

        return $this->sendNotification(
            webhookUrl: $webhookUrl,
            title: '🚨 '.$title,
            description: $description,
            level: 'danger',
            fields: empty($fields) ? null : $fields
        );
    }

    /**
     * Send a system update notification.
     */
    public function sendUpdateNotification(
        string $webhookUrl,
        string $component,
        string $version,
        string $description = ''
    ): bool {
        return $this->sendNotification(
            webhookUrl: $webhookUrl,
            title: '🔄 Mise à jour disponible',
            description: "**{$component}** version **{$version}** est disponible !\n\n{$description}",
            level: 'info'
        );
    }
}
