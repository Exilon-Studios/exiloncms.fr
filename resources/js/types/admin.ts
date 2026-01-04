/**
 * Admin Type Definitions for MC-CMS v2
 * Centralized types for all admin pages
 */

// ============================================
// USER & ROLE TYPES
// ============================================

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  role?: {
    id: number;
    name: string;
    is_admin: boolean;
    power: number;
  };
  hasAdminAccess?: boolean;
  money?: number;
  two_factor_enabled?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  name: string;
  power: number;
  is_admin: boolean;
}

// ============================================
// POST TYPES
// ============================================

export interface Post {
  id: number;
  title: string;
  slug: string;
  description?: string;
  content: string;
  image_url?: string;
  published_at: string;
  is_pinned: boolean;
  author: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface PostAuthor {
  id: number;
  name: string;
}

export interface PostComment {
  id: number;
  content: string;
  created_at: string;
  author: PostAuthor;
}

export interface PostLike {
  id: number;
  user_id: number;
}

export interface PostWithRelations extends Post {
  author: PostAuthor;
  comments: PostComment[];
  likes: PostLike[];
}

// ============================================
// PAGE TYPES
// ============================================

export interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  description?: string;
  enabled?: boolean;
  is_enabled?: boolean;
  roles?: number[];
  puck_data?: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// NAVBAR ELEMENT TYPES
// ============================================

export interface NavbarElement {
  id: number;
  name: string;
  value: string;
  type: NavbarElementType;
  icon: string | null;
  new_tab: boolean;
  position: number;
  parent_id: number | null;
  roles?: Role[];
  elements?: NavbarElement[];
}

export type NavbarElementType = 'home' | 'link' | 'page' | 'post' | 'posts' | 'plugin' | 'dropdown';

// ============================================
// SOCIAL LINK TYPES
// ============================================

export interface SocialLink {
  id: number;
  name: string;
  url: string;
  icon: string;
  position: number;
}

// ============================================
// SETTINGS TYPES
// ============================================

export interface GeneralSettings {
  site_name: string;
  site_description: string;
  site_keywords: string;
  logo?: string;
  favicon?: string;
}

export interface SecuritySettings {
  registration_enabled: boolean;
  email_verification: boolean;
  two_factor_enabled: boolean;
  password_min_length: string;
  user_change_name: boolean;
  user_upload_avatar: boolean;
  user_delete: boolean;
  admin_force_2fa: boolean;
}

export interface MailSettings {
  mail_mailer: string;
  mail_host: string;
  mail_port: string;
  mail_username: string;
  mail_password: string;
  mail_encryption: string;
  mail_from_address: string;
  mail_from_name: string;
}

export interface MaintenanceSettings {
  status: boolean;
  title: string | null;
  subtitle: string | null;
  paths: string[] | null;
}

// ============================================
// IMAGE TYPES
// ============================================

export interface Image {
  id: number;
  name: string;
  path: string;
  size: number;
  created_at: string;
}

// ============================================
// SERVER TYPES
// ============================================

export interface Server {
  id: number;
  name: string;
  address: string;
  port: number;
  query_port?: number;
  rcon_port?: number;
  rcon_password?: string;
  type: string;
  is_default: boolean;
  display_home: boolean;
  join_button?: string;
}

// ============================================
// BAN TYPES
// ============================================

export interface Ban {
  id: number;
  reason: string;
  expires_at: string | null;
  banned_user: {
    id: number;
    name: string;
  };
  created_at: string;
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export interface Notification {
  id: number;
  type: string;
  data: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
}

// ============================================
// FORM & VALIDATION TYPES
// ============================================

export interface ApiResource {
  id: number;
  [key: string]: unknown;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface FilterState {
  search: string;
  page: number;
  perPage: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// ============================================
// PUCK EDITOR TYPES
// ============================================

export interface PuckPage {
  id: number;
  title: string;
  slug: string;
  puck_data: Record<string, unknown> | null;
  use_puck: boolean;
  enabled: boolean;
}
