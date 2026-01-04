/**
 * useTrans Hook
 * Hook React pour accéder aux traductions depuis le composant
 * Résout le problème d'appeler trans() dans les event handlers
 */

import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

/**
 * Hook pour accéder aux traductions
 * Doit être appelé au niveau supérieur du composant
 */
export function useTrans() {
  const { props } = usePage<PageProps>();
  const translations = props.trans as Record<string, any> | undefined;

  /**
   * Get a translation by key with optional replacements
   *
   * @param key - Translation key in dot notation (e.g., 'messages.welcome')
   * @param replacements - Object with placeholder replacements
   * @returns Translated string
   */
  const trans = (key: string, replacements?: Record<string, string | number>): string => {
    if (!translations) {
      return key;
    }

    // Split the key by dots to navigate nested objects
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

    // Apply replacements
    if (replacements) {
      let result = value;
      for (const [placeholder, replacement] of Object.entries(replacements)) {
        const regex = new RegExp(`:${placeholder}`, 'g');
        result = result.replace(regex, String(replacement));
      }
      return result;
    }

    return value;
  };

  return { trans };
}
