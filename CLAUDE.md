# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ExilonCMS** (formerly MC-CMS V2) is a modern content management system for Minecraft and game servers, built with Laravel 12 (PHP 8.2+) and React 19 + TypeScript. The project uses Inertia.js v2 for seamless SPA-like experiences without writing an API.

**Stack:**
- Backend: Laravel 12, PHP 8.2+, PostgreSQL (recommended) or MySQL
- Frontend: React 19, TypeScript (strict mode), Inertia.js v2
- UI: Tailwind CSS v3, shadcn/ui components
- Build: Vite 7 with HMR
- Visual Editor: Puck drag-and-drop page builder

**Namespace:** `ExilonCMS\` (not `App\`)

**High-Level Architecture:**
- **Monorepo-style structure** with plugins and themes as self-contained modules
- **Inertia.js** as the bridge between Laravel backend and React frontend (no API routes)
- **Puck Editor** for visual page building with reusable React components
- **Role-based permissions** with gates and policies for authorization
- **Game integration** layer supporting Minecraft (Java/Bedrock), FiveM, and Steam games

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

# Create Puck editor permission
php artisan db:seed --class=PuckPermissionSeeder
```

### Development Workflow
```bash
# Start all dev servers (concurrent: Laravel, Queue, Logs, Vite)
composer dev

# Or manually:
# Terminal 1 - Laravel backend
php artisan serve --port=8000

# Terminal 2 - Vite frontend with HMR
npm run dev
```

### Plugin & Theme Commands
```bash
# Create a new plugin (with interactive options)
php artisan plugin:create MyPlugin

# Enable/disable plugins
php artisan plugin:enable MyPlugin
php artisan plugin:disable MyPlugin

# Clear plugin cache
php artisan plugin:clear

# Create a new theme
php artisan theme:create MyTheme

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

### Testing & Quality
```bash
# Run PHPUnit tests
php artisan test
# or
composer test

# Run specific test
php artisan test --filter=UserTest

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
npm run build
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

**Navigation:**
- `navbar`: Array of NavbarElement objects (dynamic navbar from database)
- `socialLinks`: Array of social media links

**Translations:**
- `trans`: Pre-loaded translation keys (auth, messages, admin, pages, puck, dashboard, shop)

**Plugin Data:**
- `enabledPlugins`: List of enabled plugins with metadata
- `pluginAdminNavItems`: Admin navigation from plugins
- `pluginUserNavItems`: User navigation from plugins
- `cartCount`: Shop cart item count (if shop plugin enabled)

**Updates:**
- `updatesCount`: Count of available CMS/plugin/theme updates (admin only)

Access in React:
```tsx
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

const { auth, flash, settings, navbar, trans } = usePage<PageProps>().props;
```

### 3. Plugin System

Plugins live in `plugins/{plugin-name}/` directory.

**Structure:**
```
plugins/shop/
├── plugin.json              # Metadata & dependencies
├── composer.json            # PSR-4 autoloading
├── navigation.json          # Navigation items for admin/user menus
├── src/
│   ├── Http/Controllers/
│   ├── Models/
│   └── Providers/
│       └── ShopServiceProvider.php
├── resources/
│   ├── js/
│   │   └── pages/           # React pages for plugin
│   │       └── Index.tsx
│   └── lang/                # Translations (use namespace: plugin-id::file.key)
│       └── fr/
│           ├── nav.php
│           └── messages.php
├── database/
│   └── migrations/
├── Widgets/                 # Optional dashboard widgets
└── routes/
    ├── web.php              # Public and authenticated user routes
    └── admin.php            # Admin panel routes (optional, can use web.php)
```

**plugin.json format:**
```json
{
  "id": "shop",
  "name": "Shop",
  "description": "Plugin description",
  "version": "1.0.0",
  "author": "AuthorName",
  "url": "https://github.com/repo",
  "mccms_api": "0.2",
  "providers": [
    "ExilonCMS\\Plugins\\Shop\\Providers\\ShopServiceProvider"
  ],
  "requirements": {
    "php": ">=8.2",
    "laravel": ">=12"
  }
}
```

**navigation.json format:**
```json
{
  "admin": [
    {
      "label": "Shop",
      "href": "/admin/shop",
      "permission": "admin.shop",
      "icon": "shopping-bag"
    }
  ],
  "user": [
    {
      "label": "Shop",
      "href": "/shop",
      "icon": "shopping-bag"
    }
  ]
}
```

**Available icon names** (Lucide/Tabler icons):
- `shopping-bag`, `package`, `file-text`, `puzzle`, `settings`, `users`
- `shield`, `ban`, `file`, `photo`, `arrows-right-left`, `palette`, `download`
- `list`, `language`, `home`, `server`, `credit-card`, `wallet`
- See `resources/js/components/admin/Sidebar.tsx` for icon mapping component

**Plugin Service Provider:**
```php
namespace ExilonCMS\Plugins\Shop\Providers;

use ExilonCMS\Extensions\Plugin\BasePluginServiceProvider;

class ShopServiceProvider extends BasePluginServiceProvider
{
    public function boot()
    {
        $this->loadTranslations();
        $this->loadRoutes();
        $this->loadMigrations();
    }
}
```

**Available BasePluginServiceProvider methods:**
- `loadTranslations()` - Load translations from `resources/lang/`
- `loadViews()` - Load Blade views from `resources/views/`
- `loadMigrations()` - Load migrations from `database/migrations/`
- `loadRoutes()` - Load routes from `routes/web.php`
- `registerAdminRoutes(Closure $callback)` - Register admin routes (`/admin/*`)
- `registerUserRoutes(Closure $callback)` - Register authenticated user routes

Plugins are loaded via `app/Providers/ExtensionServiceProvider.php` and managed by `PluginManager` in `app/Extensions/Plugin/PluginManager.php`.

**Plugin translations namespace:** Use `plugin-id::file.key` format (e.g., `trans('shop::nav.shop')`). Load in HandleInertiaRequests to make available in React.

### 4. Theme System

Themes live in `themes/{theme-name}/` directory. Themes can extend layouts and customize views. Managed by `ThemeManager` in `app/Extensions/Theme/`.

### 5. Widget System

Plugins can provide dashboard widgets that appear in the user dashboard. Widgets are placed in `plugins/{plugin}/Widgets/` directory.

**Widget example:**
```php
<?php

namespace ExilonCMS\Plugins\Shop\Widgets;

use ExilonCMS\Extensions\Widget\BaseWidget;
use ExilonCMS\Models\User;

class ShopWidget extends BaseWidget
{
    public function id(): string
    {
        return 'shop-widget';
    }

    public function title(): string
    {
        return __('shop::widget.title');
    }

    public function type(): string
    {
        // Types: 'card', 'sidebar', 'widget'
        return 'sidebar';
    }

    public function icon(): ?string
    {
        return 'shopping-bag';
    }

    public function link(): ?string
    {
        return '/shop';
    }

    public function props(?User $user): array
    {
        return [
            'items' => [], // Widget data
        ];
    }
}
```

Widget types:
- `card`: Large card in main dashboard area
- `sidebar`: Sidebar widget
- `widget`: Generic widget type

### 6. Game Integration

ExilonCMS supports multiple game servers:
- Minecraft (Java & Bedrock editions)
- FiveM
- Steam games (Rust, etc.)

**Game implementations:**
- `app/Games/Game.php` - Base game abstract class
- `app/Games/Minecraft/` - Minecraft-specific implementations (Online, Offline, Bedrock)
- `app/Games/Steam/` - Steam-based games
- `app/Games/FiveMGame.php` - FiveM game implementation

**Server bridges:** Handle server communication (RCON, Query, Ping, AzLink) via `ServerBridge` abstract class in `app/Games/ServerBridge.php`.

### 7. Roles & Permissions

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

### 8. File Structure

**Backend:**
- `app/Models/` - Eloquent models
- `app/Http/Controllers/` - Controllers (use Inertia)
- `app/Http/Middleware/` - Middleware (HandleInertiaRequests is critical)
- `app/Providers/` - Service providers
- `app/Extensions/` - Plugin/Theme systems
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

### 9. TypeScript Configuration

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
// @/plugins/*        → plugins/*
```

### 10. Database & Models

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

### 11. Settings System

Settings are stored in the `settings` table and accessed via helper:

```php
setting('site_name', 'ExilonCMS'); // With default
setting('site_name'); // Without default
```

Common settings: `name`, `description`, `locale`, `timezone`, `money` (currency name).

### 12. Helper Functions

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

// Plugins/Themes
plugin_path(string $plugin, string $path = '') // Get plugin path
theme_path(string $theme, string $path = '') // Get theme path
```

Available globally via `app/color_helpers.php`:

```php
// Color utilities for theming
get_color(string $hex, string $type) // Extract color values
mix_colors(string $color1, string $color2, int $percentage) // Mix two colors
```

### 13. Puck Visual Editor

ExilonCMS includes **Puck Editor** - a drag-and-drop visual page builder.

**Key files:**
- `resources/js/puck/config.tsx` - Puck configuration and component registry
- `resources/js/puck/components/` - Puck component definitions
- `resources/js/pages/Admin/PuckEditor.tsx` - Full-screen editor interface
- `resources/js/pages/PuckPage.tsx` - Public page renderer

**Database:** Pages table includes `puck_data` (JSON) and `use_puck` (boolean) columns.

**Permission:** `admin.pages.puck-edit` controls access to the editor.

**Creating Puck components:**
```tsx
// resources/js/puck/components/MyBlock.tsx
export const MyBlock = ({ title, content }: { title: string; content: string }) => (
  <div className="p-4 border rounded">
    <h2>{title}</h2>
    <p>{content}</p>
  </div>
);

// Add to config.tsx
import { MyBlock } from './components/MyBlock';

export const puckConfig: Config = {
  components: {
    MyBlock: {
      fields: {
        title: { type: 'text' },
        content: { type: 'text' },
      },
      defaultProps: {
        title: 'Default Title',
        content: 'Default content',
      },
      render: MyBlock,
    },
  },
};
```

**Available components:** HeadingBlock, ParagraphBlock, ButtonBlock, ImageBlock, CardBlock, GridBlock.

### 14. Frontend Libraries

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

**Visual Editor:**
- `@measured/puck` - Drag-and-drop page builder
- `@tanstack/react-table` - Table components

## Plugin Creation Workflow

When creating a plugin, follow these steps:

1. **Create plugin structure:**
   ```bash
   php artisan plugin:create MyPlugin --author="YourName" --description="Description"
   ```

2. **Edit generated files:**
   - `plugins/my-plugin/plugin.json` - Update metadata
   - `plugins/my-plugin/composer.json` - PSR-4 autoloading
   - `plugins/my-plugin/navigation.json` - Add navigation items

3. **Create functionality:**
   - Add controllers in `src/Http/Controllers/`
   - Add routes in `routes/web.php`
   - Add React pages in `resources/js/pages/`
   - Add translations in `resources/lang/fr/`

4. **Register in ServiceProvider:**
   ```php
   public function boot(): void
   {
       $this->loadTranslations();
       $this->loadRoutes();
       $this->loadMigrations();
   }
   ```

5. **Enable plugin:**
   ```bash
   composer dump-autoload
   php artisan plugin:enable MyPlugin
   php artisan migrate  # If plugin has migrations
   php artisan optimize:clear
   ```

6. **Add translations to HandleInertiaRequests** (if needed):
   ```php
   'trans' => [
       // ...
       'my-plugin::nav' => trans('my-plugin::nav'),
   ],
   ```

## Important Notes

1. **Never create Blade views** - Use React + Inertia only (except root `app.blade.php`)
2. **All routes return Inertia responses** - Controllers use `Inertia::render()`
3. **TypeScript is strict** - Handle all edge cases, nullable types
4. **Namespace is ExilonCMS\\** - Not App\\
5. **Database agnostic** - Migrations must work on PostgreSQL and MySQL
6. **Plugins are modular** - Each plugin is self-contained with its own routes, controllers, models, migrations, and React pages
7. **No direct API calls** - Use Inertia for data flow between Laravel and React
8. **Flash messages** - Use session flash for success/error messages, accessed via `usePage().props.flash`
9. **Helper functions** - Available globally via `app/helpers.php` and `app/color_helpers.php` (auto-loaded in composer.json)
10. **Tailwind CSS v3** - Uses `@tailwind` directives in `resources/css/app.css`

## Common Patterns

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
- **Puck permission missing**: Run `php artisan db:seed --class=PuckPermissionSeeder`
- **Composer autoload issues**: Run `composer dump-autoload`
- **Installation state issues**: The `is_installed()` helper checks if CMS is installed. If returning false, check `installed` key in cache/settings

## Installation State

ExilonCMS uses an `is_installed()` helper function (defined in `app/helpers.php`) to check if the CMS has been installed. This affects:
- `ExtensionServiceProvider`: Skips theme loading if not installed
- `PluginManager::cachePlugins()`: Only caches plugins if installed
- Various routes and middleware that may check installation state

The installation state is stored in the `installed` key in the cache and can be reset during development using `Cache::forget('installed')`.

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
