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
        $themeLoader = app(\ExilonCMS\Extensions\Theme\ThemeLoader::class);

        // Get file-based themes from ThemeLoader
        $fileThemes = collect($themeLoader->getThemes())->map(fn ($theme, $id) => [
            'id' => $id, // Use the theme ID from loader
            'name' => $theme['name'],
            'slug' => $theme['id'],
            'description' => $theme['description'],
            'version' => $theme['version'],
            'author' => $theme['author'],
            'thumbnail' => $theme['screenshot'] ?? null,
            'is_active' => $themeLoader->isActive($theme['id']),
            'is_enabled' => true, // File themes are always enabled
            'type' => 'file', // Mark as file-based theme
            'type_label' => 'File Theme',
        ])->values();

        // Get database themes (if any), excluding ones that conflict with file-based themes
        $fileThemeIds = $fileThemes->pluck('slug')->toArray();
        $dbThemes = Theme::all()
            ->filter(fn ($theme) => ! in_array($theme->slug, $fileThemeIds))
            ->map(fn ($theme) => [
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

        $themes = $fileThemes->concat($dbThemes);

        return Inertia::render('Admin/Themes/Index', [
            'themes' => $themes,
        ]);
    }

    /**
     * Activate a theme.
     */
    public function activate(Request $request, string|int $themeId)
    {
        $request->validate([
            'confirm' => 'required|accepted',
        ]);

        try {
            $themeLoader = app(\ExilonCMS\Extensions\Theme\ThemeLoader::class);

            // Check if it's a file-based theme (string ID) or database theme (integer ID)
            if (is_string($themeId) && $themeLoader->hasTheme($themeId)) {
                // File-based theme - use ThemeLoader
                $themeLoader->activateTheme($themeId);
            } else {
                // Database theme - use model
                $theme = Theme::findOrFail($themeId);

                if (! $theme->is_enabled) {
                    return back()->with('error', 'This theme is disabled and cannot be activated.');
                }

                $theme->activate();

                // Also update ThemeLoader cache
                $themeLoader->activateTheme($theme->slug);
            }

            // Clear all caches
            Artisan::call('cache:clear');
            Artisan::call('config:clear');
            Artisan::call('view:clear');

            return back()->with('success', 'Theme activated successfully!');
        } catch (\Exception $e) {
            return back()->with('error', 'Error activating theme: '.$e->getMessage());
        }
    }

    /**
     * Deactivate current theme.
     */
    public function deactivate(Request $request)
    {
        try {
            // Use ThemeLoader instead of database model
            $themeLoader = app(\ExilonCMS\Extensions\Theme\ThemeLoader::class);
            $themeLoader->deactivateTheme();

            // Clear caches
            Artisan::call('cache:clear');
            Artisan::call('config:clear');
            Artisan::call('view:clear');

            return back()->with('success', 'Theme deactivated. Default theme restored.');
        } catch (\Exception $e) {
            return back()->with('error', 'Error deactivating theme: '.$e->getMessage());
        }
    }

    /**
     * Toggle theme enabled status.
     */
    public function toggleEnabled(Request $request, string|int $themeId)
    {
        try {
            $themeLoader = app(\ExilonCMS\Extensions\Theme\ThemeLoader::class);

            // Check if it's a file-based theme (string ID) or database theme (integer ID)
            if (is_string($themeId) && $themeLoader->hasTheme($themeId)) {
                // File-based themes are always enabled - cannot be toggled
                return back()->with('error', 'File-based themes are always enabled.');
            } else {
                // Database theme - use model
                $theme = Theme::findOrFail($themeId);

                $theme->update(['is_enabled' => ! $theme->is_enabled]);

                // If disabling the active theme, deactivate it first
                if (! $theme->is_enabled && $theme->is_active) {
                    $theme->deactivate();
                }

                Artisan::call('cache:clear');

                return back()->with('success', $theme->is_enabled ? 'Theme enabled.' : 'Theme disabled.');
            }
        } catch (\Exception $e) {
            return back()->with('error', 'Error updating theme: '.$e->getMessage());
        }
    }

    /**
     * Publish theme assets.
     */
    public function publishAssets(string|int $themeId)
    {
        try {
            $themeLoader = app(\ExilonCMS\Extensions\Theme\ThemeLoader::class);

            // Check if it's a file-based theme (string ID) or database theme (integer ID)
            if (is_string($themeId) && $themeLoader->hasTheme($themeId)) {
                // File-based theme
                $themePath = base_path("themes/{$themeId}");
                $publicPath = public_path("themes/{$themeId}");

                if (is_dir($themePath)) {
                    if (! is_dir(public_path('themes'))) {
                        mkdir(public_path('themes'), 0755, true);
                    }

                    // Symlink or copy assets
                    if (! file_exists($publicPath)) {
                        symlink($themePath, $publicPath);
                    }
                }

                return back()->with('success', 'Theme assets published successfully!');
            } else {
                // Database theme
                $theme = Theme::findOrFail($themeId);

                // Publish theme assets to public directory
                $themePath = resource_path("views/themes/{$theme->slug}");
                $publicPath = public_path("themes/{$theme->slug}");

                if (is_dir($themePath)) {
                    if (! is_dir(public_path('themes'))) {
                        mkdir(public_path('themes'), 0755, true);
                    }

                    // Symlink or copy assets
                    if (! file_exists($publicPath)) {
                        symlink($themePath, $publicPath);
                    }
                }

                return back()->with('success', 'Theme assets published successfully!');
            }
        } catch (\Exception $e) {
            return back()->with('error', 'Error publishing assets: '.$e->getMessage());
        }
    }

    /**
     * Preview a theme.
     */
    public function preview(Request $request, string|int $themeId)
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
