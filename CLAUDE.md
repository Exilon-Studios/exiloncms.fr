# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**MC-CMS V2** is a modern content management system for Minecraft and game servers, built with Laravel 12 (PHP 8.2+) and React 19 + TypeScript. The project uses Inertia.js v2 for seamless SPA-like experiences without writing an API.

**Stack:**
- Backend: Laravel 12, PHP 8.2+, PostgreSQL (recommended) or MySQL
- Frontend: React 19, TypeScript (strict mode), Inertia.js v2
- UI: Tailwind CSS v4, shadcn/ui components
- Build: Vite 7 with HMR
- Visual Editor: Puck drag-and-drop page builder

**Namespace:** `MCCMS\` (not `App\`)

**High-Level Architecture:**
- **Monorepo-style structure** with plugins and themes as self-contained modules
- **Inertia.js** as the bridge between Laravel backend and React frontend (no API routes)
- **Puck Editor** for visual page building with reusable React components
- **Role-based permissions** with gates and policies for authorization
- **Game integration** layer supporting Minecraft (Java/Bedrock) and Steam games

## Development Commands

### Setup
```bash
# Initial setup (first time)
composer install
php artisan key:generate
php artisan migrate:fresh --seed
php artisan user:create --admin --name="Admin" --email="admin@example.com" --password="password"
npm install
npm run build

# Or use composer script
composer setup

# Create Puck editor permission
php artisan db:seed --class=PuckPermissionSeeder
```

### Development Workflow
```bash
# Start all dev servers (concurrent: Laravel, Queue, Logs, Vite)
composer dev

# Or manually:
# Terminal 1 - Laravel backend
php artisan serve --port=8002

# Terminal 2 - Vite frontend with HMR
npm run dev
```

### Testing & Quality
```bash
# Run PHPUnit tests
composer test
# or
php artisan test

# Run specific test
php artisan test --filter=UserTest

# Clear all caches
php artisan optimize:clear

# Linting (if configured)
php artisan pint
```

### Database
```bash
# Fresh migration with seeding
php artisan migrate:fresh --seed

# Just migrate
php artisan migrate

# Docker setup
docker-compose up -d

# Connect to PostgreSQL database
docker exec -it mccms_v2_db psql -U mccms -d mccms_v2
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

- `auth.user`: Current authenticated user (id, name, email, role, money)
- `flash`: Flash messages (success, error, info, warning)

Access in React:
```tsx
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

const { auth, flash } = usePage<PageProps>().props;
```

### 3. Plugin System

Plugins live in `plugins/{plugin-name}/` directory.

**Structure:**
```
plugins/shop/
├── plugin.json              # Metadata & dependencies
├── src/
│   ├── Http/Controllers/
│   ├── Models/
│   └── Providers/
│       └── ShopServiceProvider.php
├── resources/
│   └── js/
│       └── pages/           # React pages for plugin
│           └── Index.tsx
├── database/
│   └── migrations/
└── routes/
    └── web.php
```

**Plugin Service Provider:**
```php
namespace MCCMS\Plugin\Shop\Providers;

use MCCMS\Extensions\Plugin\BasePluginServiceProvider;

class ShopServiceProvider extends BasePluginServiceProvider
{
    public function boot()
    {
        $this->loadViews();
        $this->loadTranslations();
        $this->loadMigrations();

        // Register admin routes
        $this->registerAdminRoutes(function () {
            Route::get('/shop', [ShopController::class, 'index']);
        });
    }
}
```

Plugins are loaded via `app/Providers/ExtensionServiceProvider.php` and managed by `PluginManager`.

### 4. Theme System

Themes live in `themes/{theme-name}/` directory. Themes can extend layouts and customize views. Managed by `ThemeManager` in `app/Extensions/Theme/`.

### 5. Game Integration

MC-CMS supports multiple game servers:
- Minecraft (Java & Bedrock editions)
- Steam games (Rust, FiveM, etc.)

**Game implementations:**
- `app/Games/Game.php` - Base game interface
- `app/Games/Minecraft/` - Minecraft-specific implementations
- `app/Games/Steam/` - Steam-based games

**Server bridges:** Handle server communication (RCON, Query, Ping, AzLink).

### 6. Roles & Permissions

**Models:**
- `User` (MCCMS\Models\User)
- `Role` (MCCMS\Models\Role)
- `Permission` (MCCMS\Models\Permission)

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

### 7. File Structure

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

### 8. TypeScript Configuration

TypeScript uses **strict mode** with:
- `noUnusedLocals`, `noUnusedParameters`
- `noImplicitReturns`, `noFallthroughCasesInSwitch`
- `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`

**Path aliases:**
```typescript
import Button from '@/components/ui/button';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
```

### 9. Database & Models

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

### 10. Settings System

Settings are stored in the `settings` table and accessed via helper:

```php
setting('site_name', 'MC-CMS'); // With default
setting('site_name'); // Without default
```

Common settings: `name`, `description`, `locale`, `timezone`, `money` (currency name).

### 11. Puck Visual Editor

MC-CMS includes **Puck Editor** - a drag-and-drop visual page builder.

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

### 12. Frontend Libraries

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

## Important Notes

1. **Never create Blade views** - Use React + Inertia only (except root `app.blade.php`)
2. **All routes return Inertia responses** - Controllers use `Inertia::render()`
3. **TypeScript is strict** - Handle all edge cases, nullable types
4. **Namespace is MCCMS\\** - Not App\\
5. **Database agnostic** - Migrations must work on PostgreSQL and MySQL
6. **Plugins are modular** - Each plugin is self-contained with its own routes, controllers, models, migrations, and React pages
7. **No direct API calls** - Use Inertia for data flow between Laravel and React
8. **Flash messages** - Use session flash for success/error messages, accessed via `usePage().props.flash`
9. **Helper functions** - Available globally via `app/helpers.php` and `app/color_helpers.php` (auto-loaded in composer.json)
10. **Tailwind CSS v4** - Uses the new v4 syntax with `@import` instead of `@tailwind` directives

## Common Patterns

### Creating a new admin page

1. **Route** (`routes/admin.php`):
```php
Route::get('/example', [ExampleController::class, 'index'])->name('example.index');
```

2. **Controller**:
```php
namespace MCCMS\Http\Controllers\Admin;

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
docker exec -it mccms_v2_db psql -U mccms -d mccms_v2 -c "\dt"

# MySQL (Docker)
docker exec -it mccms_db mysql -u root -p -e "SHOW TABLES;"
```

## Troubleshooting

- **Inertia version mismatch**: Clear cache with `php artisan optimize:clear`
- **TypeScript errors**: Check `tsconfig.json` paths match file structure
- **Vite not found**: Run `npm install` and ensure `node_modules` exists
- **Database connection failed**: Verify `.env` DB credentials and that DB server is running
- **500 error on Inertia pages**: Check `storage/logs/laravel.log` for details
- **PostgreSQL connection refused**: Ensure Docker is running (`docker-compose up -d`)
- **Puck permission missing**: Run `php artisan db:seed --class=PuckPermissionSeeder`
- **CSS not building**: Ensure Tailwind v4 syntax uses `@import "tailwindcss";` not `@tailwind` directives
- **Composer autoload issues**: Run `composer dump-autoload`
