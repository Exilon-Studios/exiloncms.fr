<?php

namespace ExilonCMS\Http\Controllers\Admin;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Models\Setting;
use ExilonCMS\Services\DiscordWebhookService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class IntegrationsController extends Controller
{
    /**
     * Show the integrations settings page.
     */
    public function index(Request $request)
    {
        return Inertia::render('Admin/Settings/Integrations', [
            'webhooks' => [
                'discord_url' => setting('webhooks.discord.url'),
                'discord_enabled' => (bool) setting('webhooks.discord.enabled', false),
                'discord_events' => $this->getDiscordEventsSettings(),
            ],
            'availableEvents' => $this->getAvailableEvents(),
        ]);
    }

    /**
     * Update the integrations settings.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            // Discord webhook
            'discord_url' => ['nullable', 'url'],
            'discord_enabled' => ['nullable', 'boolean'],
            'discord_events' => ['nullable', 'array'],
            'discord_events.*' => ['boolean'],
        ]);

        // Update Discord settings
        $settings = [
            'webhooks.discord.url' => $validated['discord_url'] ?? null,
            'webhooks.discord.enabled' => $request->boolean('discord_enabled', false),
        ];

        // Update Discord events
        $events = $validated['discord_events'] ?? [];
        foreach ($this->getAvailableEvents() as $event => $label) {
            $settings["webhooks.discord.events.{$event}"] = isset($events[$event]) && $events[$event];
        }

        Setting::updateSettings($settings);

        return Redirect::route('admin.settings.integrations')
            ->with('success', 'Intégrations mises à jour avec succès.');
    }

    /**
     * Test a webhook by sending a test notification.
     */
    public function testWebhook(Request $request)
    {
        $request->validate([
            'type' => 'required|in:discord',
        ]);

        $webhookUrl = setting('webhooks.discord.url');

        if (empty($webhookUrl)) {
            return back()->with('error', 'Aucun webhook configuré.');
        }

        /** @var DiscordWebhookService $discord */
        $discord = app(DiscordWebhookService::class);

        $success = $discord->sendNotification(
            webhookUrl: $webhookUrl,
            title: '🧪 Test de webhook',
            description: 'Ceci est un message de test depuis **'.setting('name', 'ExilonCMS')."**.\n\nSi vous voyez ce message, votre webhook est correctement configuré !",
            level: 'info'
        );

        if ($success) {
            return back()->with('success', 'Message de test envoyé avec succès !');
        }

        return back()->with('error', 'Échec de l\'envoi du message de test. Vérifiez l\'URL du webhook.');
    }

    /**
     * Get available webhook events.
     */
    protected function getAvailableEvents(): array
    {
        return [
            'new_user' => 'Nouvel utilisateur',
            'new_order' => 'Nouvelle commande',
            'server_online' => 'Serveur en ligne',
            'server_offline' => 'Serveur hors ligne',
            'security_alert' => 'Alertes de sécurité',
            'system_update' => 'Mises à jour système',
        ];
    }

    /**
     * Get current Discord events settings.
     */
    protected function getDiscordEventsSettings(): array
    {
        $events = [];
        foreach ($this->getAvailableEvents() as $event => $label) {
            $events[$event] = (bool) setting("webhooks.discord.events.{$event}", false);
        }

        return $events;
    }
}
