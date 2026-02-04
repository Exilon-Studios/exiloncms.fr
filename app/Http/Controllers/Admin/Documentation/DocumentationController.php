<?php

namespace ExilonCMS\Http\Controllers\Admin\Documentation;

use ExilonCMS\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;
use Inertia\Inertia;

class DocumentationController extends Controller
{
    /**
     * Documentation editor page
     */
    public function editor(Request $request)
    {
        $docsPath = base_path('docs');
        $locales = [];

        // Get available locales
        if (File::exists($docsPath)) {
            $directories = File::directories($docsPath);
            foreach ($directories as $dir) {
                $locales[] = basename($dir);
            }
        }

        // Get categories for first locale (or 'fr' as default)
        $defaultLocale = !empty($locales) ? $locales[0] : 'fr';
        $categories = [];

        if (File::exists($docsPath . '/' . $defaultLocale)) {
            $categoryDirs = File::directories($docsPath . '/' . $defaultLocale);
            foreach ($categoryDirs as $dir) {
                $categories[] = basename($dir);
            }
        }

        return Inertia::render('Admin/Editor/Index', [
            'locales' => $locales,
            'categories' => $categories,
            'defaultLocale' => $defaultLocale,
        ]);
    }

    /**
     * Edit a documentation file
     */
    public function editFile(Request $request, string $locale, string $category, string $page)
    {
        $filePath = base_path("docs/{$locale}/{$category}/{$page}.md");

        if (!File::exists($filePath)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        $content = File::get($filePath);

        // Parse frontmatter
        $frontmatter = [];
        $markdown = $content;

        if (preg_match('/^---(.*?)---(.*)$/s', $content, $matches)) {
            $yaml = $matches[1];
            $markdown = $matches[2];

            // Parse YAML frontmatter
            $lines = explode("\n", $yaml);
            foreach ($lines as $line) {
                if (preg_match('/^([^:]+):\s*(.+)$/', $line, $match)) {
                    $key = trim($match[1]);
                    $value = trim($match[2], '"\'');
                    $frontmatter[$key] = $value;
                }
            }
        }

        return response()->json([
            'frontmatter' => $frontmatter,
            'markdown' => $markdown,
            'path' => "{$locale}/{$category}/{$page}",
        ]);
    }

    /**
     * Save a documentation file
     */
    public function saveFile(Request $request, string $locale, string $category, string $page)
    {
        $request->validate([
            'frontmatter' => 'array',
            'markdown' => 'required|string',
        ]);

        $filePath = base_path("docs/{$locale}/{$category}/{$page}.md");

        // Create directory if not exists
        $directory = dirname($filePath);
        if (!File::exists($directory)) {
            File::makeDirectory($directory, 0755, true);
        }

        // Build YAML frontmatter
        $frontmatterYaml = "---\n";
        foreach ($request->input('frontmatter', []) as $key => $value) {
            if ($value === true || $value === false) {
                $value = $value ? 'true' : 'false';
            } elseif (is_array($value)) {
                $value = '[' . implode(', ', array_map(fn($v) => '"' . $v . '"', $value)) . ']';
            } else {
                $value = '"' . $value . '"';
            }
            $frontmatterYaml .= "{$key}: {$value}\n";
        }
        $frontmatterYaml .= "---\n";

        // Save file
        File::put($filePath, $frontmatterYaml . "\n" . $request->input('markdown'));

        return response()->json([
            'success' => true,
            'message' => trans('admin.documentation.editor.save_success'),
        ]);
    }
}
