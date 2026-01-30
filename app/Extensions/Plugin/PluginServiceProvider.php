<?php

namespace ExilonCMS\Extensions\Plugin;

use ExilonCMS\Contracts\Plugins\AuthenticationHook;
use ExilonCMS\Contracts\Plugins\MediaHook;
use ExilonCMS\Contracts\Plugins\NotificationHook;
use ExilonCMS\Contracts\Plugins\PaymentGatewayHook;
use ExilonCMS\Contracts\Plugins\SearchHook;
use ExilonCMS\Contracts\Plugins\UserExtensionHook;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class PluginServiceProvider extends ServiceProvider
{
    protected PluginLoader $loader;

    public function register(): void
    {
        $this->app->singleton(PluginLoader::class, function () {
            return new PluginLoader;
        });

        $this->app->singleton(PluginRegistry::class, function () {
            return new PluginRegistry;
        });

        $this->loader = $this->app->make(PluginLoader::class);
    }

    public function boot(): void
    {
        $this->loadPlugins();
        $this->registerPluginGates();

        // Share plugin registry data with Inertia
        $this->sharePluginData();
    }

    /**
     * Share plugin registry data with Inertia for React components.
     */
    protected function sharePluginData(): void
    {
        $enabledPlugins = collect(setting('enabled_plugins', []))->toArray();

        // Share with Inertia for use in React components
        $registry = app(PluginRegistry::class);

        \Inertia\Inertia::share('pluginBlocks', fn () => $registry->getBlocks($enabledPlugins)->toArray());
        \Inertia\Inertia::share('pluginNavbarItems', fn () => $registry->getNavbarItems($enabledPlugins)->toArray());
        \Inertia\Inertia::share('pluginFooterLinks', fn () => $registry->getFooterLinks($enabledPlugins));
        \Inertia\Inertia::share('pluginPages', fn () => $registry->getPages($enabledPlugins)->toArray());
        \Inertia\Inertia::share('pluginAdminSections', fn () => $registry->getAdminSections($enabledPlugins)->toArray());
    }

    /**
     * Load all discovered plugins.
     */
    protected function loadPlugins(): void
    {
        $plugins = $this->loader->getPlugins();

        // Get enabled plugins from settings
        $enabledPlugins = collect(setting('enabled_plugins', []))->toArray();

        // Clear registry and re-register for enabled plugins
        PluginRegistry::clearAll();

        // Build plugin dependency graph and resolve load order
        $loadOrder = $this->resolvePluginLoadOrder($plugins, $enabledPlugins);

        // Load plugins in dependency order
        foreach ($loadOrder as $pluginId) {
            $plugin = collect($plugins)->first(fn ($p) => $p['id'] === $pluginId);
            if ($plugin) {
                $this->loadPlugin($plugin);
                $this->registerPluginElements($plugin);
            }
        }
    }

    /**
     * Resolve plugin load order based on dependencies.
     * Uses topological sort to ensure dependencies are loaded first.
     */
    protected function resolvePluginLoadOrder(array $plugins, array $enabledPlugins): array
    {
        $pluginMap = collect($plugins)->keyBy('id')->toArray();
        $loadOrder = [];
        $visited = [];
        $visiting = [];

        foreach ($enabledPlugins as $pluginId) {
            if (! isset($pluginMap[$pluginId])) {
                continue;
            }

            $this->visitPlugin($pluginId, $pluginMap, $visited, $visiting, $loadOrder);
        }

        return $loadOrder;
    }

    /**
     * Visit plugin for topological sort (DFS).
     */
    protected function visitPlugin(string $pluginId, array $pluginMap, array &$visited, array &$visiting, array &$loadOrder): void
    {
        // Skip if plugin doesn't exist
        if (! isset($pluginMap[$pluginId])) {
            return;
        }

        // Already visited
        if (isset($visited[$pluginId])) {
            return;
        }

        // Circular dependency detected
        if (isset($visiting[$pluginId])) {
            \Log::warning("Circular dependency detected in plugin: {$pluginId}");

            return;
        }

        $visiting[$pluginId] = true;

        // Get plugin dependencies
        $plugin = $pluginMap[$pluginId];
        $dependencies = $plugin['dependencies'] ?? [];

        // Visit dependencies first
        foreach ($dependencies as $depPluginId => $constraint) {
            // Skip CMS version requirement (only care about plugin deps)
            if ($depPluginId === 'exiloncms') {
                continue;
            }

            // Check if dependency is enabled
            $enabledPlugins = collect(setting('enabled_plugins', []))->toArray();
            if (! in_array($depPluginId, $enabledPlugins, true)) {
                \Log::warning("Plugin {$pluginId} requires {$depPluginId} but it's not enabled. Skipping {$pluginId}.");

                return;
            }

            $this->visitPlugin($depPluginId, $pluginMap, $visited, $visiting, $loadOrder);
        }

        $visiting[$pluginId] = false;
        $visited[$pluginId] = true;
        $loadOrder[] = $pluginId;
    }

    /**
     * Register plugin elements (navbar, footer, pages) in registry.
     */
    protected function registerPluginElements(array $plugin): void
    {
        $pluginId = $plugin['id'];
        $pluginJson = $plugin['path'].'/plugin.json';

        if (! file_exists($pluginJson)) {
            return;
        }

        $config = json_decode(file_get_contents($pluginJson), true);

        // Load and register plugin translations
        if (isset($config['translations'])) {
            $this->registerPluginTranslations($pluginId, $config['translations']);
        }

        // Register navbar items
        if (isset($config['navbar_items'])) {
            foreach ($config['navbar_items'] as $item) {
                PluginRegistry::registerNavbarItem($pluginId, $item);
            }
        }

        // Register footer links
        if (isset($config['footer_links'])) {
            foreach ($config['footer_links'] as $category => $links) {
                PluginRegistry::registerFooterLinks($pluginId, $category, $links);
            }
        }

        // Register pages
        if (isset($config['pages'])) {
            foreach ($config['pages'] as $pageId => $pageConfig) {
                PluginRegistry::registerPage($pluginId, $pageId, $pageConfig);
            }
        }

        // Register admin sections
        if (isset($config['admin_section'])) {
            PluginRegistry::registerAdminSection($pluginId, $config['admin_section']);
        }

        // Register plugin hooks from service provider
        $this->registerPluginHooks($plugin);
    }

    /**
     * Register plugin hooks from service provider.
     * Plugin service providers can implement hook interfaces to extend CMS functionality.
     */
    protected function registerPluginHooks(array $plugin): void
    {
        $pluginId = $plugin['id'];

        // Check if plugin has a service provider that implements hooks
        if (! $plugin['service_provider']) {
            return;
        }

        $providerClass = $plugin['service_provider'];

        if (! class_exists($providerClass)) {
            return;
        }

        // Get the provider instance from the app (already registered in loadPlugin)
        $provider = $this->app->getProvider($providerClass);

        if (! $provider) {
            return;
        }

        // Register hooks based on implemented interfaces
        if ($provider instanceof AuthenticationHook) {
            PluginHookManager::registerAuthHook($pluginId, $provider);
        }

        if ($provider instanceof MediaHook) {
            PluginHookManager::registerMediaHook($pluginId, $provider);
        }

        if ($provider instanceof SearchHook) {
            PluginHookManager::registerSearchHook($pluginId, $provider);
        }

        if ($provider instanceof NotificationHook) {
            PluginHookManager::registerNotificationHook($pluginId, $provider);
        }

        if ($provider instanceof PaymentGatewayHook) {
            PluginHookManager::registerPaymentHook($pluginId, $provider);
        }

        if ($provider instanceof UserExtensionHook) {
            PluginHookManager::registerUserHook($pluginId, $provider);
        }
    }

    /**
     * Register plugin translations with Laravel's translator.
     */
    protected function registerPluginTranslations(string $pluginId, array $translations): void
    {
        foreach ($translations as $locale => $messages) {
            // Merge plugin translations with existing translations
            $existing = trans($pluginId, [], $locale);

            if (! is_array($existing)) {
                $existing = [];
            }

            // Deep merge translations
            $merged = array_replace_recursive($existing, $messages);

            // Register as a custom translator namespace
            \Illuminate\Support\Facades\Lang::addNamespace($pluginId, [
                "{$locale}" => $merged,
            ]);
        }
    }

    /**
     * Load a single plugin.
     */
    protected function loadPlugin(array $plugin): void
    {
        // Load service provider if defined
        if ($plugin['service_provider']) {
            $this->loadServiceProvider($plugin);
        }

        // Load routes
        $routesFile = $plugin['path'].'/routes/web.php';
        if (file_exists($routesFile)) {
            $this->loadPluginRoutesFrom($routesFile, $plugin['id']);
        }

        // Load admin routes
        $adminRoutesFile = $plugin['path'].'/routes/admin.php';
        if (file_exists($adminRoutesFile)) {
            $this->loadPluginAdminRoutesFrom($adminRoutesFile, $plugin['id']);
        }

        // Load views
        $viewsPath = $plugin['path'].'/resources/views';
        if (is_dir($viewsPath)) {
            $this->loadViewsFrom($viewsPath, $plugin['id']);
        }

        // Load translations
        $langPath = $plugin['path'].'/resources/lang';
        if (is_dir($langPath)) {
            $this->loadTranslationsFrom($langPath, $plugin['id']);
        }

        // Load migrations
        $migrationsPath = $plugin['path'].'/database/migrations';
        if (is_dir($migrationsPath) && $this->app->runningInConsole()) {
            $this->loadMigrationsFrom($migrationsPath);
        }
    }

    /**
     * Load plugin's service provider.
     */
    protected function loadServiceProvider(array $plugin): void
    {
        $providerClass = $plugin['service_provider'];

        if (! class_exists($providerClass)) {
            return;
        }

        $this->app->register($providerClass);
    }

    /**
     * Load routes from a file with plugin prefix.
     */
    protected function loadPluginRoutesFrom(string $path, string $pluginId): void
    {
        Route::prefix('plugins/'.$pluginId)
            ->middleware(['web'])
            ->group($path);
    }

    /**
     * Load admin routes from a file with plugin prefix and auth middleware.
     */
    protected function loadPluginAdminRoutesFrom(string $path, string $pluginId): void
    {
        Route::prefix('admin/plugins/'.$pluginId)
            ->middleware(['web', 'auth', 'admin'])
            ->group($path);
    }

    /**
     * Register gates for plugin permissions.
     */
    protected function registerPluginGates(): void
    {
        // Each plugin can define its own gates
        // This is a placeholder for common plugin gates
    }
}
