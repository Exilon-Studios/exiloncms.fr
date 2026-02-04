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

        return Inertia::render('Admin/Plugins/Documentation/Index', [
            'stats' => [
                'total_pages' => $totalPages,
                'total_categories' => $totalCategories,
                'total_locales' => $totalLocales,
                'cached_pages' => $cachedPages,
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
     * Browse documentation files
     */
    public function browse(Request $request, string $locale = 'fr')
    {
        $categories = $this->reader->getCategories($locale);

        return Inertia::render('Admin/Documentation/Browse', [
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
            ->with('success', 'Page mise à jour avec succès.');
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
                ->with('error', 'Cette page existe déjà.');
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

        return redirect()->route('admin.documentation.browse', ['locale' => $locale])
            ->with('success', 'Page créée avec succès.');
    }

    /**
     * Delete a page
     */
    public function destroy(Request $request, string $locale, string $category, string $page)
    {
        $pagePath = base_path("docs/{$locale}/{$category}/{$page}.md");

        if (! File::exists($pagePath)) {
            return redirect()->back()
                ->with('error', 'Page non trouvée.');
        }

        File::delete($pagePath);

        // Clear cache
        $this->cache->setLocale($locale)->clearPage($locale, $category, $page);

        return redirect()->back()
            ->with('success', 'Page supprimée avec succès.');
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
            ->with('success', 'Cache vidé avec succès.');
    }

    /**
     * Warm cache
     */
    public function warmCache(Request $request)
    {
        $stats = $this->cache->warm();

        return redirect()->back()
            ->with('success', "Cache préchargé : {$stats['locales']} locales, {$stats['categories']} catégories, {$stats['pages']} pages.");
    }

    /**
     * Get file tree (for file browser)
     */
    public function fileTree(Request $request, string $locale = 'fr')
    {
        $docsPath = base_path('docs/'.$locale);

        if (! File::exists($docsPath)) {
            return response()->json(['tree' => []]);
        }

        $tree = $this->buildFileTree($docsPath, $locale);

        return response()->json(['tree' => $tree]);
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

            $items[] = [
                'type' => 'directory',
                'name' => $name,
                'path' => $relativeName,
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
}
