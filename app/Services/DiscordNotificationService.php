<?php

namespace ExilonCMS\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Service for sending Discord webhook notifications
 */
class DiscordNotificationService
{
    private ?string $webhookUrl;

    private string $cmsName;

    private string $cmsUrl;

    public function __construct()
    {
        $this->webhookUrl = env('DISCORD_UPDATE_WEBHOOK_URL');
        $this->cmsName = setting('name', 'ExilonCMS');
        $this->cmsUrl = config('app.url');
    }

    /**
     * Check if Discord notifications are enabled
     */
    public function isEnabled(): bool
    {
        return ! empty($this->webhookUrl);
    }

    /**
     * Send notification about CMS update
     */
    public function notifyCmsUpdate(string $currentVersion, string $newVersion, ?string $changelog = null): bool
    {
        if (! $this->isEnabled()) {
            return false;
        }

        $embed = [
            'title' => '🚀 New ExilonCMS Update Available!',
            'description' => "A new version of ExilonCMS is available for **{$this->cmsName}**.",
            'color' => 5814783, // Blue
            'fields' => [
                [
                    'name' => 'Current Version',
                    'value' => $currentVersion,
                    'inline' => true,
                ],
                [
                    'name' => 'Latest Version',
                    'value' => $newVersion,
                    'inline' => true,
                ],
            ],
            'timestamp' => now()->toIso8601String(),
            'footer' => [
                'text' => 'ExilonCMS Update Notifier',
                'icon_url' => 'https://exiloncms.fr/logo.png',
            ],
        ];

        if ($changelog) {
            $embed['fields'][] = [
                'name' => 'What\'s New',
                'value' => substr($changelog, 0, 1000).(strlen($changelog) > 1000 ? '...' : ''),
                'inline' => false,
            ];
        }

        return $this->sendEmbed($embed);
    }

    /**
     * Send notification about plugin update
     */
    public function notifyPluginUpdate(string $pluginName, string $pluginId, string $currentVersion, string $newVersion): bool
    {
        if (! $this->isEnabled()) {
            return false;
        }

        $embed = [
            'title' => '🧩 Plugin Update Available',
            'description' => "An update is available for the **{$pluginName}** plugin on **{$this->cmsName}**.",
            'color' => 15158332, // Orange
            'fields' => [
                [
                    'name' => 'Plugin',
                    'value' => $pluginName,
                    'inline' => true,
                ],
                [
                    'name' => 'Current Version',
                    'value' => $currentVersion,
                    'inline' => true,
                ],
                [
                    'name' => 'Latest Version',
                    'value' => $newVersion,
                    'inline' => true,
                ],
            ],
            'timestamp' => now()->toIso8601String(),
        ];

        return $this->sendEmbed($embed);
    }

    /**
     * Send notification about theme update
     */
    public function notifyThemeUpdate(string $themeName, string $themeId, string $currentVersion, string $newVersion): bool
    {
        if (! $this->isEnabled()) {
            return false;
        }

        $embed = [
            'title' => '🎨 Theme Update Available',
            'description' => "An update is available for the **{$themeName}** theme on **{$this->cmsName}**.",
            'color' => 3066993, // Green
            'fields' => [
                [
                    'name' => 'Theme',
                    'value' => $themeName,
                    'inline' => true,
                ],
                [
                    'name' => 'Current Version',
                    'value' => $currentVersion,
                    'inline' => true,
                ],
                [
                    'name' => 'Latest Version',
                    'value' => $newVersion,
                    'inline' => true,
                ],
            ],
            'timestamp' => now()->toIso8601String(),
        ];

        return $this->sendEmbed($embed);
    }

    /**
     * Send notification about multiple updates
     */
    public function notifyMultipleUpdates(int $cmsCount, int $pluginCount, int $themeCount): bool
    {
        if (! $this->isEnabled()) {
            return false;
        }

        $totalUpdates = $cmsCount + $pluginCount + $themeCount;

        $description = "There are **{$totalUpdates} update(s)** available for **{$this->cmsName}**:\n";

        if ($cmsCount > 0) {
            $description .= "- {$cmsCount} CMS update(s)\n";
        }
        if ($pluginCount > 0) {
            $description .= "- {$pluginCount} plugin update(s)\n";
        }
        if ($themeCount > 0) {
            $description .= "- {$themeCount} theme update(s)\n";
        }

        $embed = [
            'title' => '📦 Updates Available',
            'description' => $description,
            'color' => 15105570, // Red
            'timestamp' => now()->toIso8601String(),
            'footer' => [
                'text' => 'Check your admin panel for more details',
            ],
        ];

        return $this->sendEmbed($embed);
    }

    /**
     * Send a custom Discord embed
     */
    protected function sendEmbed(array $embed): bool
    {
        if (! $this->isEnabled()) {
            return false;
        }

        try {
            $response = Http::timeout(10)->post($this->webhookUrl, [
                'embeds' => [$embed],
            ]);

            if ($response->successful()) {
                Log::info('Discord notification sent successfully');

                return true;
            }

            Log::warning('Failed to send Discord notification', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return false;
        } catch (\Exception $e) {
            Log::error('Error sending Discord notification', [
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Send a simple text message
     */
    public function sendMessage(string $message): bool
    {
        if (! $this->isEnabled()) {
            return false;
        }

        try {
            $response = Http::timeout(10)->post($this->webhookUrl, [
                'content' => $message,
            ]);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Error sending Discord message', [
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }
}
