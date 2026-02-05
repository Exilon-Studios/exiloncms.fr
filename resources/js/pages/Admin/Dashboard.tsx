import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, File, Image, AlertTriangle, Info, User, Settings, Bell, Palette, Shield, ShoppingBag, MessageSquare } from 'lucide-react';
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
  dashboardWidgets?: any[];
  adminWidgets?: any[];
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
  dashboardWidgets = [],
  adminWidgets = [],
}: DashboardProps) {
  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.dashboard.title')} />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {trans('admin.dashboard.title')}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {trans('admin.dashboard.welcome')}
        </p>
      </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{trans('admin.dashboard.users')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">{trans('admin.dashboard.registered_accounts')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{trans('admin.dashboard.posts')}</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPosts}</div>
              <p className="text-xs text-muted-foreground">{trans('admin.dashboard.published_articles')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{trans('admin.dashboard.pages')}</CardTitle>
              <File className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPages}</div>
              <p className="text-xs text-muted-foreground">{trans('admin.dashboard.static_pages')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{trans('admin.dashboard.images')}</CardTitle>
              <Image className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalImages}</div>
              <p className="text-xs text-muted-foreground">{trans('admin.dashboard.uploaded_files')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Cards */}
        {!secure && (
          <Card className="mb-6 border-yellow-500">
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

        {/* Quick Actions Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Onboarding Card */}
          <OnboardingChecklist
            onboardingComplete={onboardingComplete}
            onboardingProgress={onboardingProgress}
          />

          {/* Users Management */}
          <Card>
            <CardHeader>
              <CardTitle>{trans('admin.dashboard.quick_actions.users.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href="/admin/users"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{trans('admin.nav.users.users')}</div>
                  <div className="text-sm text-muted-foreground">{trans('admin.dashboard.quick_actions.users.manage')}</div>
                </div>
              </Link>
              <Link
                href="/admin/roles"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{trans('admin.nav.users.roles')}</div>
                  <div className="text-sm text-muted-foreground">{trans('admin.dashboard.quick_actions.users.roles')}</div>
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Settings & Appearance */}
          <Card>
            <CardHeader>
              <CardTitle>{trans('admin.dashboard.quick_actions.settings.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href="/admin/settings/general"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <Settings className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{trans('admin.dashboard.quick_actions.settings.general')}</div>
                  <div className="text-sm text-muted-foreground">{trans('admin.dashboard.quick_actions.settings.site_config')}</div>
                </div>
              </Link>
              <Link
                href="/admin/themes"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <Palette className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{trans('admin.dashboard.quick_actions.settings.themes')}</div>
                  <div className="text-sm text-muted-foreground">{trans('admin.dashboard.quick_actions.settings.appearance')}</div>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Dynamic Widgets Section */}
        <div className="grid gap-6">
          {dashboardWidgets.map((widget) => (
            <Card key={widget.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {widget.icon && widget.icon === 'FileText' && <FileText className="h-5 w-5" />}
                  {widget.icon && widget.icon === 'ShoppingBag' && <ShoppingBag className="h-5 w-5" />}
                  {widget.trans ? trans(widget.title) : widget.title}
                </CardTitle>
                <CardDescription>{widget.trans ? trans(widget.description) : widget.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Widget content is rendered by the component specified in widget */}
                {widget.component && (
                  <div className="text-sm text-muted-foreground">
                    Widget: {widget.component}
                  </div>
                )}
                {widget.href && (
                  <Link href={widget.href} className="inline-flex items-center gap-2 mt-4 text-sm text-primary hover:underline">
                    {widget.linkLabel || 'En savoir plus'} →
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Default widget if no plugins */}
          {dashboardWidgets.length === 0 && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun widget disponible</p>
                  <p className="text-sm mt-2">Installez des plugins pour voir des widgets ici</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
    </AuthenticatedLayout>
  );
}
