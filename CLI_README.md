# ExilonCMS CLI

## Installation

### Option 1: Via npm (Recommended)

Once published on npm, you can install globally:

```bash
npm install -g exiloncms
```

For development/testing from the local repo:

```bash
cd /path/to/ExilonCMS
npm link
```

### Option 2: Direct PHP

No installation needed! Just use the PHP script directly:

```bash
php bin/exiloncms new my-site
```

## Usage

### Create a New Project

```bash
exiloncms new <project-name>
```

Example:
```bash
exiloncms new my-awesome-site
```

The CLI will then guide you through interactive questions:

1. **Basic Information**
   - Site name
   - Site URL
   - Language (English/French)
   - Timezone

2. **Database Configuration**
   - Database type (PostgreSQL, MySQL, SQLite)
   - Host, port, credentials (if not SQLite)

3. **Cache & Session**
   - Cache driver (File, Redis, Memcached)
   - Session driver

4. **Admin Account**
   - Admin name, email, password

5. **Theme Selection**
   - Choose from available themes in the marketplace

6. **Plugin Selection**
   - Select multiple plugins from the marketplace

7. **Additional Options**
   - Docker configuration
   - Run migrations
   - Build assets

### Other Commands

```bash
exiloncms version    # Show version
exiloncms help       # Show help
```

## What Gets Created

The CLI will:

1. ✅ Download the latest ExilonCMS release from GitHub
2. ✅ Extract files to your project directory
3. ✅ Configure `.env` with your answers
4. ✅ Install Composer dependencies
5. ✅ Install npm dependencies
6. ✅ Build frontend assets
7. ✅ Run database migrations
8. ✅ Create admin user
9. ✅ Install selected themes and plugins

## Next Steps

After installation:

```bash
cd my-site

# Without Docker
php artisan serve

# With Docker
docker-compose up -d
```

Visit your site at the configured URL (default: http://localhost:8000)

## Requirements

- **PHP**: 8.2 or higher
- **Composer**: 2.x
- **Node.js**: 18.x or higher (for the CLI wrapper, not for the created project)
- **Database**: PostgreSQL 10+, MySQL 8+, or SQLite 3

## Troubleshooting

### PHP not found

Make sure PHP is installed and in your PATH:

**Windows:**
- Download from https://windows.php.net/download/
- Add PHP to your system PATH

**macOS:**
```bash
brew install php
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt install php8.2 php8.2-xml php8.2-zip php8.2-mbstring
```

### Permission denied

If you get a permission error when running `exiloncms`:

```bash
chmod +x bin/exiloncms
```

Or use PHP directly:
```bash
php bin/exiloncms new my-site
```

## Development

To test the CLI locally:

```bash
# From the ExilonCMS repo
npm link

# Now you can use it anywhere
exiloncms new test-project

# When done developing
npm unlink exiloncms
```

## License

MIT - See LICENSE file for details
