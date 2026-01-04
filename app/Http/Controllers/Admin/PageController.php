<?php

namespace ExilonCMS\Http\Controllers\Admin;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Http\Requests\PageRequest;
use ExilonCMS\Models\Page;
use ExilonCMS\Models\Role;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/Pages/Index', ['pages' => Page::get()]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Pages/Create', [
            'pendingId' => old('pending_id', Str::uuid()),
            'roles' => Role::orderByDesc('power')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PageRequest $request)
    {
        $page = Page::create(Arr::except($request->validated(), 'roles'));

        $page->persistPendingAttachments($request->input('pending_id'));
        $page->roles()->sync($request->input('roles'));

        return to_route('admin.pages.index')
            ->with('success', trans('messages.status.success'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Page $page)
    {
        return Inertia::render('Admin/Pages/Edit', [
            'page' => $page,
            'roles' => Role::orderByDesc('power')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PageRequest $request, Page $page)
    {
        $page->update(Arr::except($request->validated(), 'roles'));
        $page->roles()->sync($request->input('roles'));

        return to_route('admin.pages.index')
            ->with('success', trans('messages.status.success'));
    }

    /**
     * Show the Puck editor for the specified page.
     */
    public function puckEditor(Page $page)
    {
        return Inertia::render('Admin/Pages/PuckEditor', [
            'page' => $page,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @throws \LogicException
     */
    public function destroy(Page $page)
    {
        $page->delete();

        return to_route('admin.pages.index')
            ->with('success', trans('messages.status.success'));
    }
}
