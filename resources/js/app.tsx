/**
 * Main Inertia App Entry Point
 * Type-safe, DRY, with progress indicator
 */

import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
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

createInertiaApp({
  title: (title) => `${title} - ${appName}`,

  // Auto-import pages from pages directory with theme override support
  resolve: (name) => {
    // Inject active theme ID into window for client-side theme resolution
    if (props.initialPage.props.activeTheme) {
      (window as any).__exiloncms_theme = props.initialPage.props.activeTheme;
    }

    // Try to resolve theme page first, then fall back to core pages
    return resolvePageComponent(
      `./pages/${name}.tsx`,
      {
        // Core CMS pages
        ...import.meta.glob('./pages/**/*.tsx'),
        // Theme pages (will override core pages if they exist)
        ...import.meta.glob('./../../../themes/*/resources/js/pages/**/*.tsx', {
          eager: false,
        }),
      }
    );
  },

  setup({ el, App, props }) {
    // Inject active theme ID into window for client-side theme resolution
    if ((props as any).initialPage?.props?.activeTheme) {
      (window as any).__exiloncms_theme = (props as any).initialPage.props.activeTheme;
    }

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
