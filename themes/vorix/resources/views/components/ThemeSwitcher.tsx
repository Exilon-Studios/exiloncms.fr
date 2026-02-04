'use client';

import { Moon, Sun } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useContext(ThemeContext);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-8 w-8 flex items-center justify-center">
        <div className="h-4 w-4 bg-gray-300 rounded-full animate-pulse" />
      </div>
    );
  }

  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  const getThemeIcon = () => {
    return theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setTheme(nextTheme)}
        className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200"
        aria-label="Toggle theme"
      >
        {getThemeIcon()}
      </button>

      <div className="absolute top-full right-0 mt-1 rounded-md bg-background border shadow-lg p-1 z-50 hidden group-hover:block">
        <div className="text-xs text-muted-foreground px-2 py-1 mb-1">
          {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
        </div>
      </div>
    </div>
  );
}