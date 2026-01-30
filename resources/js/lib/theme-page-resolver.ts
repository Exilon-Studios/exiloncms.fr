/**
 * Theme Page Resolver
 *
 * This module provides theme page override functionality for ExilonCMS.
 * Themes can override any page (core, plugin, or admin) by providing their own React component.
 *
 * Page Resolution Priority:
 * 1. Active theme page (if exists)
 * 2. Plugin page (if route belongs to plugin)
 * 3. Core CMS page (fallback)
 */

import { PageProps } from '@inertiajs/react';

/**
 * Theme page metadata
 */
interface ThemePage {
  component: React.ComponentType<any>;
  themeId: string;
  pageName: string;
}

/**
 * Registry of all available theme pages
 * Populated by Vite during build
 */
const themePageRegistry: Map<string, ThemePage> = new Map();

/**
 * Register a theme page
 * Called automatically by theme entry files
 */
export function registerThemePage(
  themeId: string,
  pageName: string,
  component: React.ComponentType<any>
): void {
  const key = `${themeId}:${pageName}`;
  themePageRegistry.set(key, {
    component,
    themeId,
    pageName,
  });
}

/**
 * Get the active theme from Inertia props
 */
export function getActiveTheme(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    // @ts-ignore - ExilonCMS adds activeTheme to props
    const pageProps: PageProps & { settings?: { activeTheme?: string } } = window.__inertia_page_props || {};
    return pageProps.settings?.activeTheme || null;
  } catch {
    return null;
  }
}

/**
 * Resolve a page component with theme override support
 *
 * @param pageName - The page name (e.g., 'Home', 'Shop/Index', 'Blog/Show')
 * @param defaultComponent - The default component to use if no theme override exists
 * @returns The resolved component (theme override or default)
 */
export function resolvePage<T = any>(
  pageName: string,
  defaultComponent: React.ComponentType<T>
): React.ComponentType<T> {
  const activeTheme = getActiveTheme();

  if (!activeTheme) {
    return defaultComponent;
  }

  // Check if active theme has an override for this page
  const themeKey = `${activeTheme}:${pageName}`;
  const themePage = themePageRegistry.get(themeKey);

  if (themePage) {
    console.log(`[ThemePageResolver] Using theme override: ${themeKey}`);
    return themePage.component as React.ComponentType<T>;
  }

  // No theme override found, use default
  return defaultComponent;
}

/**
 * Check if a page has a theme override
 */
export function hasThemeOverride(pageName: string): boolean {
  const activeTheme = getActiveTheme();

  if (!activeTheme) {
    return false;
  }

  const themeKey = `${activeTheme}:${pageName}`;
  return themePageRegistry.has(themeKey);
}

/**
 * Get all theme pages for a specific theme
 */
export function getThemePages(themeId: string): ThemePage[] {
  return Array.from(themePageRegistry.values())
    .filter(page => page.themeId === themeId);
}

/**
 * Clear all registered theme pages (useful for testing/HMR)
 */
export function clearThemePageRegistry(): void {
  themePageRegistry.clear();
}

/**
 * Make page props available for client-side theme resolution
 * This is called by Inertia when rendering pages
 */
export function initializeThemePageResolver(pageProps: any): void {
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.__inertia_page_props = pageProps;
  }
}

/**
 * HOC to wrap a page with theme override support
 *
 * Usage:
 * ```tsx
 * import { withThemeOverride } from '@/lib/theme-page-resolver';
 * import DefaultHomePage from './Home';
 *
 * export default withThemeOverride('Home', DefaultHomePage);
 * ```
 */
export function withThemeOverride<T = any>(
  pageName: string,
  DefaultComponent: React.ComponentType<T>
): React.ComponentType<T> {
  const ResolvedComponent = resolvePage<T>(pageName, DefaultComponent);

  // Wrap with display name for debugging
  ResolvedComponent.displayName = `ThemeOverride(${pageName})`;

  return ResolvedComponent;
}
