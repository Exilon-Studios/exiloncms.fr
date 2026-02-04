/**
 * Vorix Theme - Main Layout
 * Modern digital agency theme with light/dark mode switcher
 */

import { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import Navbar from '@/components/vorix/Navbar';
import Footer from '@/components/vorix/Footer';
import ScrollToTop from '@/components/vorix/ScrollToTop';
import ThemeSwitcher from '@/components/vorix/ThemeSwitcher';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

interface VorixLayoutProps {
  children: ReactNode;
}

export default function VorixLayout({ children }: VorixLayoutProps) {
  const { settings } = usePage<PageProps>().props as any;
  const [theme, setTheme] = useState<'light' | 'dark'>(settings?.theme || 'dark');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`min-h-screen font-sans antialiased ${theme}`}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <ScrollToTop />
        <ThemeSwitcher />
      </div>
    </ThemeContext.Provider>
  );
}
