import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import {
  AdminLayout,
  AdminLayoutHeader,
  AdminLayoutTitle,
  AdminLayoutContent
} from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, File, Image, AlertTriangle, Info, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { trans } from '@/lib/i18n';
import { OnboardingChecklist } from '@/components/admin/OnboardingChecklist';

interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  totalPages: number;
  totalImages: number;
}

interface DashboardCharts {
  newUsersPerMonths: Record<string, number>;
  newUsersPerDays: Record<string, number>;
}

interface DashboardProps extends PageProps {
  secure: boolean;
  stats: DashboardStats;
  charts: DashboardCharts;
  activeUsers: Record<string, number>;
  newVersion: string | null;
  apiAlerts: any[];
  onboardingComplete: boolean;
  onboardingProgress: any[];
}

export default function Dashboard({
  secure,
  stats,
  charts,
  activeUsers,
  newVersion,
  apiAlerts,
  onboardingComplete,
  onboardingProgress,
}: DashboardProps) {
  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.dashboard.title')} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title={trans('admin.nav.dashboard')}
            description={trans('admin.dashboard.welcome')}
          />
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <div className="space-y-6">
            {/* Onboarding Checklist */}
            <OnboardingChecklist
              onboardingComplete={onboardingComplete}
              onboardingProgress={onboardingProgress}
            />

            {/* Alerts */}
            {!secure && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                    <div>
                      <p className="font-semibold text-destructive">{trans('admin.dashboard.security_warning')}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {trans('admin.dashboard.http')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {newVersion && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold text-primary">{trans('admin.update.has_update')}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {trans('admin.update.update', { 'last-version': newVersion, version: '' })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{trans('admin.dashboard.users')}</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">{trans('admin.dashboard.registered_accounts')}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{trans('admin.dashboard.posts')}</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalPosts}</div>
                  <p className="text-xs text-muted-foreground">{trans('admin.dashboard.published_articles')}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{trans('admin.dashboard.pages')}</CardTitle>
                  <File className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalPages}</div>
                  <p className="text-xs text-muted-foreground">{trans('admin.dashboard.static_pages')}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{trans('admin.dashboard.images')}</CardTitle>
                  <Image className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalImages}</div>
                  <p className="text-xs text-muted-foreground">{trans('admin.dashboard.uploaded_files')}</p>
                </CardContent>
              </Card>
            </div>

            {/* Active Users & New Users */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{trans('admin.dashboard.active_users')}</CardTitle>
                  <CardDescription>{trans('admin.dashboard.user_activity')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(activeUsers).map(([period, count]) => (
                      <div key={period} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{period}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    {trans('admin.dashboard.recent_users')}
                  </CardTitle>
                  <CardDescription>{trans('admin.dashboard.registrations_7days')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(charts.newUsersPerDays).slice(-7).map(([day, count]) => (
                      <div key={day} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{day}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </AdminLayoutContent>
      </AdminLayout>
    </AuthenticatedLayout>
  );
}
