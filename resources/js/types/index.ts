/**
 * Global Type Definitions for MC-CMS v2
 * Type-safe, DRY, and fully typed
 */

import { Config } from 'ziggy-js';

// ============================================
// CORE LARAVEL & INERTIA TYPES
// ============================================

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  avatar_url?: string;
  role: UserRole;
  money: number;
  created_at: string;
  updated_at: string;
}

export type UserRole = 'admin' | 'moderator' | 'user';

export interface PageProps<T extends Record<string, unknown> = Record<string, unknown>> {
  auth: {
    user: User | null;
  };
  ziggy: Config & { location: string };
  flash: {
    success?: string;
    error?: string;
    info?: string;
    warning?: string;
  };
  errors: Record<string, string>;
  [key: string]: unknown;
}

// ============================================
// NAVIGATION & UI TYPES
// ============================================

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
  badge?: string | number;
  active?: boolean;
  permission?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// ============================================
// FORM & VALIDATION TYPES
// ============================================

export type FormErrors<T> = Partial<Record<keyof T, string>>;

export interface FormProps<T> {
  data: T;
  errors: FormErrors<T>;
  processing: boolean;
  setData: <K extends keyof T>(key: K, value: T[K]) => void;
  submit: () => void;
  reset: (...keys: (keyof T)[]) => void;
}

// ============================================
// PAGINATION TYPES
// ============================================

export interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
}

// ============================================
// COMMON MODEL TYPES
// ============================================

export interface Timestamps {
  created_at: string;
  updated_at: string;
}

export interface SoftDeletes extends Timestamps {
  deleted_at: string | null;
}

// ============================================
// UTILITY TYPES
// ============================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type ID = number | string;

// Make all properties optional recursively
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Extract keys that are of a certain type
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

// ============================================
// RE-EXPORT ADMIN TYPES
// ============================================

export * from './admin';

