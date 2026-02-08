<?php

namespace ExilonCMS\Plugins\Documentation\Controllers\Admin;

use ExilonCMS\Plugins\Documentation\Services\DocumentationCache;
use ExilonCMS\Plugins\Documentation\Services\DocumentationReader;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

/**
 * Admin Documentation Controller
 *
 * Gestion administrative de la documentation
 */
class DocumentationController
{
    public function __construct(
        protected DocumentationReader $reader,
        protected DocumentationCache $cache,
    ) {}

    /**
     * Dashboard - overview of documentation
     */
    public function index(Request $request)
    {
        $locales = $this->reader->getAvailableLocales();
        $totalCategories = 0;
        $totalPages = 0;
        $totalLocales = count($locales);
        $cachedPages = 0;

        foreach ($locales as $locale) {
            $categories = $this->reader->getCategories($locale);
            $totalCategories += count($categories);

            foreach ($categories as $category) {
                $totalPages += count($category['pages'] ?? []);
            }
        }

        $cacheStats = $this->cache->getStats();
        $cachedPages = $cacheStats['total_pages'] ?? 0;

        return Inertia::render('Admin/Documentation/Index', [
            'locales' => $locales,
            'stats' => collect($locales)->mapWithKeys(function ($locale) {
                $categories = $this->reader->getCategories($locale);
                $pages = 0;
                foreach ($categories as $category) {
                    $pages += count($category['pages'] ?? []);
                }

                return [$locale => ['categories' => count($categories), 'pages' => $pages]];
            })->toArray(),
            'cacheStats' => [
                'enabled' => setting('documentation.cache_enabled', true),
                'duration' => setting('documentation.cache_duration', 3600),
                'locale' => setting('documentation.default_locale', 'fr'),
            ],
        ]);
    }

    /**
     * Configuration page
     */
    public function config(Request $request)
    {
        // Get config from plugin config file
        $configFile = base_path('plugins/documentation/config/config.php');
        $config = File::exists($configFile) ? require $configFile : [];

        // Get current values from settings
        $settings = [];
        foreach ($config as $key => $field) {
            $settingKey = "documentation.{$key}";
            $settings[$key] = setting($settingKey, $field['default'] ?? null);
        }

        return Inertia::render('Admin/Plugins/Documentation/Config', [
            'config' => $config,
            'settings' => $settings,
            'availableLocales' => $this->reader->getAvailableLocales(),
        ]);
    }

    /**
     * Update configuration
     */
    public function updateConfig(Request $request)
    {
        $plugin = app(\ExilonCMS\Classes\Plugin\PluginLoader::class)->getPlugin('documentation');

        if (! $plugin) {
            return redirect()->back()->with('error', 'Documentation plugin not found.');
        }

        $configFields = collect($plugin->getConfigFields())->keyBy('name');

        // Save each setting
        foreach ($request->all() as $key => $value) {
            if (! $configFields->has($key)) {
                continue;
            }

            $field = $configFields->get($key);
            $settingKey = "plugin.documentation.{$key}";

            // Process value based on field type
            $processedValue = $this->processFieldValue($value, $field);

            \ExilonCMS\Models\Setting::updateOrCreate(
                ['name' => $settingKey],
                ['value' => is_array($processedValue) ? json_encode($processedValue) : $processedValue]
            );
        }

        return redirect()->back()->with('success', 'Configuration updated successfully.');
    }

    /**
     * Process a field value based on its type.
     */
    protected function processFieldValue(mixed $value, array $field): mixed
    {
        $type = $field['type'] ?? 'text';

        return match ($type) {
            'boolean', 'toggle' => (bool) $value,
            'integer', 'number' => is_numeric($value) ? (int) $value : 0,
            default => $value,
        };
    }

    /**
     * Browse documentation files (Editor)
     */
    public function browse(Request $request, string $locale = 'fr')
    {
        $categories = $this->reader->getCategories($locale);

        return Inertia::render('Admin/Documentation/Editor', [
            'locale' => $locale,
            'availableLocales' => $this->reader->getAvailableLocales(),
            'categories' => $categories,
        ]);
    }

    /**
     * Edit a documentation page
     */
    public function edit(Request $request, string $locale, string $category, string $page)
    {
        $pagePath = base_path("docs/{$locale}/{$category}/{$page}.md");

        if (! File::exists($pagePath)) {
            abort(404);
        }

        $content = File::get($pagePath);
        $frontmatter = $this->reader->parseFrontmatter($content);
        $markdown = $this->reader->extractMarkdown($content);

        return Inertia::render('Admin/Documentation/Edit', [
            'locale' => $locale,
            'category' => $category,
            'page' => $page,
            'frontmatter' => $frontmatter,
            'markdown' => $markdown,
            'availableLocales' => $this->reader->getAvailableLocales(),
        ]);
    }

    /**
     * Update a documentation page
     */
    public function update(Request $request, string $locale, string $category, string $page)
    {
        $request->validate([
            'frontmatter' => 'array',
            'markdown' => 'required|string',
        ]);

        $pagePath = base_path("docs/{$locale}/{$category}/{$page}.md");

        if (! File::exists($pagePath)) {
            // Create directory if not exists
            $directory = dirname($pagePath);
            if (! File::exists($directory)) {
                File::makeDirectory($directory, 0755, true);
            }
        }

        // Build YAML frontmatter
        $frontmatterYaml = "---\n";
        foreach ($request->input('frontmatter', []) as $key => $value) {
            if ($value === true || $value === false) {
                $value = $value ? 'true' : 'false';
            } elseif (is_array($value)) {
                $value = '["'.implode('", "', $value).'"]';
            } else {
                $value = '"'.$value.'"';
            }
            $frontmatterYaml .= "{$key}: {$value}\n";
        }
        $frontmatterYaml .= "---\n";

        // Save file
        File::put($pagePath, $frontmatterYaml."\n".$request->input('markdown'));

        // Clear cache for this page
        $this->cache->setLocale($locale)->clearPage($locale, $category, $page);

        return redirect()->back()
            ->with('success', __('admin.documentation.messages.page_updated'));
    }

    /**
     * Create a new page
     */
    public function create(Request $request)
    {
        $locales = $this->reader->getAvailableLocales();

        return Inertia::render('Admin/Documentation/Create', [
            'availableLocales' => $locales,
        ]);
    }

    /**
     * Store a new page
     */
    public function store(Request $request)
    {
        $request->validate([
            'locale' => 'required|string',
            'category' => 'required|string',
            'filename' => 'required|string',
            'title' => 'required|string',
            'content' => 'required|string',
        ]);

        $locale = $request->input('locale');
        $category = $request->input('category');
        $filename = str_replace('.md', '', $request->input('filename')).'.md';
        $title = $request->input('title');
        $content = $request->input('content');

        $pagePath = base_path("docs/{$locale}/{$category}/{$filename}");

        if (File::exists($pagePath)) {
            return redirect()->back()
                ->with('error', __('admin.documentation.messages.page_exists'));
        }

        // Create directory if not exists
        $directory = dirname($pagePath);
        if (! File::exists($directory)) {
            File::makeDirectory($directory, 0755, true);
        }

        // Build YAML frontmatter
        $frontmatterYaml = "---\n";
        $frontmatterYaml .= "title: \"{$title}\"\n";
        $frontmatterYaml .= "description: \"\"\n";
        $frontmatterYaml .= "order: 999\n";
        $frontmatterYaml .= "---\n";

        // Save file
        File::put($pagePath, $frontmatterYaml."\n".$content);

        // Clear cache
        $this->cache->setLocale($locale)->clearLocale($locale);

        return redirect()->route('admin.plugins.documentation.browse', ['locale' => $locale])
            ->with('success', __('admin.documentation.messages.page_created'));
    }

    /**
     * Store a new category (folder)
     */
    public function storeCategory(Request $request)
    {
        $request->validate([
            'locale' => 'required|string',
            'name' => 'required|string|min:1|max:255',
            'slug' => 'required|string|min:1|max:255|regex:/^[a-z0-9-]+$/',
        ]);

        $locale = $request->input('locale');
        $name = $request->input('name');
        $slug = strtolower($request->input('slug'));

        $categoryPath = base_path("docs/{$locale}/{$slug}");

        // Check if category already exists
        if (File::exists($categoryPath)) {
            return response()->json([
                'success' => false,
                'message' => __('admin.documentation.messages.category_exists'),
            ], 400);
        }

        // Create category directory
        File::makeDirectory($categoryPath, 0755, true);

        // Create an index.md file with basic frontmatter
        $indexContent = "---\ntitle: \"{$name}\"\ndescription: \"\"\norder: 999\n---\n\n# {$name}\n\n";
        File::put($categoryPath.'/index.md', $indexContent);

        // Clear cache
        $this->cache->setLocale($locale)->clearLocale($locale);

        return response()->json([
            'success' => true,
            'message' => __('admin.documentation.messages.category_created'),
            'category' => [
                'id' => $slug,
                'title' => $name,
                'slug' => $slug,
                'pages' => [],
            ],
        ]);
    }

    /**
     * Delete a page
     */
    public function destroy(Request $request, string $locale, string $category, string $page)
    {
        $pagePath = base_path("docs/{$locale}/{$category}/{$page}.md");

        if (! File::exists($pagePath)) {
            return redirect()->back()
                ->with('error', __('admin.documentation.messages.file_not_found'));
        }

        File::delete($pagePath);

        // Clear cache
        $this->cache->setLocale($locale)->clearPage($locale, $category, $page);

        return redirect()->back()
            ->with('success', __('admin.documentation.messages.page_deleted'));
    }

    /**
     * Cache management
     */
    public function cache(Request $request)
    {
        return Inertia::render('Admin/Documentation/Cache', [
            'stats' => $this->cache->getStats(),
        ]);
    }

    /**
     * Clear cache
     */
    public function clearCache(Request $request)
    {
        $this->cache->clear();

        return redirect()->back()
            ->with('success', __('admin.documentation.messages.cache_cleared'));
    }

    /**
     * Warm cache
     */
    public function warmCache(Request $request)
    {
        $stats = $this->cache->warm();

        return redirect()->back()
            ->with('success', __('admin.documentation.messages.cache_warmed', [
                'locales' => $stats['locales'],
                'categories' => $stats['categories'],
                'pages' => $stats['pages'],
            ]));
    }

    /**
     * Get file tree (for file browser)
     */
    public function fileTree(Request $request, string $locale = 'fr')
    {
        try {
            $docsPath = base_path('docs/'.$locale);

            if (! File::exists($docsPath)) {
                return response()->json(['tree' => []]);
            }

            $tree = $this->buildFileTree($docsPath, $locale);

            return response()->json(['tree' => $tree]);
        } catch (\Exception $e) {
            \Log::error('Failed to build file tree: '.$e->getMessage(), [
                'locale' => $locale,
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json(['tree' => []], 200);
        }
    }

    /**
     * Build file tree recursively
     */
    protected function buildFileTree(string $path, string $locale, string $relativePath = ''): array
    {
        $items = [];

        $directories = File::directories($path);
        $files = File::files($path);

        // Sort directories and files
        sort($directories);
        sort($files);

        // Add directories first
        foreach ($directories as $directory) {
            $name = basename($directory);
            $relativeName = $relativePath ? $relativePath.'/'.$name : $name;

            // Try to read title from index.md
            $title = $name; // Default to folder name
            $indexPath = $directory.'/index.md';
            if (File::exists($indexPath)) {
                $content = File::get($indexPath);
                $frontmatter = $this->reader->parseFrontmatter($content);
                $title = $frontmatter['title'] ?? $name;
            }

            $items[] = [
                'type' => 'directory',
                'name' => $title, // Use title from index.md
                'path' => $relativeName,
                'title' => $title, // Add title field for consistency
                'children' => $this->buildFileTree($directory, $locale, $relativeName),
            ];
        }

        // Add files
        foreach ($files as $file) {
            if ($file->getExtension() !== 'md') {
                continue;
            }

            $name = $file->getFilename();
            $relativeName = $relativePath ? $relativePath.'/'.$name : $name;
            $slug = str_replace('.md', '', $name);

            // Extract title from frontmatter
            $content = File::get($file->getPathname());
            $frontmatter = $this->reader->parseFrontmatter($content);
            $title = $frontmatter['title'] ?? ucfirst($slug);

            $items[] = [
                'type' => 'file',
                'name' => $name,
                'title' => $title,
                'slug' => $slug,
                'path' => $relativeName,
                'url' => route('docs.page', [
                    'locale' => $locale,
                    'category' => explode('/', $relativeName)[0],
                    'page' => str_replace('.md', '', $relativeName),
                ]),
            ];
        }

        return $items;
    }

    /**
     * Get file content for editing (IDE-style editor)
     */
    public function fileContent(Request $request)
    {
        $request->validate([
            'locale' => 'required|string',
            'path' => 'required|string',
        ]);

        $locale = $request->input('locale');
        $path = $request->input('path');

        $filePath = base_path("docs/{$locale}/{$path}.md");

        if (! File::exists($filePath)) {
            return response()->json([
                'content' => '',
                'error' => 'File not found',
            ], 404);
        }

        $content = File::get($filePath);

        return response()->json([
            'content' => $content,
            'path' => $path,
        ]);
    }

    /**
     * Save file content (IDE-style editor)
     */
    public function saveContent(Request $request)
    {
        $request->validate([
            'locale' => 'required|string',
            'path' => 'required|string',
            'content' => 'required|string',
        ]);

        $locale = $request->input('locale');
        $path = $request->input('path');
        $content = $request->input('content');

        $filePath = base_path("docs/{$locale}/{$path}.md");

        // Create directory if not exists
        $directory = dirname($filePath);
        if (! File::exists($directory)) {
            File::makeDirectory($directory, 0755, true);
        }

        // Save file
        File::put($filePath, $content);

        // Extract category and page from path for cache clearing
        $pathParts = explode('/', $path);
        $category = $pathParts[0] ?? null;
        $page = str_replace('.md', '', $pathParts[count($pathParts) - 1] ?? null);

        if ($category && $page) {
            $this->cache->setLocale($locale)->clearPage($locale, $category, $page);
        }

        // Return success with flash message for Inertia
        return redirect()->back()
            ->with('success', __('admin.documentation.messages.file_saved'));
    }

    /**
     * Delete a file or folder by path
     */
    public function deleteByPath(Request $request)
    {
        $request->validate([
            'locale' => 'required|string',
            'path' => 'required|string',
            'type' => 'required|in:file,directory',
        ]);

        $locale = $request->input('locale');
        $path = $request->input('path');
        $type = $request->input('type');

        if ($type === 'file') {
            $filePath = base_path("docs/{$locale}/{$path}.md");

            if (! File::exists($filePath)) {
                return response()->json([
                    'success' => false,
                    'message' => __('admin.documentation.messages.file_not_found'),
                ], 404);
            }

            File::delete($filePath);
        } else {
            // Directory - delete recursively
            $dirPath = base_path("docs/{$locale}/{$path}");

            if (! File::exists($dirPath)) {
                return response()->json([
                    'success' => false,
                    'message' => __('admin.documentation.messages.folder_not_found'),
                ], 404);
            }

            File::deleteDirectory($dirPath);
        }

        // Clear cache for this locale
        $this->cache->setLocale($locale)->clearLocale($locale);

        return redirect()->back()
            ->with('success', $type === 'file'
                ? __('admin.documentation.messages.page_deleted')
                : __('admin.documentation.messages.folder_deleted'));
    }

    /**
     * Create a new locale (language)
     */
    public function createLocale(Request $request)
    {
        $request->validate([
            'locale' => 'required|string|min:2|max:10',
        ]);

        $locale = strtolower($request->input('locale'));
        $docsPath = base_path('docs/'.$locale);

        // Check if locale already exists
        if (File::exists($docsPath)) {
            return response()->json([
                'success' => false,
                'message' => __('admin.documentation.messages.locale_exists'),
            ], 400);
        }

        // Create locale directory
        File::makeDirectory($docsPath, 0755, true);

        // Create default category
        $defaultCategoryPath = $docsPath.'/getting-started';
        File::makeDirectory($defaultCategoryPath, 0755, true);

        // Create index.md file
        $indexContent = "---\ntitle: \"Bienvenue\"\ndescription: \"Page d'accueil\"\norder: 1\n---\n\n# Bienvenue\n\nCeci est la page d'accueil de la documentation en {$locale}.\n";
        File::put($defaultCategoryPath.'/index.md', $indexContent);

        return response()->json([
            'success' => true,
            'message' => __('admin.documentation.messages.locale_created'),
            'locale' => $locale,
        ]);
    }

    /**
     * Duplicate locale (language) from another language
     */
    public function duplicateLocale(Request $request)
    {
        $request->validate([
            'source_locale' => 'required|string|min:2|max:10',
            'target_locale' => 'required|string|min:2|max:10|different:source_locale',
        ]);

        $sourceLocale = strtolower($request->input('source_locale'));
        $targetLocale = strtolower($request->input('target_locale'));

        $sourcePath = base_path('docs/'.$sourceLocale);
        $targetPath = base_path('docs/'.$targetLocale);

        // Check if source locale exists
        if (! File::exists($sourcePath)) {
            return response()->json([
                'success' => false,
                'message' => __('admin.documentation.messages.source_locale_not_found'),
            ], 400);
        }

        // Check if target locale already exists
        if (File::exists($targetPath)) {
            return response()->json([
                'success' => false,
                'message' => __('admin.documentation.messages.locale_exists'),
            ], 400);
        }

        // Copy all files from source to target
        File::copyDirectory($sourcePath, $targetPath);

        // Clear cache for target locale
        $this->cache->setLocale($targetLocale)->clearLocale($targetLocale);

        return response()->json([
            'success' => true,
            'message' => __('admin.documentation.messages.locale_duplicated', [
                'source' => $sourceLocale,
                'target' => $targetLocale,
            ]),
            'source_locale' => $sourceLocale,
            'target_locale' => $targetLocale,
        ]);
    }

    /**
     * Reorder documentation items (categories and pages)
     * Saves order information to a JSON file for each locale
     */
    public function reorder(Request $request)
    {
        $locale = $request->input('locale', 'fr');
        $order = $request->input('order', []);

        if (empty($order)) {
            return response()->json([
                'success' => false,
                'message' => 'No order data provided',
            ], 400);
        }

        // Save order to a JSON file in the docs directory
        $orderPath = base_path('docs/'.$locale.'/.order.json');

        // Ensure directory exists
        if (! File::exists(dirname($orderPath))) {
            File::makeDirectory(dirname($orderPath), 0755, true);
        }

        File::put($orderPath, json_encode($order, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

        // Clear cache for this locale
        $this->cache->setLocale($locale)->clearLocale($locale);

        return response()->json([
            'success' => true,
            'message' => 'Order saved successfully',
        ]);
    }
}
