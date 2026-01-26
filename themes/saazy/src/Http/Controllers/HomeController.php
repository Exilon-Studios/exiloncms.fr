<?php

namespace Themes\Saazy\Http\Controllers;

use ExilonCMS\Models\Post;
use ExilonCMS\Models\Server;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the theme homepage.
     */
    public function index(Request $request)
    {
        $servers = Server::where('is_active', true)->get();
        $posts = Post::where('published', true)
            ->orderBy('created_at', 'desc')
            ->take(6)
            ->get();

        return Inertia::render('Theme/Home', [
            'siteName' => setting('name', config('app.name')),
            'servers' => $servers,
            'posts' => $posts,
            'settings' => [
                'description' => setting('description'),
                'logo' => setting('logo'),
                'background' => setting('background'),
            ],
        ]);
    }

    /**
     * Display a theme page.
     */
    public function page(Request $request, $slug)
    {
        $page = Post::where('slug', $slug)
            ->where('published', true)
            ->firstOrFail();

        return Inertia::render('Theme/Page', [
            'page' => $page,
        ]);
    }
}
