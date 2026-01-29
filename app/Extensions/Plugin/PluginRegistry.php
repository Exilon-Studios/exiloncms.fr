<?php

namespace ExilonCMS\Extensions\Plugin;

use Illuminate\Support\Collection;

class PluginRegistry
{
    /**
     * Registered plugin blocks/widgets.
     *
     * @var array<string, array<string, mixed>>
     */
    protected static array $blocks = [];

    /**
     * Registered navbar items from plugins.
     *
     * @var array<int, array<string, mixed>>
     */
    protected static array $navbarItems = [];

    /**
     * Registered footer links from plugins.
     *
     * @var array<string, array<int, array<string, mixed>>>
     */
    protected static array $footerLinks = [];

    /**
     * Registered pages from plugins.
     *
     * @var array<string, array<string, mixed>>
     */
    protected static array $pages = [];

    /**
     * Registered sidebar sections for admin.
     *
     * @var array<int, array<string, mixed>>
     */
    protected static array $adminSections = [];

    /**
     * Register a block/widget from a plugin.
     * Blocks can be displayed in themes (hero, sidebar, footer, etc.)
     */
    public static function registerBlock(string $pluginId, string $blockId, array $config): void
    {
        static::$blocks[$pluginId][$blockId] = [
            'id' => $blockId,
            'plugin' => $pluginId,
            'type' => $config['type'] ?? 'component', // component, html, iframe
            'component' => $config['component'] ?? null,
            'props' => $config['props'] ?? [],
            'content' => $config['content'] ?? null,
            'position' => $config['position'] ?? 'bottom',
            'priority' => $config['priority'] ?? 50,
        ];
    }

    /**
     * Register a navbar item from a plugin.
     */
    public static function registerNavbarItem(string $pluginId, array $item): void
    {
        static::$navbarItems[] = [
            'id' => $item['id'] ?? $pluginId.'-'.$item['label'],
            'plugin' => $pluginId,
            'label' => $item['label'],
            'url' => $item['url'] ?? null,
            'route' => $item['route'] ?? null,
            'icon' => $item['icon'] ?? null,
            'badge' => $item['badge'] ?? null,
            'permission' => $item['permission'] ?? null,
            'position' => $item['position'] ?? 50,
            'new_tab' => $item['new_tab'] ?? false,
        ];
    }

    /**
     * Register footer links from a plugin.
     */
    public static function registerFooterLinks(string $pluginId, string $category, array $links): void
    {
        if (! isset(static::$footerLinks[$category])) {
            static::$footerLinks[$category] = [];
        }

        foreach ($links as $link) {
            static::$footerLinks[$category][] = [
                'plugin' => $pluginId,
                'label' => $link['label'],
                'url' => $link['url'] ?? null,
                'route' => $link['route'] ?? null,
                'icon' => $link['icon'] ?? null,
                'position' => $link['position'] ?? 50,
            ];
        }
    }

    /**
     * Register a page from a plugin.
     */
    public static function registerPage(string $pluginId, string $pageId, array $config): void
    {
        static::$pages[$pageId] = [
            'id' => $pageId,
            'plugin' => $pluginId,
            'title' => $config['title'],
            'description' => $config['description'] ?? null,
            'route' => $config['route'],
            'component' => $config['component'] ?? null, // React component path
            'layout' => $config['layout'] ?? 'public', // public, auth, admin
            'permission' => $config['permission'] ?? null,
            'keywords' => $config['keywords'] ?? [],
            'show_in_navbar' => $config['show_in_navbar'] ?? false,
            'show_in_footer' => $config['show_in_footer'] ?? false,
        ];
    }

    /**
     * Register an admin sidebar section from a plugin.
     */
    public static function registerAdminSection(string $pluginId, array $section): void
    {
        static::$adminSections[] = [
            'id' => $section['id'] ?? $pluginId.'-'.$section['label'],
            'plugin' => $pluginId,
            'label' => $section['label'],
            'items' => $section['items'] ?? [],
            'permission' => $section['permission'] ?? null,
            'position' => $section['position'] ?? 50,
            'icon' => $section['icon'] ?? null,
        ];
    }

    /**
     * Get all registered blocks, filtered by enabled plugins.
     */
    public static function getBlocks(array $enabledPlugins = []): Collection
    {
        $blocks = collect(static::$blocks);

        if (! empty($enabledPlugins)) {
            $blocks = $blocks->filter(fn ($blocks, $pluginId) => in_array($pluginId, $enabledPlugins, true));
        }

        return $blocks->flatten(1)->sortBy('priority')->values();
    }

    /**
     * Get blocks by position (hero, sidebar, footer, etc.)
     */
    public static function getBlocksByPosition(string $position, array $enabledPlugins = []): Collection
    {
        return static::getBlocks($enabledPlugins)
            ->filter(fn ($block) => $block['position'] === $position)
            ->values();
    }

    /**
     * Get all registered navbar items, filtered by enabled plugins.
     */
    public static function getNavbarItems(array $enabledPlugins = []): Collection
    {
        $items = collect(static::$navbarItems);

        if (! empty($enabledPlugins)) {
            $items = $items->filter(fn ($item) => in_array($item['plugin'], $enabledPlugins, true));
        }

        return $items->sortBy('position')->values();
    }

    /**
     * Get all registered footer links, filtered by enabled plugins.
     */
    public static function getFooterLinks(array $enabledPlugins = []): array
    {
        $links = collect(static::$footerLinks);

        if (! empty($enabledPlugins)) {
            $links = $links->map(fn ($categoryLinks) => collect($categoryLinks)
                ->filter(fn ($link) => in_array($link['plugin'], $enabledPlugins, true))
                ->sortBy('position')
                ->values()
            )->toArray();
        }

        return $links->toArray();
    }

    /**
     * Get all registered pages, filtered by enabled plugins.
     */
    public static function getPages(array $enabledPlugins = []): Collection
    {
        $pages = collect(static::$pages);

        if (! empty($enabledPlugins)) {
            $pages = $pages->filter(fn ($page) => in_array($page['plugin'], $enabledPlugins, true));
        }

        return $pages->values();
    }

    /**
     * Get all registered admin sections, filtered by enabled plugins.
     */
    public static function getAdminSections(array $enabledPlugins = []): Collection
    {
        $sections = collect(static::$adminSections);

        if (! empty($enabledPlugins)) {
            $sections = $sections->filter(fn ($section) => in_array($section['plugin'], $enabledPlugins, true));
        }

        return $sections->sortBy('position')->values();
    }

    /**
     * Clear all registered items for a specific plugin.
     * Called when a plugin is disabled.
     */
    public static function clearPlugin(string $pluginId): void
    {
        unset(static::$blocks[$pluginId]);
        static::$navbarItems = array_filter(static::$navbarItems, fn ($item) => $item['plugin'] !== $pluginId);
        static::$footerLinks = array_map(fn ($category) => array_filter($category, fn ($link) => $link['plugin'] !== $pluginId), static::$footerLinks);
        static::$pages = array_filter(static::$pages, fn ($page) => $page['plugin'] !== $pluginId);
        static::$adminSections = array_filter(static::$adminSections, fn ($section) => $section['plugin'] !== $pluginId);
    }

    /**
     * Clear all registered items.
     */
    public static function clearAll(): void
    {
        static::$blocks = [];
        static::$navbarItems = [];
        static::$footerLinks = [];
        static::$pages = [];
        static::$adminSections = [];
    }
}
