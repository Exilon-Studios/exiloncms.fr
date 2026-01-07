/**
 * Theme definitions for ExilonCMS V2
 * Each theme defines a complete color palette for light and dark modes
 */

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  light: ThemeColors;
  dark: ThemeColors;
}

/**
 * HSL to HSL string converter for CSS variables
 */
function hsl(h: number, s: number, l: number): string {
  return `${h} ${s}% ${l}%`;
}

/**
 * Theme presets inspired by popular color schemes
 */
export const themePresets: ThemePreset[] = [
  {
    id: 'gray',
    name: 'Gray Monochrome',
    description: 'Classic grayscale theme',
    light: {
      background: hsl(0, 0, 94.12),
      foreground: hsl(0, 0, 20),
      card: hsl(0, 0, 96.08),
      cardForeground: hsl(0, 0, 20),
      popover: hsl(0, 0, 96.08),
      popoverForeground: hsl(0, 0, 20),
      primary: hsl(0, 0, 37.65),
      primaryForeground: hsl(0, 0, 100),
      secondary: hsl(0, 0, 87.84),
      secondaryForeground: hsl(0, 0, 20),
      muted: hsl(0, 0, 85.10),
      mutedForeground: hsl(0, 0, 40),
      accent: hsl(0, 0, 75.29),
      accentForeground: hsl(0, 0, 20),
      destructive: hsl(0, 60, 50),
      destructiveForeground: hsl(0, 0, 100),
      border: hsl(0, 0, 81.57),
      input: hsl(0, 0, 87.84),
      ring: hsl(0, 0, 37.65),
    },
    dark: {
      background: hsl(0, 0, 10.20),
      foreground: hsl(0, 0, 85.10),
      card: hsl(0, 0, 12.55),
      cardForeground: hsl(0, 0, 85.10),
      popover: hsl(0, 0, 12.55),
      popoverForeground: hsl(0, 0, 85.10),
      primary: hsl(0, 0, 62.75),
      primaryForeground: hsl(0, 0, 10.20),
      secondary: hsl(0, 0, 18.82),
      secondaryForeground: hsl(0, 0, 85.10),
      muted: hsl(0, 0, 16.47),
      mutedForeground: hsl(0, 0, 50.20),
      accent: hsl(0, 0, 25.10),
      accentForeground: hsl(0, 0, 85.10),
      destructive: hsl(0, 66.30, 63.92),
      destructiveForeground: hsl(0, 0, 100),
      border: hsl(0, 0, 20.78),
      input: hsl(0, 0, 18.82),
      ring: hsl(0, 0, 62.75),
    },
  },
  {
    id: 'blue',
    name: 'Ocean Blue',
    description: 'Calming blue tones',
    light: {
      background: hsl(210, 20, 96),
      foreground: hsl(222, 47, 11),
      card: hsl(210, 20, 98),
      cardForeground: hsl(222, 47, 11),
      popover: hsl(210, 20, 98),
      popoverForeground: hsl(222, 47, 11),
      primary: hsl(214, 95, 54),
      primaryForeground: hsl(0, 0, 100),
      secondary: hsl(210, 20, 90),
      secondaryForeground: hsl(222, 47, 11),
      muted: hsl(210, 15, 85),
      mutedForeground: hsl(215, 20, 40),
      accent: hsl(210, 30, 80),
      accentForeground: hsl(222, 47, 11),
      destructive: hsl(0, 84, 60),
      destructiveForeground: hsl(0, 0, 100),
      border: hsl(214, 20, 88),
      input: hsl(214, 20, 90),
      ring: hsl(214, 95, 54),
    },
    dark: {
      background: hsl(222, 47, 11),
      foreground: hsl(210, 20, 98),
      card: hsl(222, 47, 13),
      cardForeground: hsl(210, 20, 98),
      popover: hsl(222, 47, 13),
      popoverForeground: hsl(210, 20, 98),
      primary: hsl(214, 95, 64),
      primaryForeground: hsl(222, 47, 11),
      secondary: hsl(215, 25, 20),
      secondaryForeground: hsl(210, 20, 98),
      muted: hsl(217, 20, 17),
      mutedForeground: hsl(215, 15, 55),
      accent: hsl(215, 30, 25),
      accentForeground: hsl(210, 20, 98),
      destructive: hsl(0, 84, 70),
      destructiveForeground: hsl(0, 0, 100),
      border: hsl(215, 25, 23),
      input: hsl(215, 25, 20),
      ring: hsl(214, 95, 64),
    },
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    description: 'Elegant purple theme',
    light: {
      background: hsl(270, 15, 95),
      foreground: hsl(270, 60, 15),
      card: hsl(270, 15, 97),
      cardForeground: hsl(270, 60, 15),
      popover: hsl(270, 15, 97),
      popoverForeground: hsl(270, 60, 15),
      primary: hsl(271, 76, 53),
      primaryForeground: hsl(0, 0, 100),
      secondary: hsl(270, 15, 88),
      secondaryForeground: hsl(270, 60, 15),
      muted: hsl(270, 10, 83),
      mutedForeground: hsl(270, 30, 35),
      accent: hsl(270, 20, 78),
      accentForeground: hsl(270, 60, 15),
      destructive: hsl(0, 84, 60),
      destructiveForeground: hsl(0, 0, 100),
      border: hsl(270, 15, 85),
      input: hsl(270, 15, 88),
      ring: hsl(271, 76, 53),
    },
    dark: {
      background: hsl(270, 60, 8),
      foreground: hsl(270, 15, 95),
      card: hsl(270, 50, 10),
      cardForeground: hsl(270, 15, 95),
      popover: hsl(270, 50, 10),
      popoverForeground: hsl(270, 15, 95),
      primary: hsl(271, 76, 63),
      primaryForeground: hsl(270, 60, 8),
      secondary: hsl(270, 30, 18),
      secondaryForeground: hsl(270, 15, 95),
      muted: hsl(270, 25, 15),
      mutedForeground: hsl(270, 20, 50),
      accent: hsl(270, 35, 22),
      accentForeground: hsl(270, 15, 95),
      destructive: hsl(0, 84, 70),
      destructiveForeground: hsl(0, 0, 100),
      border: hsl(270, 30, 20),
      input: hsl(270, 30, 18),
      ring: hsl(271, 76, 63),
    },
  },
  {
    id: 'green',
    name: 'Forest Green',
    description: 'Natural green tones',
    light: {
      background: hsl(140, 15, 95),
      foreground: hsl(140, 60, 12),
      card: hsl(140, 15, 97),
      cardForeground: hsl(140, 60, 12),
      popover: hsl(140, 15, 97),
      popoverForeground: hsl(140, 60, 12),
      primary: hsl(142, 76, 36),
      primaryForeground: hsl(0, 0, 100),
      secondary: hsl(140, 15, 88),
      secondaryForeground: hsl(140, 60, 12),
      muted: hsl(140, 10, 83),
      mutedForeground: hsl(140, 30, 35),
      accent: hsl(140, 20, 78),
      accentForeground: hsl(140, 60, 12),
      destructive: hsl(0, 84, 60),
      destructiveForeground: hsl(0, 0, 100),
      border: hsl(140, 15, 85),
      input: hsl(140, 15, 88),
      ring: hsl(142, 76, 36),
    },
    dark: {
      background: hsl(140, 50, 8),
      foreground: hsl(140, 15, 95),
      card: hsl(140, 40, 10),
      cardForeground: hsl(140, 15, 95),
      popover: hsl(140, 40, 10),
      popoverForeground: hsl(140, 15, 95),
      primary: hsl(142, 76, 46),
      primaryForeground: hsl(140, 50, 8),
      secondary: hsl(140, 25, 18),
      secondaryForeground: hsl(140, 15, 95),
      muted: hsl(140, 20, 15),
      mutedForeground: hsl(140, 20, 50),
      accent: hsl(140, 30, 22),
      accentForeground: hsl(140, 15, 95),
      destructive: hsl(0, 84, 70),
      destructiveForeground: hsl(0, 0, 100),
      border: hsl(140, 25, 20),
      input: hsl(140, 25, 18),
      ring: hsl(142, 76, 46),
    },
  },
  {
    id: 'rose',
    name: 'Rose Pink',
    description: 'Warm rose tones',
    light: {
      background: hsl(350, 15, 95),
      foreground: hsl(350, 60, 15),
      card: hsl(350, 15, 97),
      cardForeground: hsl(350, 60, 15),
      popover: hsl(350, 15, 97),
      popoverForeground: hsl(350, 60, 15),
      primary: hsl(346, 77, 50),
      primaryForeground: hsl(0, 0, 100),
      secondary: hsl(350, 15, 88),
      secondaryForeground: hsl(350, 60, 15),
      muted: hsl(350, 10, 83),
      mutedForeground: hsl(350, 30, 35),
      accent: hsl(350, 20, 78),
      accentForeground: hsl(350, 60, 15),
      destructive: hsl(0, 84, 60),
      destructiveForeground: hsl(0, 0, 100),
      border: hsl(350, 15, 85),
      input: hsl(350, 15, 88),
      ring: hsl(346, 77, 50),
    },
    dark: {
      background: hsl(340, 50, 8),
      foreground: hsl(350, 15, 95),
      card: hsl(340, 40, 10),
      cardForeground: hsl(350, 15, 95),
      popover: hsl(340, 40, 10),
      popoverForeground: hsl(350, 15, 95),
      primary: hsl(346, 77, 60),
      primaryForeground: hsl(340, 50, 8),
      secondary: hsl(340, 25, 18),
      secondaryForeground: hsl(350, 15, 95),
      muted: hsl(340, 20, 15),
      mutedForeground: hsl(340, 20, 50),
      accent: hsl(340, 30, 22),
      accentForeground: hsl(350, 15, 95),
      destructive: hsl(0, 84, 70),
      destructiveForeground: hsl(0, 0, 100),
      border: hsl(340, 25, 20),
      input: hsl(340, 25, 18),
      ring: hsl(346, 77, 60),
    },
  },
  {
    id: 'orange',
    name: 'Sunset Orange',
    description: 'Warm orange tones',
    light: {
      background: hsl(30, 15, 95),
      foreground: hsl(30, 60, 12),
      card: hsl(30, 15, 97),
      cardForeground: hsl(30, 60, 12),
      popover: hsl(30, 15, 97),
      popoverForeground: hsl(30, 60, 12),
      primary: hsl(25, 95, 53),
      primaryForeground: hsl(0, 0, 100),
      secondary: hsl(30, 15, 88),
      secondaryForeground: hsl(30, 60, 12),
      muted: hsl(30, 10, 83),
      mutedForeground: hsl(30, 30, 35),
      accent: hsl(30, 20, 78),
      accentForeground: hsl(30, 60, 12),
      destructive: hsl(0, 84, 60),
      destructiveForeground: hsl(0, 0, 100),
      border: hsl(30, 15, 85),
      input: hsl(30, 15, 88),
      ring: hsl(25, 95, 53),
    },
    dark: {
      background: hsl(20, 50, 8),
      foreground: hsl(30, 15, 95),
      card: hsl(20, 40, 10),
      cardForeground: hsl(30, 15, 95),
      popover: hsl(20, 40, 10),
      popoverForeground: hsl(30, 15, 95),
      primary: hsl(25, 95, 63),
      primaryForeground: hsl(20, 50, 8),
      secondary: hsl(20, 25, 18),
      secondaryForeground: hsl(30, 15, 95),
      muted: hsl(20, 20, 15),
      mutedForeground: hsl(20, 20, 50),
      accent: hsl(20, 30, 22),
      accentForeground: hsl(30, 15, 95),
      destructive: hsl(0, 84, 70),
      destructiveForeground: hsl(0, 0, 100),
      border: hsl(20, 25, 20),
      input: hsl(20, 25, 18),
      ring: hsl(25, 95, 63),
    },
  },
];

/**
 * Get theme preset by ID
 */
export function getThemePreset(id: string): ThemePreset | undefined {
  return themePresets.find((preset) => preset.id === id);
}

/**
 * Get default theme preset
 */
export function getDefaultThemePreset(): ThemePreset {
  return themePresets[0]; // Gray as default
}

/**
 * Convert theme colors to CSS variables string
 */
export function themeToCSSVariables(theme: ThemePreset, mode: 'light' | 'dark'): string {
  const colors = mode === 'light' ? theme.light : theme.dark;
  return `
    --background: ${colors.background};
    --foreground: ${colors.foreground};
    --card: ${colors.card};
    --card-foreground: ${colors.cardForeground};
    --popover: ${colors.popover};
    --popover-foreground: ${colors.popoverForeground};
    --primary: ${colors.primary};
    --primary-foreground: ${colors.primaryForeground};
    --secondary: ${colors.secondary};
    --secondary-foreground: ${colors.secondaryForeground};
    --muted: ${colors.muted};
    --muted-foreground: ${colors.mutedForeground};
    --accent: ${colors.accent};
    --accent-foreground: ${colors.accentForeground};
    --destructive: ${colors.destructive};
    --destructive-foreground: ${colors.destructiveForeground};
    --border: ${colors.border};
    --input: ${colors.input};
    --ring: ${colors.ring};
  `;
}
