import { Head, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { MessageSquare, HelpCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TicketsIndexProps extends PageProps {
  stats: {
    total_tickets: number;
    open_tickets: number;
    pending_tickets: number;
    closed_tickets: number;
  };
}

export default function TicketsAdminIndex({ stats }: TicketsIndexProps) {
  const { settings } = usePage<TicketsIndexProps>().props;

  return (
    <div className={settings?.darkTheme ? 'dark' : ''}>
      <Head title="Tickets Admin - {settings?.name}" />

      <div className="min-h-screen bg-background">
        <div className="container py-12 px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Support Tickets</h1>
            <p className="text-muted-foreground text-lg">
              Manage user support tickets and responses
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_tickets}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
                <HelpCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.open_tickets}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Plus className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pending_tickets}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Closed</CardTitle>
                <div className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.closed_tickets}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common ticket management tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Category
                </Button>
                <Button variant="outline">
                  View Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
