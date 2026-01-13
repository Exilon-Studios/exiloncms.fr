import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Link } from '@inertiajs/react';

/**
 * SHOP PLUGIN PUCK COMPONENTS
 *
 * These components can be used in the Puck visual editor.
 * To use them, register them in your shop plugin's entry point.
 *
 * Example registration (plugins/shop/resources/js/index.ts):
 * ```typescript
 * import { registerPluginComponent } from '@/lib/pluginComponents';
 * import { LatestPurchasesBlock, FeaturedItemsBlock, ShopStatsBlock } from './components/PuckComponents';
 *
 * registerPluginComponent({
 *   id: 'latest-purchases',
 *   pluginId: 'shop',
 *   name: 'Latest Purchases',
 *   category: 'shop',
 *   description: 'Display recent shop purchases',
 *   fields: { limit: { type: 'number', label: 'Items' } },
 *   defaultProps: { limit: 5 },
 *   render: LatestPurchasesBlock,
 * });
 * ```

// ============================================================
// LATEST PURCHASES BLOCK
// ============================================================

interface LatestPurchasesProps {
  limit?: number;
  showUser?: boolean;
  showAmount?: boolean;
  title?: string;
}

interface ShopPurchase {
  id: number;
  itemName: string;
  price: number;
  currency: string;
  userName?: string;
  createdAt: string;
}

export function LatestPurchasesBlock({
  limit = 5,
  showUser = true,
  showAmount = true,
  title = 'Latest Purchases',
}: LatestPurchasesProps) {
  const { settings } = usePage<PageProps>().props;

  // Mock data - in real usage, this would come from API
  const purchases: ShopPurchase[] = [
    { id: 1, itemName: 'Diamond Rank', price: 25, currency: '€', userName: 'Player1', createdAt: '2 min ago' },
    { id: 2, itemName: 'Gold Rank', price: 15, currency: '€', userName: 'Player2', createdAt: '5 min ago' },
    { id: 3, itemName: '1000 Coins', price: 5, currency: '€', userName: 'Player3', createdAt: '10 min ago' },
    { id: 4, itemName: 'VIP Rank', price: 10, currency: '€', userName: 'Player4', createdAt: '15 min ago' },
    { id: 5, itemName: '500 Coins', price: 3, currency: '€', userName: 'Player5', createdAt: '20 min ago' },
  ].slice(0, limit);

  const currency = settings?.money || '€';

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        <Link
          href="/shop"
          className="text-xs text-primary hover:underline"
        >
          View Shop →
        </Link>
      </div>

      <div className="space-y-3">
        {purchases.map((purchase) => (
          <div
            key={purchase.id}
            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{purchase.itemName}</p>
                {showUser && (
                  <p className="text-xs text-muted-foreground">by {purchase.userName}</p>
                )}
              </div>
            </div>
            {showAmount && (
              <div className="text-right">
                <p className="text-sm font-bold text-primary">
                  {purchase.price}{currency}
                </p>
                <p className="text-xs text-muted-foreground">{purchase.createdAt}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// FEATURED ITEMS BLOCK
// ============================================================

interface FeaturedItemsProps {
  limit?: number;
  title?: string;
  category?: string;
}

interface ShopItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
}

export function FeaturedItemsBlock({
  limit = 4,
  title = 'Featured Items',
  category,
}: FeaturedItemsProps) {
  const { settings } = usePage<PageProps>().props;

  // Mock data
  const items: ShopItem[] = [
    { id: 1, name: 'Diamond Rank', description: 'Permanent perks', price: 25, image: '/img/rank-diamond.png' },
    { id: 2, name: 'Gold Rank', description: 'Great benefits', price: 15, image: '/img/rank-gold.png' },
    { id: 3, name: '1000 Coins', description: 'In-game currency', price: 5, image: '/img/coins.png' },
    { id: 4, name: 'Crate Key', description: 'Loot crate', price: 2, image: '/img/key.png' },
  ].slice(0, limit);

  const currency = settings?.money || '€';

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        <Link href="/shop" className="text-xs text-primary hover:underline">
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/shop/item/${item.id}`}
            className="group"
          >
            <div className="bg-muted/50 rounded-lg p-4 hover:bg-muted hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-3 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <h4 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                {item.name}
              </h4>
              <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
              <p className="text-sm font-bold text-primary">
                {item.price}{currency}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// SHOP STATS BLOCK
// ============================================================

interface ShopStatsProps {
  showRevenue?: boolean;
  showOrders?: boolean;
  showItems?: boolean;
  title?: string;
}

export function ShopStatsBlock({
  showRevenue = true,
  showOrders = true,
  showItems = true,
  title = 'Shop Statistics',
}: ShopStatsProps) {
  const { settings } = usePage<PageProps>().props;

  // Mock data
  const stats = {
    revenue: { value: '1,250', label: 'Total Revenue', icon: 'currency' },
    orders: { value: '342', label: 'Total Orders', icon: 'cart' },
    items: { value: '89', label: 'Available Items', icon: 'package' },
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-foreground mb-6">{title}</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {showRevenue && (
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500">
                  <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <p className="text-xs text-muted-foreground">{stats.revenue.label}</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.revenue.value}{settings?.money}</p>
          </div>
        )}

        {showOrders && (
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <p className="text-xs text-muted-foreground">{stats.orders.label}</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.orders.value}</p>
          </div>
        )}

        {showItems && (
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-500">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
              </div>
              <p className="text-xs text-muted-foreground">{stats.items.label}</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.items.value}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// QUICK BUY BLOCK
// ============================================================

interface QuickBuyProps {
  items?: string; // Comma-separated item IDs
  title?: string;
  showImage?: boolean;
}

export function QuickBuyBlock({
  items = '',
  title = 'Quick Buy',
  showImage = true,
}: QuickBuyProps) {
  const { settings } = usePage<PageProps>().props;

  // Mock quick buy items
  const quickItems: ShopItem[] = [
    { id: 1, name: '1000 Coins', description: 'In-game currency', price: 5 },
    { id: 2, name: 'Crate Key', description: 'Loot crate key', price: 2 },
    { id: 3, name: 'Fly Pass', description: '30 days fly access', price: 10 },
  ];

  const currency = settings?.money || '€';

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-foreground mb-4">{title}</h3>

      <div className="space-y-3">
        {quickItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors group">
            <div className="flex items-center gap-3">
              {showImage && (
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <path d="M3 6h18" />
                  </svg>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </div>
            <Link
              href={`/shop/buy/${item.id}`}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors opacity-0 group-hover:opacity-100"
            >
              Buy {item.price}{currency}
            </Link>
          </div>
        ))}
      </div>

      <Link
        href="/shop"
        className="mt-4 block text-center text-sm text-primary hover:underline"
      >
        Visit Shop →
      </Link>
    </div>
  );
}

// ============================================================
// COMPONENT REGISTRATION EXPORT
// ============================================================

/**
 * Export all components with their Puck configurations
 * Use this to register in your shop plugin
 */
export const ShopPuckComponents = {
  LatestPurchasesBlock: {
    component: LatestPurchasesBlock,
    config: {
      fields: {
        limit: { type: 'number', label: 'Number of items', default: 5 },
        showUser: { type: 'checkbox', label: 'Show username', default: true },
        showAmount: { type: 'checkbox', label: 'Show amount', default: true },
        title: { type: 'text', label: 'Title', default: 'Latest Purchases' },
      },
    },
  },

  FeaturedItemsBlock: {
    component: FeaturedItemsBlock,
    config: {
      fields: {
        limit: { type: 'number', label: 'Number of items', default: 4 },
        title: { type: 'text', label: 'Title', default: 'Featured Items' },
        category: { type: 'text', label: 'Filter by category (optional)', default: '' },
      },
    },
  },

  ShopStatsBlock: {
    component: ShopStatsBlock,
    config: {
      fields: {
        showRevenue: { type: 'checkbox', label: 'Show revenue', default: true },
        showOrders: { type: 'checkbox', label: 'Show orders', default: true },
        showItems: { type: 'checkbox', label: 'Show items', default: true },
        title: { type: 'text', label: 'Title', default: 'Shop Statistics' },
      },
    },
  },

  QuickBuyBlock: {
    component: QuickBuyBlock,
    config: {
      fields: {
        items: { type: 'text', label: 'Item IDs (comma-separated)', default: '' },
        title: { type: 'text', label: 'Title', default: 'Quick Buy' },
        showImage: { type: 'checkbox', label: 'Show images', default: true },
      },
    },
  },
};
