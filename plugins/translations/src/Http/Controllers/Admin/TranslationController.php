<?php

namespace ExilonCMS\Plugins\Translations\Http\Controllers\Admin;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Plugins\Translations\Models\TranslationEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class TranslationController extends Controller
{
    public function index(Request $request)
    {
        $locale = $request->get('locale', app()->getLocale());
        $group = $request->get('group', 'all');
        $search = $request->get('search', '');

        $query = TranslationEntry::query();

        if ($group !== 'all') {
            $query->forGroup($group);
        }

        if ($search) {
            $query->search($search);
        }

        $translations = $query->forLocale($locale)
            ->orderBy('group')
            ->orderBy('key')
            ->paginate(50);

        $groups = TranslationEntry::select('group')
            ->distinct()
            ->orderBy('group')
            ->pluck('group');

        $locales = TranslationEntry::select('locale')
            ->distinct()
            ->orderBy('locale')
            ->pluck('locale');

        $missingCount = TranslationEntry::forLocale($locale)
            ->where(function ($q) {
                $q->whereNull('value')->orWhere('value', '');
            })
            ->count();

        return Inertia::render('Translations/Admin/Index', [
            'translations' => $translations,
            'groups' => $groups,
            'locales' => $locales,
            'filters' => [
                'locale' => $locale,
                'group' => $group,
                'search' => $search,
            ],
            'missingCount' => $missingCount,
        ]);
    }

    public function update(Request $request, TranslationEntry $translation)
    {
        $validated = $request->validate([
            'value' => 'required|string',
        ]);

        $translation->update($validated);

        // Sync to file if auto-sync enabled
        if (setting('translations_auto_sync', true)) {
            $translation->syncToFile();
        }

        return back()->with('success', 'Translation updated.');
    }

    public function sync(Request $request)
    {
        $locale = $request->input('locale', app()->getLocale());
        $group = $request->input('group');

        if ($group) {
            $translations = TranslationEntry::forLocale($locale)
                ->forGroup($group)
                ->get();
        } else {
            $translations = TranslationEntry::forLocale($locale)->get();
        }

        $synced = 0;
        foreach ($translations as $translation) {
            if ($translation->syncToFile()) {
                $synced++;
            }
        }

        return back()->with('success', "Synced {$synced} translations to files.");
    }

    public function import(Request $request)
    {
        $request->validate([
            'locale' => 'required|string',
            'file' => 'required|file',
        ]);

        $file = $request->file('file');
        $locale = $request->input('locale');

        $tempPath = $file->getRealPath();
        $translations = include $tempPath;

        if (! is_array($translations)) {
            return back()->with('error', 'Invalid translation file format.');
        }

        $imported = 0;
        foreach ($translations as $key => $value) {
            $parts = explode('.', $key);
            $group = $parts[0];
            $itemKey = implode('.', array_slice($parts, 1));

            TranslationEntry::updateOrCreate(
                [
                    'locale' => $locale,
                    'group' => $group,
                    'key' => $itemKey,
                ],
                ['value' => $value]
            );
            $imported++;
        }

        return back()->with('success', "Imported {$imported} translations.");
    }

    public function export(Request $request)
    {
        $locale = $request->input('locale', app()->getLocale());
        $group = $request->input('group');

        $translations = TranslationEntry::forLocale($locale)
            ->when($group, fn ($q) => $q->forGroup($group))
            ->get()
            ->groupBy('group');

        $filename = "translations-{$locale}-".now()->format('Y-m-d').'.json';

        return response()->streamDownload(function () use ($translations) {
            echo json_encode($translations->map(fn ($group) => $group->pluck('value', 'key')), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }, $filename);
    }

    public function scanAndImport(Request $request)
    {
        $locale = $request->input('locale', app()->getLocale());
        $langPath = resource_path("lang/{$locale}");

        if (! is_dir($langPath)) {
            return back()->with('error', 'Locale directory not found.');
        }

        $files = File::files($langPath);
        $imported = 0;

        foreach ($files as $file) {
            $group = $file->getFilenameWithoutExtension();
            $translations = include $file->getRealPath();

            if (! is_array($translations)) {
                continue;
            }

            foreach ($translations as $key => $value) {
                TranslationEntry::updateOrCreate(
                    [
                        'locale' => $locale,
                        'group' => $group,
                        'key' => $key,
                    ],
                    ['value' => $value]
                );
                $imported++;
            }
        }

        return back()->with('success', "Scanned and imported {$imported} translations.");
    }
}
