<?php

namespace ExilonCMS\Plugins\Documentation\Services;

/**
 * Navigation Builder Service
 *
 * Construit automatiquement la navigation basée sur la structure des dossiers
 */
class NavigationBuilder
{
    protected DocumentationReader $reader;

    protected array $categoryIcons = [
        'installation' => 'Download',
        'configuration' => 'Settings',
        'utilisation' => 'Play',
        'usage' => 'Play',
        'themes' => 'Palette',
        'plugins' => 'Plug',
        'boutique' => 'ShoppingCart',
        'shop' => 'ShoppingCart',
        'mises_a_jour' => 'RefreshCw',
        'updates' => 'RefreshCw',
        'serveurs_jeux' => 'Server',
        'game-servers' => 'Server',
        'faq' => 'HelpCircle',
        'introduction' => 'BookOpen',
        'evenements' => 'Zap',
        'events' => 'Zap',
        'widgets' => 'Layout',
        'marketplace' => 'Store',
        'api' => 'Code',
        'tests' => 'TestTube',
        'contribution' => 'GitPullRequest',
        'reference' => 'Library',
    ];

    public function __construct(DocumentationReader $reader)
    {
        $this->reader = $reader;
    }

    /**
     * Build full navigation tree for a locale
     */
    public function build(string $locale = 'fr'): array
    {
        $categories = $this->reader->getCategories($locale);

        return array_map(fn ($category) => $this->buildCategoryNode($locale, $category), $categories);
    }

    /**
     * Build a category node with its pages
     */
    protected function buildCategoryNode(string $locale, array $category): array
    {
        return [
            'id' => $category['id'],
            'slug' => $category['slug'],
            'title' => $category['title'],
            'description' => $category['description'],
            'icon' => $category['icon'] ?? $this->getIconForCategory($category['id']),
            'order' => $category['order'] ?? 999,
            'href' => '/docs/'.$locale.'/'.$category['slug'],
            'type' => 'category',
            'children' => $this->buildPageNodes($locale, $category['id'], $category['pages'] ?? []),
        ];
    }

    /**
     * Build page nodes
     */
    protected function buildPageNodes(string $locale, string $categorySlug, array $pages): array
    {
        return array_map(function ($page) use ($locale, $categorySlug) {
            $node = [
                'id' => $page['id'],
                'slug' => $page['slug'],
                'title' => $page['title'],
                'description' => $page['description'],
                'icon' => $page['icon'] ?? 'FileText',
                'order' => $page['order'] ?? 999,
                'href' => '/docs/'.$locale.'/'.$categorySlug.'/'.$page['slug'],
                'type' => 'page',
                'badge' => $page['badge'] ?? '',
            ];

            // Add children if exists
            if (! empty($page['children'])) {
                $node['children'] = $this->buildPageNodes($locale, $categorySlug, $page['children']);
            }

            return $node;
        }, $pages);
    }

    /**
     * Build flat navigation list (for sidebar)
     */
    public function buildFlat(string $locale = 'fr'): array
    {
        $tree = $this->build($locale);
        $flat = [];

        foreach ($tree as $category) {
            $flat[] = [
                'type' => 'header',
                'title' => $category['title'],
                'icon' => $category['icon'],
            ];

            foreach ($category['children'] as $page) {
                $flat[] = $page;

                if (! empty($page['children'])) {
                    foreach ($page['children'] as $child) {
                        $flat[] = array_merge($child, [
                            'indent' => true,
                            'parent' => $page['title'],
                        ]);
                    }
                }
            }
        }

        return $flat;
    }

    /**
     * Build breadcrumb for a page
     */
    public function buildBreadcrumb(string $locale, string $category, ?string $page = null): array
    {
        $breadcrumb = [
            [
                'title' => 'Documentation',
                'href' => '/docs',
            ],
            [
                'title' => $locale,
                'href' => '/docs/'.$locale,
            ],
        ];

        $categories = $this->reader->getCategories($locale);
        $categoryData = collect($categories)->firstWhere('id', $category);

        if ($categoryData) {
            $breadcrumb[] = [
                'title' => $categoryData['title'],
                'href' => '/docs/'.$locale.'/'.$categoryData['slug'],
            ];
        }

        if ($page) {
            // Handle nested pages
            $pageParts = explode('/', $page);

            if (count($pageParts) > 1) {
                // Has parent page
                $parentPage = $this->reader->getPageInfo($locale, $category, $pageParts[0].'.md');
                if ($parentPage) {
                    $breadcrumb[] = [
                        'title' => $parentPage['title'],
                        'href' => '/docs/'.$locale.'/'.$category.'/'.$pageParts[0],
                    ];
                }
            }

            $pageData = $this->reader->getPageInfo($locale, $category, end($pageParts).'.md');
            if ($pageData) {
                $breadcrumb[] = [
                    'title' => $pageData['title'],
                    'href' => null, // Current page
                ];
            }
        }

        return $breadcrumb;
    }

    /**
     * Get next/prev navigation
     */
    public function getAdjacentPages(string $locale, string $category, string $page): array
    {
        $categories = $this->reader->getCategories($locale);
        $flatPages = [];

        foreach ($categories as $cat) {
            foreach ($cat['pages'] ?? [] as $p) {
                $flatPages[] = [
                    'category' => $cat['id'],
                    'category_slug' => $cat['slug'],
                    'page' => $p['id'],
                    'slug' => $p['slug'],
                    'title' => $p['title'],
                ];

                if (! empty($p['children'])) {
                    foreach ($p['children'] as $child) {
                        $flatPages[] = [
                            'category' => $cat['id'],
                            'category_slug' => $cat['slug'],
                            'page' => $p['id'].'/'.$child['id'],
                            'slug' => $p['id'].'/'.$child['slug'],
                            'title' => $child['title'],
                            'parent' => $p['title'],
                        ];
                    }
                }
            }
        }

        // Find current page index
        $currentIndex = null;
        foreach ($flatPages as $index => $p) {
            if ($p['category'] === $category && $p['page'] === $page) {
                $currentIndex = $index;
                break;
            }
        }

        return [
            'prev' => $currentIndex > 0 ? $flatPages[$currentIndex - 1] : null,
            'next' => $currentIndex < count($flatPages) - 1 ? $flatPages[$currentIndex + 1] : null,
        ];
    }

    /**
     * Get icon for category based on its name
     */
    protected function getIconForCategory(string $categoryName): string
    {
        return $this->categoryIcons[$categoryName] ?? 'Folder';
    }

    /**
     * Get table of contents for a page
     */
    public function getTableOfContents(array $headings): array
    {
        $toc = [];
        $stack = [&$toc];

        foreach ($headings as $heading) {
            $level = $heading['level'];

            // Pop stack until we find the right parent level
            while (count($stack) > $level) {
                array_pop($stack);
            }

            $item = [
                'id' => $heading['id'],
                'text' => $heading['text'],
                'level' => $heading['level'],
                'children' => [],
            ];

            // Add to current parent
            $parent = &$stack[count($stack) - 1];
            $parent[] = $item;

            // Push this item as potential parent for next items
            $stack[] = &$item[count($item) - 1];
        }

        return $this->flattenTableOfContents($toc);
    }

    /**
     * Flatten nested table of contents
     */
    protected function flattenTableOfContents(array $nested, int $depth = 0): array
    {
        $flat = [];

        foreach ($nested as $item) {
            $flat[] = [
                'id' => $item['id'],
                'text' => $item['text'],
                'level' => $item['level'],
                'depth' => $depth,
            ];

            if (! empty($item['children'])) {
                $flat = array_merge($flat, $this->flattenTableOfContents($item['children'], $depth + 1));
            }
        }

        return $flat;
    }
}
