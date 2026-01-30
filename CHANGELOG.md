# Changelog

All notable changes to ExilonCMS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.38] - 2026-01-30

### Fixed
- **Plugin Discovery Cache**: Fixed plugin cache preventing discovery
  - PluginLoader now correctly clears cache when plugins are enabled/disabled
  - Cache key properly flushed to force plugin rediscovery
- **Sidebar Plugin Links**: Fixed sidebar links showing for disabled plugins
  - Legal section now only shows if 'legal' plugin is enabled
  - Pages link now only shows if 'pages' plugin is enabled
  - Posts link now only shows if 'blog' plugin is enabled
  - Added `enabledPlugins` check in `filterLinks()` function
- **Theme CSS System**: Implemented theme-specific CSS loading
  - Added `active_theme_css()` helper to load theme CSS files
  - Created `theme.css` files for all themes (blog, gaming, ecommerce, saazy)
  - Vite now includes theme CSS files in build process
  - Theme CSS properly loads in preview mode

### Changed
- **PluginController**: Removed unused `ThemeLoader` dependency
- **Vite Config**: Added automatic discovery and inclusion of theme CSS files

## [1.3.37] - 2026-01-30

### Fixed
- **Plugin System Migration**: Complete rewrite following Paymenter architecture
  - Consolidated 3 competing plugin systems into single unified system
  - All 10 plugins migrated to new `Plugin` base class with PHP 8 attributes
  - Removed 2,651+ lines of duplicate/obsolete code
  - Deleted old `app/Services/PluginLoader.php` and `app/Extensions/Plugin/` directory
  - Fixed PSR-4 autoloading violation in `TebexMethod.php`
  - Updated all service providers to use new `PluginLoader`
- **Inertia Middleware Fix**: Fixed "Target class [inertia] does not exist" error
  - Changed `app('inertia')->share()` to `\Inertia\Inertia::share()`
  - Use facade instead of non-existent service container binding
- **JavaScript ReferenceError**: Fixed "props is not defined" on wizard page
  - Removed undefined `props` reference in `app.tsx` resolve() function
  - Theme injection already properly handled in setup() function

### Removed
- Old plugin service providers (10 files)
- Unused contract interfaces (6 files)
- Duplicate plugin loaders (3 systems consolidated to 1)

## [1.3.36] - 2026-01-29

### Added
- **DRY Compliance**: Created shared components and types to eliminate code duplication
  - `PreviewBanner` component - Shared preview banner for all themes
  - `PluginFeatures` component - Dynamic plugin feature display
  - `SiteSettings`, `PluginFeaturesProps`, `ServerStatus` types in `@/types`
- **Dynamic Theme System**: All themes now dynamically adapt based on enabled plugins
  - Gaming, E-commerce, Saazy, and Blog themes detect and display only enabled plugin features
  - Home pages use shared `PluginFeatures` component with grid/flex variants
- **Theme Preview Mode**: Fixed preview system to actually show theme designs
  - `ThemeLoader::getActiveThemeId()` now checks session for preview mode
  - `ThemeLoader::isPreviewMode()` method for preview state detection
  - Preview banner shared across all themes
  - `isPreviewMode` shared with Inertia for frontend access
- **Theme Dependency Validation**: Fixed plugin dependency validation
  - `ThemeLoader::checkPluginDependencies()` validates `plugin:*` requirements
  - Proper error messages when required plugins are missing
  - Validation happens before theme activation
- **Plugin Configuration**: Added `enabledPlugins` to Home page props for dynamic content
- **Internationalization (i18n)**: Core theme components now fully translatable
  - Added `resources/lang/en/theme.php` for English translations
  - Added `resources/lang/fr/theme.php` for French translations
  - `PreviewBanner` component uses translatable strings (preview banner, exit button)
  - `PluginFeatures` component uses translatable feature names and descriptions
  - Theme translations shared via `HandleInertiaRequests` middleware
  - Fallback to English if translation missing

### Changed
- **DRY Principles**: Removed all duplicated types/interfaces from theme files
  - All types now centralized in `resources/js/types/index.ts`
  - Themes import from shared `@/types` instead of redefining
- **Theme Architecture**: Themes are now developer-friendly and maintainable
  - Custom themes work standalone without CMS management
  - Shared components prevent code duplication across themes
  - Plugin detection is automatic and consistent

### Technical Details
**Shared Components**:
```
resources/js/components/theme/
├── PreviewBanner.tsx       # Preview mode banner
└── PluginFeatures.tsx      # Dynamic plugin features (grid/flex)
```

**Shared Types**:
```typescript
// resources/js/types/index.ts
export interface SiteSettings { ... }
export interface PluginFeaturesProps { ... }
export interface ServerStatus { ... }
```

**Theme Usage Example**:
```tsx
import { PageProps } from '@/types';
import PreviewBanner from '@/components/theme/PreviewBanner';
import PluginFeatures from '@/components/theme/PluginFeatures';

export default function Home() {
    const { settings, enabledPlugins, isPreviewMode } = usePage<PageProps>().props;

    return (
        <>
            {isPreviewMode && <PreviewBanner />}
            <PluginFeatures enabledPlugins={enabledPlugins} variant="grid" />
        </>
    );
}
```

## [1.3.35] - 2026-01-29

### Added
- **Simplified Plugin System**: New plugin architecture based on Paymenter
  - PHP 8 Attributes for plugin metadata (`#[PluginMeta]`)
  - PSR-4 autoloading via composer (auto-discovery)
  - Simple `Plugin` base class (no complex service providers required)
  - Convention over configuration for routes, views, migrations
- **PluginMeta attribute**: Define plugin metadata using PHP 8 attributes instead of JSON files
- **Simplified PluginLoader**: Auto-discovers plugins via composer autoload classmap
- **SimplifiedPluginServiceProvider**: Cleaner plugin loading following Paymenter architecture

### Changed
- **Plugin autoload**: Simplified from hardcoded per-plugin entries to wildcard `ExilonCMS\Plugins\` namespace
- **Plugin loading**: Removed complex service provider requirement, now uses simple base class
- **Extension system**: Simplified following Paymenter's clean architecture
- **Code quality**: Ran Laravel Pint to ensure PSR-12 compliance

### Technical Details
**New Plugin Structure**:
```
plugins/
└── blog/
    ├── src/
    │   └── Blog.php              # Main plugin class with #[PluginMeta] attribute
    ├── routes/
    │   ├── web.php              # Public routes (auto-loaded)
    │   └── admin.php            # Admin routes (auto-loaded)
    ├── database/
    │   └── migrations/          # Migrations (auto-loaded)
    └── resources/
        ├── views/               # Views (auto-loaded)
        └── lang/                # Translations (auto-loaded)
```

**Plugin Class Example**:
```php
<?php

namespace ExilonCMS\Plugins\Blog;

use ExilonCMS\Attributes\PluginMeta;
use ExilonCMS\Classes\Plugin\Plugin;

#[PluginMeta(
    id: 'blog',
    name: 'Blog',
    version: '1.0.0',
    description: 'Blog system with posts and categories',
    author: 'ExilonCMS',
)]
class Blog extends Plugin
{
    public function boot(): void
    {
        // Plugin initialization
    }
}
```

## [1.3.34] - 2026-01-29

### Changed
- **Simplified installer**: Removed mode selection (production/demo) step
- **Simplified installer**: Removed extensions (plugins/themes) selection step
- **Direct flow**: Installer now goes Database → Admin → Complete (was 4 steps, now 2)
- **Default theme**: Blog theme is now activated by default after installation
- **Default mode**: Production mode is set by default
- **General-purpose positioning**: CMS is now positioned for all communities and businesses, not just gaming
  - Updated README.md to emphasize broad use cases (businesses, e-commerce, content creators, organizations)
  - Updated composer.json description and keywords to be more inclusive
  - Removed gaming-focused language from marketing materials

### Added
- **Theme Page Override System**: Themes can now override any core, plugin, or admin page with their own React components
  - Theme pages loaded from `themes/{theme-id}/resources/js/pages/`
  - Priority: Theme page → Plugin page → Core page (fallback)
  - Enables complete customization of the entire CMS
- **Active theme sharing**: Theme ID now shared with frontend via HandleInertiaRequests middleware
- **Theme example**: Blog theme includes example Home.tsx override demonstrating DRY principles
- **Theme resolver utility**: `@/lib/theme-resolver.ts` for client-side theme page resolution
- **Vite theme aliases**: `@/theme` and `@/themePages` aliases for theme imports

### Technical Details
**Theme Override Architecture**:
```
themes/
└── blog/
    ├── theme.json              # Theme metadata
    └── resources/
        └── js/
            └── pages/
                └── Home.tsx      # Override core Home page
```

**Page Resolution Priority**:
1. Active theme page (if exists)
2. Plugin page (if route belongs to plugin)
3. Core CMS page (fallback)

**Usage Example**:
```tsx
// Theme pages are automatically discovered by Vite
// Create a file at themes/my-theme/resources/js/pages/Shop.tsx
// It will automatically override the core Shop page when that theme is active
```

**Best Practices Implemented**:
- DRY principles with reusable components
- Clean TypeScript interfaces
- Proper component composition
- Clear separation of concerns

### Fixed
- Fixed extra closing brace syntax error in HandleInertiaRequests.php
- Updated marketplace links to point to correct URL (https://exiloncms.fr/marketplace)

---

## [1.3.33] - 2026-01-29

### Fixed
- **Critical**: Fixed plugin route parameter names - changed from {id} to {plugin}
- Routes now accept string IDs (legal, blog, shop) instead of requiring numbers
- Fixed Ziggy error: 'id' parameter 'legal' does not match required format '[0-9]+'
- Plugins can now be enabled/disabled/deleted from admin panel
- Updated PluginController methods (toggle, config, destroy) to use correct parameter names

---

## [1.3.32] - 2026-01-29

### Fixed
- **Critical**: Completely rewrote update UI with real-time progress information
- Removed broken modal that showed blank screen during updates
- Update system now shows step-by-step progress with percentage bar
- Added separate Download and Install buttons (no more confusing single button)
- Added confirmation dialog before installing update
- Progress shows: backup → extract → copy files → composer → npm → build → migrate → cache
- Success/error messages now properly displayed
- Page auto-refreshes after download and redirects after install

### Changed
- Update page now displays clear information at each step
- Added "What's New" section with full changelog from GitHub
- Added warnings before installation (what will be preserved)
- Better visual feedback during long-running operations

---

## [1.3.31] - 2026-01-29

### Fixed
- **Critical**: Fixed PluginController toggle - setting was never saved (code after return statement)
- **Critical**: Added Enable/Disable and Delete buttons to admin plugins page
- Plugins can now be properly enabled/disabled from admin panel
- Cache is cleared when plugins are toggled to ensure changes take effect

### Changed
- **Homepage is now dynamic and adapts to enabled plugins**
  - Blog plugin enabled → Shows latest posts section
  - Shop plugin enabled → Shows shop CTA section
  - No plugins → Shows simple welcome/contact section
- Homepage uses design tokens (primary, muted, card) for theme customization
- Cart icon only shows when Shop plugin is enabled

---

## [1.3.30] - 2026-01-29

### Fixed
- **Critical**: Fixed "Class 'ExilonCMS\Models\Post' not found" error in HomeController
- HomeController now checks if Blog plugin's Post model exists before using it
- Returns empty posts array when Blog plugin is disabled or not installed
- Homepage now loads correctly regardless of plugin status

---

## [1.3.29] - 2026-01-29

### Fixed
- **Critical**: Fixed TypeError in PluginRegistry::getFooterLinks()
- Return value now always matches array type hint
- Application no longer crashes when loading footer links

---

## [1.3.28] - 2026-01-29

### Fixed
- **Critical**: Fixed ParseError "Unclosed '{' on line 45" in HandleInertiaRequests
- Removed duplicate array closing bracket that broke PHP syntax
- Application can now load properly

---

## [1.3.27] - 2026-01-29

### Fixed
- **Critical**: Fixed "Session store not set on request" error during installation/wizard
- ThemeServiceProvider now checks if session exists before accessing it
- Prevents crash when session middleware hasn't run yet

---

## [1.3.26] - 2026-01-29

### Added - EXTREME MODULARITY 🚀
- **Hook System**: 6 hook contracts for extreme CMS extensibility
  - `AuthenticationHook` - OAuth providers, 2FA methods
  - `MediaHook` - Storage drivers, image filters, CDN
  - `SearchHook` - Searchable content types
  - `NotificationHook` - Notification channels
  - `PaymentGatewayHook` - Payment gateways
  - `UserExtensionHook` - Custom user fields, profile sections
- **PluginHookManager**: Central registry for all plugin hooks
- **Plugin CLI Hook Support**: `make:plugin` now supports hook implementation generation
- **Theme Preview**: Theme preview now actually loads the theme design (checks session `preview_theme`)
- **Theme Plugin Dependencies**: Themes can declare required plugins via `plugin:` prefix in theme.json
- **Theme Dependency Validation**: System validates theme plugin requirements before activation
- **Theme Admin UI**: Shows required/missing plugins in theme list

### Fixed
- **Route Conflict**: Fixed duplicate `home` route name conflict (web.php vs admin.php)
  - Renamed admin route from `home` to `settings.home`
- **Theme Preview Error**: Theme preview now works correctly with proper theme loading

### Technical Details
**Hook System Architecture**:
```php
// Plugin service provider implements hooks
class MyPluginServiceProvider implements AuthenticationHook, MediaHook {
    public function registerAuthProviders(): array { ... }
    public function registerStorageDrivers(): array { ... }
}

// Automatically registered by PluginServiceProvider
PluginHookManager::registerAuthHook('my-plugin', $provider);

// Used throughout CMS
$providers = PluginHookManager::getAuthProviders();
```

**Theme Plugin Dependencies**:
```json
{
  "requires": {
    "exiloncms": ">=1.0.0",
    "plugin:shop": ">=1.0.0",
    "plugin:payments": ">=1.0.0"
  }
}
```

---

## [1.3.25] - 2026-01-29

### Fixed
- **Critical**: Fixed "Class 'ExilonCMS\Http\Controllers\Admin\Controller' not found" error in PluginController
- Added missing `use ExilonCMS\Http\Controllers\Controller;` import statement

---

## [1.3.24] - 2026-01-29

### Changed
- **Critical**: CMS now NEVER crashes due to missing/empty database tables
- Replaced global database check with per-operation error handling
- Each data loading operation wrapped in try/catch with safe fallbacks
- Table existence checks before queries (Schema::hasTable)
- Graceful degradation: missing data returns empty arrays/defaults instead of errors

### Technical Details
**Philosophy**: The CMS should work even when data is missing (like Azuriom)

**Before (v1.3.23)**:
```php
if (! $databaseReady) {
    return [...minimal data...];  // Blocked everything
}
```

**After (v1.3.24)**:
```php
// Each operation handles its own errors
'navbar' => $this->safeLoadNavbarElements($user),
'socialLinks' => $this->safeLoadSocialLinks(),
'onboardingComplete' => $this->safeGetOnboardingComplete($user),

function safeLoadNavbarElements($user) {
    try {
        if (! Schema::hasTable('navbar_elements')) return [];
        return $this->loadNavbarElements($user);
    } catch (\Exception $e) {
        return [];  // Safe fallback
    }
}
```

**Benefits**:
- ✅ Works during installation (tables don't exist yet)
- ✅ Works if tables are empty
- ✅ Works if specific data is missing
- ✅ No more crashes on /wizard
- ✅ More robust overall

---

## [1.3.23] - 2026-01-29

### Fixed
- **Critical**: Fixed "Database file does not exist" error on /wizard during installation
- HandleInertiaRequests now checks if database tables exist (not just installed files)
- Single global check for `Schema::hasTable('migrations')` instead of per-table checks
- Eliminates all "table doesn't exist" errors during installation wizard
- Removed creation of installed.json marker from standalone installer
- Installation state now determined by actual database table existence

### Technical Details
Changed from file-based installation detection to table-based detection:
- **Before**: Checked for `public/installed.json` file (unreliable)
- **After**: Checks for `migrations` and `settings` tables existence (reliable)
- This prevents loading database data before wizard creates the database

---

## [1.3.22] - 2026-01-29

### Changed
- **Critical**: Installer now follows Azuriom's approach for maximum compatibility
- Migrations are NO LONGER executed by standalone installer (avoids php-fpm/php-cli issues)
- Database creation is now handled by web wizard instead of installer
- Web wizard runs migrations via `Artisan::call()` in pure PHP (works on ALL hosting platforms)
- This approach works reliably on Plesk, cPanel, and any web hosting without shell access

### Technical Details
Standalone installer now ONLY:
1. Downloads CMS from GitHub
2. Extracts files
3. Creates .env configuration
4. Fixes index.php for all server types
5. Redirects to web wizard

Web wizard (InstallController) handles:
- Database configuration
- Migration execution via `Artisan::call('migrate', ['--force' => true])`
- Admin account creation
- Site configuration

This matches Azuriom's architecture and eliminates all shell/PHP binary detection issues.

---

## [1.3.21] - 2026-01-29

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
