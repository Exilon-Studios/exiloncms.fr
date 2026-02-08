import { Head, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { IconShoppingCart, IconPlus } from '@tabler/icons-react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

export default function ShopItems() {
  const { settings } = usePage<PageProps>().props;

  return (
    <AuthenticatedLayout>
      <Head title="Shop Items" />

      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Shop Items</h1>
            <p className="text-muted-foreground">Manage your shop items</p>
          </div>
          <Button>
            <IconPlus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        <div className="bg-card rounded-lg border p-8 text-center">
          <IconShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">No items yet</h2>
          <p className="text-muted-foreground mb-4">Create your first shop item to get started</p>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
