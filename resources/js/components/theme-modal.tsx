/**
 * Theme Settings Modal - Full theme customization with live preview
 */

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { themePresets, ThemePreset } from '@/lib/themes';
import { trans } from '@/lib/i18n';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Palette, Sun, Moon, Check, X, Type } from 'lucide-react';
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

  const handleCancel = () => {
    setSelectedTheme(theme.id);
    setSelectedMode(mode);
    onOpenChange(false);
  };

  const currentTheme = themePresets.find((t) => t.id === selectedTheme) || themePresets[0];
  const colors = selectedMode === 'light' ? currentTheme.light : currentTheme.dark;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b px-6 py-4">
          <DialogHeader className="space-y-1">
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  {trans('messages.theme.title')}
                </div>

                {/* Mode Toggle - Compact */}
                <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                  <button
                    onClick={() => setSelectedMode('light')}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                      selectedMode === 'light' ? "bg-background shadow-sm" : "hover:bg-background/50"
                    )}
                  >
                    <Sun className="h-4 w-4" />
                    {trans('messages.theme.light')}
                  </button>
                  <button
                    onClick={() => setSelectedMode('dark')}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                      selectedMode === 'dark' ? "bg-background shadow-sm" : "hover:bg-background/50"
                    )}
                  >
                    <Moon className="h-4 w-4" />
                    {trans('messages.theme.dark')}
                  </button>
                </div>
              </div>
            </DialogTitle>
            <DialogDescription>
              {trans('messages.theme.description')}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-border">

            {/* Top - Live Preview */}
            <div className="p-6">
              <h3 className="text-sm font-semibold mb-3">{trans('messages.theme.preview')}</h3>

              {/* Preview Card */}
              <div
                className="border rounded-xl overflow-hidden"
                style={{
                  backgroundColor: `hsl(${colors.card})`,
                  borderColor: `hsl(${colors.border})`,
                }}
              >
                {/* Header */}
                <div
                  className="px-4 py-3 border-b flex items-center justify-between"
                  style={{ borderColor: `hsl(${colors.border})` }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-7 w-7 rounded flex items-center justify-center text-xs font-bold"
                      style={{
                        backgroundColor: `hsl(${colors.primary})`,
                        color: `hsl(${colors.primaryForeground})`,
                      }}
                    >
                      MC
                    </div>
                    <span className="font-semibold text-sm" style={{ color: `hsl(${colors.foreground})` }}>
                      ExilonCMS
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: `hsl(${colors.primary})` }} />
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: `hsl(${colors.muted})` }} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <p className="text-sm" style={{ color: `hsl(${colors.mutedForeground})` }}>
                    {trans('messages.theme.preview_text')}
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <div
                      className="px-3 py-1.5 rounded text-xs font-medium"
                      style={{
                        backgroundColor: `hsl(${colors.primary})`,
                        color: `hsl(${colors.primaryForeground})`,
                      }}
                    >
                      {trans('messages.theme.primary_button')}
                    </div>
                    <div
                      className="px-3 py-1.5 rounded text-xs font-medium border"
                      style={{
                        backgroundColor: `hsl(${colors.secondary})`,
                        color: `hsl(${colors.secondaryForeground})`,
                        borderColor: `hsl(${colors.border})`,
                      }}
                    >
                      {trans('messages.theme.secondary_button')}
                    </div>
                  </div>

                  {/* Input */}
                  <div
                    className="h-8 w-full rounded border px-3 flex items-center text-xs"
                    style={{
                      backgroundColor: `hsl(${colors.background})`,
                      borderColor: `hsl(${colors.input})`,
                      color: `hsl(${colors.foreground})`,
                    }}
                  >
                    {trans('messages.theme.input_placeholder')}
                  </div>

                  {/* Badges */}
                  <div className="flex gap-1.5 flex-wrap">
                    <div
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{ backgroundColor: `hsl(${colors.primary} / 0.1)`, color: `hsl(${colors.primary})` }}
                    >
                      {trans('messages.theme.badge_active')}
                    </div>
                    <div
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{ backgroundColor: `hsl(${colors.destructive} / 0.1)`, color: `hsl(${colors.destructive})` }}
                    >
                      {trans('messages.theme.badge_error')}
                    </div>
                    <div
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{ backgroundColor: `hsl(${colors.muted})`, color: `hsl(${colors.mutedForeground})` }}
                    >
                      {trans('messages.theme.badge_inactive')}
                    </div>
                  </div>

                  {/* Full Palette */}
                  <div className="pt-2 border-t" style={{ borderColor: `hsl(${colors.border})` }}>
                    <p className="text-[10px] mb-1.5" style={{ color: `hsl(${colors.mutedForeground})` }}>
                      {trans('messages.theme.full_palette')}
                    </p>
                    <div className="grid grid-cols-6 gap-1">
                      {[
                        { name: trans('messages.theme.color_primary'), color: colors.primary },
                        { name: trans('messages.theme.color_secondary'), color: colors.secondary },
                        { name: trans('messages.theme.color_accent'), color: colors.accent },
                        { name: trans('messages.theme.color_muted'), color: colors.muted },
                        { name: trans('messages.theme.color_error'), color: colors.destructive },
                        { name: trans('messages.theme.color_bg'), color: colors.background, border: colors.border },
                      ].map((item) => (
                        <div key={item.name} className="text-center">
                          <div
                            className="h-6 w-full rounded mb-0.5"
                            style={{
                              backgroundColor: `hsl(${item.color})`,
                              ...(item.border && { border: '1px solid', borderColor: `hsl(${item.border})` })
                            }}
                          />
                          <p className="text-[8px]" style={{ color: `hsl(${colors.mutedForeground})` }}>
                            {item.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom - Theme Selection */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  {trans('messages.theme.colors')}
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {themePresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedTheme(preset.id)}
                      className={cn(
                        'relative border-2 rounded-xl p-3 text-left transition-all hover:scale-[1.02]',
                        selectedTheme === preset.id
                          ? 'border-primary shadow-md bg-primary/5'
                          : 'border-border hover:border-primary/50 bg-card'
                      )}
                    >
                      {selectedTheme === preset.id && (
                        <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}

                      {/* Color Preview */}
                      <div className="flex gap-1 mb-2 h-8 rounded-lg overflow-hidden">
                        <div className="flex-[2]" style={{ backgroundColor: preset.light.primary }} />
                        <div className="flex-1" style={{ backgroundColor: preset.light.secondary }} />
                        <div className="flex-1" style={{ backgroundColor: preset.light.accent }} />
                      </div>

                      <div className="flex items-center gap-2">
                        <div
                          className="h-5 w-5 rounded-full border-2 border-white/50 shadow-sm"
                          style={{ backgroundColor: preset.light.primary }}
                        />
                        <div>
                          <p className="font-medium text-sm">{preset.name}</p>
                          <p className="text-xs text-muted-foreground">{preset.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Typography */}
              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  {trans('messages.theme.typography')}
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="border rounded-lg p-2 bg-card">
                    <p className="text-muted-foreground text-xs">{trans('messages.theme.primary_font')}</p>
                    <p className="font-medium" style={{ fontFamily: selectedMode === 'dark' ? 'Inter, sans-serif' : 'Montserrat, sans-serif' }}>
                      {selectedMode === 'dark' ? 'Inter' : 'Montserrat'}
                    </p>
                  </div>
                  <div className="border rounded-lg p-2 bg-card">
                    <p className="text-muted-foreground text-xs">{trans('messages.theme.mono_font')}</p>
                    <p className="font-mono">Fira Code</p>
                  </div>
                </div>
              </div>

              {/* Current Selection */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm bg-muted/50 rounded-lg p-3">
                  <span className="text-muted-foreground">{trans('messages.theme.current')}:</span>
                  <span className="font-medium text-primary">{currentTheme.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex items-center justify-end gap-2 bg-muted/30">
          <Button variant="outline" onClick={handleCancel} size="sm">
            {trans('messages.theme.cancel')}
          </Button>
          <Button onClick={handleSave} size="sm">
            <Check className="h-4 w-4 mr-1" />
            {trans('messages.theme.apply')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
