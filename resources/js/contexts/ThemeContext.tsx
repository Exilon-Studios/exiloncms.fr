/**
 * Theme Context - Manages theme state and application
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemePreset, getDefaultThemePreset, getThemePreset, themeToCSSVariables } from '@/lib/themes';

interface ThemeContextType {
  theme: ThemePreset;
  mode: 'light' | 'dark';
  setTheme: (themeId: string) => void;
  setMode: (mode: 'light' | 'dark') => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  defaultMode?: 'light' | 'dark' | 'system';
}

export function ThemeProvider({ children, defaultTheme = 'gray', defaultMode = 'system' }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemePreset>(getDefaultThemePreset());
  const [mode, setModeState] = useState<'light' | 'dark'>('light');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedThemeId = localStorage.getItem('theme-preset');
    if (savedThemeId) {
      const savedTheme = getThemePreset(savedThemeId);
      if (savedTheme) {
        setThemeState(savedTheme);
      }
    }

    const savedMode = localStorage.getItem('theme-mode');
    if (savedMode === 'light' || savedMode === 'dark') {
      setModeState(savedMode);
    } else if (defaultMode === 'system') {
      // Check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setModeState(systemPrefersDark ? 'dark' : 'light');
    }
  }, [defaultMode]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    // Apply theme colors as CSS variables
    const colors = mode === 'light' ? theme.light : theme.dark;
    root.style.setProperty('--background', colors.background);
    root.style.setProperty('--foreground', colors.foreground);
    root.style.setProperty('--card', colors.card);
    root.style.setProperty('--card-foreground', colors.cardForeground);
    root.style.setProperty('--popover', colors.popover);
    root.style.setProperty('--popover-foreground', colors.popoverForeground);
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--primary-foreground', colors.primaryForeground);
    root.style.setProperty('--secondary', colors.secondary);
    root.style.setProperty('--secondary-foreground', colors.secondaryForeground);
    root.style.setProperty('--muted', colors.muted);
    root.style.setProperty('--muted-foreground', colors.mutedForeground);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--accent-foreground', colors.accentForeground);
    root.style.setProperty('--destructive', colors.destructive);
    root.style.setProperty('--destructive-foreground', colors.destructiveForeground);
    root.style.setProperty('--border', colors.border);
    root.style.setProperty('--input', colors.input);
    root.style.setProperty('--ring', colors.ring);

    // Apply dark mode class
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Store in localStorage
    localStorage.setItem('theme-preset', theme.id);
    localStorage.setItem('theme-mode', mode);
  }, [theme, mode]);

  const setTheme = (themeId: string) => {
    const newTheme = getThemePreset(themeId);
    if (newTheme) {
      setThemeState(newTheme);
    }
  };

  const setMode = (newMode: 'light' | 'dark') => {
    setModeState(newMode);
  };

  const toggleMode = () => {
    setModeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, mode, setTheme, setMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to use theme context
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
