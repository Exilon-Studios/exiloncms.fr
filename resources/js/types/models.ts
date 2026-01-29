/**
 * Database Model Type Definitions
 * Shared types for all database models (Eloquent models from Laravel)
 */

import { Timestamps, SoftDeletes } from './index';

// ============================================
// SERVER MODEL
// ============================================

export interface Server {
  id: number;
  name: string;
  address: string;
  port: number;
  fullAddress: string;
  join_url?: string;
  home_display: boolean;
  isOnline: boolean;
  onlinePlayers?: number;
  maxPlayers?: number;
  playersPercents?: number;
}

// ============================================
// BLOG POST MODEL (from Blog plugin)
// ============================================

export interface Post extends Timestamps {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  featured_image?: string;
  published_at?: string;
  author?: {
    id: number;
    name: string;
    email?: string;
    avatar_url?: string;
  };
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  tags?: Tag[];
}

// ============================================
// BLOG TAG MODEL (from Blog plugin)
// ============================================

export interface Tag extends Timestamps {
  id: number;
  name: string;
  slug: string;
}

// ============================================
// BLOG CATEGORY MODEL (from Blog plugin)
// ============================================

export interface Category extends Timestamps {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

// ============================================
// COMMENT MODEL (from Blog plugin)
// ============================================

export interface Comment extends Timestamps {
  id: number;
  content: string;
  user?: {
    id: number;
    name: string;
    avatar_url?: string;
  };
  post_id: number;
}

// ============================================
// PAGE MODEL (from Pages plugin)
// ============================================

export interface Page extends Timestamps {
  id: number;
  title: string;
  slug: string;
  content?: string;
  is_published: boolean;
  published_at?: string;
}

// ============================================
// SHOP PRODUCT MODEL (from Shop plugin)
// ============================================

export interface Product extends Timestamps {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  image?: string;
  category?: ShopCategory;
  is_active: boolean;
}

// ============================================
// SHOP CATEGORY MODEL (from Shop plugin)
// ============================================

export interface ShopCategory extends Timestamps {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

// ============================================
// SHOP ORDER MODEL (from Shop plugin)
// ============================================

export interface Order extends Timestamps {
  id: number;
  user_id: number;
  total: number;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  items: OrderItem[];
}

// ============================================
// SHOP ORDER ITEM MODEL (from Shop plugin)
// ============================================

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product?: Product;
}

// ============================================
// NOTIFICATION MODEL
// ============================================

export interface Notification extends Timestamps {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  read_at?: string;
}

// ============================================
// IMAGE MODEL
// ============================================

export interface Image extends Timestamps {
  id: number;
  path: string;
  url: string;
  filename: string;
  mime_type: string;
  size: number;
  user_id?: number;
}

// ============================================
// SETTINGS MODEL
// ============================================

export interface Setting {
  key: string;
  name?: string;
  value: string | number | boolean | object;
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
  group?: string;
}

// ============================================
// LANDING SETTINGS MODEL
// ============================================

export interface LandingSettings {
  hero_title?: string;
  hero_description?: string;
  hero_background?: string;
  hero_cta_text?: string;
  hero_cta_link?: string;
  features_title?: string;
  features?: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  social_links?: Array<{
    platform: string;
    url: string;
    icon?: string;
  }>;
  [key: string]: unknown;
}
