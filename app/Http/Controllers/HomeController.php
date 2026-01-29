<?php

namespace ExilonCMS\Http\Controllers;

use ExilonCMS\Models\LandingSetting;
use ExilonCMS\Models\Server;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Show the application dashboard.
     */
    public function index()
    {
        // Try to get posts from Blog plugin if available
        $posts = [];
        try {
            if (class_exists('ExilonCMS\Models\Post')) {
                $posts = \ExilonCMS\Models\Post::published()
                    ->with('author')
                    ->latest('published_at')
                    ->take(3)
                    ->get();
            }
        } catch (\Exception $e) {
            // Blog plugin not available or not set up
            $posts = [];
        }

        $server = Server::where('home_display', true)->first();
        $servers = Server::where('home_display', true)->get();

        // Get landing page settings
        $landingSettings = LandingSetting::getAllGrouped();

        return Inertia::render('Home', [
            'message' => setting('home_message'),
            'siteName' => setting('name', 'ExilonCMS'),
            'posts' => $posts,
            'landingSettings' => $landingSettings,
            'server' => $server ? [
                'id' => $server->id,
                'name' => $server->name,
                'address' => $server->address,
                'port' => $server->port,
                'fullAddress' => $server->fullAddress(),
                'joinUrl' => $server->join_url,
                'isOnline' => $server->isOnline(),
                'onlinePlayers' => $server->getOnlinePlayers(),
                'maxPlayers' => $server->getMaxPlayers(),
                'playersPercents' => $server->getPlayersPercents(),
            ] : null,
            'servers' => $servers->map(fn ($s) => [
                'id' => $s->id,
                'name' => $s->name,
                'address' => $s->address,
                'port' => $s->port,
                'fullAddress' => $s->fullAddress(),
                'joinUrl' => $s->join_url,
                'isOnline' => $s->isOnline(),
                'onlinePlayers' => $s->getOnlinePlayers(),
                'maxPlayers' => $s->getMaxPlayers(),
                'playersPercents' => $s->getPlayersPercents(),
            ]),
        ]);
    }
}
