/**
 * Dashboard Page - Main admin page
 * Type-safe with PageProps
 */

import { Head } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ShoppingCart, DollarSign, Activity } from 'lucide-react';
import { trans } from '@/lib/i18n';

interface DashboardStats {
  totalUsers: number;
  totalRevenue: number;
  totalOrders: number;
  activeServers: number;
}

interface DashboardProps extends PageProps {
  stats: DashboardStats;
}

export default function Dashboard({ stats }: DashboardProps) {
  return (
    <DashboardLayout showCart={true}>
      <Head title={trans('dashboard.title')} />

      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{trans('dashboard.title')}</h2>
            <p className="text-muted-foreground">
              {trans('dashboard.description')}
            </p>
          </div>
          <Button>
            <Activity className="mr-2 h-4 w-4" />
            {trans('dashboard.refresh_stats')}
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title={trans('dashboard.stats.total_users')}
            value={stats.totalUsers}
            icon={Users}
            description={trans('dashboard.stats.change_from_last_month')}
          />
          <StatCard
            title={trans('dashboard.stats.revenue')}
            value={`€${stats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            description={trans('dashboard.stats.change_from_last_month_revenue')}
          />
          <StatCard
            title={trans('dashboard.stats.orders')}
            value={stats.totalOrders}
            icon={ShoppingCart}
            description={trans('dashboard.stats.change_from_yesterday')}
          />
          <StatCard
            title={trans('dashboard.stats.active_servers')}
            value={stats.activeServers}
            icon={Activity}
            description={trans('dashboard.stats.all_systems_operational')}
            positive
          />
        </div>

        {/* Recent Activity */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{trans('dashboard.recent_orders.title')}</CardTitle>
              <CardDescription>{trans('dashboard.recent_orders.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {trans('dashboard.recent_orders.no_orders')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{trans('dashboard.server_status.title')}</CardTitle>
              <CardDescription>{trans('dashboard.server_status.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {trans('dashboard.server_status.all_online')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

// ============================================
// STAT CARD COMPONENT (DRY)
// ============================================

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  positive?: boolean;
}

function StatCard({ title, value, icon: Icon, description, positive }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className={`text-xs ${positive ? 'text-green-600' : 'text-muted-foreground'}`}>
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
