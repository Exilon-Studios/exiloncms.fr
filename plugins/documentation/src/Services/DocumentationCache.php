<?php

namespace ExilonCMS\Plugins\Documentation\Services;

use Illuminate\Support\Facades\Cache;

/**
 * Documentation Cache Service
 *
 * Gère le cache de la documentation pour de meilleures performances
 */
class DocumentationCache
{
    protected string $locale;

    protected bool $enabled;

    protected int $duration;

    public function __construct()
    {
        $this->locale = app()->getLocale();
        $this->enabled = setting('plugin.documentation.cache_enabled', true);
        $this->duration = (int) setting('plugin.documentation.cache_duration', 3600);
    }

    /**
     * Set the locale
     */
    public function setLocale(string $locale): self
    {
        $this->locale = $locale;

        return $this;
    }

    /**
     * Check if cache is enabled
     */
    public function isEnabled(): bool
    {
        return $this->enabled;
    }

    /**
     * Enable or disable cache
     */
    public function setEnabled(bool $enabled): self
    {
        $this->enabled = $enabled;

        return $this;
    }

    /**
     * Get cached navigation
     */
    public function getNavigation(callable $callback): array
    {
        return $this->remember('docs.navigation.'.$this->locale, $callback);
    }

    /**
     * Get cached categories
     */
    public function getCategories(callable $callback): array
    {
        return $this->remember('docs.categories.'.$this->locale, $callback);
    }

    /**
     * Get cached page content
     */
    public function getPage(string $category, string $page, callable $callback): ?array
    {
        $key = 'docs.page.'.$this->locale.'.'.$category.'.'.str_replace('/', '.', $page);

        return $this->remember($key, $callback);
    }

    /**
     * Get cached search results
     */
    public function getSearchResults(string $query, callable $callback): array
    {
        // Cache search results for shorter time
        $originalDuration = $this->duration;
        $this->duration = min(300, $this->duration); // Max 5 minutes for search

        $result = $this->remember('docs.search.'.$this->locale.'.'.md5($query), $callback);

        $this->duration = $originalDuration;

        return $result;
    }

    /**
     * Remember a value in cache
     */
    protected function remember(string $key, callable $callback): mixed
    {
        if (! $this->enabled) {
            return $callback();
        }

        return Cache::remember($key, $this->duration, $callback);
    }

    /**
     * Clear all documentation cache
     */
    public function clear(): void
    {
        $locales = ['fr', 'en'];

        foreach ($locales as $locale) {
            Cache::forget('docs.navigation.'.$locale);
            Cache::forget('docs.categories.'.$locale);
        }

        // Clear all page caches
        $keys = Cache::get('docs.cache_keys', []);

        foreach ($keys as $key) {
            Cache::forget($key);
        }

        Cache::forget('docs.cache_keys');
    }

    /**
     * Clear cache for specific locale
     */
    public function clearLocale(string $locale): void
    {
        Cache::forget('docs.navigation.'.$locale);
        Cache::forget('docs.categories.'.$locale);
    }

    /**
     * Clear cache for specific page
     */
    public function clearPage(string $locale, string $category, string $page): void
    {
        $key = 'docs.page.'.$locale.'.'.$category.'.'.str_replace('/', '.', $page);
        Cache::forget($key);
    }

    /**
     * Warm up the cache (pre-load all data)
     */
    public function warm(): array
    {
        $stats = [
            'locales' => 0,
            'categories' => 0,
            'pages' => 0,
        ];

        if (! $this->enabled) {
            return $stats;
        }

        $reader = app(DocumentationReader::class);
        $locales = $reader->getAvailableLocales();

        foreach ($locales as $locale) {
            $stats['locales']++;

            $categories = $reader->getCategories($locale);
            $stats['categories'] += count($categories);

            foreach ($categories as $category) {
                $stats['pages'] += count($category['pages'] ?? []);

                // Cache each page
                foreach ($category['pages'] ?? [] as $page) {
                    $this->getPage($category['id'], $page['id'], function () use ($reader, $locale, $category, $page) {
                        return $reader->getPageContent($locale, $category['id'], $page['id']);
                    });
                }
            }
        }

        return $stats;
    }

    /**
     * Get cache statistics
     */
    public function getStats(): array
    {
        return [
            'enabled' => $this->enabled,
            'duration' => $this->duration,
            'locale' => $this->locale,
        ];
    }
}
