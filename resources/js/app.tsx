/**
 * Main Inertia App Entry Point
 * Type-safe, DRY, with progress indicator
 *
 * Theme System:
 * - Theme pages are stored in themes/{theme}/resources/views/{Page}.tsx
 * - The resolver checks the active theme first, then falls back to core pages
 * - Simple and elegant - just put your theme overrides in the views folder
 */

import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { route as ziggyRoute } from 'ziggy-js';
import { ModalProvider } from '@/lib/modalManager';
import { ModalDialog } from '@/components/ui/modal-dialog';
import { ThemeProvider } from '@/contexts/ThemeContext';

const appName = import.meta.env.VITE_APP_NAME || 'ExilonCMS';

// Make Ziggy route() available globally
declare global {
  function route(
    name?: string,
    params?: Record<string, unknown> | unknown,
    absolute?: boolean
  ): string;
}

globalThis.route = ziggyRoute;

// Get all pages: core + themes
// Themes use the views directory: themes/{theme}/resources/views/{Page}.tsx
const pages = import.meta.glob([
  './pages/**/*.tsx',
  '../../themes/*/resources/views/**/*.tsx',
], {
  eager: false,
});

createInertiaApp({
  title: (title) => `${title} - ${appName}`,

  resolve: async (name) => {
    // Get active theme from window (set by Blade script on first load)
    let theme = (window as any).__exiloncms_theme;

    console.log('[Inertia Resolve]', {
      page: name,
      windowTheme: theme
    });

    // If we have an active theme, try to load the theme page first
    // Theme pages are at: ../../themes/{theme}/resources/views/{Page}.tsx
    if (theme && theme !== 'default') {
      const themePagePath = `../../themes/${theme}/resources/views/${name}.tsx`;

      console.log('[Inertia Resolve] Trying theme page:', themePagePath);

      // Try both forward slashes and backslashes (Windows compatibility)
      const backslashPath = themePagePath.replace(/\//g, '\\');

      if (themePagePath in pages) {
        console.log('[Inertia Resolve] ✓ Loading theme page (forward slash)');
        const module = await pages[themePagePath]();
        // Vite dynamic imports return { default: component }
        const component = module.default || module;
        console.log('[Inertia Resolve] Returning theme component');
        return component;
      } else if (backslashPath in pages) {
        console.log('[Inertia Resolve] ✓ Loading theme page (backslash)');
        const module = await pages[backslashPath]();
        const component = module.default || module;
        console.log('[Inertia Resolve] Returning theme component');
        return component;
      }

      console.log('[Inertia Resolve] ✗ Theme page not found, using core');
      console.log('[Inertia Resolve] Available paths:', Object.keys(pages).filter(k => k.includes(theme)));
    }

    // Load core page
    const corePagePath = `./pages/${name}.tsx`;
    console.log('[Inertia Resolve] Loading core page');

    if (corePagePath in pages) {
      const module = await pages[corePagePath]();
      return module.default || module;
    }

    throw new Error(`Page not found: ${name}`);
  },

  setup({ el, App, props }) {
    // Get active theme from props and update window immediately
    // This ensures the theme is correct for the CURRENT page load
    const activeTheme = (props as any).initialPage?.props?.settings?.activeTheme ||
                        (props as any).initialPage?.props?.activeTheme;

    (window as any).__exiloncms_theme = activeTheme || 'default';

    console.log('[Inertia Setup] Page loaded, theme:', (window as any).__exiloncms_theme);

    const root = createRoot(el);
    root.render(
      <ThemeProvider>
        <ModalProvider>
          <App {...props} />
          <ModalDialog />
        </ModalProvider>
      </ThemeProvider>
    );
  },

  progress: {
    color: '#4B5563',
    showSpinner: true,
  },
});
