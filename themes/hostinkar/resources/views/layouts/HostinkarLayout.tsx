/**
 * Hostinkar Theme - Main Layout
 * Web hosting theme with modern animations and shadcn/ui components
 */

import React, { ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import Navbar from '@/components/theme/Navbar';
import Footer from '@/components/theme/Footer';
import ThemeSettings from '@/components/theme/ThemeSettings';
import { trans } from '@/lib/i18n';

interface HostinkarLayoutProps {
  children: ReactNode;
  showCart?: boolean;
  variant?: 'one' | 'two' | 'three' | 'four';
}

export default function HostinkarLayout({
  children,
  showCart = false,
  variant = 'one'
}: HostinkarLayoutProps) {
  const { settings } = usePage<PageProps>().props as any;

  // Apply theme settings from localStorage or API
  const [themeSettings, setThemeSettings] = useState({
    homeVariant: 'one',
    showFeatures: true,
    showTestimonials: true,
    showServices: true,
    showDomainSearch: true,
    darkTheme: settings?.darkTheme || true,
    primaryColor: '#0066FF',
    secondaryColor: '#00D4FF',
    accentColor: '#00FF94'
  });

  // Load theme settings on component mount
  React.useEffect(() => {
    const savedSettings = localStorage.getItem('hostinkar-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setThemeSettings(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Failed to load theme settings:', e);
      }
    }
  }, []);

  // Apply dark theme
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', themeSettings.darkTheme);
  }, [themeSettings.darkTheme]);

  // Apply custom colors via CSS variables
  React.useEffect(() => {
    document.documentElement.style.setProperty('--hostinkar-primary', themeSettings.primaryColor);
    document.documentElement.style.setProperty('--hostinkar-secondary', themeSettings.secondaryColor);
    document.documentElement.style.setProperty('--hostinkar-accent', themeSettings.accentColor);
  }, [themeSettings]);

  return (
    <div className={`min-h-screen font-sans antialiased ${themeSettings.darkTheme ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Navbar showCart={showCart} />
      <main className="min-h-[calc(100vh-8rem)]">
        <div className="container mx-auto px-4">
          {children}
        </div>
      </main>
      <Footer />
      <ThemeSettings />
    </div>
  );
}
