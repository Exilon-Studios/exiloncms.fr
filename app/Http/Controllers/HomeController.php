<?php

namespace ExilonCMS\Http\Controllers;

use ExilonCMS\Models\Post;
use ExilonCMS\Models\Server;
use ExilonCMS\Models\LandingSetting;
use Inertia\Inertia;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * Show the application dashboard.
     */
    public function index()
    {
        $posts = Post::published()
            ->with('author')
            ->latest('published_at')
            ->take(3)
            ->get();

        $server = Server::where('home_display', true)->first();
        $servers = Server::where('home_display', true)->get();

        // Get landing page settings
        $landingSettings = LandingSetting::getAllGrouped();

        // Add puck_data if exists
        $puckData = LandingSetting::where('key', 'puck_data')->first();
        if ($puckData) {
            $landingSettings['puck_data'] = $puckData->value;
        }

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
            'servers' => $servers->map(fn($s) => [
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

    /**
     * Show the Puck editor for the landing page.
     */
    public function edit()
    {
        $landingSettings = LandingSetting::getAllGrouped();

        // Get puck data if exists
        $puckData = LandingSetting::where('key', 'puck_data')->first()?->value;

        // Decode JSON if it's a string, otherwise use as-is
        $initialData = null;
        if ($puckData) {
            if (is_string($puckData)) {
                $initialData = json_decode($puckData, true);
            } elseif (is_array($puckData)) {
                $initialData = $puckData;
            }
        }

        return Inertia::render('PuckEdit', [
            'landingSettings' => $landingSettings,
            'initialData' => $initialData,
            'locale' => app()->getLocale(),
        ]);
    }

    /**
     * Save the landing page settings.
     */
    public function saveEdit(Request $request)
    {
        \Log::info('Puck save request received', ['data' => $request->all()]);

        $data = $request->validate([
            'puck_data' => ['required', 'string'],
        ]);

        \Log::info('Puck data validated', ['puck_data' => $data['puck_data']]);

        // Save puck data
        LandingSetting::updateOrCreate(
            ['key' => 'puck_data'],
            [
                'value' => $data['puck_data'],
                'type' => 'json',
            ]
        );

        \Log::info('Puck data saved successfully');

        return response()->json([
            'success' => true,
            'message' => 'Landing page updated successfully'
        ]);
    }
}
