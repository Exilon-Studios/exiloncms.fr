# Contributing to ExilonCMS

Thank you for your interest in contributing to ExilonCMS! This document provides guidelines and information for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description** of the problem
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- **Environment details** (OS, PHP version, Node version, CMS version)
- **Relevant logs** from `storage/logs/laravel.log`
- **Screenshots** if applicable

### Suggesting Enhancements

Enhancement suggestions are welcome! Please:

- Use a clear and descriptive title
- Provide a detailed explanation of the feature
- Explain why this enhancement would be useful
- Include examples or mockups if applicable

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Follow the code style** (run `composer pint` and `npm run typecheck`)
5. **Write tests** if applicable (`php artisan test`)
6. **Commit your changes** (use conventional commits)
7. **Push to the branch** (`git push origin feature/amazing-feature`)
8. **Open a Pull Request**

### Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/ExilonCMS.git
cd ExilonCMS

# Add upstream remote
git remote add upstream https://github.com/Exilon-Studios/ExilonCMS.git

# Install PHP dependencies
composer install

# Install Node dependencies
npm install

# Create .env file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate:fresh --seed

# Build frontend assets
npm run build

# Start development server
composer dev
```

### Code Style

- **PHP**: Follow [PSR-12](https://www.php-fig.org/psr/psr-12/) coding standard
- **JavaScript/TypeScript**: Follow ESLint rules
- **Run Laravel Pint** before committing: `composer pint`
- **Run type checks**: `npm run typecheck`
- **Write meaningful commit messages**

### Commit Message Format

We follow conventional commits:

```
feat: add new plugin marketplace integration
fix: correct permission check in admin panel
docs: update README with installation instructions
refactor: simplify plugin loading logic
test: add tests for user authentication
chore: update dependencies
```

## Project Structure

```
.
├── app/                      # Laravel application code
│   ├── Console/             # Artisan commands
│   ├── Extensions/          # Custom extensions (UpdateManager, Plugin, Theme)
│   ├── Games/               # Game server integrations
│   ├── Http/                # Controllers, middleware, requests
│   ├── Models/              # Eloquent models
│   ├── Policies/            # Authorization policies
│   └── Providers/           # Service providers
├── plugins/                 # Plugin system
│   ├── analytics/           # Analytics plugin
│   ├── blog/                # Blog plugin
│   ├── shop/                # Shop plugin
│   └── ...
├── resources/               # Frontend resources
│   ├── css/                 # Tailwind CSS
│   ├── js/                  # React + TypeScript
│   └── views/               # Blade templates (minimal)
├── routes/                  # Route definitions
│   ├── api.php              # API routes
│   ├── admin.php            # Admin routes
│   ├── console.php          # Console routes
│   ├── install.php          # Installation routes
│   └── web.php              # Web routes
├── database/                # Database migrations and seeders
├── tests/                   # PHPUnit tests
└── .github/workflows/       # CI/CD workflows
```

## Adding Features

When adding new features:

1. **Create an issue** to discuss the feature first
2. **Follow the existing patterns** in the codebase
3. **Use Inertia.js** for all frontend pages (no Blade views except root)
4. **Add TypeScript types** for all React components
5. **Write tests** if applicable
6. **Update documentation** (README, help text)
7. **Run linter and type checker** before submitting

## Plugin Development

ExilonCMS has a powerful plugin system. To create a new plugin:

```bash
# Use the CLI (recommended)
npm install -g @exilonstudios/cli
exiloncms new plugin my-plugin

# Or manually
mkdir -p plugins/my-plugin/src
cd plugins/my-plugin
```

**Plugin structure:**
```
plugins/my-plugin/
├── plugin.json           # Plugin metadata
├── composer.json         # Autoloading configuration
├── src/
│   ├── Models/          # Plugin models
│   ├── Http/            # Controllers and requests
│   ├── Providers/       # Plugin service provider
│   └── routes/          # Plugin routes
└── resources/           # Frontend assets
```

**Plugin manifest (plugin.json):**
```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "My awesome plugin",
  "author": "Your Name",
  "url": "https://github.com/your/repo",
  "namespace": "ExilonCMS\\Plugins\\MyPlugin",
  "enabled": true
}
```

## Theme Development

To create a new theme:

```bash
# Use the CLI
exiloncms new theme my-theme

# Or manually
mkdir -p themes/my-theme
cd themes/my-theme
```

**Theme structure:**
```
themes/my-theme/
├── theme.json            # Theme metadata
├── screenshot.png        # Theme preview
├── views/                # Theme views
├── assets/               # CSS, JS, images
└── config.php            # Theme configuration
```

## Testing

```bash
# Run all tests
php artisan test
# or
composer test

# Run specific test
php artisan test --filter=UserTest

# Run with coverage
php artisan test --coverage

# Laravel Pint (code style)
composer pint

# TypeScript type checking
npm run typecheck

# ESLint
npm run lint
```

## Development Workflow

### Frontend Development

```bash
# Terminal 1 - Laravel backend
php artisan serve --port=8000

# Terminal 2 - Vite frontend with HMR
npm run dev

# Or use composer dev to run both
composer dev
```

### Backend Development

```bash
# Clear all caches
php artisan optimize:clear

# Clear specific cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Generate IDE helper files
php artisan ide-helper:generate
php artisan ide-helper:models
```

### Database

```bash
# Fresh migration with seeding
php artisan migrate:fresh --seed

# Create a new migration
php artisan make:migration create_table_name

# Rollback last migration
php artisan migrate:rollback

# Show migration status
php artisan migrate:status
```

## Important Notes

1. **Never create Blade views** - Use React + Inertia only (except root `app.blade.php`)
2. **All routes return Inertia responses** - Controllers use `Inertia::render()`
3. **TypeScript is strict** - Handle all edge cases, nullable types
4. **Namespace is ExilonCMS\\** - Not App\\
5. **Database agnostic** - Migrations must work on PostgreSQL and MySQL
6. **No direct API calls** - Use Inertia for data flow between Laravel and React
7. **Flash messages** - Use session flash for success/error messages

## Architecture

### Inertia.js Integration

All frontend pages use Inertia.js - there are NO Blade views except `resources/views/app.blade.php` (the root wrapper).

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

### Plugin System

ExilonCMS uses a modular plugin system:

- **Plugin discovery** via `plugin.json` manifest files
- **Service Providers** for plugin bootstrapping
- **PSR-4 autoloading** for plugin classes
- **Plugin lifecycle hooks**: install, activate, deactivate, uninstall

### Theme System

Themes control the visual appearance:

- **JSON manifest** (`theme.json`) for metadata
- **Template inheritance** from default theme
- **Asset compilation** with Vite
- **Theme settings** stored in database

## Security

- **Never commit secrets** (API keys, passwords)
- **Use environment variables** for sensitive data
- **Follow Laravel security best practices**
- **Report security vulnerabilities** privately
- **Use prepared statements** (Eloquent handles this)
- **Validate all user input**
- **Use CSRF protection** (built into Laravel)

## Questions?

Feel free to open an issue or ask in discussions!

## License

By contributing, you agree that your contributions will be licensed under the **GNU General Public License v3.0 or later**.

## Resources

- [Documentation](https://exiloncms.fr/docs)
- [Laravel Documentation](https://laravel.com/docs)
- [Inertia.js Documentation](https://inertiajs.com)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)

Thank you for contributing to ExilonCMS! 🚀
