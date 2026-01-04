<?php

namespace ExilonCMS\Http\Controllers\Admin;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Models\Translation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TranslationController extends Controller
{
    /**
     * Display the translation management page.
     */
    public function index(Request $request)
    {
        $group = $request->get('group', 'admin');
        $locale = $request->get('locale', app()->getLocale());

        // Get available groups from language files
        $availableGroups = $this->getAvailableGroups();
        $locales = ['fr', 'en'];

        // Ensure group and locale are valid
        if (!in_array($group, $availableGroups)) {
            $group = $availableGroups[0] ?? 'admin';
        }
        if (!in_array($locale, $locales)) {
            $locale = $locales[0] ?? 'fr';
        }

        // Try to get from database first
        $translations = Translation::query()
            ->where('group', $group)
            ->where('locale', $locale)
            ->orderBy('key')
            ->get();

        // If no translations in DB for this group/locale, import from file
        if ($translations->isEmpty()) {
            $file = lang_path("{$locale}/{$group}.php");

            if (file_exists($file)) {
                $fileTranslations = include $file;

                if (is_array($fileTranslations)) {
                    $flattened = $this->flattenArray($fileTranslations);

                    foreach ($flattened as $key => $value) {
                        if (is_string($value)) {
                            Translation::set($group, $key, $locale, $value);
                        }
                    }

                    // Get the newly imported translations
                    $translations = Translation::query()
                        ->where('group', $group)
                        ->where('locale', $locale)
                        ->orderBy('key')
                        ->get();
                }
            }
        }

        // Debug temporaire
        \Log::info('Translation groups', ['groups' => $availableGroups, 'is_array' => is_array($availableGroups)]);

        return Inertia::render('Admin/Translations/Index', [
            'groups' => is_array($availableGroups) ? array_values($availableGroups) : [],
            'locales' => $locales,
            'currentGroup' => $group,
            'currentLocale' => $locale,
            'translations' => $translations,
        ]);
    }

    /**
     * Get available translation groups from language files.
     */
    protected function getAvailableGroups(): array
    {
        $groups = [];
        $locales = ['fr', 'en'];

        foreach ($locales as $locale) {
            $localePath = lang_path($locale);

            if (is_dir($localePath)) {
                $files = scandir($localePath);

                foreach ($files as $file) {
                    if (pathinfo($file, PATHINFO_EXTENSION) === 'php') {
                        $groups[] = pathinfo($file, PATHINFO_FILENAME);
                    }
                }
            }
        }

        sort($groups); // Sort alphabetically
        return array_unique($groups);
    }

    /**
     * Store or update a translation.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'group' => 'required|string|max:255',
            'key' => 'required|string|max:255',
            'locale' => 'required|string|max:10',
            'value' => 'required|string',
        ]);

        Translation::set(
            $validated['group'],
            $validated['key'],
            $validated['locale'],
            $validated['value']
        );

        return back()->with('success', 'Traduction mise à jour avec succès.');
    }

    /**
     * Delete a translation.
     */
    public function destroy(string $group, string $key, string $locale)
    {
        Translation::query()
            ->where('group', $group)
            ->where('key', $key)
            ->where('locale', $locale)
            ->delete();

        return back()->with('success', 'Traduction supprimée avec succès.');
    }

    /**
     * Import translations from language files.
     */
    public function import(Request $request)
    {
        $validated = $request->validate([
            'group' => 'required|string',
            'locale' => 'required|string',
        ]);

        $group = $validated['group'];
        $locale = $validated['locale'];

        // Load the language file
        $file = lang_path("{$locale}/{$group}.php");

        if (!file_exists($file)) {
            return back()->with('error', 'Fichier de traduction non trouvé.');
        }

        $translations = include $file;

        if (!is_array($translations)) {
            return back()->with('error', 'Format de fichier invalide.');
        }

        // Flatten the array and import
        $flattened = $this->flattenArray($translations);
        $count = 0;

        foreach ($flattened as $key => $value) {
            if (is_string($value)) {
                Translation::set($group, $key, $locale, $value);
                $count++;
            }
        }

        return back()->with('success', "{$count} traductions importées avec succès.");
    }

    /**
     * Flatten a multi-dimensional array.
     */
    protected function flattenArray(array $array, string $prefix = ''): array
    {
        $result = [];

        foreach ($array as $key => $value) {
            $newKey = $prefix ? "{$prefix}.{$key}" : $key;

            if (is_array($value)) {
                $result = array_merge($result, $this->flattenArray($value, $newKey));
            } else {
                $result[$newKey] = $value;
            }
        }

        return $result;
    }
}
