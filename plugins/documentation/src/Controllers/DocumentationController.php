<?php

namespace ExilonCMS\Plugins\Documentation\Controllers;

use ExilonCMS\Plugins\Documentation\Services\DocumentationCache;
use ExilonCMS\Plugins\Documentation\Services\DocumentationReader;
use ExilonCMS\Plugins\Documentation\Services\NavigationBuilder;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Documentation Controller
 *
 * Gère l'affichage de la documentation
 */
class DocumentationController
{
    public function __construct(
        protected DocumentationReader $reader,
        protected NavigationBuilder $navigation,
        protected DocumentationCache $cache,
    ) {}

    /**
     * Index page - show documentation home
     */
    public function index(Request $request, string $locale = 'fr')
    {
        // Validate locale
        $availableLocales = $this->reader->getAvailableLocales();

        if (! in_array($locale, $availableLocales, true)) {
            $locale = setting('plugin.documentation.default_locale', 'fr');
        }

        // Get categories for this locale
        $categories = $this->cache->setLocale($locale)->getCategories(function () use ($locale) {
            return $this->reader->getCategories($locale);
        });

        // Get navigation
        $navigation = $this->cache->setLocale($locale)->getNavigation(function () use ($locale) {
            return $this->navigation->build($locale);
        });

        return Inertia::render('Documentation/Index', [
            'locale' => $locale,
            'availableLocales' => $availableLocales,
            'categories' => $categories,
            'navigation' => $navigation,
            'currentPage' => null,
        ]);
    }

    /**
     * Show a category page (index.md of category)
     */
    public function category(Request $request, string $locale, string $category)
    {
        // Get category index page
        $pageContent = $this->cache->setLocale($locale)->getPage($category, 'index', function () use ($locale, $category) {
            return $this->reader->getPageContent($locale, $category, 'index.md');
        });

        if (! $pageContent) {
            // If no index.md, redirect to first page
            $categories = $this->reader->getCategories($locale);
            $categoryData = collect($categories)->firstWhere('slug', $category);

            if ($categoryData && ! empty($categoryData['pages'])) {
                $firstPage = $categoryData['pages'][0];

                return redirect()->route('docs.page', [
                    'locale' => $locale,
                    'category' => $category,
                    'page' => $firstPage['slug'],
                ]);
            }

            abort(404, 'Category not found');
        }

        return $this->renderPage($request, $locale, $category, null, $pageContent);
    }

    /**
     * Show a documentation page
     */
    public function page(Request $request, string $locale, string $category, string $page)
    {
        // Get page content
        $pageContent = $this->cache->setLocale($locale)->getPage($category, $page, function () use ($locale, $category, $page) {
            return $this->reader->getPageContent($locale, $category, $page);
        });

        if (! $pageContent) {
            abort(404, 'Page not found');
        }

        return $this->renderPage($request, $locale, $category, $page, $pageContent);
    }

    /**
     * Render a documentation page
     */
    protected function renderPage(Request $request, string $locale, string $category, ?string $page, array $pageContent)
    {
        $availableLocales = $this->reader->getAvailableLocales();

        // Get navigation
        $navigation = $this->cache->setLocale($locale)->getNavigation(function () use ($locale) {
            return $this->navigation->build($locale);
        });

        // Build flat navigation for sidebar
        $flatNavigation = $this->navigation->buildFlat($locale);

        // Get breadcrumb
        $breadcrumb = $this->navigation->buildBreadcrumb($locale, $category, $page);

        // Get adjacent pages (prev/next)
        $pageSlug = $page ?? 'index';
        $adjacent = $this->navigation->getAdjacentPages($locale, $category, $pageSlug);

        // Get table of contents
        $tableOfContents = $this->navigation->getTableOfContents($pageContent['headings']);

        return Inertia::render('Documentation/Page', [
            'locale' => $locale,
            'availableLocales' => $availableLocales,
            'navigation' => $navigation,
            'flatNavigation' => $flatNavigation,
            'breadcrumb' => $breadcrumb,
            'page' => [
                'category' => $category,
                'slug' => $page ?? 'index',
                'content' => $pageContent['content'],
                'frontmatter' => $pageContent['frontmatter'],
                'headings' => $pageContent['headings'],
                'last_modified' => $pageContent['last_modified'],
                'reading_time' => $pageContent['reading_time'],
            ],
            'tableOfContents' => $tableOfContents,
            'adjacent' => $adjacent,
        ]);
    }

    /**
     * Search documentation
     */
    public function search(Request $request, string $locale = 'fr')
    {
        $query = $request->input('q', '');

        if (strlen($query) < 2) {
            return response()->json(['results' => []]);
        }

        $results = $this->cache->setLocale($locale)->getSearchResults($query, function () use ($query, $locale) {
            return $this->reader->search($query, $locale);
        });

        return response()->json([
            'results' => $results,
            'count' => count($results),
        ]);
    }

    /**
     * Get page content via AJAX (for dynamic loading)
     */
    public function content(Request $request, string $locale, string $category, string $page)
    {
        $pageContent = $this->cache->setLocale($locale)->getPage($category, $page, function () use ($locale, $category, $page) {
            return $this->reader->getPageContent($locale, $category, $page);
        });

        if (! $pageContent) {
            return response()->json(['error' => 'Page not found'], 404);
        }

        return response()->json([
            'content' => $pageContent['content'],
            'frontmatter' => $pageContent['frontmatter'],
            'headings' => $pageContent['headings'],
            'table_of_contents' => $this->navigation->getTableOfContents($pageContent['headings']),
        ]);
    }
}
