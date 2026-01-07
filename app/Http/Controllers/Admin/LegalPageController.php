<?php

namespace ExilonCMS\Http\Controllers\Admin;

use ExilonCMS\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LegalPageController extends Controller
{
    /**
     * Display and edit the Terms of Service page.
     */
    public function terms()
    {
        $content = DB::table('settings')
            ->where('name', 'legal_terms')
            ->value('value') ?? '';

        return Inertia::render('Admin/Settings/Legal/Terms', [
            'content' => $content,
        ]);
    }

    /**
     * Update the Terms of Service.
     */
    public function updateTerms(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        DB::table('settings')
            ->updateOrInsert(
                ['name' => 'legal_terms'],
                ['value' => $validated['content']]
            );

        cache()->forget('settings');

        return redirect()
            ->back()
            ->with('success', 'Conditions générales d\'utilisation mises à jour avec succès.');
    }

    /**
     * Display and edit the Privacy Policy page.
     */
    public function privacy()
    {
        $content = DB::table('settings')
            ->where('name', 'legal_privacy')
            ->value('value') ?? '';

        return Inertia::render('Admin/Settings/Legal/Privacy', [
            'content' => $content,
        ]);
    }

    /**
     * Update the Privacy Policy.
     */
    public function updatePrivacy(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        DB::table('settings')
            ->updateOrInsert(
                ['name' => 'legal_privacy'],
                ['value' => $validated['content']]
            );

        cache()->forget('settings');

        return redirect()
            ->back()
            ->with('success', 'Politique de confidentialité mise à jour avec succès.');
    }

    /**
     * Display and edit the Cookies Policy page.
     */
    public function cookies()
    {
        $content = DB::table('settings')
            ->where('name', 'legal_cookies')
            ->value('value') ?? '';

        return Inertia::render('Admin/Settings/Legal/Cookies', [
            'content' => $content,
        ]);
    }

    /**
     * Update the Cookies Policy.
     */
    public function updateCookies(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        DB::table('settings')
            ->updateOrInsert(
                ['name' => 'legal_cookies'],
                ['value' => $validated['content']]
            );

        cache()->forget('settings');

        return redirect()
            ->back()
            ->with('success', 'Politique de cookies mise à jour avec succès.');
    }

    /**
     * Display and edit the Refund Policy page.
     */
    public function refund()
    {
        $content = DB::table('settings')
            ->where('name', 'legal_refund')
            ->value('value') ?? '';

        return Inertia::render('Admin/Settings/Legal/Refund', [
            'content' => $content,
        ]);
    }

    /**
     * Update the Refund Policy.
     */
    public function updateRefund(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        DB::table('settings')
            ->updateOrInsert(
                ['name' => 'legal_refund'],
                ['value' => $validated['content']]
            );

        cache()->forget('settings');

        return redirect()
            ->back()
            ->with('success', 'Politique de remboursement mise à jour avec succès.');
    }
}
