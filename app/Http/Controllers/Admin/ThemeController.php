<?php

namespace ExilonCMS\Http\Controllers\Admin;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Models\Theme;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Inertia\Inertia;

class ThemeController extends Controller
{
    /**
     * Display all themes.
     */
    public function index()
    {
        $themes = Theme::all()->map(fn ($theme) => [
            'id' => $theme->id,
            'name' => $theme->name,
            'slug' => $theme->slug,
            'description' => $theme->description,
            'version' => $theme->version,
            'author' => $theme->author,
            'thumbnail' => $theme->thumbnail,
            'is_active' => $theme->is_active,
            'is_enabled' => $theme->is_enabled,
            'type' => $theme->type,
            'type_label' => $theme->getTypeLabel(),
        ]);

        $activeTheme = Theme::getActive();

        return Inertia::render('Admin/Themes/Index', [
            'themes' => $themes,
            'activeTheme' => $activeTheme ? [
                'id' => $activeTheme->id,
                'name' => $activeTheme->name,
                'slug' => $activeTheme->slug,
            ] : null,
        ]);
    }

    /**
     * Activate a theme.
     */
    public function activate(Request $request, int $themeId)
    {
        $request->validate([
            'confirm' => 'required|accepted',
        ]);

        try {
            $theme = Theme::findOrFail($themeId);

            if (!$theme->is_enabled) {
                return back()->with('error', 'This theme is disabled and cannot be activated.');
            }

            $theme->activate();

            // Clear all caches
            Artisan::call('cache:clear');
            Artisan::call('config:clear');
            Artisan::call('view:clear');

            return back()->with('success', 'Theme activated successfully!');
        } catch (\Exception $e) {
            return back()->with('error', 'Error activating theme: ' . $e->getMessage());
        }
    }

    /**
     * Deactivate current theme.
     */
    public function deactivate(Request $request)
    {
        try {
            $activeTheme = Theme::getActive();

            if ($activeTheme) {
                $activeTheme->deactivate();
            }

            // Clear caches
            Artisan::call('cache:clear');
            Artisan::call('config:clear');
            Artisan::call('view:clear');

            return back()->with('success', 'Theme deactivated. Default theme restored.');
        } catch (\Exception $e) {
            return back()->with('error', 'Error deactivating theme: ' . $e->getMessage());
        }
    }

    /**
     * Toggle theme enabled status.
     */
    public function toggleEnabled(Request $request, int $themeId)
    {
        try {
            $theme = Theme::findOrFail($themeId);

            $theme->update(['is_enabled' => !$theme->is_enabled]);

            // If disabling the active theme, deactivate it first
            if (!$theme->is_enabled && $theme->is_active) {
                $theme->deactivate();
            }

            Artisan::call('cache:clear');

            return back()->with('success', $theme->is_enabled ? 'Theme enabled.' : 'Theme disabled.');
        } catch (\Exception $e) {
            return back()->with('error', 'Error updating theme: ' . $e->getMessage());
        }
    }

    /**
     * Publish theme assets.
     */
    public function publishAssets(int $themeId)
    {
        try {
            $theme = Theme::findOrFail($themeId);

            // Publish theme assets to public directory
            $themePath = resource_path("views/themes/{$theme->slug}");
            $publicPath = public_path("themes/{$theme->slug}");

            if (is_dir($themePath)) {
                if (!is_dir(public_path('themes'))) {
                    mkdir(public_path('themes'), 0755, true);
                }

                // Symlink or copy assets
                if (!file_exists($publicPath)) {
                    symlink($themePath, $publicPath);
                }
            }

            return back()->with('success', 'Theme assets published successfully!');
        } catch (\Exception $e) {
            return back()->with('error', 'Error publishing assets: ' . $e->getMessage());
        }
    }

    /**
     * Preview a theme.
     */
    public function preview(Request $request, int $themeId)
    {
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
