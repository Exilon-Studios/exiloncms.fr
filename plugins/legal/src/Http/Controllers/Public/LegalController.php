<?php

namespace ExilonCMS\Plugins\Legal\Http\Controllers\Public;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Plugins\Legal\Models\LegalPage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LegalController extends Controller
{
    public function show(Request $request, string $type)
    {
        $locale = $request->get('locale', app()->getLocale());

        $page = LegalPage::byType($type)
            ->forLocale($locale)
            ->enabled()
            ->firstOrFail();

        return Inertia::render('Legal/Show', [
            'page' => $page,
        ]);
    }

    public function index(Request $request)
    {
        $locale = $request->get('locale', app()->getLocale());

        $pages = LegalPage::forLocale($locale)
            ->enabled()
            ->get()
            ->keyBy('type');

        return Inertia::render('Legal/Index', [
            'pages' => $pages,
        ]);
    }
}
