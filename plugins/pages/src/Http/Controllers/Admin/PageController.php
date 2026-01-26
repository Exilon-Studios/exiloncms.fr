<?php

namespace ExilonCMS\Plugins\Pages\Http\Controllers\Admin;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Plugins\Pages\Models\Page;
use ExilonCMS\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PageController extends Controller
{
    public function index(Request $request)
    {
        $pages = Page::with(['user:id,name', 'roles'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/Pages/Index', [
            'pages' => $pages,
        ]);
    }

    public function create()
    {
        $roles = Role::all();

        return Inertia::render('Admin/Pages/Create', [
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:pages,slug',
            'content' => 'required|string',
            'excerpt' => 'nullable|string|max:500',
            'is_enabled' => 'boolean',
            'role_ids' => 'array',
            'role_ids.*' => 'exists:roles,id',
        ]);

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['title']);
        $validated['user_id'] = $request->user()->id;

        $page = Page::create($validated);

        if (!empty($validated['role_ids'])) {
            $page->roles()->attach($validated['role_ids']);
        }

        return redirect()
            ->route('admin.pages.index')
            ->with('success', 'Page created successfully.');
    }

    public function edit(Page $page)
    {
        $page->load('roles');
        $roles = Role::all();

        return Inertia::render('Admin/Pages/Edit', [
            'page' => $page,
            'roles' => $roles,
        ]);
    }

    public function update(Request $request, Page $page)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:pages,slug,'.$page->id,
            'content' => 'required|string',
            'excerpt' => 'nullable|string|max:500',
            'is_enabled' => 'boolean',
            'role_ids' => 'array',
            'role_ids.*' => 'exists:roles,id',
        ]);

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['title']);

        $page->update($validated);

        if (isset($validated['role_ids'])) {
            $page->roles()->sync($validated['role_ids']);
        }

        return back()->with('success', 'Page updated successfully.');
    }

    public function destroy(Page $page)
    {
        $page->delete();

        return redirect()
            ->route('admin.pages.index')
            ->with('success', 'Page deleted successfully.');
    }

    public function toggle(Page $page)
    {
        $page->update(['is_enabled' => !$page->is_enabled]);

        return back()->with('success', 'Page status updated.');
    }
}
