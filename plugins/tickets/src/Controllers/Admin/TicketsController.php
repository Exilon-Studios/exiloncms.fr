<?php

namespace ExilonCMS\Plugins\Tickets\Controllers\Admin;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TicketsController
{
    public function index()
    {
        $stats = [
            'total_tickets' => 0,
            'open_tickets' => 0,
            'pending_tickets' => 0,
            'closed_tickets' => 0,
        ];

        try {
            $ticketModel = class_exists('ExilonCMS\Plugins\Tickets\Models\Ticket')
                ? new \ExilonCMS\Plugins\Tickets\Models\Ticket
                : null;

            if ($ticketModel && method_exists($ticketModel, 'count')) {
                $stats['total_tickets'] = $ticketModel::count();
            }
        } catch (\Exception $e) {
            // Table might not exist, use defaults
        }

        return Inertia::render('Admin/Tickets/Index', [
            'stats' => $stats,
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

        if (! $plugin) {
            return redirect()->back()->with('error', 'Tickets plugin not found.');
        }

        $configFields = collect($plugin->getConfigFields())->keyBy('name');

        foreach ($request->all() as $key => $value) {
            if (! $configFields->has($key)) {
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
