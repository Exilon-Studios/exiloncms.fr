import { Head, usePage, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, RefreshCw, Trash2, Check, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';

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
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleClearCache = async () => {
    setClearing(true);
    setMessage(null);

    try {
      await router.post(route('admin.plugins.documentation.cache.clear'));
      setMessage({ type: 'success', text: 'Cache vidé avec succès.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors du vidage du cache.' });
    } finally {
      setClearing(false);
    }
  };

  const handleWarmCache = async () => {
    setWarming(true);
    setMessage(null);

    try {
      await router.post(route('admin.plugins.documentation.cache.warm'));
      setMessage({ type: 'success', text: 'Cache préchargé avec succès.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors du préchargement du cache.' });
    } finally {
      setWarming(false);
    }
  };

  const safeStats = stats || {};

  return (
    <AuthenticatedLayout>
      <Head title="Documentation Cache" />

      <div className="container mx-auto py-6 px-4">
        {/* Header */}
        <div className="mb-6">
          <Link href={route('admin.plugins.documentation.index')}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>

          <h1 className="text-2xl font-bold mt-4">Documentation Cache</h1>
          <p className="text-muted-foreground">
            Manage documentation cache for better performance
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-400'
            }`}
          >
            {message.type === 'success' ? (
              <Check className="h-5 w-5" />
            ) : (
              <Trash2 className="h-5 w-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-2xl font-bold mt-1">
                    {safeStats.enabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
                <Database className="h-8 w-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="text-2xl font-bold mt-1">{safeStats.duration || 0}s</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Cached Pages</p>
              <p className="text-2xl font-bold mt-1">{safeStats.total_pages || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Locales</p>
              <p className="text-2xl font-bold mt-1">{safeStats.total_locales || 0}</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>
              Manage documentation cache
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
                  <p className="font-medium">Clear Cache</p>
                  <p className="text-sm text-muted-foreground">
                    Remove all cached data
                  </p>
                </div>
              </Button>

              <Button
                onClick={handleWarmCache}
                disabled={warming}
                variant="outline"
                className="h-auto p-4 justify-start"
              >
                <RefreshCw className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <p className="font-medium">Warm Cache</p>
                  <p className="text-sm text-muted-foreground">
                    Preload all pages into cache
                  </p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">About Cache</h3>
            <p className="text-sm text-muted-foreground">
              Documentation cache stores processed pages and navigation for better performance.
              Cache is automatically invalidated when pages are modified.
            </p>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
