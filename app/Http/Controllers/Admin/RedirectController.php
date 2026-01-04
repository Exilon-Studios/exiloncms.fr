<?php

namespace MCCMS\Http\Controllers\Admin;

use MCCMS\Http\Controllers\Controller;
use MCCMS\Http\Requests\RedirectRequest;
use MCCMS\Models\Redirect;
use Inertia\Inertia;

class RedirectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/Redirects/Index', ['redirects' => Redirect::get()]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Redirects/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RedirectRequest $request)
    {
        Redirect::create($request->validated());

        return to_route('admin.redirects.index')
            ->with('success', trans('messages.status.success'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Redirect $redirect)
    {
        return Inertia::render('Admin/Redirects/Edit', ['redirect' => $redirect]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RedirectRequest $request, Redirect $redirect)
    {
        $redirect->update($request->validated());

        return to_route('admin.redirects.index')
            ->with('success', trans('messages.status.success'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @throws \LogicException
     */
    public function destroy(Redirect $redirect)
    {
        $redirect->delete();

        return to_route('admin.redirects.index')
            ->with('success', trans('messages.status.success'));
    }
}
