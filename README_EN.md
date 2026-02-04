<div align="center">

# 🚀 ExilonCMS

**A modern, extensible CMS for communities and businesses**

[![Latest Release](https://img.shields.io/github/v/release/Exilon-Studios/exiloncms.fr)](https://github.com/Exilon-Studios/exiloncms.fr/releases)
[![License](https://img.shields.io/github/license/Exilon-Studios/exiloncms.fr)](LICENSE)
[![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?logo=php&logoColor=white)](https://php.net)
[![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?logo=laravel&logoColor=white)](https://laravel.com)

A powerful, modern content management system built for communities, businesses, and creators. Featuring an extensible plugin architecture, dynamic theming, and a developer-friendly API.

</div>

---

## ✨ Features

- 🎨 **Dynamic Theme System** - Theme page overrides allow complete customization of any page
- 🔌 **Extensible Plugin Architecture** - Add features with modular plugins
- 🚀 **Modern Tech Stack** - Laravel 12, React 19, Inertia.js v2, TypeScript, Tailwind CSS v3.4
- 🎯 **Developer-Friendly** - Clear API, CLI tools, and comprehensive documentation
- 🌍 **Multi-language Support** - Built-in translation system
- 🔐 **Role-based Access Control** - Granular permissions and user management
- 🔄 **Automatic Updates** - Seamless updates from GitHub with automatic backups
- 📦 **Extension Marketplace** - Browse and install extensions from [exiloncms.fr/marketplace](https://exiloncms.fr/marketplace)
- 📱 **Responsive Design** - Beautiful, mobile-first interface out of the box

### Use Cases

ExilonCMS is designed for:
- **Communities** - Gaming servers, forums, social platforms
- **Businesses** - Corporate sites, portfolios, product showcases
- **E-commerce** - Online stores with integrated payment gateways
- **Content Creators** - Blogs, news sites, documentation platforms
- **Organizations** - Non-profits, educational institutions, clubs

---

## 📋 Requirements

- **PHP**: 8.2 or higher
- **Database**: SQLite 3.8+ (included), PostgreSQL 10+, or MySQL 8+
- **Web Server**: Apache, Nginx, or Laravel Valet
- **Extensions**: curl, fileinfo, json, mbstring, openssl, pdo, zip, bcmath

---

## 🚀 Installation

### Option 1: Standalone Web Installer (Recommended)

The easiest way to install ExilonCMS with an interactive web interface:

```bash
# Download the installer
wget https://github.com/Exilon-Studios/exiloncms.fr/releases/latest/download/exiloncms-installer.zip

# Extract it
unzip exiloncms-installer.zip

# Start the PHP server
php -S localhost:8000

# Open http://localhost:8000 in your browser
# The installer will:
# ✅ Download the latest CMS automatically
# ✅ Guide you through database setup
# ✅ Create your admin account
# ✅ Configure your site settings
```

### Option 2: Manual Installation

Download the full CMS package and set it up manually:

```bash
# Download from GitHub Releases
wget https://github.com/Exilon-Studios/exiloncms.fr/releases/latest/download/exiloncms.zip

# Extract
unzip exiloncms.zip
cd exiloncms

# Install dependencies
composer install

# Configure environment
cp .env.example .env
php artisan key:generate

# Edit .env and set your database (SQLite by default)
# DB_DATABASE=database/database.sqlite

# Run migrations
php artisan migrate --seed

# Create admin user
php artisan user:create --admin --name="Admin" --email="admin@example.com" --password="password"

# Start development server
php artisan serve
```

Visit `http://localhost:8000` to access your site.

---

## 🎯 Development

```bash
# Start all services (Laravel + Queue + Vite)
composer dev

# Windows (without logs)
composer dev-windows

# Or start individually:
php artisan serve      # Laravel backend
npm run dev            # Vite frontend (with HMR)
```

```bash
# Run tests
composer test

# Code formatting (required before committing)
./vendor/bin/pint

# Clear cache
php artisan optimize:clear

# Type checking
npm run typecheck
```

---

## 📦 Extensibility

### Plugin System

ExilonCMS comes with several built-in plugins:

- **Analytics** - Website analytics and statistics tracking
- **Blog** - News, articles, and blog system
- **Docs** - Documentation system with categories
- **Legal** - Legal pages (privacy policy, terms of service)
- **Notifications** - User notification system
- **Pages** - Custom page management
- **Releases** - Release notes and changelogs
- **Shop** - E-commerce with payment gateway support
- **Translations** - Translation management interface
- **Votes** - Voting and polling system

```bash
# Plugin management
php artisan plugin:list
php artisan plugin:install <plugin>
php artisan plugin:uninstall <plugin>
```

### Creating Plugins

```bash
# Create a new plugin
php artisan make:plugin MyPlugin

# Plugin structure:
plugins/
└── my-plugin/
    ├── plugin.json              # Plugin metadata
    ├── composer.json            # Dependencies
    ├── src/
    │   └── MyPluginServiceProvider.php
    ├── routes/
    │   ├── web.php              # Public routes
    │   └── admin.php            # Admin routes
    ├── database/
    │   └── migrations/          # Plugin migrations
    └── resources/
        └── js/
            └── pages/           # React pages
```

### Theme System

ExilonCMS features a powerful theme override system:

```bash
# Create a new theme
php artisan theme:create MyTheme

# Theme structure:
themes/
└── my-theme/
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

---

## 🔄 Updating

ExilonCMS supports automatic updates via GitHub:

1. Go to `/admin/updates` in your admin panel
2. Check for available updates
3. Download the update (automatic backup created)
4. Install and apply

Or manually:

```bash
git pull origin main
composer install
npm run build
php artisan migrate --force
php artisan optimize:clear
```

---

## 📚 Documentation

Full documentation is available at: [https://exiloncms.fr/docs](https://exiloncms.fr/docs)

### Documentation Areas

- **Getting Started** - Installation and basic setup
- **Plugin Development** - Creating custom plugins
- **Theme Development** - Building custom themes
- **API Reference** - REST API and hooks
- **Configuration** - System settings and options

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Laravel 12
- **Language**: PHP 8.2+
- **Database**: SQLite / PostgreSQL / MySQL
- **Architecture**: Service-oriented with dependency injection

### Frontend
- **Framework**: React 19
- **Language**: TypeScript (strict mode)
- **Routing**: Inertia.js v2 (SPA without API)
- **Styling**: Tailwind CSS v3.4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Rich Text**: Tiptap editor
- **Forms**: React Hook Form + Zod validation
- **Build Tool**: Vite 7

---

## 🤝 Contributing

Contributions are welcome! We accept contributions for:
- Bug fixes and improvements
- New plugins and themes
- Documentation improvements
- Performance optimizations

Please see our contributing guidelines for more details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Run `./vendor/bin/pint` before committing (required in CI)
- Follow PSR-12 coding standards
- Add tests for new features
- Update documentation as needed

---

## 🌐 Community

- **Website**: [https://exiloncms.fr](https://exiloncms.fr)
- **Documentation**: [https://exiloncms.fr/docs](https://exiloncms.fr/docs)
- **Extension Marketplace**: [https://exiloncms.fr/marketplace](https://exiloncms.fr/marketplace)
- **GitHub Issues**: [Bug reports and feature requests](https://github.com/Exilon-Studios/exiloncms.fr/issues)
- **Discussions**: [Community discussions](https://github.com/Exilon-Studios/exiloncms.fr/discussions)

---

## 📄 License

ExilonCMS is open-sourced software licensed under the [GPL-3.0-or-later](LICENSE).

This means:
- ✅ Free to use for personal and commercial projects
- ✅ Free to modify and extend
- ✅ Free to distribute (with source code)
- ❌ Cannot close-source derivative works

See [LICENSE](LICENSE) for the full text.

---

## 🙏 Acknowledgments

Built with inspiration from:
- [Laravel](https://laravel.com) - The PHP Framework For Web Artisans
- [React](https://react.dev) - The library for web and native user interfaces
- [Inertia.js](https://inertiajs.com) - Build single-page apps without building an API
- [shadcn/ui](https://ui.shadcn.com) - Beautifully designed components
- [Tailwind CSS](https://tailwindcss.com) - A utility-first CSS framework
- [Azuriom](https://azuriom.com) - Game server CMS inspiration
- [Paymenter](https://paymenter.org) - Billing platform inspiration

---

<div align="center">

**Built with ❤️ by Exilon Studios**

[Website](https://exiloncms.fr) • [Documentation](https://exiloncms.fr/docs) • [Marketplace](https://exiloncms.fr/marketplace)

</div>
