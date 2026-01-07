<?php

namespace ExilonCMS\Http\Controllers\Admin;

use ExilonCMS\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;
use Inertia\Inertia;

class CompanySettingsController extends Controller
{
    /**
     * Display the company settings page.
     */
    public function index(): View
    {
        $settings = DB::table('settings')
            ->whereIn('name', [
                'company_name',
                'company_address',
                'company_postal_code',
                'company_city',
                'company_country',
                'company_siret',
                'company_vat',
                'company_phone',
                'company_email',
                'company_type',
                'company_vat_rate',
                'company_website',
                'legal_notice',
            ])
            ->pluck('value', 'name')
            ->toArray();

        return view('admin.settings.company', [
            'settings' => $settings,
        ]);
    }

    /**
     * Get company settings for Inertia.
     */
    public function get()
    {
        $settings = DB::table('settings')
            ->whereIn('name', [
                'company_name',
                'company_address',
                'company_postal_code',
                'company_city',
                'company_country',
                'company_siret',
                'company_vat',
                'company_phone',
                'company_email',
                'company_type',
                'company_vat_rate',
                'company_website',
                'legal_notice',
                'legal_terms', // CGU
                'legal_privacy', // Politique de confidentialité
                'legal_cookies', // Politique de cookies
                'legal_refund', // Politique de remboursement
            ])
            ->pluck('value', 'name')
            ->toArray();

        return Inertia::render('Admin/Settings/Company', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update company settings.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'company_address' => 'required|string|max:255',
            'company_postal_code' => 'required|string|max:20',
            'company_city' => 'required|string|max:100',
            'company_country' => 'required|string|max:100',
            'company_siret' => 'nullable|string|max:20',
            'company_vat' => 'nullable|string|max:20',
            'company_phone' => 'nullable|string|max:50',
            'company_email' => 'required|email|max:255',
            'company_type' => 'required|in:company,association,micro_enterprise,auto_entrepreneur',
            'company_vat_rate' => 'required|numeric|min:0|max:100',
            'company_website' => 'nullable|url|max:255',
            'legal_notice' => 'nullable|string',
            'legal_terms' => 'nullable|string', // CGU
            'legal_privacy' => 'nullable|string', // Politique de confidentialité
            'legal_cookies' => 'nullable|string', // Politique de cookies
            'legal_refund' => 'nullable|string', // Politique de remboursement
        ]);

        $settingsToUpdate = [
            'company_name' => $validated['company_name'],
            'company_address' => $validated['company_address'],
            'company_postal_code' => $validated['company_postal_code'],
            'company_city' => $validated['company_city'],
            'company_country' => $validated['company_country'],
            'company_siret' => $validated['company_siret'] ?? null,
            'company_vat' => $validated['company_vat'] ?? null,
            'company_phone' => $validated['company_phone'] ?? null,
            'company_email' => $validated['company_email'],
            'company_type' => $validated['company_type'],
            'company_vat_rate' => $validated['company_vat_rate'],
            'company_website' => $validated['company_website'] ?? null,
            'legal_notice' => $validated['legal_notice'] ?? null,
            'legal_terms' => $validated['legal_terms'] ?? null,
            'legal_privacy' => $validated['legal_privacy'] ?? null,
            'legal_cookies' => $validated['legal_cookies'] ?? null,
            'legal_refund' => $validated['legal_refund'] ?? null,
        ];

        foreach ($settingsToUpdate as $key => $value) {
            if ($value === null) {
                DB::table('settings')
                    ->where('name', $key)
                    ->delete();
            } else {
                DB::table('settings')
                    ->updateOrInsert(
                        ['name' => $key],
                        ['value' => $value]
                    );
            }
        }

        // Clear settings cache
        cache()->forget('settings');

        return redirect()
            ->back()
            ->with('success', 'Paramètres entreprise mis à jour avec succès.');
    }

    /**
     * Get company settings for API.
     */
    public function api()
    {
        $settings = DB::table('settings')
            ->whereIn('name', [
                'company_name',
                'company_address',
                'company_postal_code',
                'company_city',
                'company_country',
                'company_siret',
                'company_vat',
                'company_phone',
                'company_email',
                'company_type',
                'company_vat_rate',
                'company_website',
                'legal_notice',
            ])
            ->pluck('value', 'name')
            ->toArray();

        return response()->json($settings);
    }
}
