/**
 * Theme Switcher - Allows users to switch between theme presets and light/dark mode
 */

import { Moon, Sun, Palette } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { themePresets } from '@/lib/themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ThemeSwitcherProps {
  className?: string;
}

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const { theme, mode, setTheme, setMode, toggleMode } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`h-9 w-9 ${className || ''}`}
          aria-label="Switch theme"
        >
          <Palette className="h-4 w-4" />
          <span className="sr-only">Switch theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Light/Dark Mode Toggle */}
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={toggleMode}>
            <Sun className="mr-2 h-4 w-4" />
            <span>Switch to {mode === 'light' ? 'Dark' : 'Light'} Mode</span>
            {mode === 'dark' ? (
              <Moon className="ml-auto h-4 w-4" />
            ) : (
              <Sun className="ml-auto h-4 w-4" />
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Color Theme Presets */}
        <DropdownMenuLabel>Color Scheme</DropdownMenuLabel>
        <DropdownMenuGroup>
          {themePresets.map((preset) => (
            <DropdownMenuItem
              key={preset.id}
              onClick={() => setTheme(preset.id)}
              className={theme.id === preset.id ? 'bg-accent' : ''}
            >
              <div
                className="mr-2 h-4 w-4 rounded border"
                style={{
                  backgroundColor: preset.light.primary,
                }}
              />
              <span className="flex-1">{preset.name}</span>
              {theme.id === preset.id && (
                <span className="ml-auto text-xs text-muted-foreground">Active</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Simple Theme Toggle - Just switches between light and dark mode
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { mode, toggleMode } = useTheme();

  return (
    <button
      onClick={toggleMode}
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 ${className || ''}`}
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
