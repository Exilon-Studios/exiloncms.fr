<?php

namespace ExilonCMS\Plugins\Documentation\Services;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

/**
 * Documentation Reader Service
 *
 * Lit les fichiers markdown depuis le dossier /docs
 * et extrait les métadonnées (frontmatter)
 */
class DocumentationReader
{
    protected string $docsPath;

    protected array $defaultFrontmatter = [
        'title' => '',
        'description' => '',
        'category' => '',
        'order' => 0,
        'icon' => '',
        'badge' => '',
        'draft' => false,
    ];

    public function __construct()
    {
        $this->docsPath = base_path('docs');
    }

    /**
     * Set the documentation path (for testing or custom paths)
     */
    public function setDocsPath(string $path): self
    {
        $this->docsPath = $path;

        return $this;
    }

    /**
     * Get all available locales
     */
    public function getAvailableLocales(): array
    {
        if (! File::exists($this->docsPath)) {
            return ['fr', 'en'];
        }

        $locales = [];
        $directories = File::directories($this->docsPath);

        foreach ($directories as $directory) {
            $locale = basename($directory);
            if (preg_match('/^[a-z]{2}(_[A-Z]{2})?$/', $locale)) {
                $locales[] = $locale;
            }
        }

        return array_values(array_unique(array_merge(['fr', 'en'], $locales)));
    }

    /**
     * Get all categories for a locale
     */
    public function getCategories(string $locale): array
    {
        $localePath = $this->docsPath.'/'.$locale;

        if (! File::exists($localePath)) {
            return [];
        }

        $categories = [];
        $directories = File::directories($localePath);

        foreach ($directories as $directory) {
            $categoryName = basename($directory);
            $categories[] = $this->getCategoryInfo($locale, $categoryName);
        }

        // Sort by order
        usort($categories, fn ($a, $b) => ($a['order'] ?? 999) <=> ($b['order'] ?? 999));

        return $categories;
    }

    /**
     * Get category information
     */
    public function getCategoryInfo(string $locale, string $category): array
    {
        $categoryPath = $this->docsPath.'/'.$locale.'/'.$category;
        $indexFile = $categoryPath.'/index.md';

        $info = [
            'id' => $category,
            'slug' => Str::slug($category),
            'title' => ucfirst($category),
            'description' => '',
            'icon' => 'Folder',
            'order' => 999,
            'pages' => [],
        ];

        // Read index.md for metadata
        if (File::exists($indexFile)) {
            $content = File::get($indexFile);
            $frontmatter = $this->parseFrontmatter($content);

            $info = array_merge($info, $frontmatter);
        }

        // Get all pages in category
        $info['pages'] = $this->getPages($locale, $category);

        return $info;
    }

    /**
     * Get all pages in a category
     */
    public function getPages(string $locale, string $category): array
    {
        $categoryPath = $this->docsPath.'/'.$locale.'/'.$category;

        if (! File::exists($categoryPath)) {
            return [];
        }

        $pages = [];
        $files = File::allFiles($categoryPath);

        foreach ($files as $file) {
            if ($file->getExtension() !== 'md') {
                continue;
            }

            $fileName = $file->getFilename();
            $relativePath = $file->getRelativePath();

            // Skip index.md as it's the category itself
            if ($fileName === 'index.md') {
                continue;
            }

            $page = $this->getPageInfo($locale, $category, $fileName);
            if ($page && ! $page['draft']) {
                $pages[] = $page;
            }
        }

        // Sort by order
        usort($pages, fn ($a, $b) => ($a['order'] ?? 999) <=> ($b['order'] ?? 999));

        return $pages;
    }

    /**
     * Get page information
     */
    public function getPageInfo(string $locale, string $category, string $fileName): ?array
    {
        $pagePath = $this->docsPath.'/'.$locale.'/'.$category.'/'.$fileName;

        if (! File::exists($pagePath)) {
            return null;
        }

        $content = File::get($pagePath);
        $frontmatter = $this->parseFrontmatter($content);

        $pageSlug = str_replace('.md', '', $fileName);

        $page = [
            'id' => $pageSlug,
            'slug' => Str::slug($pageSlug),
            'title' => $frontmatter['title'] ?? ucfirst(str_replace(['-', '_'], ' ', $pageSlug)),
            'description' => $frontmatter['description'] ?? '',
            'category' => $category,
            'order' => $frontmatter['order'] ?? 999,
            'icon' => $frontmatter['icon'] ?? 'FileText',
            'badge' => $frontmatter['badge'] ?? '',
            'draft' => $frontmatter['draft'] ?? false,
            'last_modified' => filemtime($pagePath),
            'reading_time' => $this->calculateReadingTime($content),
        ];

        // Get sub-pages if directory
        $pagePathWithoutExt = str_replace('.md', '', $pagePath);
        if (File::isDirectory($pagePathWithoutExt)) {
            $page['has_children'] = true;
            $page['children'] = $this->getSubPages($locale, $category, $pageSlug);
        }

        return $page;
    }

    /**
     * Get sub-pages (pages in subdirectories)
     */
    public function getSubPages(string $locale, string $category, string $parentSlug): array
    {
        $parentPath = $this->docsPath.'/'.$locale.'/'.$category.'/'.$parentSlug;

        if (! File::exists($parentPath)) {
            return [];
        }

        $subPages = [];
        $files = File::allFiles($parentPath);

        foreach ($files as $file) {
            if ($file->getExtension() !== 'md') {
                continue;
            }

            $page = $this->getPageInfo($locale, $category, $parentSlug.'/'.$file->getFilename());
            if ($page && ! $page['draft']) {
                $subPages[] = $page;
            }
        }

        return $subPages;
    }

    /**
     * Get page content
     */
    public function getPageContent(string $locale, string $category, string $page): ?array
    {
        // Handle nested pages (e.g., "plugin/creer-plugin")
        $pagePath = $this->docsPath.'/'.$locale.'/'.$category.'/'.$page.'.md';

        // If not found, try with subdirectory
        if (! File::exists($pagePath)) {
            $parts = explode('/', $page);
            if (count($parts) > 1) {
                $parent = array_shift($parts);
                $child = implode('/', $parts);
                $pagePath = $this->docsPath.'/'.$locale.'/'.$category.'/'.$parent.'/'.$child.'.md';
            }
        }

        if (! File::exists($pagePath)) {
            return null;
        }

        $content = File::get($pagePath);
        $frontmatter = $this->parseFrontmatter($content);
        $markdown = $this->extractMarkdown($content);

        // Extract headings for table of contents
        $headings = $this->extractHeadings($markdown);

        return [
            'content' => $markdown,
            'frontmatter' => $frontmatter,
            'headings' => $headings,
            'last_modified' => filemtime($pagePath),
            'reading_time' => $this->calculateReadingTime($content),
        ];
    }

    /**
     * Parse frontmatter from markdown content
     */
    protected function parseFrontmatter(string $content): array
    {
        $frontmatter = array_merge([], $this->defaultFrontmatter);

        // Check for YAML frontmatter
        if (preg_match('/^---\n(.*?)\n---\n/s', $content, $matches)) {
            $yaml = $matches[1];

            // Parse simple YAML key-value pairs
            $lines = explode("\n", $yaml);
            foreach ($lines as $line) {
                if (preg_match('/^([a-z_]+):\s*(.+)$/i', $line, $match)) {
                    $key = $match[1];
                    $value = trim($match[2]);

                    // Strip quotes from string values
                    if (preg_match('/^(["\'])(.*)\1$/', $value, $quoteMatch)) {
                        $value = $quoteMatch[2];
                    }

                    // Handle different value types
                    if (strtolower($value) === 'true') {
                        $value = true;
                    } elseif (strtolower($value) === 'false') {
                        $value = false;
                    } elseif (is_numeric($value)) {
                        $value = ctype_digit($value) ? (int) $value : (float) $value;
                    }

                    $frontmatter[$key] = $value;
                }
            }
        }

        return $frontmatter;
    }

    /**
     * Extract markdown content without frontmatter
     */
    protected function extractMarkdown(string $content): string
    {
        // Remove YAML frontmatter
        return preg_replace('/^---\n.*?\n---\n/s', '', $content);
    }

    /**
     * Extract headings from markdown for table of contents
     */
    protected function extractHeadings(string $markdown): array
    {
        $headings = [];

        // Match headings (## to ######)
        if (preg_match_all('/^(#{2,6})\s+(.+)$/m', $markdown, $matches, PREG_SET_ORDER)) {
            $level = 1;
            foreach ($matches as $match) {
                $headingLevel = strlen($match[1]) - 1;
                $headingText = trim($match[2]);
                $headingId = Str::slug($headingText);

                $headings[] = [
                    'id' => $headingId,
                    'text' => $headingText,
                    'level' => $headingLevel,
                    'order' => $level++,
                ];
            }
        }

        return $headings;
    }

    /**
     * Calculate estimated reading time
     */
    protected function calculateReadingTime(string $content, int $wordsPerMinute = 200): int
    {
        // Remove frontmatter and code blocks
        $content = $this->extractMarkdown($content);
        $content = preg_replace('/```.*?```/s', '', $content);

        // Count words
        $wordCount = str_word_count(strip_tags($content));

        return max(1, ceil($wordCount / $wordsPerMinute));
    }

    /**
     * Search across all documentation
     */
    public function search(string $query, string $locale = 'fr'): array
    {
        $results = [];
        $categories = $this->getCategories($locale);

        foreach ($categories as $category) {
            foreach ($category['pages'] as $page) {
                $content = $this->getPageContent($locale, $category['id'], $page['id']);

                if (! $content) {
                    continue;
                }

                $searchText = strtolower($page['title'].' '.$content['content']);

                if (str_contains($searchText, strtolower($query))) {
                    // Extract snippet
                    $snippet = $this->extractSnippet($content['content'], $query);

                    $results[] = [
                        'title' => $page['title'],
                        'category' => $category['title'],
                        'slug' => $page['slug'],
                        'category_slug' => $category['id'],
                        'snippet' => $snippet,
                        'relevance' => $this->calculateRelevance($query, $page['title'], $content['content']),
                    ];
                }
            }

            // Search in sub-pages
            if (! empty($page['children'])) {
                foreach ($page['children'] as $child) {
                    $childContent = $this->getPageContent($locale, $category['id'], $page['id'].'/'.$child['id']);

                    if ($childContent) {
                        $searchText = strtolower($child['title'].' '.$childContent['content']);

                        if (str_contains($searchText, strtolower($query))) {
                            $results[] = [
                                'title' => $child['title'],
                                'category' => $category['title'],
                                'parent' => $page['title'],
                                'slug' => $page['id'].'/'.$child['id'],
                                'category_slug' => $category['id'],
                                'snippet' => $this->extractSnippet($childContent['content'], $query),
                                'relevance' => $this->calculateRelevance($query, $child['title'], $childContent['content']),
                            ];
                        }
                    }
                }
            }
        }

        // Sort by relevance
        usort($results, fn ($a, $b) => $b['relevance'] <=> $a['relevance']);

        return array_slice($results, 0, 20);
    }

    /**
     * Extract a snippet around the search query
     */
    protected function extractSnippet(string $content, string $query, int $length = 200): string
    {
        $content = preg_replace('/```.*?```/s', '', $content);
        $queryLower = strtolower($query);

        $pos = stripos($content, $queryLower);

        if ($pos === false) {
            return substr(strip_tags($content), 0, $length).'...';
        }

        $start = max(0, $pos - $length / 2);
        $snippet = substr($content, $start, $length);

        if ($start > 0) {
            $snippet = '...'.$snippet;
        }

        if (strlen($content) > $start + $length) {
            $snippet = $snippet.'...';
        }

        return strip_tags($snippet);
    }

    /**
     * Calculate search relevance score
     */
    protected function calculateRelevance(string $query, string $title, string $content): int
    {
        $score = 0;
        $queryLower = strtolower($query);

        // Title match is worth more
        if (str_contains(strtolower($title), $queryLower)) {
            $score += 50;
            // Exact title match
            if (strtolower($title) === $queryLower) {
                $score += 30;
            }
        }

        // Count occurrences in content
        $score += substr_count(strtolower($content), $queryLower) * 5;

        return $score;
    }
}
