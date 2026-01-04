<?php

namespace ExilonCMS\Http\Controllers;

use ExilonCMS\Models\Page;
use Inertia\Inertia;

class PageController extends Controller
{
    /**
     * Display the specified resource.
     *
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function show(Page $page)
    {
        $this->authorize('view', $page);

        return Inertia::render('Pages/Show', [
            'page' => $page,
        ]);
    }
}
