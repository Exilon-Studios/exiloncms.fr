/**
 * Theme Settings Modal - Simplified, Tailwind-based, no preview
 */

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { themePresets } from '@/lib/themes';
import { trans } from '@/lib/i18n';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Palette, Sun, Moon, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ThemeModal({ open, onOpenChange }: ThemeModalProps) {
  const { theme, mode, setTheme, setMode } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme.id);
  const [selectedMode, setSelectedMode] = useState<'light' | 'dark'>(mode);

  const handleSave = () => {
    setTheme(selectedTheme);
    setMode(selectedMode);
    onOpenChange(false);
  };

  const currentTheme = themePresets.find((t) => t.id === selectedTheme) || themePresets[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0">
        {/* Header */}
        <div className="border-b px-6 py-4">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                {trans('messages.theme.title')}
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
                <button
                  onClick={() => setSelectedMode('light')}
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded text-sm transition-all",
                    selectedMode === 'light'
                      ? "bg-background shadow text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Sun className="h-3.5 w-3.5" />
                  {trans('messages.theme.light')}
                </button>
                <button
                  onClick={() => setSelectedMode('dark')}
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded text-sm transition-all",
                    selectedMode === 'dark'
                      ? "bg-background shadow text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Moon className="h-3.5 w-3.5" />
                  {trans('messages.theme.dark')}
                </button>
              </div>
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Theme Presets */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Palette className="h-4 w-4 text-primary" />
              {trans('messages.theme.colors')}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {themePresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedTheme(preset.id)}
                  className={cn(
                    'relative border rounded-lg p-3 text-left transition-all hover:scale-[1.02]',
                    selectedTheme === preset.id
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/50 bg-card'
                  )}
                >
                  {selectedTheme === preset.id && (
                    <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-2.5 w-2.5 text-primary-foreground" />
                    </div>
                  )}

                  {/* Color Preview Bar */}
                  <div className="flex gap-0.5 mb-2 h-6 rounded overflow-hidden">
                    <div className="flex-[2]" style={{ backgroundColor: preset.light.primary }} />
                    <div className="flex-1" style={{ backgroundColor: preset.light.secondary }} />
                    <div className="flex-1" style={{ backgroundColor: preset.light.accent }} />
                  </div>

                  <p className="font-medium text-sm">{preset.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Typography Preview */}
          <div className="pt-3 border-t">
            <p className="text-xs text-muted-foreground mb-2">
              {trans('messages.theme.typography')}
            </p>
            <div className="flex gap-3 text-xs">
              <span className="font-medium">Aa</span>
              <span className="font-mono text-muted-foreground">Aa</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex items-center justify-end gap-2 bg-muted/30">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            {trans('messages.theme.cancel')}
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Check className="h-4 w-4 mr-1" />
            {trans('messages.theme.apply')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
