<?php

namespace MCCMS\Http\Controllers\Admin;

use MCCMS\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index(): Response
    {
        return Inertia::render('Dashboard', [
            'stats' => [
                'totalUsers' => 150,
                'totalRevenue' => 12450,
                'totalOrders' => 89,
                'activeServers' => 3,
            ],
        ]);
    }
}
