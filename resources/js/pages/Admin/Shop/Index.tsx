import { Head, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { IconShoppingCart, IconPackage, IconFolder, IconShoppingBag, IconSettings } from '@tabler/icons-react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { route } from 'ziggy-js';

export default function ShopIndex() {
  const { settings } = usePage<PageProps>().props;

  const stats = [
    { label: 'Total Items', value: '0', icon: IconPackage },
    { label: 'Categories', value: '0', icon: IconFolder },
    { label: 'Orders', value: '0', icon: IconShoppingBag },
  ];

  return (
    <AuthenticatedLayout>
      <Head title="Shop Dashboard" />

      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Shop</h1>
          <p className="text-muted-foreground">Manage your online store</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card rounded-lg border p-6">
              <div className="flex items-center gap-4">
                <stat.icon className="h-10 w-10 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href={route('admin.plugins.shop.items.index')}>Manage Items</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={route('admin.plugins.shop.categories.index')}>Manage Categories</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={route('admin.plugins.shop.orders.index')}>View Orders</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={route('admin.plugins.shop.settings')}>
                <IconSettings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
