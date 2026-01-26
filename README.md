<div align="center">

# 🎮 ExilonCMS

**A modern CMS for game servers**

[![Latest Release](https://img.shields.io/github/v/release/Exilon-Studios/exiloncms.fr)](https://github.com/Exilon-Studios/exiloncms.fr/releases)
[![License](https://img.shields.io/github/license/Exilon-Studios/exiloncms.fr)](LICENSE)
[![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?logo=php&logoColor=white)](https://php.net)
[![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?logo=laravel&logoColor=white)](https://laravel.com)

A powerful, modern content management system designed specifically for game servers. Built with Laravel 12, React 19, and Inertia.js.

</div>

---

## ✨ Features

- 🎮 **Multi-game Support** - Minecraft (Java/Bedrock), FiveM, Rust, and more
- 🚀 **Modern Tech Stack** - Laravel 12, React 19, Inertia.js v2, TypeScript, Tailwind CSS v4
- 🎨 **Theme System** - Fully customizable with template-based theming
- 🔐 **Role-based Access** - Complete permission system
- 🌍 **Multi-language** - Built-in translation system (FR/EN)
- 🔌 **Plugin System** - Extensible architecture
- 🔄 **Auto-updates** - GitHub-based updates with automatic backups
- 🛒 **Integrated Shop** - Built-in e-commerce for game server items

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

# Or start individually:
php artisan serve      # Laravel backend
npm run dev            # Vite frontend (with HMR)
```

```bash
# Run tests
composer test

# Code formatting
./vendor/bin/pint

# Clear cache
php artisan optimize:clear
```

---

## 📦 Plugins

ExilonCMS comes with several built-in plugins:

- **Analytics** - Website analytics and statistics
- **Blog** - News and blog system
- **Docs** - Documentation system
- **Legal** - Legal pages (privacy, terms)
- **Notifications** - User notifications
- **Pages** - Custom pages
- **Releases** - Release notes and changelogs
- **Shop** - E-commerce for game items
- **Translations** - Translation management
- **Votes** - Voting system for game servers

```bash
# Plugin management (coming soon)
php artisan plugin:list
php artisan plugin:enable <plugin>
php artisan plugin:disable <plugin>
```

---

## 🎨 Themes

ExilonCMS uses a theme-based system for full customization:

```bash
# Create a new theme (coming soon)
php artisan theme:create MyTheme

# Themes are located in:
resources/themes/
└── my-theme/
    ├── views/           # Blade templates
    ├── css/             # Theme styles
    └── config.json      # Theme configuration
```

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

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Laravel 12
- **Language**: PHP 8.2+
- **Database**: SQLite / PostgreSQL / MySQL

### Frontend
- **Framework**: React 19
- **Language**: TypeScript (strict mode)
- **Routing**: Inertia.js v2
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Rich Text**: Tiptap
- **Forms**: React Hook Form + Zod

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

ExilonCMS is open-sourced software licensed under the [GPL-3.0-or-later](LICENSE).

---

## 🙏 Acknowledgments

- [Laravel](https://laravel.com) - The PHP Framework For Web Artisans
- [React](https://react.dev) - The library for web and native user interfaces
- [Inertia.js](https://inertiajs.com) - Build single-page apps without building an API
- [shadcn/ui](https://ui.shadcn.com) - Beautifully designed components
- [Tailwind CSS](https://tailwindcss.com) - A utility-first CSS framework

---

<div align="center">

**Built with ❤️ by Exilon Studios**

[Website](https://exiloncms.fr) • [Documentation](https://exiloncms.fr/docs) • [Support](https://github.com/Exilon-Studios/exiloncms.fr/issues)

</div>
