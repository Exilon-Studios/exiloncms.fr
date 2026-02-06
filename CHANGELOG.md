# Changelog

All notable changes to ExilonCMS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.95] - 2026-02-06

### Fixed
- **Update check button**: Fixed "Check for updates" button not working
  - Changed to_route() to redirect()->route() in UpdateController
- **Shop translations**: Added missing admin shop translations
  - Added translations for shop.admin.section, dashboard, products, categories, orders, payments
- **Documentation availability**: Fixed "Documentation feature is not available" error
  - Added logging to debug enabled_plugins setting
- **Duplicate sidebar entry**: Removed duplicate "Documentation" entry from admin sidebar
  - Plugin now uses its own admin_section from plugin.json
- **Double scroll on settings page**: Removed container wrapper causing extra scrollbar
  - Changed from container mx-auto py-6 px-4 to space-y-6
- **Optimistic UI for categories**: Implemented optimistic updates when creating categories
  - Added modal dialog for creating new categories
  - New category appears immediately without page reload
  - Shows loading state during creation
- **Documentation translations**: Added missing admin documentation translations
  - menu items, form labels, messages, common translations

## [1.3.94] - 2026-02-06

### Fixed
- **Plugin service provider visibility**: Changed getPluginManifest() to public
  - Allows PluginServiceProvider to access plugin manifest data
  - Fixes "Call to protected method" error on wizard page
  - Required for route prefix configuration from plugin.json
- **Orphan code in DocumentationController**: Removed duplicate return statement
  - Fixed syntax error causing parse failures
  - Resolves CI build failures from Laravel Pint

## [1.3.93] - 2026-02-06

### Fixed
- **Double scroll in admin pages**: Removed nested flex containers causing double scrollbar
  - Removed flex wrapper around children in AuthenticatedLayout
  - Scroll now handled properly by SidebarLayout's overflow-y-auto container
- **Documentation browse back button**: Fixed non-functional back button
  - Added missing `route` import from ziggy-js in Browse.tsx
  - Back button now correctly navigates to documentation index
- **Navigation icons compatibility**: Fixed icon imports for @tabler/icons-react v3
  - Replaced deprecated IconRefreshCw with IconRefresh
  - Removed non-existent icons (IconUnlock, IconImage, IconDownloadCloud, etc.)
  - Added IconPhoto as replacement for IconImage
  - Fixed imports for Book icon used in documentation plugin
- **Documentation Config page**: Fixed TypeScript errors
  - Fixed trans property access in DocumentationConfig component
  - Added type safety for config field iteration

### Added
- **Context7 MCP integration**: Added MCP Context7 configuration for AI documentation search
  - Created opencode.jsonc with Context7 MCP server configuration
  - Added CONTEXT7_API_KEY environment variable
- **AGENTS.md**: Created coding guidelines for agentic coding agents
  - Build, test, and lint commands
  - Code style guidelines (PSR-12 PHP, TypeScript strict mode)
  - Import patterns and naming conventions
  - Database migration safety rules
  - Inertia.js integration patterns
  - Extension system (plugins & themes) guidelines

## [1.3.92] - 2026-02-05

### Added
- **Configurable documentation route prefix**: Documentation plugin can now use custom base path
  - Added `route_prefix` setting to documentation plugin configuration
  - Can choose between `/docs`, `/documentation`, or any custom path
  - Route prefix is read from plugin.json manifest, database setting, or defaults to plugin ID
  - PluginServiceProvider checks all three sources in order of priority
  - Navigation cache is cleared when route_prefix is changed
  - URLs will be like `/docs/getting-started` or `/documentation/getting-started`

### Changed
- **Documentation plugin configuration**: Added route_prefix option to plugin config
  - Plugin.json updated with configurable web route prefix
  - Settings form now includes route_prefix field with validation
  - Route prefix must be lowercase alphanumeric with hyphens only

## [1.3.91] - 2026-02-05

### Added
- **Dynamic navigation system**: Plugins can now declare navigation in plugin.json
  - Created NavigationController for building navigation from plugin manifests
  - Plugins declare navigation via `admin_section` or `navigation` key in plugin.json
  - Navigation is cached for performance and automatically rebuilt on plugin changes
  - Added navigation icons helper library for dynamic icon rendering
  - AuthenticatedLayout now integrates plugin navigation dynamically
  - Icons are rendered dynamically from plugin manifest icon names
- **Navigation cache clear route**: Added POST /admin/navigation/cache/clear to rebuild navigation

### Changed
- **Navigation architecture**: Moved from hardcoded to plugin-driven navigation
  - Core navigation items still defined in AuthenticatedLayout
  - Plugin navigation items injected dynamically from plugin.json
  - Navigation is sorted by position values from manifests

### Fixed
- **Shop plugin routes**: Enabled shop plugin in plugins.json
- **Plugin helpers autoload**: Added plugin.php and hooks.php to composer autoload files

## [1.3.90] - 2026-02-05

### Fixed
- **Documentation Cache page hardcoded French text**: Removed hardcoded "Cache préchargé avec succès" messages
  - Now uses translation system for all text
  - Removed duplicate message display (relies on toast notifications)
  - Added trans() calls for all UI text
- **Site Setup card hover effect**: Removed hover effect from Quick Access Panel buttons in onboarding
- **Back to admin button**: Fixed documentation editor back button pointing to correct route
- **Documentation Index page missing**: Created Admin/Plugins/Documentation/Index.tsx page
  - Displays documentation statistics (pages, categories, locales, cache)
  - Added quick action cards for Browse, Configuration, and Cache
- **Plugin Config Edit page missing**: Created Admin/Plugins/Config/Edit.tsx for generic plugin configuration
  - Supports text, textarea, number, select, checkbox, boolean field types
  - Properly handles field validation and error display
- **Composer autoload**: Added plugin.php and hooks.php to autoload files array
- **Shop plugin enabled**: Added shop to enabled plugins list
- **Translation keys added**: Added missing translation keys for documentation stats and actions

## [1.3.89] - 2026-02-05

### Fixed
- **Update detection not working**: Fixed "Check for updates" not finding new releases
  - Added `clearstatcache()` to getVersionFromComposer() to clear PHP stat cache
  - Added comprehensive logging to UpdateManager for debugging
  - Logs current version, latest version, and comparison result
  - Logs GitHub API fetch results and errors
- **Better update debugging**: Added detailed logging throughout update check process
  - Logs repo being queried, current version, and fetched release tag
  - Logs version comparison result
  - Logs update availability when found

## [1.3.88] - 2026-02-05

### Fixed
- **Select.Item empty value error**: Fixed language duplication dropdown using empty string value
  - Changed from empty string to "none" value for Create empty option
  - Properly handles Select.Item value requirements
- **Folder creation JSON response**: Fixed folder creation returning plain JSON instead of handling response properly
  - Changed from router.post to fetch for proper JSON handling
  - Modal now closes correctly after folder creation
- **Folder name display**: Fixed folder names showing slug instead of title
  - Backend now reads title from index.md frontmatter
  - Folders display proper human-readable names (e.g., "Getting Started" instead of "getting-started")
  - Added title field to directory tree nodes
- **t.map is not a function error**: Fixed error when clicking on empty folders or loading file tree
  - Added array type checking for categories prop
  - Ensured categories is always initialized as array
  - Added fallback for missing or malformed data
- **500 Internal Server Error on tree endpoint**: Added error handling and logging
  - Wrapped fileTree method in try-catch
  - Returns empty array on error instead of crashing
  - Logs error details for debugging
- **Hardcoded translations**: Removed hardcoded "Delete" text in context menu
  - Now uses trans('admin.documentation.editor.delete')
  - Added missing translation keys in FR and EN
- **Editor link in navbar**: Removed Editor link from Documentation dropdown menu
  - Menu now only shows: Browse, Configuration, Cache
  - Cleaner navigation without redundant links

## [1.3.87] - 2026-02-05

### Added
- **Language duplication feature**: Added ability to duplicate documentation from one language to another
  - "Duplicate from" selector in language creation modal
  - Copies entire folder structure and files from source locale
  - Avoids recreating structure manually - just need to translate
  - Backend route `admin.plugins.documentation.duplicate-locale`
  - Translation keys for duplication messages

## [1.3.86] - 2026-02-05

### Added
- **Documentation language creation**: Added ability to create new languages directly from documentation editor
  - New "Add Language" button in locale selector
  - Modal for entering language code (e.g., en, es, de)
  - Automatically creates locale directory with default category
- **Full language names in selector**: Language selector now shows full names instead of codes
  - Français instead of FR
  - English instead of EN
  - Supports all common languages with proper display names
- **Context menu for files/folders**: Right-click context menu for documentation items
  - Create new file in folder
  - Rename files and folders
  - Delete files and folders with confirmation
  - Red styled delete option
- **Drag-and-drop support**: Basic drag-and-drop support for file tree using @dnd-kit
  - Files and folders can be dragged (move logic pending backend implementation)
  - Visual feedback during drag operation
- **Language name translations**: Added comprehensive language name mappings
  - Support for 11 common languages (fr, en, es, de, it, pt, ru, zh, ja, ko, ar)
  - Easy to extend with additional languages

### Changed
- **Documentation routes**: Fixed route prefix issue causing 404 errors
  - Removed duplicate prefix('docs') from documentation web routes
  - Routes now correctly accessible at /documentation/* instead of /documentation/docs/*
  - Public documentation now works at /documentation/{locale}/{category}/{page}
- **Hardcoded toast messages**: All controller messages now use translations
  - Page updated/created/deleted messages
  - Cache cleared/warmed messages
  - Category/locale creation messages
  - All messages now properly translated via __('admin.documentation.messages.*')

### Fixed
- **React error #308**: Fixed i18n system to handle calls outside React context
  - `trans()` function now falls back to `transStatic()` when called outside components
  - Prevents crash when `usePage()` hook cannot be used
  - Updates page now works without errors
- **Documentation controller translations**: Replaced all hardcoded French text with translations
  - Cache warmed message now uses parameter replacement
  - All success/error messages use __() helper
  - Added missing translation keys to EN and FR admin.php files
- **Back to Admin and Preview buttons**: Fixed navigation buttons in documentation editor
  - Back to Admin button now correctly routes to admin.plugins.documentation.index
  - Preview button opens documentation in new tab at correct URL
- **Folder deletion**: Implemented recursive folder deletion
  - Deletes all files in folder before removing folder
  - Shows confirmation dialog with folder name
  - Properly cleans up index.md file

## [1.3.85] - 2026-02-05

### Added
- **Documentation category/folder creation**: Added ability to create new categories from IDE editor
  - New "New Folder" button in sidebar with FolderPlus icon
  - Modal for entering folder name and slug
  - Backend route `admin.plugins.documentation.category.store` for creating categories
  - Creates category directory with index.md file
- **Safe migration helpers**: Added `app/Helpers/migration.php` with safe migration functions
  - `safe_drop_if_exists()` - checks if table has data before dropping
  - `safe_modify_table()` - modifies tables without dropping them
  - Prevents accidental data loss during migrations
- **Visual folder distinction**: Folder icons now use Folder/FolderOpen based on expansion state
  - Expanded folders show FolderOpen icon
  - Collapsed folders show Folder icon
  - Files show FileText icon
  - File count displays "X pages" using translation

### Changed
- **Documentation translations**: Fixed translation system to use proper `trans()` function
  - All hardcoded ternary operators replaced with `trans('admin.documentation.editor.*')` calls
  - Added new translation keys: `new_file`, `new_folder`, `new_page`, `folder_name`, `folder_slug`, `unsaved`, etc.
  - Translations properly loaded from core admin.php (not plugin-specific)
  - Both EN and FR translations updated

### Fixed
- **Translation system in Documentation Editor**: Fixed hardcoded translations
  - Was using `{locale === 'fr' ? '...' : '...'}` ternary operators
  - Now uses proper `{trans('admin.documentation.editor.key')}` pattern
  - Follows core CMS translation conventions

## [1.3.84] - 2026-02-05

### Fixed
- **Version mismatch**: Updated composer.json and package.json to v1.3.84
  - Previous version was stuck at 1.3.70 in composer.json
  - Version now correctly reflects current release
  - Update system reads version from composer.json via ExilonCMS::version()

## [1.3.83] - 2026-02-05

### Added
- **Full-screen IDE editor for documentation**: Complete rewrite as full-screen editor
  - No sidebar/header, just Back button and Preview
  - Language selector in header that switches files dynamically
  - New file creation directly from modal in IDE
  - Removed CHANGES column - cleaner 2-column layout
- **New file creation modal**: Create pages directly from IDE
  - Select category and enter page title
  - Auto-generates slug from title
  - Creates with default markdown content

### Changed
- **Documentation browse page**: Now uses full-screen layout
  - Removed AuthenticatedLayout wrapper
  - Header is minimal with Back, Documentation title, Locale selector, Save, Preview
  - File tree sidebar (280px) + Editor (flex-1)
  - Total height with h-screen instead of calc()

### Removed
- **Documentation Create.tsx page**: No longer needed
- **Documentation Edit.tsx page**: No longer needed
- **Documentation create/edit routes**: Consolidated into IDE editor
- **CHANGES column**: Removed from IDE layout for cleaner interface

## [1.3.81] - 2026-02-05

### Added
- **Check for updates button**: Added button to manually check for updates on Updates page
  - Button appears in Current Version card
  - Calls admin.update.fetch route to refresh update status

### Changed
- **Documentation navigation**: Reorganized admin section links
  - Renamed "Browse" to "Editor" in navigation
  - "Editor" is now first link (IDE-style editor)
  - Updated links to use correct route paths
  - Settings link moved to second position
- **Documentation page rename**: Browse.tsx renamed to Editor.tsx
  - Controller updated to render Admin/Documentation/Editor
  - Route names remain the same for backwards compatibility

### Fixed
- **Documentation Cache page**: Fixed "Cannot convert undefined or null to object" error
  - Added null/undefined checks for stats prop
  - Changed to use safeStats with default empty object
  - Used lucide-react icons instead of @tabler/icons-react
  - Updated to use Card components for consistent styling
- **Documentation Config page**: Fixed locale selector using Input instead of Select
  - Updated Config.tsx with proper Select component
  - Added Switch component for boolean fields
  - Added availableLocales prop from controller
  - Dynamic locale options from available locales
- **Update page translations**: Added translation keys for update buttons
  - admin.update.current_version, current_version_description, check_button

## [1.3.80] - 2026-02-05

### Added
- **IDE-style documentation editor backend**: Added file-content and save-content routes
  - POST /admin/plugins/documentation/file-content - Load file content for editing
  - POST /admin/plugins/documentation/save-content - Save file content to disk
  - Auto-creates directories if they don't exist
  - Clears cache after saving files
- **Documentation Config page**: Created configuration page for documentation plugin
  - Locale selector with dynamic options from available languages
  - Language management section showing all available locales
  - Add new language functionality with auto-creation of directory structure
  - Creates default category "getting-started" with index.md file
- **FileNode interface**: Added slug property for proper file identification
- **Locale management**: POST /admin/plugins/documentation/create-locale endpoint
  - Creates new locale directory in docs/
  - Creates default getting-started category with welcome page
  - Validates locale code (2-10 characters)

### Fixed
- **Documentation Browse page**: Fixed route() usage in loadFile function
  - Separated URL generation from fetch options
  - Added CSRF token to POST request headers
- **useTrans hook usage**: Fixed destructuring in Browse.tsx
  - Changed from `const trans = useTrans()` to `const { trans } = useTrans()`
- **Preview route**: Fixed subcategory handling in preview URL
  - Uses correct page path for nested categories (category/subcategory/page)
  - Falls back to slug or path without .md extension
- **Config route**: Updated controller to return availableLocales
  - Config page now receives list of available languages
  - Select options populated dynamically instead of hardcoded

### Changed
- **Documentation plugin**: Removed hardcoded locale options from getConfigFields()
  - Options now populated dynamically from available locales
  - Supports adding new languages through admin interface

## [1.3.79] - 2026-02-05

### Fixed
- **Default theme visible**: Added default core theme to themes list in admin
  - Theme now appears in /admin/themes page as "Core Theme"
  - Shows as "Theme par défaut d'ExilonCMS" with current CMS version
  - Properly marked as active when selected
- **Documentation routes**: Fixed route names for documentation plugin
  - Changed from `plugins.documentation.*` to `admin.plugins.documentation.*`
  - Fixes Ziggy route errors when accessing documentation admin pages
  - All documentation admin pages now work correctly (index, settings, browse, create, edit, cache)

## [1.3.78] - 2026-02-05

### Changed
- **Plugin cards UI**: Cleaned up plugin display in admin panel
  - Removed status Badge from plugin names (no more Check/X icons)
  - Removed status text next to Enable/Disable switch
  - Cleaner, more minimal design with just name, description, and toggle
  - Plugin status now shown only through border color and toggle position

## [1.3.77] - 2026-02-05

### Fixed
- **Translation keys path**: Fixed admin.updates → admin.update in Updates page
  - Changed trans() calls to use correct singular 'admin.update' path
  - Text now displays correctly instead of showing translation keys
- **Database themes removed**: Removed database themes from ThemeController
  - Only file-based themes (from themes/ directory) are now shown in admin
  - No more Gaming/Blog/Ecommerce themes appearing from database
- **Sidebar cleanup**: Removed Logs link from Settings section
  - Logs still accessible via bottom of sidebar
- **Missing imports**: Added Link import in Documentation/Cache.tsx
  - Fixes "Link is not defined" error when viewing cache page

## [1.3.76] - 2026-02-05

### Changed
- **Theme system**: Implemented true file-based theme discovery
  - Removed all bundled themes (ecommerce, gaming, saazy) from themes/ directory
  - Themes are now only discovered if they exist as folders in themes/ with valid theme.json
  - Default theme is built into core, doesn't need a folder
  - Automatic cache cleanup when theme doesn't exist on disk anymore
  - Updated ThemeLoader to use 'default' as fallback instead of non-existent 'blog' theme

### Fixed
- **Translation keys**: Fixed missing translation keys for Updates page
  - Added `admin.update.up_to_date` and `admin.update.latest_version` keys
  - Keys were added to both English and French translation files

## [1.3.75] - 2026-02-05

### Fixed
- **Documentation plugin pages**: Created missing React pages for documentation admin
  - Added `Admin/Plugins/Documentation/Config.tsx` for plugin settings
  - Added `Admin/Documentation/Create.tsx` for creating new docs pages
  - Added `Admin/Documentation/Edit.tsx` for editing docs pages
  - Moved Browse.tsx, Cache.tsx, Index.tsx to correct locations
- **Missing UI components**: Created `Collapsible` component using @radix-ui/react-collapsible
- **Translations**: Replaced hardcoded text with `trans()` calls in Updates page
  - Added `admin.updates.up_to_date` and `admin.updates.latest_version` translation keys
  - Both English and French translations included
- **Icons**: Fixed `IconRefreshCw` import error (replaced with `IconRefresh`)

## [1.3.74] - 2026-02-05

### Fixed
- **Rebuild release**: v1.3.73 release was created before recent commits were pushed
  - All fixes from v1.3.73 are now properly included in this release
  - Includes documentation routes fix, editor link fix, and update section removal

## [1.3.73] - 2026-02-05

### Fixed
- **Installer GitHub repository**: Fixed incorrect GitHub repository name in installer
  - Changed from `Exilon-Studios/ExilonCMS` to `Exilon-Studios/exiloncms.fr`
  - Installer can now properly fetch latest release information from GitHub API
  - Fixes 404 error when downloading CMS through web installer
- **Documentation plugin routes**: Removed duplicate prefix in admin routes
  - Routes were `/admin/plugins/documentation/documentation/...` instead of `/admin/plugins/documentation/...`
  - Fixed settings, browse, and cache routes to work correctly
- **Documentation editor link**: Updated menu link to point to plugin create page
  - Changed from `/admin/editor` (placeholder) to `/admin/plugins/documentation/create`
  - Removes confusing BlockNote placeholder message
- **Update notifications**: Removed "Update Available" section from admin dashboard
  - Simplifies admin interface after manual update installation
  - Updates page now shows "Up to Date" message directly

## [1.3.72] - 2026-02-04

### Fixed
- **Application bootstrap**: Fixed Route facade error by restoring Laravel 12 `then:` callback pattern in bootstrap/app.php
  - Routes now properly registered within `withRouting()->then()` callback
  - Plugin helpers loaded via require_once at bootstrap top
- **Frontend build**: Removed unused ModalDialog import that was causing Vite build errors
- **Dependencies**: Restored correct Laravel 12.0 and inertia-laravel 2.0 versions

### Removed
- **Unused code cleanup**: Removed all unused components, pages, and dependencies
  - Deleted theme components (aceternity, vorix, hostinkar, wion) - 50+ unused files
  - Removed unused UI components (data-table, input-otp, modal-dialog)
  - Deleted unused pages (Resources, Maintenance, Admin/Bans, Admin/Images)
  - Removed unused admin controllers (ExtensionUpdateController, ResourceController)
  - Cleaned up admin routes (removed resources, extension updates routes)
  - Removed unused npm packages (@uploadthing/*, motion duplicate)
- **Legacy plugin cleanup**: Removed old docs plugin, replaced with new documentation plugin
- **Problematic themes**: Deleted themes with broken imports (hostinkar, vorix, wion, blog)
  - Theme cache cleared to reset to default theme (ecommerce)

### Fixed
- **Translation placeholders**: Fixed trans() function to support {placeholder} format in addition to :placeholder
  - Onboarding page now correctly displays step counts and percentages
  - Fixed "Step {current}/{total}" and "{percent}% complete" display issues
- **Blog layout**: Fixed Blog/Index.tsx to use PublicLayout instead of deleted BlogLayout
  - Added missing `route` import from ziggy-js
  - Replaced Feedbacks, FAQSection, and Contact components with placeholders
- **Blog show page**: Fixed Blog/Show.tsx to use PublicLayout instead of deleted BlogLayout
- **Sidebar component**: Removed missing PluginHeaderIcons component import
  - Component was a placeholder for plugin-specific header icons (shop cart, etc.)
  - Can be re-added later when plugin system is more mature
- **Installer GitHub repository**: Fixed incorrect GitHub repository name in installer
  - Changed from `Exilon-Studios/ExilonCMS` to `Exilon-Studios/exiloncms.fr`
  - Installer can now properly fetch latest release information from GitHub API
- **Plugin status detection**: Plugins now correctly read enabled status from plugins.json file
  - Cache clearing issue fixed - plugins now show correct enabled/disabled status
  - Documentation plugin now properly shows as enabled
- **Plugin page styling**: Completely redesigned Admin/Plugins/Index page with shadcn/ui
  - Modern card-based layout with Switch component for enable/disable
  - Badge indicators for plugin status and features (Routes, Admin, DB, Settings)
  - Added stats counter showing enabled/total plugins
  - Fixed translation function import (useTrans → trans from types)
  - Removed redundant "Configure" button (config links are in sidebar)
- **Plugin config link**: Fixed settings link for documentation plugin
  - Now correctly routes to /admin/plugins/documentation/settings instead of generic config
- **Route conflict resolution**: Documentation plugin config route changed from /config to /settings
  - Avoids conflict with generic plugin config route at /admin/plugins/{plugin}/config
- **Layout consistency**: Fixed admin pages layout to use consistent spacing
  - Dashboard page now uses AuthenticatedLayout padding instead of custom container
  - All admin pages now use same layout structure for consistent title/content alignment
  - Logs page styling matches Users page (removed extra borders)
  - Bans page styling matches Users page (removed extra borders, added translations)
- **BlockNote editor integration**: Fixed multiple bugs in BlockNoteEditor component
  - Editor now properly uses useCreateBlockNote hook instead of direct instantiation
  - Fixed loadFileIntoEditor function signature (removed incorrect async wrapper)
  - Fixed parseMarkdownToBlocks function with proper inline helper for pushCurrentBlock
  - Updated blocksToMarkdown to handle BlockNote's block structure correctly
  - Folder icons now use ChevronDown/ChevronRight from lucide-react

### Changed
- **Admin sidebar reorganization**:
  - Removed Content section (Pages, Posts, Images, Redirects - will be plugins)
  - Renamed "SETTINGS" to "CONFIGURATIONS"
  - Moved Navbar inside CONFIGURATIONS section
  - Moved Logs to secondary links (above Updates)
  - Removed Documentation link from sidebar
  - Removed plugin config links from EXTENSIONS section (only in PLUGIN CONFIG)
- **Plugin navigation**: Documentation plugin now has dropdown menu in PLUGIN CONFIG section
  - Dropdown includes: Éditeur (with icon), Configuration (with icon), Parcourir (with icon), Cache (with icon)
  - Dropdown items have left border line with dots for visual hierarchy
  - Other plugins with single config show as direct links
  - Sidebar now supports individual link dropdowns with icons (not just sections)
- **Onboarding checklist card**: Improved design with clickable entire card
  - Removed redundant "View all →" button
  - Added badge showing remaining steps count
  - Better hover effects and visual feedback
- **Translations**: All text now uses translations (no hardcoded French/English)
  - Documentation menu items (editor, configuration, browse, cache)
  - Bans page translations (description, user, reason, banned_by, date, status, etc.)
  - Dashboard quick actions translations (users management, settings & appearance)
  - Documentation plugin pages (index, browse, cache, editor)

### Added
- **Documentation plugin pages**: Complete admin interface for documentation management
  - Index page (/admin/plugins/documentation) with stats and quick actions
  - Browse page (/admin/plugins/documentation/browse) to navigate documentation files
  - Cache page (/admin/plugins/documentation/cache) for cache management
  - Editor page (/admin/editor) for creating/editing documentation pages
  - Config page (/admin/plugins/documentation/settings) for plugin settings
- **Sidebar dropdown support**: Individual links can now have dropdown menus with children and icons
  - Used for Documentation plugin with multiple config options
  - Persists expanded/collapsed state in localStorage
  - Smooth animations with framer-motion
  - Left border line with dots for visual hierarchy

## [1.3.71] - 2026-02-04

### Added
- **Documentation plugin**: Complete documentation system with multi-language support
  - Created plugin documentation configuration file (config/config.php)
  - Added admin routes under `/admin/plugins/documentation` submenu
  - Added middleware DocumentationEnabled to check if plugin is active
  - Created DocumentationServiceProvider to register plugin middleware
  - Added developer documentation pages (plugins, themes, API reference)
  - Added installation, configuration, and usage documentation in French
  - Documentation now only accessible when plugin is enabled
- **Documentation admin pages with shadcn/ui components**:
  - Configuration page with tabs (General, Display, Features, GitHub)
  - Markdown editor with preview functionality
  - Browse page with collapsible categories
  - Index page with stats cards and quick actions
- **Generic plugin configuration page**: Created `Admin/Plugins/Config/Edit.tsx`
  - Works with all plugins using `getConfigFields()` method
  - Supports multiple field types: text, boolean, select, number, textarea
  - Auto-generates form from plugin config fields
  - Handles validation and saving to database

### Fixed
- **Plugin helpers loading issue**: Merged `app/helpers/plugins.php` into `app/helpers/plugin.php`
  - Functions were not available due to incorrect autoload order
  - `get_enabled_plugins()`, `save_enabled_plugins()`, `is_plugin_enabled()` now properly available
  - Removed duplicate file and updated composer.json
- **Missing plugin config page**: Created generic configuration page for all plugins
  - Previously only specific config pages worked
  - Now all plugins can use `getConfigFields()` method

### Changed
- Updated admin routes for documentation to use `/admin/plugins/documentation` prefix
- Registered DocumentationServiceProvider in config/app.php
- Replaced Tabler icons with Lucide React icons across documentation admin pages
- All documentation admin pages now use shadcn/ui components for consistent styling
  - Created plugin documentation configuration file (config/config.php)
  - Added admin routes under `/admin/plugins/documentation` submenu
  - Created configuration page for documentation plugin settings
  - Added middleware DocumentationEnabled to check if plugin is active
  - Created DocumentationServiceProvider to register plugin middleware
  - Added developer documentation pages (plugins, themes, API reference)
  - Added installation, configuration, and usage documentation in French
  - Documentation now only accessible when plugin is enabled

### Changed
- Updated admin routes for documentation to use `/admin/plugins/documentation` prefix
- Registered DocumentationServiceProvider in config/app.php

## [1.3.70] - 2026-02-04

### Changed
- **Modular plugin system (Paymenter-inspired)**: Plugins now export their own functionality
  - Plugins can export via PHP methods OR plugin.json (both supported)
  - Added Plugin base methods: getSidebarLinks(), getWidgets(), getHeaderElements(), getNavigation()
  - Methods read from plugin.json by default, can be overridden in plugin classes
  - Added helper functions: getPublicSidebarLinks(), getUserSidebarLinks(), getAdminSidebarLinks()
  - Added helper functions: getUserWidgets(), getAdminWidgets(), getSidebarHeaderElements()
  - Added helper functions: getWidgets(), getSidebarLinks() for generic access
  - Added plugin instance helpers: get_plugin_instance(), plugin_get_sidebar_links(), plugin_get_widgets(), plugin_get_header_elements(), plugin_get_navigation()
  - Plugins declare sidebar_links in plugin.json for different contexts (public, user, admin)
  - Removed hardcoded plugin checks from PublicLayout, BlogLayout, DashboardLayout
  - Removed showCart prop dependency on enabledPlugins in layouts
  - DashboardLayout now uses userSidebarLinks from plugins dynamically
  - Admin Dashboard now uses dashboardWidgets from plugins instead of hardcoded checks
  - Added icon mapping in DashboardLayout for plugin-declared icons (ShoppingCart, etc.)
  - Shop plugin updated with sidebar_links configuration for user dashboard
  - Shop widgets updated with context attribute (user/admin/both)
  - HandleInertiaRequests shares publicSidebarLinks, userSidebarLinks, adminSidebarLinks
  - HandleInertiaRequests shares userWidgets, adminWidgets with frontend
  - HandleInertiaRequests now uses plugin_get_navigation() and plugin_get_header_elements() which check both PHP and JSON
- **Plugin storage system**: Migrated from database-based to file-based storage (inspired by Azuriom)
  - Plugins now stored in `plugins/plugins.json` instead of database `enabled_plugins` setting
  - Fixes persistent issue where plugin activation state was being reset during Laravel boot
  - Updated PluginServiceProvider to read from file instead of database
  - Updated plugin commands (enable, disable, list) to use file-based storage
  - Updated PluginController to use file-based storage for web UI
  - Created `app/helpers/plugins.php` with get_enabled_plugins(), save_enabled_plugins(), is_plugin_enabled()
- **Modular plugin header icons system**: Plugins can now declare header icons via plugin.json
  - Plugins declare `header_icons` in their plugin.json manifest
  - Created PluginHeaderIcons React component to dynamically render plugin header icons
  - Added plugin_header_icons() helper to read icons from plugin manifests
  - Added getPluginHeaderIcons() in HandleInertiaRequests to share header icons with frontend
  - Updated Shop plugin.json to declare cart icon with badge, permission, and position
  - SidebarLayout now uses PluginHeaderIcons instead of hardcoded cart button
  - Cart button only shows when Shop plugin is enabled (via permission check)
  - Account balance displayed next to user name in header
- **Onboarding checklist**: Improved UI and translations
  - Now shows only first uncompleted step instead of 2 (reduces card height)
  - Added translation keys for "View all" and "See X more steps"
  - Updated trans() helper to support positional placeholders {0}, {1}, etc.
  - French and English translations added for new keys
- **Navigation translations**: Added missing translations for admin navigation
  - `admin.nav.users.heading`: "Gestion des utilisateurs" / "Users"
  - `admin.nav.users.manage_members`: "Gérer les membres" / "Manage Members"
  - `admin.nav.users.permissions_roles`: "Permissions & rôles" / "Permissions & Roles"
  - `admin.nav.settings.heading`: "Paramètres & Apparence" / "Settings & Appearance"
  - `admin.nav.settings.site_config`: "Configuration du site" / "Site Configuration"
  - `admin.nav.settings.appearance`: "Apparence du site" / "Site Appearance"

## [1.3.69] - 2026-02-03

### Added
- **Documentation plugin**: Integrated documentation system with multilingual support
  - Reads markdown files from /docs directory (FR, EN locales)
  - Automatic navigation based on folder structure
  - Full-text search across all documentation
  - Table of contents generation from markdown headings
  - Caching system for better performance
  - Admin interface for managing documentation files
  - Components: DocumentationViewer, DocSidebar, DocSearch, DocTableOfContents
  - Routes: /docs/* for public docs, /admin/documentation/* for management
  - Helper files: app/helpers/plugin.php, app/helpers/hooks.php
- **Helper functions**: Added plugin and hooks helper files
  - plugin_manifest(), plugin_navigation(), plugin_widgets(), plugin_events()
  - hook_model_created/updated/deleted(), hook_auth_login/logout/registered()
  - hook_event(), dispatch_event(), register_model_observers()
- **Cleanup**: Removed unnecessary files from root directory
  - Removed build artifacts: exiloncms.zip, exiloncms-installer-*.zip
  - Removed unused files: pnpm-lock.yaml, routes.txt, nul
  - Confirmed: No Bootstrap CSS dependency (uses Tailwind + shadcn/ui)

## [1.3.68] - 2026-02-03

### Added
- **Dashboard widgets system**: Plugins can declare widgets for admin dashboard
  - WidgetManager class manages widget discovery, permissions, and user layouts
  - DashboardWidgetController provides API endpoints for widget data
  - HandleInertiaRequests shares dashboardWidgets with frontend
  - Widgets support positions (main, sidebar), permissions, and custom components
  - Users can customize their dashboard layout
  - Routes: /admin/widgets/* for widget management
- **Plugin ZIP import system**: Full plugin installation via ZIP file upload
  - PluginImportController handles validation, extraction, and installation
  - Supports plugin.json manifest or #[PluginMeta] attribute detection
  - Auto-registers composer autoload namespaces for new plugins
  - Automatic migration execution on import
  - Optional auto-enable after import
  - Backup functionality before deletion
  - Routes: GET /admin/plugins/import, POST /admin/plugins/import, GET /admin/plugins/backups
- **Dynamic navigation system**: Plugins can now declare admin sidebar navigation via plugin.json
  - HandleInertiaRequests shares pluginNavigation with frontend
  - NavigationController provides API endpoint for navigation data
  - Supports nested navigation items with permissions and icons
  - Plugins are sorted by position attribute
- **Comprehensive event hooks system**: Created app/helpers/hooks.php for event hooks
  - Model events: hook_model_created/updated/deleted() for any Eloquent model
  - Auth events: hook_auth_login/logout/registered()
  - Navigation hooks: hook_navigation_dashboard(), hook_navigation_account_dropdown()
  - CMS events: settings.updated, plugin.enabled/disabled, theme.activated
  - Generic helpers: hook_event(), dispatch_event(), has_event_listeners()
  - register_model_observers() to integrate Laravel model events with hook system
- **Generic plugin config controller**: Created PluginConfigController for automatic plugin configuration UI
  - Uses getConfigFields() method from Plugin base class to generate config forms
  - Supports multiple field types: text, number, boolean, array, json, etc.
  - Type-specific value processing for each field type
  - Routes: GET/POST /admin/plugins/{plugin}/config, DELETE /admin/plugins/{plugin}/config/clear
- **EventDispatcher system**: Created centralized event system for plugins
  - New app/Events/EventDispatcher.php for plugin event management
  - Methods: listen(), dispatch(), forget(), hasListeners(), flush(), registerPluginListeners()
  - Plugins can now listen to and dispatch events via plugin.json manifest
  - PluginServiceProvider automatically registers event listeners from manifests
  - Helper function: register_plugin_event_listeners()
- **Plugin manifest system**: Added plugin.json manifest support for plugins
  - Created app/helpers/plugin.php with helper functions for reading plugin manifests
  - Functions: plugin_manifest(), plugin_navigation(), plugin_widgets(), plugin_events(), plugin_routes_config()
  - Supports both new 'navigation' format and legacy 'admin_section' format
  - Shop plugin.json updated with widgets and admin_section using href instead of route
- **Shop plugin manifest updates**: Added widgets configuration and fixed admin navigation links
  - Changed from route-based to href-based navigation links for better compatibility
  - Added shop_stats widget for dashboard

### Fixed
- **Shop plugin routes**: Removed duplicate /shop prefix from admin routes
  - PluginServiceProvider already adds 'admin/plugins/shop' prefix
  - Routes were generating /admin/plugins/shop/shop/ instead of /admin/plugins/shop/
  - All admin routes now start from / (relative) for proper prefix handling
- **Plugin activation persistence**: Fixed PluginServiceProvider to properly handle enabled_plugins array
  - The Setting model already handles JSON encoding/decoding via $jsonEncoded array
  - Removed redundant JSON decoding logic that was causing plugin state to not persist
  - Simplified loadPlugins() to use flatten()->filter()->unique()->values() pattern

## [1.3.67] - 2026-02-03

### Fixed
- **Remaining hardcoded strings in Admin pages**: Completed translation cleanup for all remaining hardcoded confirm/alert messages
  - Updated Onboarding/Index.tsx with admin.onboarding.* translation keys
  - Updated Notifications/Index.tsx with admin.notifications.* translation keys
  - Updated Translations/Index.tsx with admin.translations.index.* translation keys
  - Updated Updates/Index.tsx with admin.update.index.install_confirm_with_backup key
  - Updated Shop/PromoCodes/Index.tsx with admin.shop.promo_codes.* translation keys
  - Added complete FR and EN translations for onboarding, notifications, promo_codes modules

## [1.3.66] - 2026-02-03

### Fixed
- **Database page hardcoded strings**: Replaced all hardcoded French confirm/alert messages with trans() calls
  - Updated Database/Index.tsx to use trans() from @/lib/i18n instead of useTrans() hook
  - Added missing database translation keys (restore_confirm, restore_success, delete_backup_confirm, import_success, optimize_confirm, optimize_success, truncate_confirm, truncate_success)
  - Added complete database section to EN admin.php translations

## [1.3.65] - 2026-02-03

### Fixed
- **Shop pages hardcoded strings**: Replaced all hardcoded French strings with trans() calls
  - Updated Items/Index.tsx with admin.shop.items.* translation keys
  - Updated Categories/Index.tsx with admin.shop.categories.* translation keys
  - Added items_count pluralization support
  - Added complete FR and EN translations for shop module

## [1.3.64] - 2026-02-03

### Fixed
- **Translations plugin hardcoded strings**: Replaced all hardcoded English strings with trans() calls
  - Added missing translation keys to FR and EN admin.php (admin.translations.index.*)
  - Removed orphaned handleSyncMarketplace function reference
  - Removed unused RefreshCw icon import
- **Translation cleanup**: Removed unused marketplace 'resources' translation keys from FR and EN admin.php

## [1.3.63] - 2026-02-03

### Removed
- **Marketplace translations plugin integration**: Removed marketplace sync from Translations plugin
  - Removed `syncMarketplace()` method from TranslationController
  - Removed marketplace sync button from Translations/Index.tsx
  - Removed auto-sync and sync_interval config fields from Translations plugin
  - Updated plugin description to remove marketplace references

### Fixed
- **Documentation**: Updated CLAUDE.md to remove marketplace integration references

## [1.3.62] - 2026-02-03

### Removed
- **Marketplace sidebar navigation**: Removed marketplace section from admin sidebar
  - Removed marketplace heading, packages, pending, and sellers links from AuthenticatedLayout
  - Removed marketplace translations from FR and EN admin.php (nav section and themes section)

- **Marketplace installer integration**: Removed marketplace integration from InstallCommand
  - Removed `fetchMarketplaceData()` and `$marketplaceData` property
  - Removed `downloadFromMarketplace()`, `installTheme()`, and `installPlugin()` methods
  - Removed `marketplace_url` from config/installer.php
  - Installer now uses local/default themes and plugins only

## [1.3.61] - 2026-02-03

### Fixed
- **Users page translations**: Added missing `admin.users.index.view` and `admin.users.index.edit` keys in FR
- **Button icon spacing**: Reduced icon-to-text spacing from `mr-2` to `mr-1` for tighter, cleaner buttons
- **Badge icon spacing**: Reduced badge icon spacing from `mr-1` to `mr-0.5` for compact badges

## [1.3.60] - 2026-02-03

### Removed
- **Marketplace module**: Completely removed marketplace integration from CMS core
  - Removed MarketplaceController, ResourceController, ResourceInstallController
  - Removed marketplace routes (web and admin)
  - Removed marketplace translations (resources.php, marketplace.php)
  - Removed marketplace_sso_redirect() helper function
  - Removed marketplaceUrl from shared Inertia props
  - Removed marketplace configuration from config/services.php and config/exiloncms.php
  - Removed marketplace feature flag from config
  - Deleted Admin/Resources pages directory
  - Deleted marketplace-registry.json configuration file

## [1.3.59] - 2026-02-03

### Fixed
- **Onboarding checklist translations**: Added complete i18n support for admin onboarding in FR and EN
- **Onboarding checklist styling**: Updated to use Card component matching dashboard client design
- **Onboarding skip confirmation**: Added missing `skip_confirm` translation key

### Changed
- **OnboardingChecklist component**: Now uses `trans()` for all text content with proper translation keys
- **Onboarding layout**: Changed from custom div wrapper to shadcn/ui Card component for consistency
- **Admin Dashboard layout**: Now uses same structure as client dashboard (removed AdminLayout wrapper)
  - Header matches dashboard client style
  - Direct Card layout without AdminLayout/AdminLayoutHeader/AdminLayoutContent wrappers
  - Consistent spacing with `space-y-6`

## [1.3.58] - 2026-02-01

### Added
- **Vorix theme**: Modern digital agency theme with light/dark mode switcher
  - Theme switcher component with animated sun/moon toggle
  - Mega menu navigation with thumbnail previews
  - ScrollToTop button with smooth animation
  - Animated counter component for statistics
  - Hero carousel with Framer Motion
  - Service cards with hover effects and parallax
  - Testimonial slider component
  - 3 Home page variants

- **Wion theme**: Creative digital agency theme with particle effects
  - Particle background component with canvas-based animation
  - Portfolio grid with category filtering and hover effects
  - GSAP-style animations converted to Framer Motion
  - Multiple homepage layouts
  - Video hero component support
  - Service tabs component
  - About page variations (3 layouts)

## [1.3.57] - 2026-02-01

### Added
- **Hostinkar theme**: Complete professional web hosting theme with modern design
  - 4 Home page variants (Classic Hero, Modern Split, Minimal Design, Enterprise Focus)
  - Core components: HeroSection, HostingPlans, FeaturesSection, TestimonialCarousel, ServicesSection, DomainSearch, MegaMenu
  - Bootstrap to Tailwind CSS conversion with shadcn/ui components
  - Framer Motion animations replacing AOS
  - Configuration system for choosing home variants and enabling/disabling sections
  - TypeScript support with proper type definitions
  - Custom CSS with theme variables for colors and animations
  - Responsive design with mobile-first approach

### Fixed
- **Blog routes 404**: Fixed PluginServiceProvider route loading by wrapping `require` in proper callback function
- **JSON-encoded plugin IDs**: Fixed enabled_plugins setting returning JSON-encoded strings instead of array
- **Laravel 12 Route::group()**: Removed outer Route::group() wrapper from blog routes to match Laravel 12 API

### Changed
- **Blog theme home page**: Simplified to only Hero, Articles récents, Newsletter, and Footer
  - Removed Features, FeaturesCards, FAQ, Contact, Feedbacks sections
  - Newsletter (BookACall component) now appears after articles

## [1.3.56] - 2026-02-01

### Fixed
- **Blog routes 404**: Removed duplicate `blog` prefix from plugin routes - PluginServiceProvider already adds prefix, causing /blog/blog/... URLs
- **Translations system**: All blog components now use `trans()` for dynamic translations instead of hardcoded text
- **Button spacing**: Fixed huge gap between icon and text in newsletter button by removing absolute positioning
- **Language detection**: Fixed language selector not showing correct selection

### Added
- **Blog translations**: Added complete translation keys for blog in fr/messages.php and en/messages.php
  - Hero, Features, FeaturesCards, FAQ, Contact, Newsletter
  - Blog pages (Index, Show) translations

## [1.3.55] - 2026-02-01

### Fixed
- **Language selector detection**: Now correctly reads locale from settings.shared instead of document.lang
- **Navbar positioning**: Removed `fixed` position, navbar now scrolls with content as requested

## [1.3.54] - 2026-02-01

### Added
- **Language selector in user dropdown**: Users can now switch between English (en) and French (fr) directly from the dropdown menu
  - Added LocaleController with /locale route
  - Updated SetLocale middleware to check session for user preference
  - Added DropdownMenuSub with language options in DropdownUser

### Changed
- **Blog theme layout**: Hero stays at max-w-screen-2xl, but "Articles récents" section reverts to max-w-7xl

### Fixed
- **Navbar scroll issue**: Added `initial={false}` to Framer Motion motion.div to prevent unwanted animations that could cause navbar scroll
- **Dropdown language sub-menu**: Properly displays current language with checkmark

## [1.3.53] - 2026-02-01

### Changed
- **Blog theme layout width**: Increased from max-w-7xl to max-w-screen-2xl for more content space

### Fixed
- **Cart button visibility**: Set showCart=false on blog theme home since shop plugin is not fully functional
- **NavbarElementRequest PHP error**: Fixed undefined function plugins() by using PluginLoader directly

## [1.3.52] - 2026-02-01

### Fixed
- **Hero component**: Removed SocialMediaCard element that didn't fit blog theme
- **Hero colors**: Replaced hardcoded emerald colors with CMS variables
  - Banner: `bg-emerald-500/50` → `bg-primary/50`
  - Button: `border-emerald-700 bg-gradient-to-b from-emerald-500 to-brand` → `border-primary/70 bg-gradient-to-b from-primary to-secondary`

## [1.3.51] - 2026-02-01

### Changed
- **Acernity template text transformed for blog theme**: All hiring/recruitment themed text replaced with blog-focused content
  - Hero: "Share stories. Connect with readers worldwide."
  - Features: "Go from idea to published"
  - FeaturesCards: "Powerful search", "Lightning-fast editor", "Auto-save"
  - FAQData: Blog-focused questions and answers
  - Contact: "Readers love us" and blog community text
- **Blog theme Home page layout**: Removed unnecessary sections (ProductPreview, Grids, MapSection, Pricing)
  - Kept: Hero, Features, FeaturesCards, Featured Post, Blog Grid, Feedbacks, FAQSection, Contact
  - All sections now use max-w-7xl container width
- **BookACall component**: Replaced "Book a call" with "Subscribe" for newsletter
  - Removed "Powered by Aceternity" footer text
- **FeaturesCards**: Increased width from max-w-4xl to max-w-7xl

### Added
- **Blog Index page** (resources/js/pages/Blog/Index.tsx): Lists all blog posts with pagination
- **Blog Show page** (resources/js/pages/Blog/Show.tsx): Displays single blog post with comments and related posts
- **Newsletter signup section** in Blog Index page

### Fixed
- **Blog plugin 404 error**: Created missing Blog/Index and Blog/Show pages
  - Blog routes now work correctly at /blog and /blog/{slug}

## [1.3.50] - 2026-01-31

### Added
- **Complete Acernity playful-marketing template recreation for blog theme**
  - Hero section with floating cards, background dots pattern, animated text
  - Features section with Badge header
  - FeaturesCards with ProfileSearch, SymbolsSpeed, CloudIcon (using CMS primary color)
  - ProductPreview with gradient background and floating IconBoxHero elements
  - Grids section with IconBoxHero, Analytics, social media cards, and ChartCard
  - MapSection with WorldMap, AnimatedCounter, and Checks components
  - Pricing section with 3 tiers (Hobby, Starter/Featured, Pro) using exact template structure
  - FAQSection with Accordion component and IconBoxHero decoration
  - Feedbacks section with testimonial cards and video banner
  - Contact section with social proof avatars and BookACall form
- **Acernity UI Components**:
  - Logo - Lightning bolt SVG with CMS primary color
  - IconBoxHero - Floating logo box with gradient and shadow
  - Analytics - Calendar card with meeting items
  - SocialMediaCard - Social media integration card with emoji placeholders
  - PaperPinCard - Interview cards with avatars and dots menu
  - Hero - Main hero with floating decorative elements and animated words
  - Features - Section header with Badge
  - Header - Reusable section header component
  - ContentCard - Title and description card component
  - ChartCard - Time tracker chart with graph bars
  - Checks - Feature checkmarks with hover animation
  - Grids - Complex grid layout with cards and charts
  - Pricing - Three-tier pricing with featured plan decoration
  - FAQSection - Accordion FAQ with IconBoxHero
  - MapSection - World map with AnimatedCounter
  - Feedbacks - Testimonial grid with video banner
  - Contact - Social proof avatars with BookACall
- **Supporting Components**:
  - WorldMap - SVG map with animated path lines and avatar dots
  - Accordion - Radix UI accordion with custom styling
  - AnimatedCounter - Counter using motion/react hooks
  - BookACall - Email input with gradient button
  - Avatar - Dicebear avatar component
  - Badge - Styled badge with shadow
  - Icons - Dots, Twitter, Linkedin, Github, Facebook, Instagram, HorizontalDots, InfoIcon, SandWatch, CheckIcon, GithubIcon
- **Data utilities**:
  - aceternity-data.ts with graphData, FAQData, WorldMapDotsData, WorldMapAvatarsData, transition, variants, cardVariants

### Changed
- **Blog theme Home page**: Now uses complete Acernity playful-marketing template structure
  - Hero → Features → FeaturesCards → ProductPreview → Header → Grids → MapSection → Pricing → Feedbacks → FAQSection → Contact
  - All colors replaced with CMS variables (hsl(var(--primary)), hsl(var(--secondary)), etc.)

## [1.3.49] - 2026-01-31

### Fixed
- **Import statements in blog theme Home page**: Changed to default imports for Acernity components
  - BlogHero, Header, FeaturesCards, ProductPreview use default exports

## [1.3.48] - 2026-01-31

### Changed
- **Blog Theme Home Page - Complete Acernity UI Template**: Full redesign with all template sections
  - Features section with Header and FeaturesCards (lucide-react icons: Search, Zap, Cloud)
  - ProductPreview section with gradient background and floating decorative elements
  - Pricing section with 3 tiers (Hobby, Starter, Pro) using CMS colors
  - FAQ section with Accordion component
  - Feedback/Testimonials section with avatar cards
  - Contact section with social proof avatars
  - Stats section with icons (Users, Globe, Clock)
  - All sections use CMS primary/secondary colors via CSS variables
- **Acernity UI Components Added**:
  - Header component - Section header with badge
  - FeaturesCards component - Feature grid with lucide-react icons
  - ProductPreview component - Product showcase with gradient
  - Icons file - CheckIcon, ProfileSearch, SymbolsSpeed, CloudIcon with CMS colors
- **DashboardLayout Sidebar Fix**: Added documentation icon (FileText) and official site link (BrandTabler)
- **Profile and Notifications pages**: Now use DashboardLayout instead of AuthenticatedLayout

### Fixed
- **User-facing sidebar consistency**: Documentation icon changed from Home to FileText
- **Missing official site link**: Added to user sidebar like admin sidebar
- **Profile and Notifications pages**: No admin sections on user-facing pages

## [1.3.47] - 2026-01-31

### Fixed
- **Profile and Notifications pages**: Now use DashboardLayout instead of AuthenticatedLayout
  - No admin sections (USERS, CONTENT, MARKETPLACE, SETTINGS) on user-facing pages
  - Consistent user-facing sidebar across /dashboard, /profile, /notifications

## [1.3.46] - 2026-01-31

### Changed
- **Dashboard Layout with Sidebar**: Added sidebar to /dashboard page
  - Uses SidebarLayout component with collapsible sidebar
  - Simplified navigation (Dashboard, Profile, Notifications, Shop if enabled)
  - NO admin sections (USERS, CONTENT, MARKETPLACE, SETTINGS)
  - User-facing only - admin sections remain on /admin pages
- **Acernity UI Components**: Added Badge and Header components
  - Badge component with shadow and border for section labels
  - Header component for section titles with badge support
  - Uses CMS border colors instead of hardcoded values

### Fixed
- **Dashboard sidebar issue**: Dashboard now has sidebar without admin sections
- **DashboardLayout import fix**: Correctly uses DashboardLayout instead of AuthenticatedLayout

## [1.3.45] - 2026-01-31

### Changed
- **Blog Theme - Complete Acernity UI template integration**
  - Exact copy of playful-marketing template structure with CMS colors
  - Navbar separated from Hero section (using BlogThemeLayout)
  - Hero with radial dot grid background (10px spacing)
  - Floating decorative elements (IconBoxHero, Analytics, PaperPinCard)
  - Word-by-word animation on hero title
  - Banner component showing posts count
  - All template colors replaced with CMS primary/secondary variables
  - Categories section with Acernity-style cards
  - Newsletter section with rounded-[3rem] and dot pattern background
- **Blog Theme Layout Fix**: Created BlogThemeLayout for proper full-width hero
  - Hero now displays at full width with proper padding
  - Content sections use max-w-6xl container for proper readability
  - White background for better hero contrast
  - Fixed theme Home page path: themes/blog/resources/views/Home.tsx
- **Admin Sidebar Reorganization**: Restructured Settings navigation
  - SYSTEM section moved to end of Settings
  - Updates moved from EXTENSIONS to SYSTEM section
  - EXTENSIONS now only contains Plugins
- **Dashboard Layout Separation**: Fixed /dashboard to use user-facing layout
  - /dashboard now uses DashboardLayout without admin sidebar
  - Clean header with basic navigation (Dashboard, Profile, Cart, User menu)
  - Admin pages remain with full AdminLayout and sidebar navigation

### Fixed
- **Dashboard layout issue**: Dashboard/Index.tsx now correctly uses DashboardLayout instead of AuthenticatedLayout
- **Theme page resolution**: Fixed HomeController to check correct theme views path
- **User dropdown z-index**: Adjusted dropdown z-index to prevent layout shift (z-[70])
- **Users page total variable**: UserController now passes total count for translation
- **Plugins toggle redirect**: Changed back() to redirect()->route() for proper Inertia page refresh

## [1.3.44] - 2026-01-31

### Changed
- **Blog Theme - Acernity UI Template**: Complete redesign matching playful-marketing template
  - Removed diagonal grid background from site-wide layout
  - Navbar now integrated into Hero section (no fixed positioning, no blur)
  - Radial dot grid background instead of diagonal cross pattern
  - Floating decorative elements (IconBoxHero, Analytics, PaperPinCard) positioned absolutely
  - Word-by-word text animation matching original template
  - Banner component showing posts count with calendar icon
- **Categories Section Redesign**: Modern card-based layout
  - Larger category cards with icon badges
  - Gradient color indicators for each category
  - Hover effects with shadow and border color change
- **Newsletter Section**: Clean white design with subtle dot pattern background

## [1.3.43] - 2026-01-31

### Fixed
- **Theme System for Inertia.js**: Fixed theme page override system with simple views-based approach
  - Theme pages now use Laravel views convention: `themes/{theme}/resources/views/{Page}.tsx`
  - Inertia resolver automatically checks active theme first, then falls back to core pages
  - ALL pages can now be overridden by themes (Home, Blog, Shop, etc.)
  - Preview mode works correctly via session-based `preview_theme`
- **Theme Colors from CMS**: Complete Tailwind-based theming system
  - Primary/secondary colors from CMS settings (`primary_color`, `secondary_color`)
  - Colors injected as HSL values in `app.blade.php` for Tailwind compatibility
  - Fixed "default" color handling - now properly falls back to blue/violet
  - Auto-adjusts foreground color using `color_contrast()` helper
  - Added `hex2hsl()` and `hex2hsl_value()` helper functions to `app/color_helpers.php`
- **Acernity UI Integration**: Added modern UI components library
  - Installed `@aceternity/ui` and `framer-motion` for modern animations
  - Created Acernity-style components in `resources/js/components/aceternity/`
  - BlogHero component with animated diagonal grid background and floating elements
  - BlogPostCard component with hover animations and CMS colors
  - FeaturedBlogPost component for large featured article display
  - All components use CMS primary/secondary colors via Tailwind classes
- **blog theme**: Complete rewrite with Acernity UI design
  - Hero section with animated background, floating shapes, and smooth fade-in animations
  - Featured post with gradient background pattern
  - Categories section with gradient cards
  - Newsletter section with gradient background and pattern
  - All hardcoded colors replaced with `from-primary to-secondary` gradients
- **Diagonal Grid Background**: Applied to entire site via PublicLayout
  - Cross-line pattern using CSS gradients with 40px spacing
  - Applied globally to all public pages

### Available Tailwind classes for CMS colors:
- `bg-primary` / `text-primary-foreground` - Primary color with auto-contrast text
- `text-primary` - Primary color for links and accents
- `bg-primary/10` / `bg-secondary/5` - Opacity variants for backgrounds
- `from-primary to-secondary` - Gradient backgrounds
- `hover:shadow-primary/25` - Shadow colored by primary

## [1.3.42] - 2026-01-31

### Changed
- **CLAUDE.md Documentation Updates**
  - Updated project overview to reflect general-purpose CMS (not just Minecraft)
  - Updated plugin system documentation to reflect PHP 8 attribute-based system (#[PluginMeta])
  - Removed outdated plugin.json format examples
  - Added Payment Gateway System documentation (Paymenter-style architecture)
  - Added Theme System documentation with page override priority and preview mode
  - Added "Creating a new plugin" and "Creating a new payment gateway" patterns
  - Added changelog update requirement to Important Notes section

## [1.3.41] - 2026-01-30

### Added
- **Dynamic Plugin Config in Sidebar**: Enabled plugins with config now appear in Settings → PLUGIN CONFIG
  - Automatically shows plugin configuration links (Blog, Shop, Notifications, etc.)
  - Shared data `enabledPluginConfigs` provides plugin list to frontend
  - Configure button removed from plugins page - now in sidebar for consistency
- **Content Section in Sidebar**: New content management section
  - Pages, Posts (Blog), Images, Redirects links grouped together
  - Clean separation of content management from other admin functions
- **Theme Override System**: Now works correctly like Paymenter
  - HomeController checks if active theme has custom Home page
  - Renders theme-specific page (e.g., `themes/blog/Home`) when available
  - Falls back to core page when theme has no override
  - Inertia app.tsx updated to resolve theme pages dynamically

### Fixed
- **Theme Validation**: Fixed JSON decoding of `enabled_plugins` setting
  - Properly handles JSON string, array, and nested formats
  - Theme activation now correctly detects enabled plugins (shop, blog, etc.)
  - Fixed both `index()` and `checkPluginDependencies()` methods
- **Cart Routes Error**: Fixed Ziggy error `route 'cart.items' not found`
  - CartSheet now uses direct URLs instead of Ziggy routes
  - Changed from `fetch(route('cart.items'))` to `router.get('/shop/cart/items')`
  - All cart routes now work properly when shop plugin is enabled
- **Settings Sidebar Reorganization**: Consolidated settings into logical groups
  - General: Site-wide settings
  - System: Security, Maintenance, Logs (grouped)
  - Appearance: Navbar, Themes (grouped)
  - Extensions: Plugins, Updates (grouped)
  - Plugin Config: Shows only enabled plugins with config (dynamic)

### Changed
- **Plugins Index Page**: Removed Configure button
  - Plugins with settings now show "Configuration available in Settings → Plugin Config"
  - Cleaner UI with only Enable/Disable and Delete buttons
  - All plugin configuration now centralized in sidebar under Settings

## [1.3.40] - 2026-01-30

### Fixed
- **Plugin Config Page Styling**: Updated to use shadcn/ui components for consistency
  - Replaced basic Tailwind classes with shadcn/ui (Card, Button, Input, Switch, Select, Checkbox, Textarea)
  - Now matches the visual style of other admin pages (Posts, Users, etc.)
  - Added proper back button with icon, badges for version/author
- **Plugin Config Translations**: Added French and English translations
  - All strings now use trans() helper for i18n support
  - Translations added to `resources/lang/en/admin.php` and `resources/lang/fr/admin.php`
  - Keys: `admin.plugins.configure.*`
- **Blog Admin Routes Documentation**: Clarified blog admin route locations
  - Posts: `/admin/posts`
  - Categories: `/admin/blog/categories`
  - Tags: `/admin/blog/tags`
  - Comments: `/admin/blog/comments`

## [1.3.39] - 2026-01-30

### Fixed
- **Plugin Config Page**: Created missing Admin/Plugins/Config page for plugin configuration
  - Added route `POST admin/plugins/{plugin}/config` for saving configuration
  - Added `update()` method to PluginController to save settings
- **Theme Validation**: Fixed theme plugin validation logic
  - Added JSON decoding for `enabled_plugins` setting in ThemeController
  - Fixed `checkPluginDependencies()` and `getMissingPlugins()` methods
  - Theme activation now correctly checks enabled plugins
- **Shop Plugin Routes**: Fixed shop plugin `/shop` route returning 404
  - Changed route prefix from `/plugins/{pluginId}` to just `/{pluginId}` in PluginServiceProvider
  - Shop routes now correctly load at `/shop` instead of `/plugins/shop`
- **Vite Module Resolution**: Fixed Vite build errors from theme import resolution
  - Simplified Home.tsx to remove complex theme override system
  - Theme override system will be re-implemented in future update with proper module resolution
- **Plugin Types**: Created centralized type definitions for plugins
  - Added `plugins/shop/resources/js/types/index.ts` with all shop-related types
  - All shop pages now use centralized types for maintainability

### Added
- **Plugin Config Files**: Added configuration for all plugins that were missing it
  - Analytics: tracking options, data retention, custom tracking code
  - Docs: search, comments, TOC generation, breadcrumbs
  - Legal: page toggles, cookie banner, company info
  - Pages: search, author display, comments
  - Releases: RSS, download counts, auto-notify, markdown
  - Translations: auto-detect, language switcher, user contributions
  - Votes: cooldown, rewards, reminders, voting sites
- **Shop Plugin Pages**: Created React pages for shop functionality
  - Shop/Index: Category listing page
  - Shop/Category: Category detail with items
  - Shop/Item: Product detail page
  - Cart/Items: Shopping cart page

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
- **Installation Database Error**: Fixed ThemeServiceProvider trying to access database before installation
  - Added `Schema::hasTable('settings')` check before accessing settings
  - Prevents errors during fresh installation when database doesn't exist yet

### Added
- **Payment Gateway System**: Complete payment system inspired by Paymenter
  - `Extension` base class for all extensions with config management
  - `Gateway` abstract class for payment gateways
  - `ExtensionHelper` with payment methods (pay, addPayment, handleWebhook)
  - Support for billing agreements (recurring payments)
  - Webhook handling for payment providers
  - Migration helpers for extensions
  - Auto-discovery via composer autoload (same as plugins)
- **Auto-Update Script**: Paymenter-style update system (`update.sh`)
  - Automatic backup before update
  - Downloads latest release from GitHub
  - Runs migrations and optimizations
  - Preserves user permissions
  - Usage: `./update.sh` or `./update.sh --url=CUSTOM_URL`
- **Auto-Enable Required Plugins**: Theme activation now automatically enables required plugins
  - ThemeLoader automatically enables plugins when activating a theme
  - ThemeServiceProvider auto-enables theme dependencies on boot
  - Existing enabled plugins remain active when switching themes
  - Blog theme now requires blog plugin for proper functionality
- **EnableBlogPluginSeeder**: Database seeder to enable blog plugin by default
  - Sets blog plugin as enabled in settings
  - Sets blog theme as active theme
  - Run with: `php artisan db:seed --class=EnableBlogPluginSeeder`

### Changed
- **PluginController**: Removed unused `ThemeLoader` dependency
- **Vite Config**: Added automatic discovery and inclusion of theme CSS files
- **Theme Dependencies**: Blog theme now declares `plugin:blog` as requirement

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
