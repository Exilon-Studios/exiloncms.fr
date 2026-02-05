# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ExilonCMS** (formerly MC-CMS V2) is a modern content management system for communities and businesses, built with Laravel 12 (PHP 8.2+) and React 19 + TypeScript. The project uses Inertia.js v2 for seamless SPA-like experiences without writing an API.

**Stack:**
- Backend: Laravel 12, PHP 8.2+, PostgreSQL (recommended) or MySQL
- Frontend: React 19, TypeScript (strict mode), Inertia.js v2
- UI: Tailwind CSS v3.4, shadcn/ui components
- Build: Vite 7 with HMR
- Rich Text: TipTap editor

**Namespace:** `ExilonCMS\` (not `App\`)

**High-Level Architecture:**
- **Inertia.js** as the bridge between Laravel backend and React frontend (no API routes)
- **Extension System** (Plugins + Themes) using PHP 8 attributes and composer autoload
- **Role-based permissions** with gates and policies for authorization
- **Game integration** layer supporting Minecraft (Java/Bedrock), FiveM, and Steam games
- **Payment Gateway System** (Paymenter-style) for processing payments via Stripe, PayPal, etc.
- **Standalone Installer** in `installer/` directory for web-based setup

## Development Commands

### Setup

**Interactive installer (recommended):**
```bash
# Run the interactive setup wizard
php artisan install:interactive
```

**Manual setup:**
```bash
# Initial setup (first time)
composer install
php artisan key:generate
php artisan migrate:fresh --seed
php artisan user:create --admin --name="Admin" --email="admin@example.com" --password="password"
npm install
npm run build
```

### Development Workflow
```bash
# Start all dev servers (concurrent: Laravel, Queue, Logs, Vite)
composer dev

# Windows (without logs)
composer dev-windows

# Or manually:
# Terminal 1 - Laravel backend
php artisan serve --port=8000

# Terminal 2 - Vite frontend with HMR
npm run dev
```

### Game Integration Commands
```bash
# Create a new game integration
php artisan game:create MyGame
```

### User Management Commands
```bash
# Create a new user
php artisan user:create --name="John Doe" --email="john@example.com" --password="secret"

# Create an admin user
php artisan user:create --admin --name="Admin" --email="admin@example.com" --password="password"

# Change user password
php artisan user:password --email="user@example.com" --password="newpassword"
```

### Database & Configuration Commands
```bash
# Interactive database configuration
php artisan db:config

# Interactive installation wizard
php artisan install:interactive

# Check game server ping/status
php artisan game:ping
```

### Maintenance Commands
```bash
# Purge old attachments
php artisan attachments:purge

# Purge old logs
php artisan logs:purge
```

### Plugin Management Commands
```bash
# List all installed plugins
php artisan plugin:list

# Install a plugin from marketplace
php artisan plugin:install <plugin-slug>

# Uninstall a plugin
php artisan plugin:uninstall <plugin-slug>
```

### Testing & Quality
```bash
# Run PHPUnit tests
php artisan test
# or
composer test

# Run specific test
php artisan test --filter=UserTest

# TypeScript type checking
npm run typecheck

# Code formatting (Laravel Pint)
./vendor/bin/pint

# Clear all caches
php artisan optimize:clear
```

### Database
```bash
# Fresh migration with seeding
php artisan migrate:fresh --seed

# Just migrate
php artisan migrate

# Rollback last migration
php artisan migrate:rollback

# Docker setup
docker-compose up -d

# Connect to PostgreSQL database
docker exec -it exiloncms_db psql -U exiloncms -d exiloncms
```

### Building for Production
```bash
# Build main app assets
npm run build

# Build installer assets
npm run build:installer

# Build everything
npm run build:all
```

### ExilonCMS CLI (Project Scaffolding)

The project includes an npm CLI tool for creating new ExilonCMS projects:

```bash
# Install globally via npm
npm install -g exiloncms

# Create a new project (interactive wizard)
exiloncms new my-site

# Development mode (from source)
cd /path/to/ExilonCMS
npm link
exiloncms new my-site

# Direct PHP (no npm needed)
php bin/exiloncms new my-site
```

The CLI wizard guides through:
- Site configuration (name, URL, language, timezone)
- Database setup (PostgreSQL, MySQL, SQLite)
- Admin account creation
- Marketplace integration for packages
- Docker configuration (optional)

### Docker Setup

```bash
# Start PostgreSQL and pgAdmin
docker-compose up -d

# Container details:
# - PostgreSQL: localhost:5432
#   - Database: mccms_v2
#   - User: mccms
#   - Password: mccms_secret
# - pgAdmin: http://localhost:5050
#   - Email: admin@mccms.local
#   - Password: admin

# Connect to PostgreSQL directly
docker exec -it mccms_v2_db psql -U mccms -d mccms_v2
```

## Architecture & Key Concepts

### 1. Inertia.js Integration

**All frontend pages use Inertia.js** - there are NO Blade views except `resources/views/app.blade.php` (the root wrapper).

**Controller pattern:**
```php
use Inertia\Inertia;

public function index()
{
    return Inertia::render('Admin/Users/Index', [
        'users' => User::paginate(20),
    ]);
}
```

**React page pattern:**
```tsx
// resources/js/pages/Admin/Users/Index.tsx
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function UsersIndex({ users }) {
    return (
        <AuthenticatedLayout>
            <Head title="Users" />
            {/* Component content */}
        </AuthenticatedLayout>
    );
}
```

### 2. Shared Data System

Global props are shared via `app/Http/Middleware/HandleInertiaRequests.php`:

**Auth & User:**
- `auth.user`: Current authenticated user (id, name, email, role, money, hasAdminAccess, adminPermissions)

**Flash Messages:**
- `flash.success`, `flash.error`, `flash.info`, `flash.warning`: Session flash messages

**Settings:**
- `settings.name`, `settings.description`, `settings.locale`, `settings.background`, `settings.favicon`
- `settings.darkTheme`: Dark theme enabled flag
- `settings.navbar`: Navbar configuration (links_position, links_spacing, style, background)
- `settings.marketplaceUrl`: URL to marketplace.exiloncms.fr

**Navigation:**
- `navbar`: Array of NavbarElement objects (dynamic navbar from database)
- `socialLinks`: Array of social media links

**Translations:**
- `trans`: Pre-loaded translation keys (auth, messages, admin, pages, dashboard, marketplace)

**Updates:**
- `updatesCount`: Count of available CMS updates (admin only)

Access in React:
```tsx
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

const { auth, flash, settings, navbar, trans } = usePage<PageProps>().props;
```

### 3. Marketplace Integration

ExilonCMS integrates with **marketplace.exiloncms.fr** for packages and extensions.

**Marketplace API:**
- Base URL: Available via `settings.marketplaceUrl` (defaults to `https://marketplace.exiloncms.fr`)
- Authentication: API tokens for secure package downloads
- RBAC: Role-based access control for creators and users

**Marketplace features:**
- Browse and install packages from marketplace
- Automatic updates for installed packages
- Version compatibility checking
- Secure package downloads

**Configuration:**
```php
// config/services.php
'marketplace' => [
    'url' => env('MARKETPLACE_URL', 'https://marketplace.exiloncms.fr'),
    'api_key' => env('MARKETPLACE_API_KEY'),
],
```

**Accessing marketplace URL in React:**
```tsx
const { settings } = usePage<PageProps>().props;
const marketplaceUrl = settings.marketplaceUrl;
```

### 4. Game Integration

ExilonCMS supports multiple game servers through a unified game integration system:
- **Minecraft** (Java & Bedrock editions, Online/Offline modes)
- **FiveM** (GTA V multiplayer)
- **Steam games** (Rust, and other Steam-based games)

**Game implementations:**
- `app/Games/Game.php` - Base game abstract class with common interface
- `app/Games/Minecraft/` - Minecraft-specific implementations:
  - `MinecraftOnlineGame` - Online mode (Mojang auth)
  - `MinecraftOfflineGame` - Offline mode (no auth)
  - `MinecraftBedrockGame` - Bedrock edition
  - `Servers/` - Server bridges (Ping, RCON, AzLink, Bedrock protocols)
- `app/Games/Steam/` - Steam-based games:
  - `SteamGame` - Base Steam game
  - `RustGame` - Rust-specific implementation
  - `FiveMGame.php` - FiveM implementation
  - `Servers/` - Server bridges (Query, RCON, FiveM status, AzLink)
- `app/Games/ServerBridge.php` - Abstract server bridge class
- `app/Games/UserAttribute.php` - User attribute mapping

**Server communication methods:**
- **Ping** - Basic server status query (port-based)
- **Query** - Detailed server information (player list, etc.)
- **RCON** - Remote console command execution
- **AzLink** - Third-party bridge for advanced features

**Creating a custom game:**
```bash
php artisan game:create MyGame
```

This generates a basic game class that extends `Game` and implements required methods for server communication, user authentication, and attribute mapping.

### 5. Extension System (Plugins + Themes)

ExilonCMS uses a modern PHP 8 attribute-based extension system that handles both plugins and themes.

**Architecture:**
- `PluginServiceProvider` (app/Providers/PluginServiceProvider.php) - Loads plugins via PluginLoader
- `ThemeServiceProvider` (app/Extensions/Theme/ThemeServiceProvider.php) - Loads active theme via ThemeLoader
- `ExtensionHelper` (app/Helpers/ExtensionHelper.php) - Manages payment gateways and other extensions

**Critical: Lazy Loading Pattern**
Extensions MUST use lazy loading to avoid "Class cache does not exist" errors during `package:discover`:

```php
public function register(): void
{
    $this->app->singleton(PluginLoader::class, function () {
        return new PluginLoader;
    });
    // DON'T instantiate loader here - cache not available yet
}

public function boot(): void
{
    // Skip during package:discover
    if ($this->app->runningInConsole() && isset($_SERVER['argv'])
        && in_array('package:discover', $_SERVER['argv'])) {
        return;
    }

    // Lazy load in boot(), not register()
    $this->loader = $this->app->make(PluginLoader::class);
}
```

**Why this matters:**
- During `composer install` → `package:discover`, the cache service isn't available
- If you try to use `Cache::get()` in `register()`, you get "Class cache does not exist"
- Always defer service instantiation to `boot()` phase
- Check for `package:discover` in argv to skip during discovery

### 6. Plugin System

ExilonCMS uses a modern PHP 8 attribute-based plugin architecture. Plugins are auto-discovered via composer autoload from the `plugins/` directory.

**Plugin Structure:**
```
plugins/
└── blog/
    ├── composer.json            # Plugin dependencies
    ├── src/
    │   └── Blog.php             # Main plugin class with #[PluginMeta] attribute
    ├── routes/
    │   ├── web.php              # Public routes
    │   └── admin.php            # Admin routes
    ├── database/
    │   └── migrations/          # Plugin migrations
    └── resources/
        ├── js/
        │   └── pages/           # React pages for plugin
        ├── views/               # Blade views (optional)
        └── lang/                # Translation files
```

**Plugin class with PHP 8 attributes:**
```php
namespace ExilonCMS\Plugins\Blog;

use ExilonCMS\Classes\Plugin\Plugin;
use ExilonCMS\Attributes\PluginMeta;

#[PluginMeta(
    id: 'blog',
    name: 'Blog',
    version: '1.0.0',
    description: 'Blog system with posts, categories, tags and comments',
    author: 'ExilonCMS',
    dependencies: [],
    permissions: ['blog.posts.create', 'blog.posts.edit', 'blog.posts.delete']
)]
class Blog extends Plugin
{
    public function boot(): void
    {
        // Plugin initialization - routes/views are auto-loaded by PluginServiceProvider
    }

    public function getConfigFields(): array
    {
        return [
            ['name' => 'posts_per_page', 'label' => 'Posts per page', 'type' => 'integer', 'default' => 10],
        ];
    }
}
```

**Plugin base class methods:**
- `boot()` - Called every request when plugin is enabled
- `installed()` - Called when plugin is first enabled
- `uninstalled()` - Called when plugin is disabled
- `upgraded(string $oldVersion)` - Called when plugin is updated
- `getConfigFields(): array` - Define admin configuration fields
- `config(string $key, mixed $default)` - Get plugin config from database
- `setConfig(string $key, mixed $value)` - Set plugin config in database

**Built-in Plugins:**
- **Analytics** - Website analytics and statistics tracking
- **Blog** - News/blog system with categories, tags, and comments
- **Docs** - Documentation system with categories
- **Legal** - Legal pages (privacy policy, terms of service)
- **Notifications** - User notification system with channels and templates
- **Pages** - Custom page management
- **Releases** - Release notes and changelogs
- **Shop** - E-commerce for game server items
- **Translations** - Translation management interface
- **Votes** - Voting system for game servers

**Plugin Loading:**
- Plugins are auto-discovered by `PluginLoader` via composer autoload classmap
- `PluginServiceProvider` registers routes, views, migrations, and translations for enabled plugins
- Plugin migrations are auto-registered and run with standard `php artisan migrate`
- Plugin namespaces are auto-loaded via `composer.json` autoload configuration
- Enabled plugins are stored in `settings` table under `enabled_plugins` key

### 7. Payment Gateway System

ExilonCMS includes a Paymenter-style payment gateway system for processing payments through multiple providers.

**Architecture:**
- `Gateway` abstract base class (`app/Classes/Extension/Gateway.php`) - Base for all payment gateways
- `ExtensionHelper` (`app/Helpers/ExtensionHelper.php`) - Centralized gateway management
- Gateways auto-discovered from `app/Extensions/Gateways/<Name>/` via composer autoload

**Gateway methods:**
```php
abstract class Gateway extends Extension
{
    // Required: Process payment for an invoice
    abstract public function pay(Invoice $invoice, $total);

    // Optional: Handle webhook from payment provider
    public function webhook($request) { }

    // Optional: Billing agreements (recurring payments)
    public function supportsBillingAgreements(): bool { return false; }
    public function createBillingAgreement(User $user) { }
    public function charge(Invoice $invoice, $total, $billingAgreement) { }
}
```

**ExtensionHelper usage:**
```php
use ExilonCMS\Helpers\ExtensionHelper;

// Get all gateways
$gateways = ExtensionHelper::getExtensions('gateway');

// Initiate payment
$response = ExtensionHelper::pay($gateway, $invoice);

// Handle webhook
return ExtensionHelper::handleWebhook($gatewayName, $request);

// Add payment transaction
$transaction = ExtensionHelper::addPayment($invoice, $gateway, $amount, $fee, $transactionId);
```

**Configuration fields:**
Gateways can define config fields by overriding `getConfig()` to return an array of field definitions for the admin panel.

### 8. Roles & Permissions

**Models:**
- `User` (ExilonCMS\Models\User)
- `Role` (ExilonCMS\Models\Role)
- `Permission` (ExilonCMS\Models\Permission)

**Middleware:**
- `Authenticate` - Requires auth
- `AdminAccess` - Requires admin role

**Gate usage:**
```php
// In routes
Route::middleware('can:admin.users')->group(function () {
    // Admin user management routes
});
```

**In React:**
```tsx
const { auth } = usePage<PageProps>().props;

{auth.user?.role === 'admin' && (
    <Link href="/admin">Admin Panel</Link>
)}
```

### 9. Theme System

Themes support page overrides that allow complete customization of any page in the CMS.

**Theme Structure:**
```
themes/
└── blog/
    ├── theme.json              # Theme metadata
    ├── resources/
    │   ├── css/                # Theme styles
    │   ├── js/
    │   │   └── pages/          # Theme page overrides
    │   │       ├── Home.tsx    # Override home page
    │   │       ├── Shop.tsx    # Override shop page
    │   │       └── Blog.tsx    # Override blog page
    │   └── views/              # Blade templates (optional)
    └── assets/                 # Theme assets
```

**Theme Page Override Priority:**
1. Active theme page (if exists)
2. Plugin page (if route belongs to plugin)
3. Core CMS page (fallback)

This means you can override ANY page (core, plugin, or admin) by creating a corresponding file in your theme's `resources/js/pages/` directory.

**Theme preview mode:**
Themes can be previewed without activation by setting `preview_theme` in session:
```php
session(['preview_theme' => 'my-theme']);
```

**Theme metadata (theme.json):**
```json
{
  "id": "blog",
  "name": "Blog Theme",
  "version": "1.0.0",
  "description": "Default blog theme",
  "author": "ExilonCMS",
  "requires": {
    "plugin:blog": "*"
  },
  "supports": ["shop", "docs"]
}
```

**Theme activation with plugin dependencies:**
When a theme is activated, any plugins listed in `requires` (with `plugin:` prefix) are automatically enabled.

### 10. File Structure

**Backend:**
- `app/Models/` - Eloquent models
- `app/Http/Controllers/` - Controllers (use Inertia)
- `app/Http/Middleware/` - Middleware (HandleInertiaRequests is critical)
- `app/Providers/` - Service providers
- `app/Games/` - Game server integrations
- `app/Policies/` - Authorization policies
- `app/helpers.php`, `app/color_helpers.php` - Helper functions
- `routes/web.php` - Public routes
- `routes/admin.php` - Admin routes (prefixed with `/admin`)
- `database/migrations/` - Database schema

**Frontend:**
- `resources/js/app.tsx` - Inertia entry point
- `resources/js/pages/` - Page components (match Inertia::render() calls)
- `resources/js/layouts/` - Layout components (AuthenticatedLayout, GuestLayout)
- `resources/js/components/` - Reusable components
- `resources/js/types/` - TypeScript type definitions
- `resources/js/lib/` - Utility functions
- `resources/views/app.blade.php` - Root HTML wrapper (ONLY Blade file)

### 11. TypeScript Configuration

TypeScript uses **strict mode** with:
- `noUnusedLocals`, `noUnusedParameters`
- `noImplicitReturns`, `noFallthroughCasesInSwitch`
- `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`

**Path aliases** (configured in `tsconfig.json` and `vite.config.ts`):
```typescript
import Button from '@/components/ui/button';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';

// Available aliases:
// @/*                → resources/js/*
// @/components/*     → resources/js/components/*
// @/layouts/*        → resources/js/layouts/*
// @/pages/*          → resources/js/pages/*
// @/types/*          → resources/js/types/*
// @/lib/*            → resources/js/lib/*
// @/hooks/*          → resources/js/hooks/*
```

### 12. Database & Models

**Database:** Uses PostgreSQL by default (configurable in `.env`).

**Key Models:**
- User, Role, Permission - Authentication & Authorization
- Page, Post, Comment, Like - Content management
- Server, ServerStat, ServerCommand - Game server management
- Image, Attachment - Media management
- NavbarElement, SocialLink - UI configuration
- Setting - Site configuration
- Ban, ActionLog, Notification - Moderation & logging

**Traits:**
- `HasUser`, `Loggable`, `HasImage`, `HasMarkdown`
- `InteractsWithMoney`, `TwoFactorAuthenticatable`

### Database Migrations

**CRITICAL: Migration Safety Rules** 🔴

**NEVER use destructive operations in migrations:**
- ❌ `Schema::dropIfExists()` - Destroys data if table exists
- ❌ `DROP TABLE` - Direct SQL table deletion
- ❌ `TRUNCATE` - Clears all data
- ❌ `DELETE without WHERE` - Deletes all rows

**USE safe helpers instead:**
```php
// Check if table exists before modifying
Schema::hasTable('users'); // bool

// Safe table modification (create or modify)
safe_modify_table('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->text('description')->nullable();
});

// Add column only if it doesn't exist
Schema::table('users', function (Blueprint $table) {
    if (!Schema::hasColumn('users', 'new_column')) {
        $table->string('new_column')->nullable();
    }
});
```

**For plugin migrations:**
- Plugins MUST use additive migrations only
- Check for existence before adding columns
- NEVER drop core tables
- Plugin data tables should be created with `Schema::create()` (not `dropIfExists`)

**Safe migration pattern:**
```php
// ✅ GOOD - Check before creating
Schema::create('my_table', function (Blueprint $table) {
    $table->id();
    $table->string('name');
});

// Or better - use Schema::hasTable() check
if (!Schema::hasTable('my_table')) {
    Schema::create('my_table', function (Blueprint $table) {
        $table->id();
        $table->string('name');
    });
}

// ❌ BAD - Destroys data
Schema::dropIfExists('my_table');
Schema::create('my_table', function (Blueprint $table) {
    // ...
});
```

**UpdateManager behavior during updates:**
- Runs `php artisan migrate --force` automatically
- **Your data will be LOST** if migrations use `dropIfExists()`
- Always backup before updating!

### 13. Settings System

Settings are stored in the `settings` table and accessed via helper:

```php
setting('site_name', 'ExilonCMS'); // With default
setting('site_name'); // Without default
```

Common settings: `name`, `description`, `locale`, `timezone`, `money` (currency name).

### 14. Helper Functions

Available globally via `app/helpers.php`:

```php
// Installation check
is_installed() // bool - check if CMS is installed

// Settings
setting(string $key, mixed $default = null) // Get setting value

// URLs
image_url(string $path) // Get full URL for image
favicon() // Get favicon URL

// Theme
dark_theme() // Check if dark theme is enabled
```

Available globally via `app/color_helpers.php`:

```php
// Color utilities for theming
get_color(string $hex, string $type) // Extract color values
mix_colors(string $color1, string $color2, int $percentage) // Mix two colors
```

### 15. Frontend Libraries

The project uses several key React libraries:

**Forms & Validation:**
- `react-hook-form` - Form state management
- `zod` - Schema validation
- `@hookform/resolvers` - Zod integration with react-hook-form

**UI Components:**
- `@radix-ui/*` - Unstyled, accessible component primitives (dialog, dropdown, select, etc.)
- `sonner` - Toast notifications
- `framer-motion` - Animation library
- `lucide-react` & `@tabler/icons-react` - Icon libraries

**Rich Text:**
- `@tiptap/react` - Headless rich text editor
- Extensions: color, image, link, placeholder, text-align, underline

**Data Fetching:**
- `@tanstack/react-query` - Server state management
- `@tanstack/react-table` - Table components

**Drag & Drop:**
- `@dnd-kit/core` - Drag and drop utilities

## Important Notes

1. **Namespace is `ExilonCMS\`** - Not `App\`
2. **Never create Blade views** - Use React + Inertia only (except root `app.blade.php`)
3. **All routes return Inertia responses** - Controllers use `Inertia::render()`
4. **TypeScript is strict** - Handle all edge cases, nullable types
5. **Database agnostic** - Migrations must work on PostgreSQL, MySQL, and SQLite
6. **No direct API calls** - Use Inertia for data flow between Laravel and React
7. **Flash messages** - Use session flash for success/error messages, accessed via `usePage().props.flash`
8. **Helper functions** - Available globally via `app/helpers.php` and `app/color_helpers.php` (auto-loaded in composer.json)
9. **Tailwind CSS v3.4** - Uses `@tailwind` directives in `resources/css/app.css`
10. **Plugin system** - All modular features (Blog, Docs, Shop, etc.) are implemented as plugins in `plugins/` directory
11. **Marketplace integration** - Packages are installed from marketplace.exiloncms.fr via API
12. **CRITICAL: Use ziggy-js for routes in JavaScript** - NEVER import from `vendor/tightenco/ziggy` as the vendor directory doesn't exist in CI builds. Always use `import { route } from 'ziggy-js'`
13. **Extension lazy loading** - Extensions MUST use lazy loading in `boot()` phase, NOT `register()`. The cache service isn't available during `package:discover`, so instantiating services in `register()` will cause "Class cache does not exist" errors. Always check for package:discover and lazy load in `boot()`.
14. **Run Pint before committing** - Code style is enforced in CI via `./vendor/bin/pint --test`. Run `./vendor/bin/pint` to auto-fix issues before pushing.
15. **ALWAYS UPDATE CHANGELOG.md** - After ANY code change (fix, feature, refactor, chore), add an entry to `CHANGELOG.md` under today's date. Use format: `FIX:`, `FEATURE:`, `REFACTOR:`, or `CHORE:` followed by a concise description.

## Common Patterns

## Common Patterns

### Creating a new plugin

**Using the PHP 8 attribute system:**

1. **Create plugin directory structure:**
```bash
mkdir -p plugins/my-plugin/src
mkdir -p plugins/my-plugin/routes
mkdir -p plugins/my-plugin/database/migrations
mkdir -p plugins/my-plugin/resources/js/pages
```

2. **Create plugin class** (`plugins/my-plugin/src/MyPlugin.php`):
```php
<?php

namespace ExilonCMS\Plugins\MyPlugin;

use ExilonCMS\Classes\Plugin\Plugin;
use ExilonCMS\Attributes\PluginMeta;

#[PluginMeta(
    id: 'my-plugin',
    name: 'My Plugin',
    version: '1.0.0',
    description: 'Plugin description',
    author: 'Your Name',
    dependencies: [],
    permissions: ['myplugin.manage']
)]
class MyPlugin extends Plugin
{
    public function boot(): void
    {
        // Plugin initialization
    }

    public function getConfigFields(): array
    {
        return [
            [
                'name' => 'api_key',
                'label' => 'API Key',
                'type' => 'text',
                'default' => '',
            ],
        ];
    }
}
```

3. **Update composer.json autoload** (add to `autoload.psr-4`):
```json
"ExilonCMS\\Plugins\\MyPlugin\\": "plugins/my-plugin/src/"
```

4. **Run composer dump-autoload:**
```bash
composer dump-autoload
```

5. **Enable plugin via settings:**
```php
// In database or via admin panel
setting('enabled_plugins', ['blog', 'shop', 'my-plugin']);
```

### Creating a new payment gateway

1. **Create gateway class** in `app/Extensions/Gateways/<Name>/<Name>.php`:
```php
<?php

namespace ExilonCMS\Extensions\Gateways\Stripe;

use ExilonCMS\Classes\Extension\Gateway;
use ExilonCMS\Models\Invoice;

class Stripe extends Gateway
{
    public function getConfig(): array
    {
        return [
            ['name' => 'secret_key', 'label' => 'Secret Key', 'type' => 'text'],
            ['name' => 'publishable_key', 'label' => 'Publishable Key', 'type' => 'text'],
        ];
    }

    public function pay(Invoice $invoice, $total)
    {
        // Return payment view or redirect
    }

    public function webhook($request)
    {
        // Handle Stripe webhook
        return response()->json(['success' => true]);
    }
}
```

### Creating a new admin page

1. **Route** (`routes/admin.php`):
```php
Route::get('/example', [ExampleController::class, 'index'])->name('example.index');
```

2. **Controller**:
```php
namespace ExilonCMS\Http\Controllers\Admin;

use Inertia\Inertia;

class ExampleController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Example/Index', [
            'data' => Example::all(),
        ]);
    }
}
```

3. **React Page** (`resources/js/pages/Admin/Example/Index.tsx`):
```tsx
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

interface Example {
    id: number;
    name: string;
}

interface Props {
    data: Example[];
}

export default function ExampleIndex({ data }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="Example" />
            <div className="container mx-auto">
                <h1>Example Page</h1>
                {/* Content */}
            </div>
        </AuthenticatedLayout>
    );
}
```

### Form submission with Inertia

```tsx
import { useForm } from '@inertiajs/react';

export default function ExampleForm() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('example.store'));
    };

    return (
        <form onSubmit={submit}>
            <input
                value={data.name}
                onChange={e => setData('name', e.target.value)}
            />
            {errors.name && <span>{errors.name}</span>}

            <button type="submit" disabled={processing}>
                Submit
            </button>
        </form>
    );
}
```

## Testing Database Connection

```bash
# PostgreSQL (Docker)
docker exec -it exiloncms_db psql -U exiloncms -d exiloncms -c "\dt"

# MySQL (Docker) - adjust credentials as needed
docker exec -it exiloncms_db mysql -u root -p -e "SHOW TABLES;"
```

## Troubleshooting

- **Inertia version mismatch**: Clear cache with `php artisan optimize:clear`
- **TypeScript errors**: Check `tsconfig.json` paths match file structure
- **Vite not found**: Run `npm install` and ensure `node_modules` exists
- **Database connection failed**: Verify `.env` DB credentials and that DB server is running
- **500 error on Inertia pages**: Check `storage/logs/laravel.log` for details
- **PostgreSQL connection refused**: Ensure Docker is running (`docker-compose up -d`)
- **Composer autoload issues**: Run `composer dump-autoload`
- **Installation state issues**: The `is_installed()` helper checks if CMS is installed. If returning false, check `installed_at` setting in database or create one of the fallback files (`public/installed.json`, `bootstrap/cache/installed`, or `storage/installed.json`)

## Middleware System

Key middleware registered in `bootstrap/app.php`:

**Web middleware (applied to all web routes):**
- `RedirectIfNotInstalled` - Redirect to installer if CMS not installed
- `CheckForMaintenanceSettings` - Check maintenance mode from database
- `SetLocale` - Set application locale from settings
- `HandleInertiaRequests` - Share data with Inertia (critical for all Inertia pages)

**Middleware aliases:**
- `login.socialite` - Socialite OAuth authentication
- `captcha` - reCAPTCHA verification
- `admin` / `admin.access` - Require admin role
- `registration` - Check if registration is enabled

## Routing Structure

Routes are loaded in this order (defined in `bootstrap/app.php`):
1. `routes/web.php` - Public and authenticated routes
2. `routes/install.php` - Installation wizard (only when not installed)
3. `routes/admin.php` - Admin panel routes (prefixed with `/admin`, requires auth + admin)
4. `routes/api.php` - API routes (if needed)
5. `routes/console.php` - Console routes

## Update System

ExilonCMS includes an automatic update system managed by `UpdateManager` (`app/Extensions/UpdateManager.php`):

**GitHub-based updates (CMS core):**
- Checks for new releases from configured GitHub repository
- Downloads release assets as ZIP files
- Creates automatic backups before updating
- Validates update compatibility

**Update process:**
1. Check for available updates
2. Download update ZIP file
3. Create backup of current installation
4. Extract new files
5. Run migrations (if any)
6. Clear all caches
7. Verify installation

**Commands:**
```bash
# No dedicated command - updates managed via admin UI at /admin/updates
# Or manually via git pull + composer install + npm run build + migrate
```

## Installation State

ExilonCMS uses an `is_installed()` helper function (defined in `app/helpers.php`) to check if the CMS has been installed. This affects:
- `HandleInertiaRequests`: Returns minimal shared data if not installed
- `RedirectIfNotInstalled` middleware: Redirects to installer if not installed
- Various routes and middleware that may check installation state

**Installation checks (in order of priority):**
1. Database: `settings` table, row where `name = 'installed_at'`
2. Fallback files: `public/installed.json`, `bootstrap/cache/installed`, `storage/installed.json`
3. `.env` flag: `EXILONCMS_INSTALLED=true`

The installation state can be reset during development by deleting the `installed_at` setting from the database or removing the fallback files.

## Translation Commands

The project includes translation verification commands:

```bash
# Find missing translations
php artisan translations:missing

# Check for duplicate translation keys
php artisan translations:duplicates

# Verify translation file integrity
php artisan translations:verify
```

These are useful when adding new translation keys or updating existing ones.

## CI/CD & Release

**CI Workflow** (`.github/workflows/ci.yml`):
- Tests on PHP 8.2/8.3 with Laravel 11/12 matrix
- Runs Laravel Pint code style checks (`./vendor/bin/pint --test`)
- Builds frontend assets (`npm run build`)
- Tests plugin loading after fresh migrations
- Tests and translation checks are commented out (require full CMS installation)

**Release Workflow** (`.github/workflows/release.yml`):
- Triggered by version tags (`v*`) or manual dispatch
- Runs `npm run build:all` to build both main and installer assets
- Creates two ZIP files:
  - `exiloncms-{version}.zip` - Full CMS package (excludes dev files)
  - `exiloncms-installer-{version}.zip` - Standalone web installer
- Publishes to GitHub Releases with generated release notes
- Notifies marketplace webhook at `https://marketplace.exiloncms.fr/api/webhook/release`

**Release process:**
1. Update version in `composer.json` and `package.json`
2. Update `CHANGELOG.md`
3. Commit and push changes
4. Create and push tag: `git tag v1.3.0 && git push origin v1.3.0`
5. CI automatically builds and publishes release

**Important for CI:**
- Always run `./vendor/bin/pint` before committing - CI will fail on code style issues
- Use `ziggy-js` npm package for routes, NEVER vendor imports
- Keep `release/` directory clean - it's generated during release build
