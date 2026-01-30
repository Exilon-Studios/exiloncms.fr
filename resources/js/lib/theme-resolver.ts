/**
 * Theme Page Import Helper
 *
 * This utility helps import theme pages that override core CMS pages.
 * Themes can provide their own React components for any page.
 *
 * Usage:
 * ```tsx
 * import { getThemePage, useThemePage } from '@/lib/theme-resolver';
 * import DefaultHomePage from '@/pages/Home';
 *
 * // Try to get theme override, fallback to default
 * const HomePage = getThemePage('Home', DefaultHomePage);
 *
 * // Or use the hook for dynamic loading
 * function MyComponent() {
 *   const HomePage = useThemePage('Home', DefaultHomePage);
 *   return <HomePage />;
 * }
 * ```
 */

import { PageProps } from '@inertiajs/react';
import { lazy, ComponentType, Suspense } from 'react';

/**
 * Active theme ID (injected by Laravel)
 */
declare global {
  interface Window {
    __exiloncms_theme?: string;
  }
}

/**
 * Get the active theme ID
 */
export function getActiveThemeId(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  // Check global window variable (set by Laravel)
  if (window.__exiloncms_theme) {
    return window.__exiloncms_theme;
  }

  // Try to get from Inertia props
  try {
    const props = (window as any).__inertia_page_props as PageProps & { settings?: { activeTheme?: string } };
    return props?.settings?.activeTheme || null;
  } catch {
    return null;
  }
}

/**
 * Import a theme page component
 * Returns null if the theme or page doesn't exist
 */
async function importThemePage(pageName: string): Promise<ComponentType<any> | null> {
  const activeTheme = getActiveThemeId();

  if (!activeTheme) {
    return null;
  }

  try {
    // Try to import from theme: @themePages/Home
    const module = await import(`@/themePages/${pageName}`);
    return module.default || null;
  } catch (error) {
    // Theme page doesn't exist, return null
    console.debug(`[ThemeResolver] No theme override for page: ${pageName}`);
    return null;
  }
}

/**
 * Get a theme page component (sync version)
 * This uses lazy loading and will import the theme page on first render
 *
 * @param pageName - The page name (e.g., 'Home', 'Shop/Index', 'Blog/Show')
 * @param defaultComponent - The default component to use if no theme override exists
 * @returns A component that renders the theme override or default
 */
export function getThemePage<T = any>(
  pageName: string,
  defaultComponent: ComponentType<T>
): ComponentType<T> {
  const activeTheme = getActiveThemeId();

  if (!activeTheme) {
    return defaultComponent;
  }

  // Create a lazy-loaded component that tries to import the theme page
  const ThemePage = lazy(() => importThemePage(pageName).then(module => ({
    default: module || defaultComponent,
  })));

  // Return a wrapper component that handles the lazy loading
  const ThemeWrapper = (props: T) => (
    <Suspense fallback={<defaultComponent {...props} />}>
      <ThemePage {...props} />
    </Suspense>
  );

  ThemeWrapper.displayName = `ThemePage(${pageName})`;

  return ThemeWrapper as ComponentType<T>;
}

/**
 * Hook to get a theme page component
 * Use this in functional components for dynamic theme page loading
 */
export function useThemePage<T = any>(
  pageName: string,
  defaultComponent: ComponentType<T>
): ComponentType<T> {
  return getThemePage(pageName, defaultComponent);
}

/**
 * Check if a theme has an override for a specific page
 */
export function hasThemeOverride(pageName: string): boolean {
  const activeTheme = getActiveThemeId();
  return activeTheme !== null;
}

/**
 * Get all available theme info
 */
export function getThemeInfo(): { id: string | null; hasTheme: boolean } {
  const id = getActiveThemeId();
  return {
    id,
    hasTheme: id !== null,
  };
}

/**
 * HOC to wrap a page with theme override support
 *
 * Usage:
 * ```tsx
 * import { withThemePage } from '@/lib/theme-resolver';
 * import HomePage from './Home';
 *
 * export default withThemePage('Home', HomePage);
 * ```
 */
export function withThemePage<T = any>(
  pageName: string,
  defaultComponent: ComponentType<T>
): ComponentType<T> {
  return getThemePage(pageName, defaultComponent);
}
