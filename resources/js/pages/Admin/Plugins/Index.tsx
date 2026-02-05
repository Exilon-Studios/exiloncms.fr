import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { route } from 'ziggy-js';
import { trans } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Power, Trash2, Settings, Route, Database, FileText, Globe, Check, X } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  enabled: boolean;
  has_routes: boolean;
  has_admin_routes: boolean;
  has_migrations: boolean;
  has_settings: boolean;
}

interface Props {
  plugins: Plugin[];
}

export default function PluginsIndex({ plugins }: Props) {
  const togglePlugin = (pluginId: string) => {
    router.post(route('admin.plugins.toggle', pluginId));
  };

  const deletePlugin = (pluginId: string) => {
    if (confirm(trans('admin.plugins.delete_confirm'))) {
      router.delete(route('admin.plugins.destroy', pluginId));
    }
  };

  const enabledCount = plugins.filter(p => p.enabled).length;
  const totalCount = plugins.length;

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.plugins.title')} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{trans('admin.plugins.title')}</h1>
            <p className="text-muted-foreground mt-2">
              {trans('admin.plugins.description')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              <Check className="h-3 w-3 mr-1 text-green-500" />
              {enabledCount} / {totalCount} {trans('admin.plugins.enabled').toLowerCase()}
            </Badge>
          </div>
        </div>

        {/* Plugins Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plugins.map((plugin) => (
            <Card key={plugin.id} className={plugin.enabled ? 'border-green-200 dark:border-green-900' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{plugin.name}</CardTitle>
                    <CardDescription className="mt-2">{plugin.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Plugin Info */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>v{plugin.version}</span>
                  <span>•</span>
                  <span>{plugin.author}</span>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {plugin.has_routes && (
                    <Badge variant="outline" className="text-xs">
                      <Route className="h-3 w-3 mr-1" />
                      {trans('admin.plugins.routes')}
                    </Badge>
                  )}
                  {plugin.has_admin_routes && (
                    <Badge variant="outline" className="text-xs">
                      <Settings className="h-3 w-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                  {plugin.has_migrations && (
                    <Badge variant="outline" className="text-xs">
                      <Database className="h-3 w-3 mr-1" />
                      DB
                    </Badge>
                  )}
                  {plugin.has_settings && (
                    <Badge variant="outline" className="text-xs">
                      <FileText className="h-3 w-3 mr-1" />
                      {trans('admin.plugins.settings')}
                    </Badge>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between gap-2 pt-0">
                {/* Enable/Disable Switch */}
                <Switch
                  checked={plugin.enabled}
                  onCheckedChange={() => togglePlugin(plugin.id)}
                />

                {/* Delete Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deletePlugin(plugin.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {plugins.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Globe className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{trans('admin.plugins.no_plugins')}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
