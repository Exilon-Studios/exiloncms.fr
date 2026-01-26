<?php

namespace ExilonCMS\Http\Controllers\Admin;

use ExilonCMS\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class LanguageController extends Controller
{
    /**
     * Display a listing of available languages.
     */
    public function index()
    {
        $langPath = resource_path('lang');
        $languages = [];

        if (File::exists($langPath)) {
            $directories = File::directories($langPath);

            foreach ($directories as $directory) {
                $locale = basename($directory);
                $languages[] = [
                    'code' => $locale,
                    'name' => $this->getLanguageName($locale),
                    'active' => $locale === app()->getLocale(),
                ];
            }
        }

        return Inertia::render('Admin/Languages/Index', [
            'languages' => $languages,
        ]);
    }

    /**
     * Create a new language directory with empty translation files.
     */
    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string|min:2|max:5|alpha_dash|unique_locale',
            'name' => 'required|string|max:50',
        ]);

        $locale = $request->input('code');
        $langPath = resource_path("lang/{$locale}");

        // Create directory if it doesn't exist
        if (File::exists($langPath)) {
            return back()->with('error', "Language '{$locale}' already exists.");
        }

        File::makeDirectory($langPath, 0755, true);

        // Get all translation files from English as template
        $enPath = resource_path('lang/en');
        $files = File::files($enPath);

        foreach ($files as $file) {
            if ($file->getExtension() === 'php') {
                $filename = $file->getFilenameWithoutExtension();
                $content = include $file->getPathname();

                if (is_array($content)) {
                    // Create empty template with same structure
                    $emptyContent = $this->createEmptyTemplate($content);
                    $fileContent = "<?php\n\nreturn ".$this->varExport($emptyContent).";\n";
                    File::put("{$langPath}/{$filename}.php", $fileContent);
                }
            }
        }

        return redirect()->route('admin.languages.index')
            ->with('success', "Language '{$locale}' created successfully.");
    }

    /**
     * Create an empty template with same structure but empty values.
     */
    private function createEmptyTemplate(array $array): array
    {
        $result = [];

        foreach ($array as $key => $value) {
            if (is_array($value)) {
                $result[$key] = $this->createEmptyTemplate($value);
            } else {
                $result[$key] = '';
            }
        }

        return $result;
    }

    /**
     * Show the form for editing translations for a specific language.
     */
    public function edit(string $locale)
    {
        $langPath = resource_path("lang/{$locale}");

        if (! File::exists($langPath)) {
            return redirect()->route('admin.languages.index')
                ->with('error', "Language '{$locale}' not found.");
        }

        $translations = [];
        $files = File::files($langPath);

        foreach ($files as $file) {
            if ($file->getExtension() === 'php') {
                $filename = $file->getFilenameWithoutExtension();
                $content = include $file->getPathname();

                if (is_array($content)) {
                    $translations[$filename] = $this->flattenArray($content);
                }
            }
        }

        return Inertia::render('Admin/Languages/Edit', [
            'locale' => $locale,
            'languageName' => $this->getLanguageName($locale),
            'translations' => $translations,
        ]);
    }

    /**
     * Update translations for a specific language.
     */
    public function update(Request $request, string $locale)
    {
        $langPath = resource_path("lang/{$locale}");

        if (! File::exists($langPath)) {
            return back()->with('error', "Language '{$locale}' not found.");
        }

        $translations = $request->input('translations', []);

        foreach ($translations as $filename => $keys) {
            $filePath = "{$langPath}/{$filename}.php";

            if (File::exists($filePath)) {
                // Unflatten the array back to nested structure
                $unflattened = $this->unflattenArray($keys);

                // Write the file with proper PHP array formatting
                $content = "<?php\n\nreturn ".$this->varExport($unflattened).";\n";
                File::put($filePath, $content);
            }
        }

        return redirect()->route('admin.languages.edit', $locale)
            ->with('success', 'Translations updated successfully.');
    }

    /**
     * Flatten a multi-dimensional array with dot notation keys.
     */
    private function flattenArray(array $array, string $prefix = ''): array
    {
        $result = [];

        foreach ($array as $key => $value) {
            $newKey = $prefix !== '' ? "{$prefix}.{$key}" : $key;

            if (is_array($value)) {
                $result = array_merge($result, $this->flattenArray($value, $newKey));
            } else {
                $result[$newKey] = $value;
            }
        }

        return $result;
    }

    /**
     * Unflatten a dot notation array back to nested array.
     */
    private function unflattenArray(array $array): array
    {
        $result = [];

        foreach ($array as $key => $value) {
            $keys = explode('.', $key);
            $current = &$result;

            foreach ($keys as $i => $k) {
                if ($i === count($keys) - 1) {
                    $current[$k] = $value;
                } else {
                    if (! isset($current[$k]) || ! is_array($current[$k])) {
                        $current[$k] = [];
                    }
                    $current = &$current[$k];
                }
            }
        }

        return $result;
    }

    /**
     * Export array as formatted PHP code.
     */
    private function varExport(array $array, int $indent = 0): string
    {
        $output = "[\n";
        $indentStr = str_repeat('    ', $indent + 1);

        foreach ($array as $key => $value) {
            $output .= $indentStr.var_export($key, true).' => ';

            if (is_array($value)) {
                $output .= $this->varExport($value, $indent + 1);
            } else {
                $output .= var_export($value, true);
            }

            $output .= ",\n";
        }

        $output .= str_repeat('    ', $indent).']';

        return $output;
    }

    /**
     * Get the language name from its code.
     */
    private function getLanguageName(string $code): string
    {
        $names = [
            'en' => 'English',
            'fr' => 'Français',
            'de' => 'Deutsch',
            'es' => 'Español',
            'it' => 'Italiano',
            'pt' => 'Português',
            'ru' => 'Русский',
            'zh' => '中文',
            'ja' => '日本語',
        ];

        return $names[$code] ?? strtoupper($code);
    }
}
