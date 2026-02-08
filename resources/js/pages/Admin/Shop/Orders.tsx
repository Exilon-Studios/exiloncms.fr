import { Head, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { IconShoppingBag } from '@tabler/icons-react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

export default function ShopOrders() {
  const { settings } = usePage<PageProps>().props;

  return (
    <AuthenticatedLayout>
      <Head title="Shop Orders" />

      <div className="container py-6">
        <div>
          <h1 className="text-3xl font-bold">Shop Orders</h1>
          <p className="text-muted-foreground">View and manage customer orders</p>
        </div>

        <div className="mt-6 bg-card rounded-lg border p-8 text-center">
          <IconShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
          <p className="text-muted-foreground">Orders will appear here when customers make purchases</p>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
