<?php

namespace ExilonCMS\Http\Controllers;

use ExilonCMS\Extensions\Widget\WidgetManager;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Display the user dashboard.
     */
    public function index(Request $request, WidgetManager $widgetManager): Response
    {
        $user = $request->user();

        $allWidgets = $widgetManager->getWidgetsFromPlugins($user);

        // Separate sidebar widgets from regular cards
        $sidebarWidgets = $allWidgets->filter(fn ($widget) => ($widget['type'] ?? 'widget') === 'sidebar')->values();
        $dashboardCards = $allWidgets->filter(fn ($widget) => ($widget['type'] ?? 'widget') === 'card')->values();
        $dashboardWidgets = $allWidgets->filter(fn ($widget) => ($widget['type'] ?? 'widget') === 'widget')->values();

        return Inertia::render('Dashboard/Index', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'money' => $user->money,
                'avatar' => $user->avatar,
                'role' => $user->role,
                'created_at' => $user->created_at,
            ],
            'stats' => [
                'account_age' => $user->created_at?->diffForHumans(),
                'money' => $user->money,
            ],
            'settings' => [
                'money' => setting('money', 'Points'),
            ],
            // Get dashboard cards from plugins
            'dashboardCards' => $dashboardCards,
            // Get dashboard widgets from plugins
            'dashboardWidgets' => $dashboardWidgets,
            // Get sidebar widgets (e.g., shop card with recent orders)
            'dashboardSidebarWidgets' => $sidebarWidgets,
        ]);
    }
}
