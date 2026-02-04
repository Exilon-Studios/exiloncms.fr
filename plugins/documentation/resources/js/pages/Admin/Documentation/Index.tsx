import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookOpen, FileText, Database, Settings, Globe, ArrowRight, Check, X } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Props {
  locales: string[];
  stats: Record<string, { categories: number; pages: number }>;
  cacheStats: {
    enabled: boolean;
    duration: number;
    locale: string;
  };
}

export default function DocumentationIndex({ locales, stats, cacheStats }: Props) {
  const { settings } = usePage<PageProps>().props;

  const totalCategories = Object.values(stats).reduce((sum, s) => sum + s.categories, 0);
  const totalPages = Object.values(stats).reduce((sum, s) => sum + s.pages, 0);

  return (
    <AuthenticatedLayout>
      <Head title="Documentation Management" />

      <div className="space-y-6 p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
            <p className="text-muted-foreground mt-2">
              Manage your integrated documentation system
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={route('admin.plugins.documentation.index') + '/settings'}>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Locales</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{locales.length}</div>
              <p className="text-xs text-muted-foreground">
                Available languages
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPages}</div>
              <p className="text-xs text-muted-foreground">
                Across {totalCategories} categories
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Cache Status</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {cacheStats.enabled ? (
                  <>
                    <Badge variant="default" className="bg-green-500">
                      <Check className="h-3 w-3 mr-1" />
                      Enabled
                    </Badge>
                  </>
                ) : (
                  <Badge variant="secondary">
                    <X className="h-3 w-3 mr-1" />
                    Disabled
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {cacheStats.duration}s duration
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Link href={route('admin.plugins.documentation.browse', { locale: 'fr' })} className="group">
            <Card className="transition-colors hover:bg-accent/50 cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Browse Documentation
                  <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardTitle>
                <CardDescription>
                  View and edit documentation pages
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href={route('admin.plugins.documentation.cache')} className="group">
            <Card className="transition-colors hover:bg-accent/50 cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Cache Management
                  <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardTitle>
                <CardDescription>
                  Clear or warm the documentation cache
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Stats by Locale */}
        <Card>
          <CardHeader>
            <CardTitle>Statistics by Language</CardTitle>
            <CardDescription>
              Documentation pages breakdown per locale
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Language</TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead>Pages</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locales.map((locale) => (
                  <TableRow key={locale}>
                    <TableCell className="font-medium">
                      <Badge variant="outline">{locale.toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell>{stats[locale]?.categories ?? 0}</TableCell>
                    <TableCell>{stats[locale]?.pages ?? 0}</TableCell>
                    <TableCell className="text-right">
                      <Link href={route('admin.plugins.documentation.browse', { locale })}>
                        <Button variant="ghost" size="sm">
                          Browse
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
