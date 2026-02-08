import { Head, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IconSettings } from '@tabler/icons-react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

export default function ShopSettings() {
  const { settings } = usePage<PageProps>().props;

  return (
    <AuthenticatedLayout>
      <Head title="Shop Settings" />

      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Shop Settings</h1>
          <p className="text-muted-foreground">Configure your shop settings</p>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Currency</Label>
              <Input placeholder="USD" />
            </div>

            <div className="space-y-2">
              <Label>Tax Rate (%)</Label>
              <Input type="number" placeholder="20" />
            </div>

            <Button>Save Settings</Button>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
