<?php

namespace MCCMS\Http\Controllers;

use MCCMS\Models\Page;
use MCCMS\Models\Redirect;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Inertia\Inertia;

class FallbackController extends Controller
{
    /**
     * Display the specified resource.
     *
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function get(string $path)
    {
        /** @var \MCCMS\Models\Redirect|null $redirect */
        $redirect = Redirect::enabled()->firstWhere('source', $path);

        if ($redirect !== null) {
            return redirect($redirect->destination, $redirect->code);
        }

        $page = Page::enabled()->where('slug', $path)->first();

        if ($page === null) {
            throw (new ModelNotFoundException())->setModel(Page::class);
        }

        $this->authorize('view', $page);

        return Inertia::render('Pages/Show', [
            'page' => $page,
        ]);
    }
}
