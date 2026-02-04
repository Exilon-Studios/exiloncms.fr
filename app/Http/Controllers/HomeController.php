<?php

namespace ExilonCMS\Http\Controllers;

use ExilonCMS\Models\LandingSetting;
use ExilonCMS\Models\Server;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Show the application dashboard.
     * Theme-aware - will use theme's Home page if available.
     */
    public function index()
    {
        // Get active theme from ThemeLoader
        $themeLoader = app(\ExilonCMS\Extensions\Theme\ThemeLoader::class);
        $activeTheme = $themeLoader->getActiveThemeId();

        // Check if the active theme has a custom Home page
        // Theme pages are at: themes/{theme}/resources/views/{Page}.tsx
        $hasThemeHome = false;
        if ($activeTheme && $activeTheme !== 'default') {
            $themeHomePath = base_path("themes/{$activeTheme}/resources/views/Home.tsx");
            $hasThemeHome = file_exists($themeHomePath);
        }

        // Get enabled plugins for dynamic content
        $enabledPluginsValue = setting('enabled_plugins', []);
        if (is_string($enabledPluginsValue)) {
            $enabledPlugins = json_decode($enabledPluginsValue, true) ?? [];
        } elseif (is_array($enabledPluginsValue) && isset($enabledPluginsValue['enabled_plugins'])) {
            $enabledPlugins = $enabledPluginsValue['enabled_plugins'];
        } else {
            $enabledPlugins = (array) $enabledPluginsValue;
        }

        // Try to get posts from Blog plugin if available
        $posts = [];
        try {
            if (class_exists('ExilonCMS\Models\Post')) {
                $posts = \ExilonCMS\Models\Post::published()
                    ->with(['author', 'category'])
                    ->latest('published_at')
                    ->take(6)
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

        // Prepare common props for both core and theme pages
        $props = [
            'message' => setting('home_message'),
            'siteName' => setting('name', 'ExilonCMS'),
            'posts' => $posts,
            'landingSettings' => $landingSettings,
            'enabledPlugins' => $enabledPlugins,
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
        ];

        // Share active theme info for the frontend resolver
        Inertia::share('activeTheme', $activeTheme);

        // Always render 'Home' - the theme override is handled in app.tsx resolve
        return Inertia::render('Home', $props);
    }
}
