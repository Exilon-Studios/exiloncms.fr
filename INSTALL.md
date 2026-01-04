# ExilonCMS Installation Guide

Complete installation guide for ExilonCMS.

## Table of Contents

- [Requirements](#requirements)
- [Installation Methods](#installation-methods)
  - [Method 1: ExilonCMS CLI (Recommended)](#method-1-exiloncms-cli-recommended)
  - [Method 2: Composer](#method-2-composer)
  - [Method 3: Manual Installation](#method-3-manual-installation)
  - [Method 4: Docker](#method-4-docker)
- [Post-Installation](#post-installation)
- [Web Server Configuration](#web-server-configuration)
- [Troubleshooting](#troubleshooting)

---

## Requirements

### Server Requirements

- **PHP**: 8.2 or higher
- **Composer**: 2.x
- **Node.js**: 20.x or higher
- **NPM**: 10.x or higher

### Database Requirements

One of:
- **PostgreSQL**: 10 or higher
- **MySQL**: 8.0 or higher
- **MariaDB**: 10.3 or higher

### PHP Extensions

- BCMath
- Ctype
- cURL
- DOM
- Fileinfo
- JSON
- Mbstring
- OpenSSL
- PCRE
- PDO
- Tokenizer
- XML
- Mbstring
- GD (for image manipulation)

### Optional (Recommended)

- Redis (for caching and queues)
- Supervisor (for queue workers)

---

## Installation Methods

### Method 1: ExilonCMS CLI (Recommended)

The easiest way to get started with ExilonCMS is using our interactive CLI tool.

#### Installation

```bash
# Install the CLI globally
npm install -g exiloncms
```

For development/testing from source:

```bash
cd /path/to/ExilonCMS
npm link
```

Or use PHP directly (no npm required):

```bash
# The CLI is included in the repository
php bin/exiloncms new my-site
```

#### Creating a New Project

```bash
# Interactive wizard - guides you through all options
exiloncms new my-site

# Or specify the project name directly
exiloncms new blog --theme=default
```

The interactive CLI will guide you through:

1. **Basic Information**
   - Site name, URL, language, timezone

2. **Database Configuration**
   - Database type (PostgreSQL, MySQL, SQLite)
   - Connection details

3. **Cache & Session**
   - Cache driver (File, Redis, Memcached)
   - Session driver

4. **Admin Account**
   - Name, email, password

5. **Theme Selection**
   - Browse and select from marketplace themes

6. **Plugin Selection**
   - Choose multiple plugins from marketplace

7. **Additional Options**
   - Docker configuration
   - Run migrations
   - Build assets

The CLI automatically:
- ✅ Downloads the latest ExilonCMS release
- ✅ Configures your `.env` file
- ✅ Installs all dependencies
- ✅ Builds frontend assets
- ✅ Runs database migrations
- ✅ Creates your admin account
- ✅ Installs selected themes and plugins

---

### Method 2: Composer

This is the traditional way to create a new project.

```bash
# 1. Create a new project
composer create-project exilon-studios/exiloncms your-site-name

# 2. Navigate to the project directory
cd your-site-name

# 3. Run the interactive installer
php artisan install:interactive

# Or manually:
npm install
npm run build
cp .env.example .env
php artisan key:generate

# Configure your database in .env
# DB_DATABASE=your_database_name
# DB_USERNAME=your_database_username
# DB_PASSWORD=your_database_password

# 4. Run migrations and seeders
php artisan migrate --seed

# 5. Create admin user
php artisan user:create --admin --name="Admin" --email="admin@example.com" --password="your_secure_password"

# 6. Start the development server
php artisan serve
```

Visit `http://localhost:8000` to access your site!

---

### Method 3: Manual Installation

#### Step 1: Clone the Repository

```bash
git clone https://github.com/Exilon-Studios/ExilonCMS.git your-site-name
cd your-site-name
```

#### Step 2: Install PHP Dependencies

```bash
composer install --no-interaction
```

#### Step 3: Install Frontend Dependencies

```bash
npm install
```

#### Step 4: Build Frontend Assets

```bash
npm run build
```

#### Step 5: Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

Edit your `.env` file and configure your database:

```env
APP_NAME="Your Site Name"
APP_ENV=production
APP_KEY=base64:generated_key
APP_DEBUG=false
APP_URL=https://your-domain.com

# Database Configuration
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=exiloncms
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

#### Step 6: Run Migrations

```bash
php artisan migrate --seed
```

#### Step 7: Create Admin User

```bash
php artisan user:create --admin --name="Admin" --email="admin@example.com" --password="secure_password"
```

#### Step 8: Set Permissions

```bash
# Storage and cache directories
chmod -R 775 storage bootstrap/cache

# On some systems, you may need:
chmod -R 777 storage bootstrap/cache
```

#### Step 9: Start Server (Development)

```bash
php artisan serve
```

---

### Method 4: Docker

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Build and start containers
docker-compose up -d

# 3. Run migrations
docker-compose exec app php artisan migrate --seed

# 4. Create admin user
docker-compose exec app php artisan user:create --admin --name="Admin" --email="admin@example.com" --password="password"
```

Access your site at `http://localhost:8000`.

---

## Post-Installation

### 1. Configure GitHub Updates (Optional)

If you want automatic updates from GitHub, add to your `.env`:

```env
GITHUB_UPDATES_ENABLED=true
GITHUB_REPO_OWNER=Exilon-Studios
GITHUB_REPO_NAME=ExilonCMS
# GITHUB_TOKEN=your_github_token # Optional, for higher rate limits
```

### 2. Configure Mail (Optional)

Edit your `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@your-domain.com"
MAIL_FROM_NAME="${APP_NAME}"
```

### 3. Optimize for Production

```bash
# Cache configuration
php artisan config:cache

# Cache routes
php artisan route:cache

# Cache views
php artisan view:cache

# Optimize autoloader
composer install --optimize-autoloader --no-dev
```

---

## Web Server Configuration

### Apache

Create a `.htaccess` file (already included):

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

Or point your VirtualHost to the `public` directory:

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /path/to/exiloncms/public

    <Directory /path/to/exiloncms/public>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

### Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/exiloncms/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

---

## Troubleshooting

### Issue: "Class 'ExilonCMS\ExilonCMS' not found"

**Solution:**
```bash
composer dump-autoload
php artisan optimize:clear
```

### Issue: "SQLSTATE[HY000] [2002] Connection refused"

**Solution:** Make sure your database server is running and credentials in `.env` are correct.

### Issue: "404 on all pages"

**Solution:**
```bash
php artisan optimize:clear
php artisan route:clear
php artisan config:clear
```

### Issue: Assets not loading (404)

**Solution:**
```bash
npm run build
php artisan view:clear
```

### Issue: Permissions error

**Solution:**
```bash
# Linux/Mac
sudo chown -R www-data:www-data storage bootstrap/cache

# Windows (IIS)
# Give IIS_IUSRS modify permissions to storage and bootstrap/cache folders
```

### Issue: "No application encryption key"

**Solution:**
```bash
php artisan key:generate
```

---

## Updating ExilonCMS

### Automatic Update (Recommended)

1. Go to `/admin/updates` in your admin panel
2. Click "Check for updates"
3. If an update is available, click "Download"
4. After download, click "Install"

### Manual Update

```bash
# Backup first!
cp .env .env.backup
mysqldump -u username -p database_name > backup.sql

# Pull latest changes
git pull origin main

# Update dependencies
composer install
npm install
npm run build

# Run migrations
php artisan migrate --force

# Clear cache
php artisan optimize:clear
```

---

## Getting Help

- **Documentation**: [https://github.com/Exilon-Studios/ExilonCMS/wiki](https://github.com/Exilon-Studios/ExilonCMS/wiki)
- **Issues**: [https://github.com/Exilon-Studios/ExilonCMS/issues](https://github.com/Exilon-Studios/ExilonCMS/issues)
- **Discussions**: [https://github.com/Exilon-Studios/ExilonCMS/discussions](https://github.com/Exilon-Studios/ExilonCMS/discussions)

---

## Next Steps

- Configure your site settings in `/admin/settings`
- Create pages with the visual page builder
- Install plugins from the marketplace
- Customize your theme
- Set up your game server connections

---

**Enjoy using ExilonCMS! 🎉**
