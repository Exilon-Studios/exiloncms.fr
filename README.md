<div align="center">

# 🎮 ExilonCMS

**A modern CMS for game servers**

[![Latest Release](https://img.shields.io/github/v/release/Exilon-Studios/ExilonCMS)](https://github.com/Exilon-Studios/ExilonCMS/releases)
[![License](https://img.shields.io/github/license/Exilon-Studios/ExilonCMS)](LICENSE)
[![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?logo=php&logoColor=white)](https://php.net)
[![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?logo=laravel&logoColor=white)](https://laravel.com)

A powerful, modern content management system designed specifically for game servers. Built with Laravel 12, React 19, and Inertia.js.

</div>

---

## ✨ Features

- 🎮 **Multi-game Support** - Minecraft (Java/Bedrock), FiveM, Rust, and more
- 🚀 **Modern Tech Stack** - Laravel 12, React 19, Inertia.js v2, TypeScript, Tailwind CSS v4
- 🎨 **Visual Page Builder** - Drag-and-drop editor with Puck
- 🔐 **Role-based Access** - Complete permission system
- 🌍 **Multi-language** - Built-in translation system (FR/EN)
- 🔌 **Plugin System** - Extensible architecture
- 🎭 **Theme System** - Fully customizable
- 🔄 **Auto-updates** - GitHub-based updates with automatic backups

---

## 📋 Requirements

- **PHP**: 8.2 or higher
- **Composer**: 2.x
- **Node.js**: 20.x or higher
- **Database**: PostgreSQL 10+ or MySQL 8+
- **Web Server**: Apache, Nginx, or Laravel Valet

---

## 🚀 Quick Installation

### Option 1: Using the ExilonCMS CLI (Recommended)

The easiest way to create a new ExilonCMS project is using our CLI tool:

```bash
# Install globally via npm
npm install -g exiloncms

# Create a new project (interactive wizard)
exiloncms new my-site

# The CLI will guide you through:
# ✅ Site configuration (name, URL, language, timezone)
# ✅ Database setup (PostgreSQL, MySQL, SQLite)
# ✅ Admin account creation
# ✅ Theme & plugin selection from marketplace
# ✅ Docker configuration (optional)
```

**Development mode** (from source):
```bash
cd /path/to/ExilonCMS
npm link
exiloncms new my-site
```

**Direct PHP** (no npm needed):
```bash
php bin/exiloncms new my-site
```

### Option 2: Via Composer

```bash
# Create a new project
composer create-project exilon-studios/exiloncms your-site-name

cd your-site-name

# Run interactive installer
php artisan install:interactive
```

### Option 3: Manual Installation

```bash
# Clone the repository
git clone https://github.com/Exilon-Studios/ExilonCMS.git your-site-name
cd your-site-name

# Install PHP dependencies
composer install

# Install frontend dependencies
npm install

# Build frontend
npm run build

# Configure environment
cp .env.example .env
php artisan key:generate

# Edit .env and set database credentials
# DB_DATABASE=exiloncms
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

# Run migrations
php artisan migrate --seed

# Create admin user
php artisan user:create --admin --name="Admin" --email="admin@example.com" --password="password"

# Start development server
php artisan serve
# In another terminal:
npm run dev
```

Visit `http://localhost:8000` to access your site.

---

## 🎯 Development

```bash
# Start Laravel server
php artisan serve

# Start Vite dev server (in another terminal)
npm run dev

# Run tests
composer test

# Code formatting
./vendor/bin/pint

# Clear cache
php artisan optimize:clear
```

---

## 📦 Creating Plugins

```bash
# Create a new plugin
php artisan plugin:create MyPlugin

# Enable a plugin
php artisan plugin:enable MyPlugin

# Disable a plugin
php artisan plugin:disable MyPlugin
```

---

## 🎨 Creating Themes

```bash
# Create a new theme
php artisan theme:create MyTheme
```

---

## 🔄 Updating

ExilonCMS supports automatic updates via GitHub:

1. Go to `/admin/updates` in your admin panel
2. Check for updates
3. Download the update (automatic backup created)
4. Install the update

Or manually:

```bash
git pull origin main
composer install
npm install
npm run build
php artisan migrate --force
php artisan optimize:clear
```

---

## 📚 Documentation

Full documentation is available at: [https://github.com/Exilon-Studios/ExilonCMS/wiki](https://github.com/Exilon-Studios/ExilonCMS/wiki)

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Laravel 12
- **Language**: PHP 8.2+
- **Database**: PostgreSQL / MySQL
- **Queue**: Redis (optional)

### Frontend
- **Framework**: React 19
- **Language**: TypeScript
- **Routing**: Inertia.js v2
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Editor**: Puck (Visual page builder)
- **Rich Text**: Tiptap

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

ExilonCMS is open-sourced software licensed under the [MIT license](LICENSE).

---

## 🙏 Acknowledgments

- [Laravel](https://laravel.com) - The PHP Framework For Web Artisans
- [React](https://react.dev) - The library for web and native user interfaces
- [Inertia.js](https://inertiajs.com) - Build single-page apps without building an API
- [Puck](https://measured.co/puck) - The visual drag-and-drop page builder for React
- [shadcn/ui](https://ui.shadcn.com) - Beautifully designed components
- [Tailwind CSS](https://tailwindcss.com) - A utility-first CSS framework

---

<div align="center">

**Built with ❤️ by Exilon Studios**

[Website](https://exilonstudios.com) • [Documentation](https://github.com/Exilon-Studios/ExilonCMS/wiki) • [Support](https://github.com/Exilon-Studios/ExilonCMS/issues)

</div>
