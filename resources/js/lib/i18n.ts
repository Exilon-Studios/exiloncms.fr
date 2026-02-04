/**
 * Translation helper for frontend
 * Uses translations shared from Laravel via Inertia
 */

import { usePage } from '@inertiajs/react';

/**
 * Get translation value from nested object by key
 */
function getTranslation(translations: Record<string, any>, key: string): string {
  const keys = key.split('.');
  let value: any = translations;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Return the key if translation not found
      return key;
    }
  }

  // If value is not a string, return the key
  if (typeof value !== 'string') {
    return key;
  }

  return value;
}

/**
 * Apply replacements to a translation string
 * Supports :placeholder, {placeholder}, and {0} positional formats
 */
function applyReplacements(value: string, replacements?: Record<string, string | number> | string[]): string {
  if (!replacements) {
    return value;
  }

  let result = value;

  // Handle array of positional replacements {0}, {1}, etc.
  if (Array.isArray(replacements)) {
    replacements.forEach((replacement, index) => {
      const regex = new RegExp(`\\{${index}\\}`, 'g');
      result = result.replace(regex, String(replacement));
    });
  } else {
    // Handle named replacements - try both :placeholder and {placeholder} formats
    for (const [placeholder, replacement] of Object.entries(replacements)) {
      // Try {placeholder} format first (most common in this project)
      let regex = new RegExp(`\\{${placeholder}\\}`, 'g');
      if (regex.test(result)) {
        result = result.replace(regex, String(replacement));
      } else {
        // Fallback to :placeholder format (Laravel style)
        regex = new RegExp(`:${placeholder}`, 'g');
        result = result.replace(regex, String(replacement));
      }
    }
  }

  return result;
}

/**
 * Translation helper that works outside React components
 * This version accesses the page props directly from the window object
 */
export function transStatic(key: string, replacements?: Record<string, string | number> | string[]): string {
  // Try to access translations from window (Inertia initial page)
  if (typeof window !== 'undefined' && (window as any).__INERTIA_PROPS__) {
    const translations = (window as any).__INERTIA_PROPS__.props?.trans as Record<string, any>;
    if (translations) {
      const value = getTranslation(translations, key);
      if (value !== key) {
        return applyReplacements(value, replacements);
      }
    }
  }

  // Return the key with replacements if translation not found
  return applyReplacements(key, replacements);
}

/**
 * Translation helper for use inside React components
 * Uses the usePage hook to access current page props
 */
export function trans(key: string, replacements?: Record<string, string | number> | string[]): string {
  const { props } = usePage();
  const translations = props.trans as Record<string, any>;
  const value = getTranslation(translations, key);
  return applyReplacements(value, replacements);
}

/**
 * Hook to access translation function
 */
export function useTrans() {
  return { trans };
}
