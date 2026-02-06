/**
 * Shop Plugin Types
 *
 * Central type definitions for the Shop plugin.
 * All shop-related components should import types from here.
 */

// ============================================================
// CATEGORY TYPES
// ============================================================

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  is_active: boolean;
  position: number;
  created_at: string;
  updated_at: string;
  items?: Item[];
}

// ============================================================
// ITEM TYPES
// ============================================================

export interface Item {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  image?: string | null;
  category_id: number;
  is_active: boolean;
  stock?: number | null;
  position: number;
  created_at: string;
  updated_at: string;
  category?: Category;
}

// ============================================================
// CART TYPES
// ============================================================

export interface CartItem {
  id: number;
  user_id: number;
  item_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  item?: Item;
}

export interface CartTotal {
  subtotal: number;
  tax: number;
  total: number;
}

// ============================================================
// ORDER TYPES
// ============================================================

export interface Order {
  id: number;
  user_id: number;
  total: number;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  payment_id?: number | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  payment?: Payment;
}

export interface OrderItem {
  id: number;
  order_id: number;
  item_id: number;
  quantity: number;
  price: number;
  item?: Item;
}

// ============================================================
// PAYMENT TYPES
// ============================================================

export interface Payment {
  id: number;
  user_id: number;
  amount: number;
  method: 'paypal' | 'stripe' | 'tebex' | 'balance';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentItem {
  id: number;
  payment_id: number;
  item_id: number;
  quantity: number;
  price: number;
}

// ============================================================
// PAGINATION TYPES
// ============================================================

export interface Paginated<T> {
  data: T[];
  current_page: number;
  last_page: number;
  from: number;
  to: number;
  total: number;
  per_page: number;
  links: PaginationLink[];
}

export interface PaginationLink {
  url?: string | null;
  label: string;
  active: boolean;
}

// ============================================================
// FORM TYPES
// ============================================================

export interface AddToCartData {
  itemId: number;
  quantity?: number;
}

export interface UpdateCartItemData {
  quantity: number;
}

export interface CheckoutData {
  payment_method: string;
  items: {
    item_id: number;
    quantity: number;
  }[];
}

// ============================================================
// API RESPONSE TYPES
// ============================================================

export interface ShopApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

// ============================================================
// CONFIG TYPES
// ============================================================

export interface ShopConfig {
  currency_name: string;
  currency_symbol: string;
  enable_shop: boolean;
  items_per_page: number;
  enable_guest_checkout: boolean;
  enable_stock_management: boolean;
  enable_tax: boolean;
  tax_rate?: number;
}

// ============================================================
// COMPONENT PROP TYPES
// ============================================================

export interface ShopIndexProps {
  categories: Category[];
}

export interface ShopCategoryProps {
  category: Category;
  items: Paginated<Item>;
}

export interface ShopItemProps {
  item: Item;
}

export interface CartItemsProps {
  items: CartItem[];
  total: number;
}
