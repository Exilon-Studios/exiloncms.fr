<?php

namespace ExilonCMS\Plugins\Pages\Http\Controllers\Public;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Plugins\Pages\Models\Page;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    public function show(Request $request, string $slug)
    {
        $page = Page::where('slug', $slug)
            ->enabled()
            ->with('roles')
            ->firstOrFail();

        // Check role-based access
        if ($page->roles->isNotEmpty()) {
            $user = $request->user();

            if (! $user) {
                return redirect()->route('login')->with('warning', 'Please log in to view this page.');
            }

            $hasAccess = $page->roles->contains($user->role_id);

            if (! $hasAccess) {
                abort(403, 'You do not have permission to view this page.');
            }
        }

        return Inertia::render('Pages/Show', [
            'page' => $page,
        ]);
    }

    public function index(Request $request)
    {
        $pages = Page::enabled()
            ->whereDoesntHave('roles')
            ->orderBy('title')
            ->get();

        return Inertia::render('Pages/Index', [
            'pages' => $pages,
        ]);
    }
}
