<?php

namespace ExilonCMS\Http\Controllers\Admin;

use ExilonCMS\Extensions\Theme\ThemeManager;
use ExilonCMS\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Inertia\Inertia;

class ThemeController extends Controller
{
    public function __construct(
        private ThemeManager $themeManager
    ) {}

    /**
     * Display all themes.
     */
    public function index()
    {
        $themes = $this->themeManager->getAllThemes();
        $activeTheme = $this->themeManager->getActiveTheme();

        return Inertia::render('Admin/Themes/Index', [
            'themes' => $themes,
            'activeTheme' => $activeTheme,
        ]);
    }

    /**
     * Activate a theme.
     */
    public function activate(Request $request, string $themeId)
    {
        $request->validate([
            'confirm' => 'required|accepted',
        ]);

        try {
            $result = $this->themeManager->activateTheme($themeId);

            if (!$result) {
                return back()->with('error', 'Thème non trouvé ou incompatible.');
            }

            // Clear all caches
            Artisan::call('cache:clear');
            Artisan::call('config:clear');
            Artisan::call('view:clear');

            return back()->with('success', 'Thème activé avec succès !');
        } catch (\Exception $e) {
            return back()->with('error', 'Erreur lors de l\'activation : ' . $e->getMessage());
        }
    }

    /**
     * Deactivate current theme.
     */
    public function deactivate()
    {
        $this->themeManager->deactivateTheme();

        // Clear caches
        Artisan::call('cache:clear');
        Artisan::call('config:clear');
        Artisan::call('view:clear');

        return back()->with('success', 'Thème désactivé. Retour au thème par défaut.');
    }

    /**
     * Publish theme assets.
     */
    public function publishAssets(string $themeId)
    {
        try {
            $result = $this->themeManager->publishAssets($themeId);

            if (!$result) {
                return back()->with('error', 'Impossible de publier les assets du thème.');
            }

            return back()->with('success', 'Assets du thème publiés avec succès !');
        } catch (\Exception $e) {
            return back()->with('error', 'Erreur lors de la publication : ' . $e->getMessage());
        }
    }

    /**
     * Preview a theme.
     */
    public function preview(Request $request, string $themeId)
    {
        // Store preview theme in session
        $request->session()->put('preview_theme', $themeId);

        return redirect()->route('home');
    }

    /**
     * Exit preview mode.
     */
    public function exitPreview(Request $request)
    {
        $request->session()->forget('preview_theme');

        return redirect()->route('admin.themes.index');
    }
}
