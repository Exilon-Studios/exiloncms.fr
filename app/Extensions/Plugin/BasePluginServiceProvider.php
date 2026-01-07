<?php

namespace ExilonCMS\Extensions\Plugin;

use Closure;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Http\Kernel;
use Illuminate\Routing\Router;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

abstract class BasePluginServiceProvider extends ServiceProvider
{
    use HasPlugin;

    /**
     * The plugin's global HTTP middleware stack.
     */
    protected array $middleware = [];

    /**
     * The plugin's route middleware groups.
     */
    protected array $middlewareGroups = [];

    /**
     * The plugin's route middleware.
     *
     * These middleware may be assigned to groups or used individually.
     */
    protected array $routeMiddleware = [];

    /**
     * The policy mappings for this plugin.
     */
    protected array $policies = [];

    /**
     * The router instance.
     */
    protected ?Router $router;

    /**
     * Create a new service provider instance.
     */
    public function __construct(Application $app)
    {
        parent::__construct($app);

        $this->router = $app[Router::class];
    }

    /**
     * Register any plugin services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Define the application's command schedule.
     *
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        //
    }

    protected function registerMiddleware(): void
    {
        $this->registerMiddlewares();
    }

    protected function registerMiddlewares(): void
    {
        $this->middleware($this->middleware);

        $this->middlewareGroup($this->middlewareGroups);

        $this->routeMiddleware($this->routeMiddleware);
    }

    protected function registerPolicies(): void
    {
        foreach ($this->policies() as $key => $value) {
            Gate::policy($key, $value);
        }
    }

    protected function loadViews(): void
    {
        $viewsPath = $this->pluginResourcePath('views');

        $this->loadViewsFrom($viewsPath, $this->plugin->id);
    }

    protected function loadTranslations(): void
    {
        $langPath = $this->pluginResourcePath('lang');

        $this->loadTranslationsFrom($langPath, $this->plugin->id);
    }

    protected function loadMigrations(): void
    {
        $this->loadMigrationsFrom($this->pluginPath('database/migrations'));
    }

    /**
     * Register plugin routes.
     */
    protected function loadRoutes(): void
    {
        // Try to get the plugin ID - either from bound plugin or by using the helper
        $pluginId = isset($this->plugin) ? $this->plugin->id : null;

        if (!$pluginId) {
            // Fallback: try to determine plugin ID from class name
            $className = get_class($this);
            if (preg_match('/\\\\Plugins\\\\([^\\\\]+)\\\\/', $className, $matches)) {
                $pluginId = strtolower($matches[1]);
            }
        }

        if (!$pluginId) {
            return;
        }

        $webRoutes = base_path('plugins/' . $pluginId . '/routes/web.php');

        if (file_exists($webRoutes)) {
            $this->loadRoutesFrom($webRoutes);
        }
    }

    /**
     * Register admin routes.
     * These routes are prefixed with /admin and require admin access.
     */
    protected function registerAdminRoutes(Closure $callback): void
    {
        $this->app['router']->prefix('admin')
            ->middleware(['web', 'auth', 'admin'])
            ->group($callback);
    }

    /**
     * Register user routes.
     * These routes are for authenticated users.
     */
    protected function registerUserRoutes(Closure $callback): void
    {
        $this->app['router']->middleware(['web', 'auth'])
            ->group($callback);
    }

    protected function registerRouteDescriptions(): void
    {
        $this->app['plugins']->addRouteDescription(function () {
            return $this->routeDescriptions();
        });
    }

    protected function registerAdminNavigation(): void
    {
        $this->app['plugins']->addAdminNavItem(fn () => $this->adminNavigation());
    }

    protected function registerUserNavigation(): void
    {
        $this->app['plugins']->addUserNavItem(fn () => $this->userNavigation());
    }

    protected function middleware($middleware, bool $before = false): void
    {
        $kernel = $this->app->make(Kernel::class);

        foreach ((array) $middleware as $value) {
            if ($before) {
                $kernel->prependMiddleware($value);
            } else {
                $kernel->pushMiddleware($value);
            }
        }
    }

    protected function middlewareGroup(string|array $name, ?array $middleware = null): void
    {
        $middlewares = is_array($name) ? $name : [$name => $middleware];

        foreach ($middlewares as $key => $group) {
            $this->router->middlewareGroup($key, $group);
        }
    }

    protected function routeMiddleware(string|array $name, ?string $middleware = null): void
    {
        $middlewares = is_array($name) ? $name : [$name => $middleware];

        foreach ($middlewares as $key => $class) {
            $this->router->aliasMiddleware($key, $class);
        }
    }

    protected function registerSchedule(): void
    {
        if ($this->app->runningInConsole()) {
            $this->app->booted(function () {
                $this->schedule($this->app->make(Schedule::class));
            });
        }
    }

    /**
     * Returns the routes that should be able to be added to the navbar.
     *
     * @return array
     */
    protected function routeDescriptions()
    {
        return [];
    }

    /**
     * Return the admin navigations routes to register in the dashboard.
     *
     * @return array
     */
    protected function adminNavigation()
    {
        return [];
    }

    /**
     * Return the user navigations routes to register in user menu.
     *
     * @return array
     */
    protected function userNavigation()
    {
        return [];
    }

    /**
     * Return the policies to register.
     *
     * @return array
     */
    public function policies()
    {
        return $this->policies;
    }

    protected function pluginPath($path = ''): string
    {
        return $this->app['plugins']->path($this->plugin->id, $path);
    }

    protected function pluginResourcePath($path = ''): string
    {
        return $this->pluginPath('resources/'.$path);
    }
}
