# AGENTS.md

This file provides coding guidelines and commands for agentic coding agents working on this ExilonCMS project.

## Development Commands

### Build & Test
```bash
# Run all tests
php artisan test

# Run specific test
php artisan test --filter=UserTest

# TypeScript type checking
npm run typecheck

# Format PHP code (MUST run before commit)
./vendor/bin/pint

# Build frontend assets
npm run build
npm run build:installer

# Clear caches
php artisan optimize:clear
```

### Database Commands
```bash
php artisan migrate:fresh --seed
php artisan migrate
php artisan migrate:rollback
```

### Development Workflow
```bash
composer dev
# or manually:
php artisan serve --port=8000
npm run dev
```

## Code Style Guidelines

### PHP (PSR-12)
- Use `./vendor/bin/pint` to auto-format code before committing
- Namespace: `ExilonCMS\` (NOT `App\`)

### TypeScript (Strict Mode)
- Use TypeScript strict mode with noImplicitReturns, noFallthroughCasesInSwitch
- Use path aliases: `@/*` → `resources/js/*`, `@/components/*` → `resources/js/components/*`
- Handle nullable types explicitly
- Use interfaces for all component props

### Import Patterns

**PHP:**
- Use PSR-12 ordered imports (use statements grouped)
- Import from namespaces: `use ExilonCMS\Classes\Plugin\Plugin;`
- Use helper functions from `app/helpers.php` and `app/color_helpers.php`

**TypeScript:**
- Import components using path aliases: `import Button from '@/components/ui/button';`
- Import types from `@/types/`
- Import Ziggy routes: `import { route } from 'ziggy-js'`

### Naming Conventions

**PHP:** Classes: PascalCase, Methods: camelCase, Properties: camelCase, Constants: UPPER_SNAKE_CASE
**TypeScript:** Components: PascalCase, Functions: camelCase, Interfaces: PascalCase

### Error Handling

**PHP:** Always use try-catch for database operations, Log errors with `Log::error()`, Use validation with `Validator::make()`
**TypeScript:** Handle optional properties with `?` and `|`, Use proper type guards

### Database Migrations

**CRITICAL:**
- NEVER use destructive operations: `Schema::dropIfExists()`, `DROP TABLE`, `TRUNCATE`
- ALWAYS check existence before modifying: `Schema::hasTable()`, `Schema::hasColumn()`
- Use additive migrations only

**Safe pattern:**
```php
Schema::table('users', function (Blueprint $table) {
    if (!Schema::hasColumn('users', 'new_column')) {
        $table->string('new_column')->nullable();
    }
});
```

### Inertia.js Integration

- Use Inertia for ALL frontend pages (except root `app.blade.php`)
- Controllers MUST use `Inertia::render()` to return responses
- React pages MUST use `<AuthenticatedLayout>` or `<GuestLayout>` wrappers
- Pass props via `Inertia::render('PageName', ['prop' => $value])`

### File Structure

**PHP:**
- `app/Models/`, `app/Http/Controllers/`, `app/Http/Middleware/`, `app/Providers/`, `app/Games/`

**TypeScript:**
- `resources/js/pages/`, `resources/js/layouts/`, `resources/js/components/`, `resources/js/types/`

### Extension System (Plugins & Themes)

**Lazy Loading Pattern:**
```php
public function boot(): void
{
    if ($this->app->runningInConsole() && isset($_SERVER['argv'])
        && in_array('package:discover', $_SERVER['argv'])) {
        return;
    }

    $this->loader = $this->app->make(PluginLoader::class);
}
```

**Plugin Structure:**
```php
namespace ExilonCMS\Plugins\MyPlugin;

use ExilonCMS\Classes\Plugin\Plugin;
use ExilonCMS\Attributes\PluginMeta;

#[PluginMeta(id: 'my-plugin', name: 'My Plugin', version: '1.0.0', author: 'Your Name')]
class MyPlugin extends Plugin
{
    public function boot(): void { }

    public function getConfigFields(): array
    {
        return [['name' => 'api_key', 'label' => 'API Key', 'type' => 'text']];
    }
}
```

### Code Quality Checks

**Before committing:**
1. Run `./vendor/bin/pint --test` - Check PHP style
2. Run `npm run typecheck` - Check TypeScript types
3. Run tests: `php artisan test`
4. Update `CHANGELOG.md` if applicable

**CI Requirements:**
- All PHP code MUST pass `./vendor/bin/pint --test`
- TypeScript MUST have no type errors
- All tests MUST pass
- Use `ziggy-js` for routes, never vendor imports

## Important Notes

- Use `ziggy-js` npm package for routes, NEVER vendor imports
- Extensions MUST use lazy loading in `boot()` phase
- Always run Pint before committing
- NEVER create Blade views (use React + Inertia)
- Namespace is `ExilonCMS\` not `App\`
- Settings are accessed via `setting('key', 'default')`
- Database must work on PostgreSQL, MySQL, and SQLite
