import { Head, usePage, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, RefreshCw, Trash2, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import { trans } from '@/lib/i18n';

interface CacheStats {
  enabled?: boolean;
  duration?: number;
  locale?: string;
  total_pages?: number;
  total_categories?: number;
  total_locales?: number;
  last_cleared?: string;
}

interface Props {
  stats?: CacheStats | null;
}

export default function DocumentationCache({ stats }: Props) {
  const { settings } = usePage<PageProps>().props;
  const [clearing, setClearing] = useState(false);
  const [warming, setWarming] = useState(false);

  const handleClearCache = async () => {
    setClearing(true);
    try {
      await router.post(route('admin.plugins.documentation.cache.clear'));
    } finally {
      setClearing(false);
    }
  };

  const handleWarmCache = async () => {
    setWarming(true);
    try {
      await router.post(route('admin.plugins.documentation.cache.warm'));
    } finally {
      setWarming(false);
    }
  };

  const safeStats = stats || {};

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.documentation.cache.title')} />

      <div className="container mx-auto py-6 px-4">
        {/* Header */}
        <div className="mb-6">
          <Link href={route('admin.plugins.documentation.index')}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {trans('admin.documentation.editor.back')}
            </Button>
          </Link>

          <h1 className="text-2xl font-bold mt-4">{trans('admin.documentation.cache.title')}</h1>
          <p className="text-muted-foreground">
            {trans('admin.documentation.cache.description')}
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{trans('admin.documentation.cache.stats.status')}</p>
                  <p className="text-2xl font-bold mt-1">
                    {safeStats.enabled ? trans('admin.documentation.cache.stats.enabled') : trans('admin.documentation.cache.stats.disabled')}
                  </p>
                </div>
                <Database className="h-8 w-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{trans('admin.documentation.cache.stats.duration')}</p>
              <p className="text-2xl font-bold mt-1">{safeStats.duration || 0}s</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{trans('admin.documentation.cache.stats.total_cached')}</p>
              <p className="text-2xl font-bold mt-1">{safeStats.total_pages || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{trans('admin.documentation.cache.stats.total_locales')}</p>
              <p className="text-2xl font-bold mt-1">{safeStats.total_locales || 0}</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{trans('admin.documentation.cache.actions.clear.title')}</CardTitle>
            <CardDescription>
              {trans('admin.documentation.cache.actions.clear.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                onClick={handleClearCache}
                disabled={clearing}
                variant="outline"
                className="h-auto p-4 justify-start"
              >
                <Trash2 className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <p className="font-medium">{trans('admin.documentation.cache.actions.clear.button')}</p>
                  <p className="text-sm text-muted-foreground">
                    {trans('admin.documentation.cache.actions.clear.title')}
                  </p>
                </div>
              </Button>

              <Button
                onClick={handleWarmCache}
                disabled={warming}
                variant="outline"
                className="h-auto p-4 justify-start"
              >
                <RefreshCw className={`h-5 w-5 mr-3 ${warming ? 'animate-spin' : ''}`} />
                <div className="text-left">
                  <p className="font-medium">{trans('admin.documentation.cache.actions.warm.button')}</p>
                  <p className="text-sm text-muted-foreground">
                    {trans('admin.documentation.cache.actions.warm.title')}
                  </p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">{trans('admin.documentation.cache.about.title')}</h3>
            <p className="text-sm text-muted-foreground">
              {trans('admin.documentation.cache.about.description')}
            </p>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
