<?php

namespace ExilonCMS\Http\Middleware;

use ExilonCMS\Extensions\UpdateManager;
use ExilonCMS\Models\NavbarElement;
use ExilonCMS\Models\Notification;
use ExilonCMS\Models\OnboardingStep;
use ExilonCMS\Models\SocialLink;
use ExilonCMS\Models\Theme;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        // Get admin permissions if user has admin access (with error handling)
        $adminPermissions = [];
        try {
            if ($user && $user->hasAdminAccess()) {
                $adminPermissions = $user->role->permissions->pluck('permission')->toArray();
            }
        } catch (\Exception $e) {
            // Role or permissions might not exist yet, use empty array
            $adminPermissions = [];
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'money' => $user->money ?? 0,
                    'hasAdminAccess' => $user->hasAdminAccess(),
                    'adminPermissions' => $adminPermissions,
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'info' => fn () => $request->session()->get('info'),
                'warning' => fn () => $request->session()->get('warning'),
            ],
            'settings' => [
                'name' => setting('name', config('app.name')),
                'description' => setting('description', 'ExilonCMS - Modern Content Management System'),
                'locale' => app()->getLocale(),
                'background' => setting('background') ? image_url(setting('background')) : null,
                'favicon' => favicon(),
                'copyright' => str_replace('{year}', date('Y'), setting('copyright', '')),
                'darkTheme' => dark_theme(),
                // Installation mode (demo or production)
                'installMode' => setting('install_mode', 'production'),
                // Navbar settings
                'navbar' => [
                    'links_position' => setting('navbar.links_position', 'left'),
                    'links_spacing' => setting('navbar.links_spacing', '4rem'),
                    'style' => setting('navbar.style', 'transparent'),
                    'background' => setting('navbar.background'),
                ],
                // SEO defaults
                'seo' => [
                    'title' => setting('name', config('app.name')),
                    'description' => setting('description', 'ExilonCMS - Modern Content Management System for game servers'),
                    'og_image' => setting('og_image') ? image_url(setting('og_image')) : null,
                ],
                // Active theme (from ThemeLoader, not database)
                'activeTheme' => app(\ExilonCMS\Extensions\Theme\ThemeLoader::class)->getActiveThemeId(),
                // Preview mode status
                'isPreviewMode' => app(\ExilonCMS\Extensions\Theme\ThemeLoader::class)->isPreviewMode(),
            ],
            'navbar' => $this->safeLoadNavbarElements($user),
            'socialLinks' => $this->safeLoadSocialLinks(),
            // Share translations for common keys
            'trans' => [
                'auth' => trans('auth'),
                'messages' => trans('messages'),
                'admin' => trans('admin'),
                'pages' => trans('pages'),
                'dashboard' => trans('dashboard'),
                'shop' => trans('shop'),
                'theme' => trans('theme'),
            ],
            // Share unread notifications count for authenticated users
            'unreadNotificationsCount' => $user ? $this->getUnreadNotificationsCount($user) : 0,
            // Share onboarding progress for admin users
            'onboardingComplete' => $this->safeGetOnboardingComplete($user),
            'onboardingProgress' => $this->safeGetOnboardingProgress($user),
            // Share available updates count for admin users
            'updatesCount' => $user && $user->hasAdminAccess() ? $this->getUpdatesCount() : 0,
            // Share enabled plugins for conditional UI rendering
            'enabledPlugins' => get_enabled_plugins(),
            // Share enabled plugins with config for sidebar
            'enabledPluginConfigs' => $this->getEnabledPluginConfigs(),
            // Share plugin navigation from manifests
            'pluginNavigation' => $this->getPluginNavigation(),
            // Share plugin header icons from manifests
            'pluginHeaderIcons' => $this->getPluginHeaderIcons(),
            // Share sidebar links from plugins (modular system)
            'publicSidebarLinks' => getPublicSidebarLinks(),
            'userSidebarLinks' => getUserSidebarLinks(),
            'adminSidebarLinks' => getAdminSidebarLinks(),
            // Share widgets from plugins
            'userWidgets' => getUserWidgets(),
            'adminWidgets' => getAdminWidgets(),
            // Share dashboard widgets from plugins (for admin users)
            'dashboardWidgets' => $user && $user->hasAdminAccess() ? $this->getDashboardWidgets($user) : [],
            // Share active theme for theme page override system
            'activeTheme' => app(\ExilonCMS\Extensions\Theme\ThemeLoader::class)->getActiveThemeId(),
        ];
    }

    /**
     * Get dashboard widgets for the current user.
     */
    protected function getDashboardWidgets($user): array
    {
        try {
            $widgetManager = app(\ExilonCMS\Classes\Widgets\WidgetManager::class);
            $allWidgets = $widgetManager->getWidgets();

            // Filter by user permissions
            return array_filter($allWidgets, function ($widget) use ($user, $widgetManager) {
                return $widgetManager->canViewWidget($widget, $user);
            });
        } catch (\Exception $e) {
            return [];
        }
    }

    /**
     * Get enabled plugins that have configuration
     */
    protected function getEnabledPluginConfigs(): array
    {
        $enabledPlugins = get_enabled_plugins();
        $pluginLoader = app(\ExilonCMS\Classes\Plugin\PluginLoader::class);
        $plugins = $pluginLoader->getPluginsMeta();

        return collect($plugins)
            ->filter(fn ($plugin) => in_array($plugin['id'], $enabledPlugins, true))
            ->filter(fn ($plugin) => file_exists($plugin['path'].'/config/config.php'))
            ->map(fn ($plugin) => [
                'id' => $plugin['id'],
                'name' => $plugin['name'],
                'configUrl' => '/admin/plugins/'.$plugin['id'].'/config',
            ])
            ->values()
            ->toArray();
    }

    /**
     * Get navigation items from all enabled plugins
     * Checks both PHP methods and plugin.json
     */
    protected function getPluginNavigation(): array
    {
        $enabledPlugins = get_enabled_plugins();
        $pluginNavigation = [];

        foreach ($enabledPlugins as $pluginId) {
            $nav = plugin_get_navigation($pluginId);
            if (! empty($nav)) {
                $pluginNavigation[] = $this->normalizePluginNavigation($pluginId, $nav);
            }
        }

        // Sort by position
        usort($pluginNavigation, fn ($a, $b) => ($a['position'] ?? 100) <=> ($b['position'] ?? 100));

        return $pluginNavigation;
    }

    /**
     * Normalize plugin navigation for frontend consumption
     */
    protected function normalizePluginNavigation(string $pluginId, array $nav): array
    {
        $trans = $nav['trans'] ?? false;

        return [
            'type' => 'plugin',
            'plugin' => $pluginId,
            'label' => $nav['label'] ?? ucfirst($pluginId),
            'trans' => $trans,
            'icon' => $nav['icon'] ?? 'Plugin',
            'position' => $nav['position'] ?? 100,
            'items' => $this->normalizeNavItems($nav['items'] ?? [], $trans),
        ];
    }

    /**
     * Normalize navigation items recursively
     */
    protected function normalizeNavItems(array $items, bool $trans): array
    {
        return collect($items)->map(function ($item) use ($trans) {
            $normalized = [
                'label' => $item['label'] ?? '',
                'trans' => $item['trans'] ?? $trans,
                'href' => $item['href'] ?? null,
                'route' => $item['route'] ?? null,
                'permission' => $item['permission'] ?? null,
                'icon' => $item['icon'] ?? null,
            ];

            if (isset($item['items']) && is_array($item['items'])) {
                $normalized['items'] = $this->normalizeNavItems($item['items'], $trans);
                $normalized['type'] = 'section';
            } else {
                $normalized['type'] = 'link';
            }

            return $normalized;
        })->toArray();
    }

    /**
     * Get header icons from all enabled plugins
     * Checks both PHP methods and plugin.json
     */
    protected function getPluginHeaderIcons(): array
    {
        $enabledPlugins = get_enabled_plugins();
        $pluginHeaderIcons = [];

        foreach ($enabledPlugins as $pluginId) {
            $icons = plugin_get_header_elements($pluginId);
            if (! empty($icons)) {
                foreach ($icons as $icon) {
                    $pluginHeaderIcons[] = $this->normalizePluginHeaderIcon($pluginId, $icon);
                }
            }
        }

        // Sort by position
        usort($pluginHeaderIcons, fn ($a, $b) => ($a['position'] ?? 100) <=> ($b['position'] ?? 100));

        return $pluginHeaderIcons;
    }

    /**
     * Normalize plugin header icon for frontend consumption
     */
    protected function normalizePluginHeaderIcon(string $pluginId, array $icon): array
    {
        return [
            'id' => $icon['id'] ?? "{$pluginId}_{$icon['type']}",
            'plugin' => $pluginId,
            'type' => $icon['type'] ?? 'button',
            'icon' => $icon['icon'] ?? 'Box',
            'label' => $icon['label'] ?? null,
            'ariaLabel' => $icon['aria_label'] ?? null,
            'permission' => $icon['permission'] ?? null,
            'position' => $icon['position'] ?? 100,
            'component' => $icon['component'] ?? null,
            'props' => $icon['props'] ?? [],
            'badge' => $icon['badge'] ?? null,
        ];
    }

    /**
     * Root view for Inertia responses
     */
    public function rootView(Request $request): string
    {
        // Inject active theme into JavaScript for client-side theme resolution
        $activeTheme = app(\ExilonCMS\Extensions\Theme\ThemeLoader::class)->getActiveThemeId();

        if ($activeTheme) {
            // This will be available as window.__exiloncms_theme in the browser
            \Inertia\Inertia::share('__exiloncms_theme', $activeTheme);
        }

        return 'app';
    }

    /**
     * Get the unread notifications count for the user
     */
    protected function getUnreadNotificationsCount($user): int
    {
        // Check if the notifications table exists
        if (! Schema::hasTable('notifications')) {
            return 0;
        }

        return Notification::where('user_id', $user->id)
            ->whereNull('read_at')
            ->count();
    }

    /**
     * Safely load navbar elements with error handling
     */
    protected function safeLoadNavbarElements($user): array
    {
        try {
            return $this->loadNavbarElements($user);
        } catch (\Exception $e) {
            // Table might not exist yet, return empty array
            return [];
        }
    }

    /**
     * Safely load social links with error handling
     */
    protected function safeLoadSocialLinks(): array
    {
        try {
            return $this->loadSocialLinks();
        } catch (\Exception $e) {
            // Table might not exist yet, return empty array
            return [];
        }
    }

    /**
     * Safely get onboarding complete status
     */
    protected function safeGetOnboardingComplete($user): bool
    {
        try {
            if (! $user || ! $user->role || ! $user->role->is_admin) {
                return true;
            }

            return OnboardingStep::isComplete($user->id);
        } catch (\Exception $e) {
            // Table might not exist yet, assume complete
            return true;
        }
    }

    /**
     * Safely get onboarding progress
     */
    protected function safeGetOnboardingProgress($user): array
    {
        try {
            if (! $user || ! $user->role || ! $user->role->is_admin) {
                return [];
            }

            return OnboardingStep::getUserProgress($user->id);
        } catch (\Exception $e) {
            // Table might not exist yet, return empty array
            return [];
        }
    }

    /**
     * Load navbar elements from database
     */
    protected function loadNavbarElements($user): array
    {
        // Check if table exists first
        if (! Schema::hasTable('navbar_elements')) {
            return [];
        }

        $elements = Cache::get(NavbarElement::CACHE_KEY, function () {
            return NavbarElement::orderBy('position')->with('roles')->get();
        });

        if (! $elements instanceof \Illuminate\Database\Eloquent\Collection) {
            $elements = NavbarElement::hydrate($elements);
        }

        $filteredElements = $elements->filter(fn (NavbarElement $element) => $element->hasPermission());
        $parentElements = $filteredElements->whereNull('parent_id');

        return $parentElements->map(function (NavbarElement $element) use ($filteredElements) {
            $data = [
                'id' => $element->id,
                'name' => $element->raw_name,
                'type' => $element->type,
                'value' => $element->value,
                'link' => $element->getLink(),
                'newTab' => $element->new_tab,
                'isDropdown' => $element->isDropdown(),
                'isCurrent' => $element->isCurrent(),
                'elements' => [],
            ];

            if ($element->isDropdown()) {
                $data['elements'] = $filteredElements
                    ->where('parent_id', $element->id)
                    ->map(fn ($child) => [
                        'id' => $child->id,
                        'name' => $child->raw_name,
                        'type' => $child->type,
                        'value' => $child->value,
                        'link' => $child->getLink(),
                        'newTab' => $child->new_tab,
                        'isCurrent' => $child->isCurrent(),
                    ])
                    ->values()
                    ->toArray();
            }

            return $data;
        })->values()->toArray();
    }

    /**
     * Load social links from database
     */
    protected function loadSocialLinks(): array
    {
        // Check if table exists first
        if (! Schema::hasTable('social_links')) {
            return [];
        }

        return SocialLink::orderBy('position')->get()->map(fn ($link) => [
            'title' => $link->title,
            'value' => $link->value,
            'icon' => $link->icon,
            'color' => $link->color,
        ])->toArray();
    }

    /**
     * Get the count of available CMS updates
     */
    protected function getUpdatesCount(): int
    {
        // Check if the settings table exists
        if (! Schema::hasTable('settings')) {
            return 0;
        }

        try {
            /** @var UpdateManager $updates */
            $updates = app(UpdateManager::class);

            return $updates->getUpdatesCount();
        } catch (\Exception $e) {
            return 0;
        }
    }
}
