/**
 * Main Inertia App Entry Point
 * Type-safe, DRY, with progress indicator
 */

import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { route as ziggyRoute } from '../../vendor/tightenco/ziggy';
import { ModalProvider } from '@/lib/modalManager';
import { ModalDialog } from '@/components/ui/modal-dialog';
import { ThemeProvider } from '@/contexts/ThemeContext';

const appName = import.meta.env.VITE_APP_NAME || 'MC-CMS';

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

  // Auto-import pages from pages directory
  resolve: (name) =>
    resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob('./pages/**/*.tsx')
    ),

  setup({ el, App, props }) {
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
