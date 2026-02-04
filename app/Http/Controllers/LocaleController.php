<?php

namespace ExilonCMS\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class LocaleController extends Controller
{
    /**
     * Set the application locale for the current user.
     */
    public function set(Request $request)
    {
        $request->validate([
            'locale' => 'required|string|in:en,fr',
        ]);

        $locale = $request->input('locale');

        // Store in session
        Session::put('locale', $locale);

        // If user is authenticated, you could also store in user preferences
        // if (auth()->check()) {
        //     auth()->user()->update(['preferred_locale' => $locale]);
        // }

        return redirect()->back()->with('success', 'Language changed successfully.');
    }
}
