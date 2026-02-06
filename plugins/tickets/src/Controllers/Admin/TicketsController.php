<?php

namespace ExilonCMS\Plugins\Tickets\Controllers\Admin;

use ExilonCMS\Plugins\Tickets\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TicketsController
{
    public function index()
    {
        $stats = [
            'total_tickets' => Ticket::count(),
            'open_tickets' => Ticket::open()->count(),
            'pending_tickets' => Ticket::pending()->count(),
            'closed_tickets' => Ticket::closed()->count(),
        ];

        $tickets = Ticket::with(['user', 'category'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/Tickets/Index', [
            'stats' => $stats,
            'tickets' => $tickets,
        ]);
    }

    public function settings(Request $request)
    {
        $configFile = base_path('plugins/tickets/config/config.php');
        $config = file_exists($configFile) ? require $configFile : [];

        $settings = [];
        foreach ($config as $key => $field) {
            $settingKey = "tickets.{$key}";
            $settings[$key] = setting($settingKey, $field['default'] ?? null);
        }

        return Inertia::render('Admin/Tickets/Settings', [
            'config' => $config,
            'settings' => $settings,
        ]);
    }

    public function updateSettings(Request $request)
    {
        $plugin = app(\ExilonCMS\Classes\Plugin\PluginLoader::class)->getPlugin('tickets');

        if (!$plugin) {
            return redirect()->back()->with('error', 'Tickets plugin not found.');
        }

        $configFields = collect($plugin->getConfigFields())->keyBy('name');

        foreach ($request->all() as $key => $value) {
            if (!$configFields->has($key)) {
                continue;
            }

            $field = $configFields->get($key);
            $settingKey = "plugin.tickets.{$key}";

            $processedValue = match ($field['type'] ?? 'text') {
                'boolean', 'toggle' => (bool) $value,
                'integer', 'number' => is_numeric($value) ? (int) $value : 0,
                default => $value,
            };

            \ExilonCMS\Models\Setting::updateOrCreate(
                ['name' => $settingKey],
                ['value' => is_array($processedValue) ? json_encode($processedValue) : $processedValue]
            );
        }

        return redirect()->back()->with('success', 'Configuration updated successfully.');
    }
}
