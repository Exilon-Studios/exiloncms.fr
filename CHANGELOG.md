# Changelog

All notable changes to ExilonCMS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.20] - 2026-01-29

### Fixed
- **Critical**: Fixed migrations not running automatically during installation
- Database file now created AFTER CMS extraction (not before) to ensure correct location
- Migrations now use proc_open() instead of exec() for better error handling and compatibility
- Added verification that migrations actually created required tables (navbar_elements check)
- Migrations now fail-fast with detailed error messages if they don't complete successfully
- Fixed database file permissions (0666) to ensure PHP can write to SQLite database
- Removed @ error suppression - all migration errors are now properly logged and reported

---

## [1.3.19] - 2026-01-29

### Fixed
- **Critical**: Fixed ZIP file name pattern matching to support 'v' prefix
- Installer now correctly identifies exiloncms-vX.Y.Z.zip files
- Fixes 'No CMS zip file found in release assets' error
- Both naming conventions now supported (with and without 'v' prefix)

---

## [1.3.18] - 2026-01-29

### Fixed
- **Critical**: Installer now downloads full CMS package instead of update package
- Changed ZIP selection to match exiloncms-x.y.z.zip pattern (full package with vendor/)
- Prevents "vendor/ directory missing" error during installation
- Installer now correctly identifies and downloads the complete CMS package

---

## [1.3.17] - 2026-01-29

### Fixed
- **Critical**: Removed slow composer install step from installer
- CMS ZIP already includes vendor/ directory (built by CI)
- Installation now completes in seconds instead of minutes
- Installer simply verifies vendor/ exists instead of running composer
- Much faster and more reliable installation process

---

## [1.3.16] - 2026-01-29

### Fixed
- **Critical**: Installer now runs composer install automatically after CMS extraction
- This ensures vendor/ directory exists before running Laravel migrations
- Prevents HTTP 500 errors when accessing /wizard after installation
- Installer now fully prepares CMS for immediate use without manual commands
- Combined all previous v1.3.15 fixes (index.php bootstrap, installed.json location)

---

## [1.3.15] - 2026-01-29

### Fixed
- **Critical**: Fixed installer and CMS index.php files for all server configurations
- Standalone installer now creates correct Laravel bootstrap in both index.php and public/index.php after extraction
- Release workflow now copies public/index.php to root index.php for servers where DocumentRoot is not public/
- This fixes issues where servers (like Plesk) use the root directory as DocumentRoot instead of public/
- Both standalone installer and full CMS ZIP now work correctly on all server configurations

---

## [1.3.14] - 2026-01-28

### Fixed
- **Critical**: Fixed redirect loop - installer now creates installed.json marker BEFORE extracting CMS
- This prevents middleware from redirecting back to installer during CMS extraction
- installed.json marker is created at the start of extraction to signal "installation in progress"
- Users can now complete installation without being stuck in redirect loop

---

## [1.3.13] - 2026-01-28

### Fixed
- **Critical**: Fixed standalone installer - now includes install.php to prevent being overwritten by CMS extraction
- Installer ZIP now contains BOTH index.php and install.php - use install.php to run installer
- CMS extraction no longer overwrites the installer file
- Updated GitHub workflow to create install.php copy during ZIP creation
- Users should now access installer via /install.php instead of /index.php

---

## [1.3.12] - 2026-01-28

### Fixed
- **Critical**: Fixed standalone installer - now uses /installer endpoint instead of /wizard to avoid conflicts
- Standalone installer API endpoint changed from /wizard?execute=php to /installer?execute=php
- Added /installer and /installer/* to RedirectIfNotInstalled exceptions
- Installer now properly redirects to /wizard after extraction completes

---

## [1.3.11] - 2026-01-28

### Fixed
- **Critical**: Complete rewrite of install wizard middleware logic to prevent redirect loops
- RedirectIfNotInstalled now prioritizes install/wizard path checking BEFORE installation status
- InstallController middleware simplified to avoid conflicts with global middleware
- Routes now work correctly: /install shows welcome, /wizard shows database config
- Added saveModeWeb and saveExtensionsWeb to middleware exclusions

---

## [1.3.10] - 2026-01-28

### Fixed
- **Critical**: Fixed install wizard routing - /install now shows welcome page with PHP checks
- /wizard now correctly shows database configuration page
- InstallIndex component now redirects to /wizard (database) instead of non-existent /install/plugins
- RedirectIfNotInstalled now redirects to /install (not /wizard) when CMS not installed

---

## [1.3.9] - 2026-01-28

### Fixed
- **Critical**: Fixed infinite redirect loop on install wizard pages (/wizard)
- RedirectIfNotInstalled now checks if already on install page to prevent self-redirect
- InstallController middleware improved to use route names instead of path patterns
- showCompleteWeb excluded from redirect check to avoid loop after installation

---

## [1.3.8] - 2026-01-27

### Added
- **Update ZIP** - GitHub releases now include 3 ZIP files:
  - `exiloncms-x.y.z.zip` - Full package (complete installation)
  - `exiloncms-installer-x.y.z.zip` - Standalone web installer
  - `exiloncms-update-x.y.z.zip` - Lightweight update package (code only, no data/storage/plugins/themes)
- UpdateManager now prioritizes update package for automatic updates (faster downloads)

### Fixed
- Automatic update system now properly runs composer install, npm install, npm build, and migrations
- Update package excludes: storage/, vendor/, node_modules/, plugins/, themes/, .env to preserve user data

---


## [1.3.7] - 2026-01-27

### Fixed
- **Critical**: Fixed automatic update system - now properly extracts ZIP files and runs post-install scripts
- Fixed extract() method - creates directory before extraction and validates extraction result
- Fixed copyUpdateFiles() - added error handling for empty directories and logging
- Improved runPostInstall() - now runs composer install, npm install, npm build, and migrations with proper timeouts
- Improved runCommand() - uses proc_open with timeout support instead of exec()
- Added comprehensive logging for debugging update process

---

## [1.3.6] - 2026-01-27

### Fixed
- **Critical**: Fixed "PluginInstalled model not found" error - removed legacy PluginManagerController and updated routes to use PluginController
- **Critical**: Fixed ThemeController type errors - methods now accept `string|int` for themeId to support both file-based and database themes
- Fixed duplicate themes appearing in admin list - database themes now filtered out if file-based theme with same slug exists
- Removed "Active Theme" section from bottom of themes admin page for cleaner UI
- Installer extensions page UI improvements - made container scrollable and reversed order (Themes first, then Plugins)
- Updated Theme interface in React to support string IDs for file-based themes

---

## [1.3.5] - 2026-01-27

### Added
- **Plugin and theme management pages** - Admin interface to enable/disable/configure installed plugins and activate/switch themes
- **Navigation links** - Plugins and Themes now accessible from admin sidebar under Settings section
- **Installer extensions selection step** - Choose plugins and themes during installation before admin account creation
- **Marketplace update checking service** - ExtensionUpdateService checks for plugin and theme updates from marketplace.exiloncms.fr
- **Discord webhook notification service** - DiscordNotificationService sends notifications for CMS, plugin, and theme updates
- **Extension update controller** - New admin endpoints for checking updates and sending notifications
- **DISCORD_UPDATE_WEBHOOK_URL** - New environment variable for Discord webhook notifications

### Changed
- Plugin selections during installer are now automatically enabled in settings after installation
- Theme selection during installer is now automatically activated after installation
- Updated version to 1.3.5

### Fixed
- Fixed Laravel 12 compatibility issue in UpdateManager - removed deprecated `followRedirects()` method call (v1.3.4 hotfix)

---

## [1.3.1] - 2026-01-27

### Fixed
- Installation mode selection cards now properly handle click events with preventDefault/stopPropagation
- Added keyboard accessibility (Enter/Space) to mode selection cards
- Shop plugin migrations added - creates categories, items, orders, order_items, payments, payment_items, and gateways tables
- Fixed "no such table: categories" error when accessing shop routes after fresh installation
- **Plugin migrations now run automatically during web installer** (removed `runningInConsole()` check from BasePluginServiceProvider and ShopServiceProvider)
- Plugin migrations now automatically registered and executed with standard `php artisan migrate` command
- ActionLog now checks if plugin model classes exist before registering them (prevents Post/Comment/like errors when plugins disabled)
- Removed Theme::getActive() static method that conflicted with ThemeLoader cache
- ThemeLoader completely rewritten following Azuriom's pattern - no more database Theme model conflicts
- ThemeLoader now stores active theme ID in constructor to prevent type errors
- ThemeController updated to use ThemeLoader instead of database Theme model
- HandleInertiaRequests now uses ThemeLoader for active theme instead of database model
- InstallController redirect error during installation - changed from `route('home')` to `url('/')`
- Removed unnecessary requirements check step from installer wizard - now goes directly to database configuration
- Fixed wizard navigation - all back buttons now use correct `/wizard/*` paths
- Updated step indicators to reflect 3-step installation process (was 4 steps)
- Set blog theme as the default active theme with automatic fallback
- ThemeServiceProvider now properly handles themes without service providers
- Fixed installer redirect loop - admin creation now properly creates installation marker and redirects to home with cache clear

---

## [1.3.0] - 2026-01-26

### Added
- Plugin and theme update checker system with source URL tracking
- Automatic update notifications in admin panel
- Default themes included with CMS distribution (Blog, Gaming, E-Commerce)
- All themes are marketplace-ready with proper versioning for API updates
- Hytale game support with player UUID lookup via playerdb.co API
- HytaleGame class with avatar URL and username lookup
- French translations for Hytale game
- Complete shop plugin rewrite with payment gateway system
- Tebex payment gateway integration (official FiveM payment platform)
- PaymentManager with support for multiple payment gateways
- Payment, PaymentItem, Gateway, Order, OrderItem models
- Webhook handlers for payment notifications
- Payment status tracking (pending, completed, failed, refunded, chargeback)
- Migrations for shop_payments, shop_payment_items, shop_gateways tables
- PaymentMethod abstract base class for custom payment gateways
- Support for in-game item delivery via server bridge commands

### Changed
- CI workflow improvements - added lint/typecheck scripts and SQLite database creation before migrations
- ThemeLoader now lazy-loads in boot() phase instead of register() for better performance
- Auto-redirect from requirements page to database step when all checks pass

### Fixed
- Missing Payment model import in shop plugin PaymentManager
- JavaScript "Cannot access before initialization" error in Requirements component
- Added type checks to ThemeLoader to prevent "Cannot access offset of type Theme on array" error
- Inertia redirect loop - now uses Inertia::location() instead of Laravel redirect() for installation
- Syntax error in ResourceInstallController (space instead of backslash in use statement)
- Included themes and plugins in distribution builds

---

## [1.2.9] - 2025-12-15

### Added
- Initial release with Inertia.js v2 and React 19
- Plugin system for extensible architecture
- Multi-game support (Minecraft, FiveM, Steam games)
- Marketplace integration
- TipTap rich text editor
- shadcn/ui components
