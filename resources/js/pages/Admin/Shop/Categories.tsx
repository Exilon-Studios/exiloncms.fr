import { Head, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { IconFolder, IconPlus } from '@tabler/icons-react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

export default function ShopCategories() {
  const { settings } = usePage<PageProps>().props;

  return (
    <AuthenticatedLayout>
      <Head title="Shop Categories" />

      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Shop Categories</h1>
            <p className="text-muted-foreground">Organize your items into categories</p>
          </div>
          <Button>
            <IconPlus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

        <div className="bg-card rounded-lg border p-8 text-center">
          <IconFolder className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">No categories yet</h2>
          <p className="text-muted-foreground mb-4">Create categories to organize your shop items</p>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
