import { Head, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IconSettings } from '@tabler/icons-react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

export default function TicketsSettings() {
  const { settings } = usePage<PageProps>().props;

  return (
    <AuthenticatedLayout>
      <Head title="Tickets Settings" />

      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Tickets Settings</h1>
          <p className="text-muted-foreground">Configure your support ticket system</p>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Ticket Statuses</Label>
              <Input placeholder="open,pending,closed" />
            </div>

            <div className="space-y-2">
              <Label>Default Priority</Label>
              <Input placeholder="low" />
            </div>

            <Button>Save Settings</Button>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
