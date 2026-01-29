<?php

namespace ExilonCMS\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class PluginMakeCommand extends Command
{
    protected $signature = 'make:plugin {name? : The name of the plugin}
            {--t|type= : Type of plugin (feature, integration, theme-extension, payment)}
            {--d|description= : Plugin description}
            {--author= : Plugin author}
            {--deps=* : Plugin dependencies (translations, shop, payments, etc)}
            {--has-routes : Add routes file}
            {--has-admin : Add admin routes}
            {--has-migrations : Add migrations}
            {--has-settings : Add settings page}
            {--force : Overwrite existing files}';

    protected $description = 'Create a new ExilonCMS plugin with interactive wizard';

    /**
     * Available plugin dependencies that can be integrated.
     */
    protected array $availableDependencies = [
        'translations' => [
            'label' => 'Translations',
            'description' => 'Add internationalization support with translation files',
            'integrations' => [
                'language_files' => 'Creates language files (en, fr)',
                'trans_helper' => 'Adds trans() helper support',
            ],
        ],
        'shop' => [
            'label' => 'Shop',
            'description' => 'Add shop integration (products, categories)',
            'integrations' => [
                'shop_products' => 'Add product management pages',
                'shop_category' => 'Add category integration',
                'shop_payments' => 'Add payment gateway support',
            ],
        ],
        'payments' => [
            'label' => 'Payments',
            'description' => 'Add payment gateway support',
            'integrations' => [
                'payment_gateway' => 'Create custom payment gateway',
                'payment_methods' => 'Add payment method pages',
            ],
        ],
        'notifications' => [
            'label' => 'Notifications',
            'description' => 'Add notification system integration',
            'integrations' => [
                'notification_types' => 'Add custom notification types',
                'notification_channels' => 'Add notification channels',
            ],
        ],
    ];

    /**
     * Available hooks that plugins can implement.
     */
    protected array $availableHooks = [
        'auth' => [
            'label' => 'Authentication Hook',
            'description' => 'Extend authentication (OAuth providers, 2FA methods)',
            'interface' => AuthenticationHook::class,
        ],
        'media' => [
            'label' => 'Media Hook',
            'description' => 'Extend media handling (storage drivers, image filters, CDN)',
            'interface' => MediaHook::class,
        ],
        'search' => [
            'label' => 'Search Hook',
            'description' => 'Extend search functionality (custom searchable content)',
            'interface' => SearchHook::class,
        ],
        'notifications' => [
            'label' => 'Notification Hook',
            'description' => 'Extend notifications (custom notification channels)',
            'interface' => NotificationHook::class,
        ],
        'payments' => [
            'label' => 'Payment Hook',
            'description' => 'Extend payments (custom payment gateways)',
            'interface' => PaymentGatewayHook::class,
        ],
        'user' => [
            'label' => 'User Extension Hook',
            'description' => 'Extend user functionality (custom fields, profile sections)',
            'interface' => UserExtensionHook::class,
        ],
    ];

    public function handle()
    {
        // Interactive mode if no name provided
        if (! $this->argument('name')) {
            return $this->interactiveWizard();
        }

        $name = $this->argument('name');
        $slug = Str::slug($name);
        $type = $this->option('type') ?? 'feature';
        $description = $this->option('description') ?? "A {$type} plugin for ExilonCMS";
        $author = $this->option('author') ?? config('app.name');
        $dependencies = $this->option('deps') ?? [];

        // Validate plugin name
        if (! $this->validatePluginName($slug)) {
            return 1;
        }

        // Confirm if plugin exists
        $pluginPath = base_path("plugins/{$slug}");
        if (File::exists($pluginPath) && ! $this->option('force')) {
            $this->error("Plugin {$slug} already exists!");

            if (! $this->confirm('Overwrite existing plugin?', false)) {
                return 1;
            }
        }

        // Gather additional info
        $options = $this->gatherOptions();

        // Generate plugin
        $this->generatePlugin($slug, $name, $type, $description, $author, $dependencies, $options);

        $this->info("Plugin {$name} created successfully!");
        $this->info("Location: plugins/{$slug}");

        return 0;
    }

    /**
     * Interactive wizard for plugin creation.
     */
    protected function interactiveWizard(): int
    {
        $this->info('Welcome to ExilonCMS Plugin Generator!');
        $this->info('=====================================');
        $this->newLine();

        // Plugin name
        $name = $this->ask('What is the name of your plugin? (e.g., "Advanced Shop")');
        $slug = Str::slug($name);

        if (! $this->validatePluginName($slug)) {
            return 1;
        }

        // Plugin type
        $type = $this->choice(
            'What type of plugin is this?',
            [
                'feature' => 'Feature - Adds new functionality',
                'integration' => 'Integration - Integrates with external service',
                'theme-extension' => 'Theme Extension - Extends theme capabilities',
                'payment' => 'Payment - Adds payment gateway',
            ],
            'feature'
        );

        // Description
        $description = $this->ask('Plugin description:', "A {$type} plugin for ExilonCMS");

        // Author
        $author = $this->ask('Plugin author:', config('app.name'));

        // Dependencies
        $this->newLine();
        $this->info('Select plugin dependencies (press space to select, enter to continue):');

        $dependencies = $this->choice(
            'Which plugins does this plugin depend on?',
            array_merge(
                ['none' => 'No dependencies'],
                array_map(fn ($dep) => $dep['label'], $this->availableDependencies)
            ),
            'none'
        );

        $selectedDeps = [];
        if ($dependencies !== 'none') {
            // Find matching dependency key
            foreach ($this->availableDependencies as $key => $dep) {
                if ($dep['label'] === $dependencies) {
                    $selectedDeps[] = $key;
                    break;
                }
            }

            // Ask for integrations
            $selectedIntegrations = $this->selectIntegrations($selectedDeps);
        }

        // Features
        $this->newLine();
        $this->info('Select features to include:');

        $features = [];
        if ($this->confirm('Add routes file?', true)) {
            $features[] = 'routes';
        }
        if ($this->confirm('Add admin routes?', false)) {
            $features[] = 'admin';
        }
        if ($this->confirm('Add database migrations?', false)) {
            $features[] = 'migrations';
        }
        if ($this->confirm('Add settings page?', false)) {
            $features[] = 'settings';
        }

        // Hooks
        $this->newLine();
        $this->info('Select hooks to implement (extensions for CMS systems):');

        $selectedHooks = [];
        foreach ($this->availableHooks as $key => $hook) {
            if ($this->confirm("Add {$hook['label']}?", false)) {
                $selectedHooks[] = $key;
            }
        }

        // Generate
        $options = [
            'has_routes' => in_array('routes', $features),
            'has_admin' => in_array('admin', $features),
            'has_migrations' => in_array('migrations', $features),
            'has_settings' => in_array('settings', $features),
            'integrations' => $selectedIntegrations ?? [],
            'hooks' => $selectedHooks,
        ];

        $this->generatePlugin($slug, $name, $type, $description, $author, $selectedDeps, $options);

        $this->newLine();
        $this->info("✅ Plugin {$name} created successfully!");
        $this->info("📍 Location: plugins/{$slug}");
        $this->newLine();
        $this->comment('Next steps:');
        $this->comment('1. Review and customize plugin.json');
        $this->comment('2. Implement your plugin logic');
        $this->comment('3. Enable the plugin in admin panel');

        return 0;
    }

    /**
     * Select integrations for chosen dependencies.
     */
    protected function selectIntegrations(array $dependencies): array
    {
        $integrations = [];

        foreach ($dependencies as $depKey) {
            $dep = $this->availableDependencies[$depKey] ?? null;

            if (! $dep) {
                continue;
            }

            $this->newLine();
            $this->info("{$dep['label']} integrations:");

            foreach ($dep['integrations'] as $key => $description) {
                if ($this->confirm("Add {$description}?", false)) {
                    $integrations[] = "{$depKey}.{$key}";
                }
            }
        }

        return $integrations;
    }

    /**
     * Gather additional options for plugin generation.
     */
    protected function gatherOptions(): array
    {
        return [
            'has_routes' => $this->option('has-routes') || $this->confirm('Add routes file?', true),
            'has_admin' => $this->option('has-admin') || $this->confirm('Add admin routes?', false),
            'has_migrations' => $this->option('has-migrations') || $this->confirm('Add database migrations?', false),
            'has_settings' => $this->option('has-settings') || $this->confirm('Add settings page?', false),
        ];
    }

    /**
     * Validate plugin name/slug.
     */
    protected function validatePluginName(string $slug): bool
    {
        // Reserved names
        $reserved = ['app', 'vendor', 'public', 'storage', 'database'];

        if (in_array($slug, $reserved)) {
            $this->error("Plugin name '{$slug}' is reserved.");

            return false;
        }

        // Check for invalid characters
        if (! preg_match('/^[a-z0-9-]+$/', $slug)) {
            $this->error("Plugin name can only contain lowercase letters, numbers, and hyphens.");

            return false;
        }

        return true;
    }

    /**
     * Generate plugin files and structure.
     */
    protected function generatePlugin(
        string $slug,
        string $name,
        string $type,
        string $description,
        string $author,
        array $dependencies,
        array $options
    ): void {
        $pluginPath = base_path("plugins/{$slug}");
        $namespace = "ExilonCMS\\Plugins\\".Str::studly($slug);

        // Create directory structure
        File::ensureDirectoryExists($pluginPath, 0755);
        File::ensureDirectoryExists("{$pluginPath}/src", 0755);
        File::ensureDirectoryExists("{$pluginPath}/routes", 0755);
        File::ensureDirectoryExists("{$pluginPath}/resources/views", 0755);
        File::ensureDirectoryExists("{$pluginPath}/resources/lang", 0755);
        File::ensureDirectoryExists("{$pluginPath}/database/migrations", 0755);

        // Generate plugin.json
        $this->generatePluginJson($slug, $name, $type, $description, $author, $dependencies, $options);

        // Generate service provider
        $this->generateServiceProvider($slug, $namespace, $options);

        // Generate routes
        if ($options['has_routes']) {
            $this->generateRoutes($slug);
        }

        // Generate admin routes
        if ($options['has_admin']) {
            $this->generateAdminRoutes($slug);
        }

        // Generate migrations
        if ($options['has_migrations']) {
            $this->generateMigrationStub($slug, $namespace);
        }

        // Generate translations
        if (in_array('translations', $dependencies) || ! empty($options['integrations'])) {
            $this->generateTranslations($slug, $name);
        }

        // Generate integration files based on dependencies
        if (! empty($options['integrations'])) {
            $this->generateIntegrations($slug, $namespace, $options['integrations']);
        }

        // Generate hook implementations
        if (! empty($options['hooks'])) {
            $this->generateHooks($slug, $namespace, $options['hooks']);
        }
    }

    /**
     * Generate plugin.json file.
     */
    protected function generatePluginJson(
        string $slug,
        string $name,
        string $type,
        string $description,
        string $author,
        array $dependencies,
        array $options
    ): void {
        $pluginJson = [
            'id' => $slug,
            'name' => $name,
            'version' => '1.0.0',
            'description' => $description,
            'author' => $author,
            'url' => config('app.url'),
            'namespace' => "ExilonCMS\\Plugins\\".Str::studly($slug),
            'service_provider' => "ExilonCMS\\Plugins\\".Str::studly($slug)."\\\\".Str::studly($slug)."ServiceProvider",
            'dependencies' => array_merge([
                'exiloncms' => '>=1.0.0',
            ], array_fill_keys($dependencies, '>=1.0.0')),
        ];

        // Add features
        if ($options['has_routes']) {
            $pluginJson['routes'] = true;
        }

        if ($options['has_admin']) {
            $pluginJson['admin_routes'] = true;
        }

        if ($options['has_settings']) {
            $pluginJson['settings'] = true;
        }

        File::put(
            base_path("plugins/{$slug}/plugin.json"),
            json_encode($pluginJson, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
        );
    }

    /**
     * Generate service provider.
     */
    protected function generateServiceProvider(string $slug, string $namespace, array $options): void
    {
        $studlyName = Str::studly($slug);

        $content = <<<PHP
<?php

namespace {$namespace};

use Illuminate\Support\ServiceProvider;

class {$studlyName}ServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        \$this->loadRoutes();
        \$this->loadViews();
        \$this->loadTranslations();
        \$this->loadMigrations();
    }

    /**
     * Register routes.
     */
    protected function loadRoutes(): void
    {
        // Load web routes
    }

    /**
     * Load views.
     */
    protected function loadViews(): void
    {
        \$this->loadViewsFrom(__DIR__.'/../resources/views', {$slug});
    }

    /**
     * Load translations.
     */
    protected function loadTranslations(): void
    {
        \$this->loadTranslationsFrom(__DIR__.'/../resources/lang', {$slug});
    }

    /**
     * Load migrations.
     */
    protected function loadMigrations(): void
    {
        \$this->loadMigrationsFrom(__DIR__.'/../database/migrations');
    }
}
PHP;

        File::put("{$namespace}/{$studlyName}ServiceProvider.php", $content);
    }

    /**
     * Generate web routes file.
     */
    protected function generateRoutes(string $slug): void
    {
        $content = <<<PHP
<?php

use Illuminate\Support\Facades\Route;
use ExilonCMS\Http\Controllers\Controller;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return response()->json([
        'plugin' => '{$slug}',
        'message' => 'Welcome to {$slug} plugin!',
    ]);
})->name('{$slug}.index');
PHP;

        File::put(base_path("plugins/{$slug}/routes/web.php"), $content);
    }

    /**
     * Generate admin routes file.
     */
    protected function generateAdminRoutes(string $slug): void
    {
        $content = <<<PHP
<?php

use Illuminate\Support\Facades\Route;
use ExilonCMS\Http\Controllers\Controller;

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/', function () {
        return response()->json([
            'plugin' => '{$slug}',
            'section' => 'admin',
        ]);
    })->name('{$slug}.admin.index');
});
PHP;

        File::put(base_path("plugins/{$slug}/routes/admin.php"), $content);
    }

    /**
     * Generate migration stub.
     */
    protected function generateMigrationStub(string $slug, string $namespace): void
    {
        $table = Str::plural($slug);

        $content = <<<PHP
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('{$table}', function (Blueprint \$table) {
            \$table->id();
            \$table->string('name');
            \$table->text('description')->nullable();
            \$table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('{$table}');
    }
};
PHP;

        File::put(
            base_path("plugins/{$slug}/database/migrations/".date('Y_m_d_His')."_create_{$table}_table.php"),
            $content
        );
    }

    /**
     * Generate translation files.
     */
    protected function generateTranslations(string $slug, string $name): void
    {
        $studlyName = Str::studly($slug);
        $en = [
            $slug => [
                'name' => $name,
                'description' => "{$name} plugin",
            ],
        ];

        $fr = [
            $slug => [
                'name' => $name,
                'description' => "Plugin {$name}",
            ],
        ];

        File::put(
            base_path("plugins/{$slug}/resources/lang/en/{$slug}.php"),
            '<?php return '.var_export($en, true).';'
        );

        File::put(
            base_path("plugins/{$slug}/resources/lang/fr/{$slug}.php"),
            '<?php return '.var_export($fr, true).';'
        );
    }

    /**
     * Generate integration files based on dependencies.
     */
    protected function generateIntegrations(string $slug, string $namespace, array $integrations): void
    {
        foreach ($integrations as $integration) {
            [$dep, $feature] = explode('.', $integration);

            switch ($dep) {
                case 'shop':
                    $this->generateShopIntegration($slug, $namespace, $feature);
                    break;
                case 'payments':
                    $this->generatePaymentsIntegration($slug, $namespace, $feature);
                    break;
                case 'notifications':
                    $this->generateNotificationsIntegration($slug, $namespace, $feature);
                    break;
            }
        }
    }

    /**
     * Generate shop integration.
     */
    protected function generateShopIntegration(string $slug, string $namespace, string $feature): void
    {
        match ($feature) {
            'shop_products' => $this->generateShopProductsIntegration($slug, $namespace),
            'shop_category' => $this->generateShopCategoryIntegration($slug, $namespace),
            'shop_payments' => $this->generateShopPaymentsIntegration($slug, $namespace),
            default => null,
        };
    }

    protected function generateShopProductsIntegration(string $slug, string $namespace): void
    {
        // Generate product integration
        $studlyName = Str::studly($slug);

        $content = <<<PHP
<?php

namespace {$namespace}\\Shop;

use ExilonCMS\\Plugins\\Shop\\Models\\Product;

/**
 * Shop Product Integration for {$studlyName}
 */
class {$studlyName}Product
{
    /**
     * Get plugin-specific products.
     */
    public static function getProducts(): array
    {
        return Product::where('plugin_type', '{$slug}')
            ->where('is_active', true)
            ->get()
            ->toArray();
    }

    /**
     * Create a product for this plugin.
     */
    public static function createProduct(array $data): Product
    {
        return Product::create([
            ...\$data,
            'plugin_type' => '{$slug}',
        ]);
    }
}
PHP;

        File::put(
            base_path("plugins/{$slug}/src/Shop/{$studlyName}Product.php"),
            $content
        );
    }

    protected function generateShopCategoryIntegration(string $slug, string $namespace): void
    {
        // Generate category integration
        // TODO: Implement based on Shop plugin structure
    }

    protected function generateShopPaymentsIntegration(string $slug, string $namespace): void
    {
        // Generate payment integration
        // TODO: Implement based on Payments plugin structure
    }

    protected function generatePaymentsIntegration(string $slug, string $namespace, string $feature): void
    {
        // Generate payment gateway integration
        // TODO: Implement based on Payments plugin structure
    }

    protected function generateNotificationsIntegration(string $slug, string $namespace, string $feature): void
    {
        // Generate notification integration
        // TODO: Implement based on Notifications plugin structure
    }

    /**
     * Generate hook implementations for selected hooks.
     */
    protected function generateHooks(string $slug, string $namespace, array $hooks): void
    {
        foreach ($hooks as $hookKey) {
            $hook = $this->availableHooks[$hookKey] ?? null;
            if (! $hook) {
                continue;
            }

            $this->generateHookImplementation($slug, $namespace, $hookKey, $hook['interface']);
        }
    }

    /**
     * Generate a single hook implementation.
     */
    protected function generateHookImplementation(string $slug, string $namespace, string $hookKey, string $interface): void
    {
        $studlyName = Str::studly($slug);
        $hookStudlyName = Str::studly($hookKey);

        $interfaceShortName = class_basename($interface);

        $content = <<<PHP
<?php

namespace {$namespace}\\Hooks;

use {$interface};

/**
 * {$hookStudlyName} Hook Implementation for {$studlyName}
 */
class {$studlyName}{$hookStudlyName}Hook implements {$interfaceShortName}
{
    // TODO: Implement the {$interfaceShortName} interface methods
    // This hook allows your plugin to extend the CMS {$hookKey} functionality
}
PHP;

        File::ensureDirectoryExists(base_path("plugins/{$slug}/src/Hooks"), 0755);
        File::put(
            base_path("plugins/{$slug}/src/Hooks/{$studlyName}{$hookStudlyName}Hook.php"),
            $content
        );
    }
}
