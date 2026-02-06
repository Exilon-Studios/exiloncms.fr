<?php

namespace ExilonCMS\Http\Controllers\Admin;

use ExilonCMS\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

/**
 * Navigation Controller
 *
 * Provides dynamic navigation built from plugin.json manifests
 */
class NavigationController extends Controller
{
    /**
     * Get the admin navigation structure.
     *
     * Returns navigation built from plugin manifests along with core navigation.
     * Navigation is cached for performance.
     */
    public function index(Request $request)
    {
        $navigation = $this->buildAdminNavigation();

        return Inertia::render('Admin/Navigation/Index', [
            'navigation' => $navigation,
        ]);
    }

    /**
     * Get navigation as JSON for API consumption.
     *
     * Used by AuthenticatedLayout to build dynamic navigation.
     */
    public function api(Request $request)
    {
        $navigation = $this->buildAdminNavigation();

        return response()->json([
            'navigation' => $navigation,
        ]);
    }

    /**
     * Build admin navigation from core and plugin sources.
     *
     * Combines hardcoded core navigation with dynamic plugin navigation
     * loaded from plugin.json manifests.
     */
    protected function buildAdminNavigation(): array
    {
        return Cache::remember('admin.navigation', 3600, function () {
            $navigation = $this->getCoreNavigation();
            $pluginNavigation = $this->getPluginNavigation();

            // Merge plugin navigation into core navigation
            return $this->mergeNavigation($navigation, $pluginNavigation);
        });
    }

    /**
     * Get core (hardcoded) admin navigation.
     *
     * This is the base navigation that always exists.
     */
    protected function getCoreNavigation(): array
    {
        return [
            [
                'id' => 'dashboard',
                'label' => 'Dashboard',
                'href' => '/admin',
                'permission' => 'admin.dashboard',
                'icon' => 'BrandTabler',
                'position' => 10,
            ],
            [
                'id' => 'users',
                'label' => 'Users',
                'type' => 'section',
                'permission' => 'admin.users',
                'icon' => 'Users',
                'position' => 20,
                'items' => [
                    [
                        'id' => 'users.list',
                        'label' => 'Users',
                        'href' => '/admin/users',
                        'permission' => 'admin.users',
                        'icon' => 'Users',
                        'position' => 10,
                    ],
                    [
                        'id' => 'roles',
                        'label' => 'Roles',
                        'href' => '/admin/roles',
                        'permission' => 'admin.roles',
                        'icon' => 'Shield',
                        'position' => 20,
                    ],
                    [
                        'id' => 'bans',
                        'label' => 'Bans',
                        'href' => '/admin/bans',
                        'permission' => 'admin.users',
                        'icon' => 'Ban',
                        'position' => 30,
                    ],
                ],
            ],
            [
                'id' => 'extensions',
                'label' => 'Extensions',
                'type' => 'section',
                'permission' => 'admin.settings',
                'icon' => 'Plug',
                'position' => 30,
                'items' => [
                    [
                        'id' => 'plugins',
                        'label' => 'Plugins',
                        'href' => '/admin/plugins',
                        'permission' => 'admin.settings',
                        'icon' => 'Plug',
                        'position' => 10,
                    ],
                    [
                        'id' => 'themes',
                        'label' => 'Themes',
                        'href' => '/admin/themes',
                        'permission' => 'admin.settings',
                        'icon' => 'Palette',
                        'position' => 20,
                    ],
                ],
            ],
        ];
    }

    /**
     * Get plugin navigation from enabled plugins' manifests.
     *
     * Reads plugin.json files for enabled plugins and extracts
     * navigation configuration from 'admin_section' or 'navigation' keys.
     */
    protected function getPluginNavigation(): array
    {
        $enabledPlugins = get_enabled_plugins();
        $navigation = [];

        foreach ($enabledPlugins as $pluginId) {
            $manifest = plugin_manifest($pluginId);

            if (! $manifest) {
                continue;
            }

            // Support new 'navigation' format
            if (isset($manifest['navigation'])) {
                $nav = $manifest['navigation'];
                $nav['plugin'] = $pluginId;
                $navigation[] = $nav;

                continue;
            }

            // Support legacy 'admin_section' format - convert to new format
            if (isset($manifest['admin_section'])) {
                $section = $manifest['admin_section'];

                $nav = [
                    'id' => $section['id'] ?? $pluginId,
                    'label' => $section['label'] ?? ucfirst($pluginId),
                    'type' => 'section',
                    'permission' => $section['permission'] ?? 'admin.settings',
                    'icon' => $section['icon'] ?? 'Plugin',
                    'position' => $section['position'] ?? 100,
                    'plugin' => $pluginId,
                    'trans' => $section['trans'] ?? false,
                ];

                // Convert items
                if (isset($section['items'])) {
                    $nav['items'] = collect($section['items'])->map(function ($item, $index) use ($pluginId) {
                        return [
                            'id' => $item['id'] ?? "{$pluginId}.{$index}",
                            'label' => $item['label'],
                            'href' => $item['href'] ?? null,
                            'permission' => $item['permission'] ?? 'admin.settings',
                            'icon' => $item['icon'] ?? null,
                            'position' => $item['position'] ?? $index * 10,
                            'trans' => $item['trans'] ?? false,
                        ];
                    })->toArray();
                }

                $navigation[] = $nav;
            }
        }

        return $navigation;
    }

    /**
     * Merge plugin navigation into core navigation.
     *
     * Combines both navigations, sorts by position, and returns
     * the final structure.
     */
    protected function mergeNavigation(array $core, array $plugins): array
    {
        $merged = array_merge($core, $plugins);

        // Sort by position
        usort($merged, function ($a, $b) {
            $posA = $a['position'] ?? 100;
            $posB = $b['position'] ?? 100;

            return $posA <=> $posB;
        });

        return $merged;
    }

    /**
     * Clear navigation cache.
     *
     * Call this after enabling/disabling plugins or updating manifests.
     */
    public function clearCache(Request $request)
    {
        Cache::forget('admin.navigation');

        return redirect()->back()
            ->with('success', 'Navigation cache cleared successfully.');
    }
}
