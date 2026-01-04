import { usePage } from '@inertiajs/react';

/**
 * Translation helper - Gets translations from Laravel
 */
export function useTrans() {
  const { trans } = usePage().props as any;

  return (key: string, replace?: Record<string, string>) => {
    const keys = key.split('.');
    let value: any = trans;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    // Replace placeholders like :attribute
    if (replace && typeof value === 'string') {
      Object.entries(replace).forEach(([placeholder, replacement]) => {
        value = value.replace(`:${placeholder}`, replacement);
      });
    }

    return value || key;
  };
}

/**
 * Direct translation function without hook (for use outside components)
 */
export function trans(key: string, translations: any, replace?: Record<string, string>): string {
  const keys = key.split('.');
  let value: any = translations;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key;
    }
  }

  if (replace && typeof value === 'string') {
    Object.entries(replace).forEach(([placeholder, replacement]) => {
      value = value.replace(`:${placeholder}`, replacement);
    });
  }

  return value || key;
}
