<?php

namespace ExilonCMS\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the user dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

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
            'dashboardCards' => [],
            'dashboardWidgets' => [],
            'dashboardSidebarWidgets' => [],
        ]);
    }
}
