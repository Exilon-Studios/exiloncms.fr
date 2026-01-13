import { useState } from 'react';

interface ThemeStepProps {
  data: Record<string, any>;
  setData: (data: any) => void;
  settings: Record<string, any>;
}

const PRESET_COLORS = [
  { name: 'Bleu', primary: '#3b82f6', secondary: '#8b5cf6' },
  { name: 'Vert', primary: '#22c55e', secondary: '#14b8a6' },
  { name: 'Rouge', primary: '#ef4444', secondary: '#f97316' },
  { name: 'Orange', primary: '#f97316', secondary: '#eab308' },
  { name: 'Rose', primary: '#ec4899', secondary: '#f43f5e' },
  { name: 'Cyan', primary: '#06b6d4', secondary: '#0ea5e9' },
];

export function ThemeStep({ data, setData, settings }: ThemeStepProps) {
  const [darkTheme, setDarkTheme] = useState(data.dark_theme ?? settings.darkTheme === '1');

  return (
    <div className="space-y-8">
      {/* Dark Mode Toggle */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Mode d'affichage
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              setDarkTheme(false);
              setData({ ...data, dark_theme: false });
            }}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              !darkTheme
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-border'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
              <span className="text-sm font-medium">Clair</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => {
              setDarkTheme(true);
              setData({ ...data, dark_theme: true });
            }}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              darkTheme
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-border'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              <span className="text-sm font-medium">Sombre</span>
            </div>
          </button>
        </div>
      </div>

      {/* Preset Colors */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Palette de couleurs prédéfinie
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => setData({
                ...data,
                primary_color: preset.primary,
                secondary_color: preset.secondary,
              })}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex -space-x-1">
                <div
                  className="w-5 h-5 rounded-full border-2 border-background"
                  style={{ backgroundColor: preset.primary }}
                />
                <div
                  className="w-5 h-5 rounded-full border-2 border-background"
                  style={{ backgroundColor: preset.secondary }}
                />
              </div>
              <span className="text-sm">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Couleur principale
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={data.primary_color || settings.primaryColor || '#3b82f6'}
              onChange={(e) => setData({ ...data, primary_color: e.target.value })}
              className="w-12 h-12 rounded-lg cursor-pointer border-0"
            />
            <input
              type="text"
              value={data.primary_color || settings.primaryColor || '#3b82f6'}
              onChange={(e) => setData({ ...data, primary_color: e.target.value })}
              className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground font-mono text-sm"
              placeholder="#3b82f6"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Couleur secondaire
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={data.secondary_color || settings.secondaryColor || '#8b5cf6'}
              onChange={(e) => setData({ ...data, secondary_color: e.target.value })}
              className="w-12 h-12 rounded-lg cursor-pointer border-0"
            />
            <input
              type="text"
              value={data.secondary_color || settings.secondaryColor || '#8b5cf6'}
              onChange={(e) => setData({ ...data, secondary_color: e.target.value })}
              className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground font-mono text-sm"
              placeholder="#8b5cf6"
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="p-4 bg-muted/30 border border-border rounded-lg">
        <p className="text-xs text-muted-foreground mb-3">Aperçu</p>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded-lg text-white text-sm font-medium"
            style={{ backgroundColor: data.primary_color || settings.primaryColor || '#3b82f6' }}
          >
            Bouton principal
          </button>
          <button
            className="px-4 py-2 rounded-lg text-white text-sm font-medium"
            style={{ backgroundColor: data.secondary_color || settings.secondaryColor || '#8b5cf6' }}
          >
            Secondaire
          </button>
        </div>
      </div>
    </div>
  );
}
