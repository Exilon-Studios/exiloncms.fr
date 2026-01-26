<?php

namespace ExilonCMS\Plugins\Votes\Http\Controllers\Admin;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Plugins\Votes\Models\VoteSite;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VoteSiteController extends Controller
{
    public function index()
    {
        $sites = VoteSite::withCount('votes')->orderBy('priority')->get();

        return Inertia::render('Admin/Votes/Sites/Index', [
            'sites' => $sites,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Votes/Sites/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'required|url|max:500',
            'vote_url' => 'required|url|max:500',
            'vote_key' => 'required|string|max:100',
            'priority' => 'integer|min:0|max:999',
            'is_enabled' => 'boolean',
        ]);

        VoteSite::create($validated);

        return redirect()
            ->route('admin.votes.sites.index')
            ->with('success', 'Vote site created successfully.');
    }

    public function edit(VoteSite $site)
    {
        return Inertia::render('Admin/Votes/Sites/Edit', [
            'site' => $site,
        ]);
    }

    public function update(Request $request, VoteSite $site)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'required|url|max:500',
            'vote_url' => 'required|url|max:500',
            'vote_key' => 'required|string|max:100',
            'priority' => 'integer|min:0|max:999',
            'is_enabled' => 'boolean',
        ]);

        $site->update($validated);

        return redirect()
            ->route('admin.votes.sites.index')
            ->with('success', 'Vote site updated successfully.');
    }

    public function destroy(VoteSite $site)
    {
        $site->delete();

        return back()->with('success', 'Vote site deleted successfully.');
    }

    public function toggle(VoteSite $site)
    {
        $site->update(['is_enabled' => !$site->is_enabled]);

        return back()->with('success', 'Vote site status updated.');
    }
}
