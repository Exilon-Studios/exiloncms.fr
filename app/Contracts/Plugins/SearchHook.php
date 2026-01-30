<?php

namespace ExilonCMS\Contracts\Plugins;

/**
 * Search Hook Contract
 *
 * Plugins can implement this to add searchable content:
 * - Posts, pages, products
 * - Users, servers, resources
 * - Custom entities
 *
 * Example implementation in plugin.json:
 * "hooks": {
 *   "search": {
 *     "providers": ["BlogSearch", "ShopSearch", "UserSearch"],
 *     "types": ["posts", "products", "users"]
 *   }
 * }
 */
interface SearchHook
{
    /**
     * Register searchable content types.
     * Returns array of type configurations.
     *
     * @return array<string, array{label: string, icon: string, priority: int}>
     */
    public function registerSearchableTypes(): array;

    /**
     * Perform search for a specific type.
     *
     * @return array<int, array{id: mixed, title: string, url: string, type: string}>
     */
    public function search(string $type, string $query, int $limit = 10): array;

    /**
     * Get search result highlight snippet.
     *
     * @param  mixed  $result
     */
    public function getSearchSnippet(string $type, string $query, $result): string;

    /**
     * Get search result URL.
     *
     * @param  mixed  $result
     */
    public function getSearchUrl(string $type, $result): string;

    /**
     * Check if user can access this search result.
     *
     * @param  mixed  $result
     * @param  \ExilonCMS\Models\User|null  $user
     */
    public function canAccessSearchResult(string $type, $result, $user = null): bool;
}
