import { Head, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { IconTicket, IconMessage, IconFolder, IconSettings } from '@tabler/icons-react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { route } from 'ziggy-js';

export default function TicketsIndex() {
  const { settings } = usePage<PageProps>().props;

  const stats = [
    { label: 'Total Tickets', value: '0', icon: IconTicket },
    { label: 'Open', value: '0', icon: IconMessage },
    { label: 'Categories', value: '0', icon: IconFolder },
  ];

  return (
    <AuthenticatedLayout>
      <Head title="Tickets Dashboard" />

      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Tickets</h1>
          <p className="text-muted-foreground">Manage support tickets</p>
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
              <Link href={route('admin.plugins.tickets.categories.index')}>Manage Categories</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={route('admin.plugins.tickets.settings')}>
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
