<?php

namespace ExilonCMS\Plugins\Releases\Http\Controllers\Admin;

use ExilonCMS\Plugins\Releases\Models\Release;
use ExilonCMS\Plugins\Releases\Models\ReleaseChange;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ReleaseController
{
    public function index()
    {
        $releases = Release::with('user', 'changes')
            ->latest('published_at')
            ->paginate(20);

        return Inertia::render('Admin/Releases/Index', [
            'releases' => $releases,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Releases/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'version' => 'required|string|max:50',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'content' => 'required|string',
            'type' => 'required|in:major,minor,patch,prerelease',
            'status' => 'required|in:draft,published',
            'published_at' => 'nullable|date',
            'github_tag' => 'nullable|string|max:255',
            'download_url' => 'nullable|string|max:500',
            'changes' => 'nullable|array',
            'changes.*.category' => 'required|in:feature,fix,change,breaking,performance,security',
            'changes.*.description' => 'required|string',
            'changes.*.breaking' => 'boolean',
        ]);

        $release = Release::create([
            ...$validated,
            'user_id' => auth()->id(),
        ]);

        // Create changes
        if (!empty($validated['changes'])) {
            foreach ($validated['changes'] as $index => $change) {
                ReleaseChange::create([
                    'release_id' => $release->id,
                    'category' => $change['category'],
                    'description' => $change['description'],
                    'breaking' => $change['breaking'] ?? false,
                    'order' => $index,
                ]);
            }
        }

        return redirect()->route('admin.releases.index')
            ->with('success', 'Release created successfully.');
    }

    public function show(Release $release)
    {
        $release->load('user', 'changes');

        return Inertia::render('Admin/Releases/Show', [
            'release' => $release,
        ]);
    }

    public function edit(Release $release)
    {
        $release->load('changes');

        return Inertia::render('Admin/Releases/Edit', [
            'release' => $release,
        ]);
    }

    public function update(Request $request, Release $release)
    {
        $validated = $request->validate([
            'version' => 'required|string|max:50',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'content' => 'required|string',
            'type' => 'required|in:major,minor,patch,prerelease',
            'status' => 'required|in:draft,published',
            'published_at' => 'nullable|date',
            'github_tag' => 'nullable|string|max:255',
            'download_url' => 'nullable|string|max:500',
            'changes' => 'nullable|array',
            'changes.*.id' => 'nullable|integer',
            'changes.*.category' => 'required|in:feature,fix,change,breaking,performance,security',
            'changes.*.description' => 'required|string',
            'changes.*.breaking' => 'boolean',
        ]);

        $release->update($validated);

        // Sync changes
        if (!empty($validated['changes'])) {
            // Delete removed changes
            $changeIds = array_filter(array_column($validated['changes'], 'id'));
            ReleaseChange::where('release_id', $release->id())
                ->whereNotIn('id', $changeIds)
                ->delete();

            // Update or create changes
            foreach ($validated['changes'] as $index => $change) {
                if (isset($change['id'])) {
                    ReleaseChange::where('id', $change['id'])->update([
                        'category' => $change['category'],
                        'description' => $change['description'],
                        'breaking' => $change['breaking'] ?? false,
                        'order' => $index,
                    ]);
                } else {
                    ReleaseChange::create([
                        'release_id' => $release->id,
                        'category' => $change['category'],
                        'description' => $change['description'],
                        'breaking' => $change['breaking'] ?? false,
                        'order' => $index,
                    ]);
                }
            }
        }

        return redirect()->route('admin.releases.index')
            ->with('success', 'Release updated successfully.');
    }

    public function destroy(Release $release)
    {
        $release->delete();

        return redirect()->route('admin.releases.index')
            ->with('success', 'Release deleted successfully.');
    }
}
