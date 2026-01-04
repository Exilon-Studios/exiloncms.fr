import React, { useEffect } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export interface ThemeSettingsProps {
  // Colors
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  background_color?: string;
  foreground_color?: string;
  muted_color?: string;
  card_color?: string;
  border_color?: string;

  // Typography
  font_family?: string;
  font_size_base?: string;
  heading_font?: string;

  // Spacing
  spacing_scale?: number;

  // Border radius
  border_radius_sm?: string;
  border_radius_md?: string;
  border_radius_lg?: string;

  // Preset
  preset?: 'light' | 'dark' | 'custom';
}

// ============================================================================
// THEME PRESETS
// ============================================================================

const themePresets: Record<string, ThemeSettingsProps> = {
  light: {
    primary_color: '#3b82f6',
    secondary_color: '#64748b',
    accent_color: '#8b5cf6',
    background_color: '#ffffff',
    foreground_color: '#0f172a',
    muted_color: '#f1f5f9',
    card_color: '#ffffff',
    border_color: '#e2e8f0',
    font_family: 'Inter, system-ui, sans-serif',
    font_size_base: '16px',
    heading_font: 'Inter, system-ui, sans-serif',
    spacing_scale: 1,
    border_radius_sm: '0.25rem',
    border_radius_md: '0.5rem',
    border_radius_lg: '0.75rem',
    preset: 'light',
  },
  dark: {
    primary_color: '#3b82f6',
    secondary_color: '#94a3b8',
    accent_color: '#a78bfa',
    background_color: '#0f172a',
    foreground_color: '#f1f5f9',
    muted_color: '#1e293b',
    card_color: '#1e293b',
    border_color: '#334155',
    font_family: 'Inter, system-ui, sans-serif',
    font_size_base: '16px',
    heading_font: 'Inter, system-ui, sans-serif',
    spacing_scale: 1,
    border_radius_sm: '0.25rem',
    border_radius_md: '0.5rem',
    border_radius_lg: '0.75rem',
    preset: 'dark',
  },
  minecraft: {
    primary_color: '#4ade80',
    secondary_color: '#a3a3a3',
    accent_color: '#facc15',
    background_color: '#1a1a1a',
    foreground_color: '#e5e5e5',
    muted_color: '#262626',
    card_color: '#262626',
    border_color: '#404040',
    font_family: '"Press Start 2P", cursive, monospace',
    font_size_base: '14px',
    heading_font: '"Press Start 2P", cursive, monospace',
    spacing_scale: 1,
    border_radius_sm: '0px',
    border_radius_md: '0px',
    border_radius_lg: '0px',
    preset: 'custom',
  },
};

// ============================================================================
// THEME SETTINGS COMPONENT (renders styles in head)
// ============================================================================

export const ThemeSettingsBlock: React.FC<ThemeSettingsProps> = (props) => {
  const {
    primary_color = '#3b82f6',
    secondary_color = '#64748b',
    accent_color = '#8b5cf6',
    background_color = '#ffffff',
    foreground_color = '#0f172a',
    muted_color = '#f1f5f9',
    card_color = '#ffffff',
    border_color = '#e2e8f0',
    font_family = 'Inter, system-ui, sans-serif',
    font_size_base = '16px',
    heading_font = 'Inter, system-ui, sans-serif',
    spacing_scale = 1,
    border_radius_sm = '0.25rem',
    border_radius_md = '0.5rem',
    border_radius_lg = '0.75rem',
  } = props || {};

  useEffect(() => {
    // Apply CSS variables to the root element
    const root = document.documentElement;

    // Colors
    root.style.setProperty('--primary', primary_color);
    root.style.setProperty('--secondary', secondary_color);
    root.style.setProperty('--accent', accent_color);
    root.style.setProperty('--background', background_color);
    root.style.setProperty('--foreground', foreground_color);
    root.style.setProperty('--muted', muted_color);
    root.style.setProperty('--card', card_color);
    root.style.setProperty('--border', border_color);

    // Derived colors
    root.style.setProperty('--primary-foreground', getContrastColor(primary_color));
    root.style.setProperty('--secondary-foreground', getContrastColor(secondary_color));
    root.style.setProperty('--accent-foreground', getContrastColor(accent_color));
    root.style.setProperty('--muted-foreground', adjustColor(muted_color, -20));

    // Typography
    root.style.setProperty('--font-family', font_family);
    root.style.setProperty('--font-size-base', font_size_base);
    root.style.setProperty('--heading-font', heading_font);

    // Spacing
    root.style.setProperty('--spacing-scale', spacing_scale.toString());

    // Border radius
    root.style.setProperty('--radius-sm', border_radius_sm);
    root.style.setProperty('--radius-md', border_radius_md);
    root.style.setProperty('--radius-lg', border_radius_lg);

    // Apply to body
    document.body.style.fontFamily = font_family;
    document.body.style.fontSize = font_size_base;

    return () => {
      // Cleanup (reset to defaults)
      root.style.removeProperty('--primary');
      root.style.removeProperty('--secondary');
      root.style.removeProperty('--accent');
      root.style.removeProperty('--background');
      root.style.removeProperty('--foreground');
      root.style.removeProperty('--muted');
      root.style.removeProperty('--card');
      root.style.removeProperty('--border');
      root.style.removeProperty('--primary-foreground');
      root.style.removeProperty('--secondary-foreground');
      root.style.removeProperty('--accent-foreground');
      root.style.removeProperty('--muted-foreground');
      root.style.removeProperty('--font-family');
      root.style.removeProperty('--font-size-base');
      root.style.removeProperty('--heading-font');
      root.style.removeProperty('--spacing-scale');
      root.style.removeProperty('--radius-sm');
      root.style.removeProperty('--radius-md');
      root.style.removeProperty('--radius-lg');
    };
  }, [
    primary_color,
    secondary_color,
    accent_color,
    background_color,
    foreground_color,
    muted_color,
    card_color,
    border_color,
    font_family,
    font_size_base,
    heading_font,
    spacing_scale,
    border_radius_sm,
    border_radius_md,
    border_radius_lg,
  ]);

  // This component doesn't render anything visible
  return null;
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Calculate contrast color (black or white) based on background brightness
function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#ffffff';
}

// Adjust color brightness
function adjustColor(hexColor: string, amount: number): string {
  const hex = hexColor.replace('#', '');
  let r = parseInt(hex.substr(0, 2), 16);
  let g = parseInt(hex.substr(2, 2), 16);
  let b = parseInt(hex.substr(4, 2), 16);

  r = Math.max(0, Math.min(255, r + amount));
  g = Math.max(0, Math.min(255, g + amount));
  b = Math.max(0, Math.min(255, b + amount));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// ============================================================================
// PUCK CONFIG
// ============================================================================

export const themeSettingsConfig = {
  label: 'Paramètres du thème',
  fields: {
    preset: {
      type: 'select',
      label: 'Preset de thème',
      options: [
        { label: 'Clair (Light)', value: 'light' },
        { label: 'Sombre (Dark)', value: 'dark' },
        { label: 'Minecraft', value: 'minecraft' },
        { label: 'Personnalisé', value: 'custom' },
      ],
    },
    primary_color: {
      type: 'custom',
      label: 'Couleur primaire',
      render: ({ value, onChange }: { value: string; onChange: (val: string) => void }) => (
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 px-3 py-2 border rounded"
            placeholder="#3b82f6"
          />
        </div>
      ),
    },
    secondary_color: {
      type: 'custom',
      label: 'Couleur secondaire',
      render: ({ value, onChange }: { value: string; onChange: (val: string) => void }) => (
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 px-3 py-2 border rounded"
            placeholder="#64748b"
          />
        </div>
      ),
    },
    accent_color: {
      type: 'custom',
      label: 'Couleur d\'accent',
      render: ({ value, onChange }: { value: string; onChange: (val: string) => void }) => (
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 px-3 py-2 border rounded"
            placeholder="#8b5cf6"
          />
        </div>
      ),
    },
    background_color: {
      type: 'custom',
      label: 'Couleur de fond',
      render: ({ value, onChange }: { value: string; onChange: (val: string) => void }) => (
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 px-3 py-2 border rounded"
            placeholder="#ffffff"
          />
        </div>
      ),
    },
    foreground_color: {
      type: 'custom',
      label: 'Couleur de texte',
      render: ({ value, onChange }: { value: string; onChange: (val: string) => void }) => (
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 px-3 py-2 border rounded"
            placeholder="#0f172a"
          />
        </div>
      ),
    },
    font_family: {
      type: 'select',
      label: 'Police du texte',
      options: [
        { label: 'Inter', value: 'Inter, system-ui, sans-serif' },
        { label: 'Roboto', value: 'Roboto, system-ui, sans-serif' },
        { label: 'Open Sans', value: 'Open Sans, system-ui, sans-serif' },
        { label: 'Poppins', value: 'Poppins, system-ui, sans-serif' },
        { label: 'Press Start 2P (Gaming)', value: '"Press Start 2P", cursive, monospace' },
      ],
    },
    font_size_base: {
      type: 'select',
      label: 'Taille de police de base',
      options: [
        { label: 'Petit (14px)', value: '14px' },
        { label: 'Normal (16px)', value: '16px' },
        { label: 'Grand (18px)', value: '18px' },
        { label: 'Très grand (20px)', value: '20px' },
      ],
    },
    border_radius_md: {
      type: 'select',
      label: 'Arrondi des bords',
      options: [
        { label: 'Aucun', value: '0px' },
        { label: 'Petit', value: '0.25rem' },
        { label: 'Normal', value: '0.5rem' },
        { label: 'Grand', value: '0.75rem' },
        { label: 'Très grand', value: '1rem' },
      ],
    },
  },
  defaultProps: themePresets.light,
  render: ThemeSettingsBlock,
};

// Export presets for use in other components
export { themePresets };
