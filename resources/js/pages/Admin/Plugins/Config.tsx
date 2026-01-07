import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Puzzle, ArrowLeft } from 'lucide-react';
import { trans } from '@/lib/i18n';

interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  url: string | null;
  enabled: boolean;
}

interface Props {
  plugin: Plugin;
  config: Record<string, any>;
}

export default function PluginConfig({ plugin, config }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    ...config,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/admin/plugins/${plugin.id}/config`);
  };

  return (
    <AuthenticatedLayout>
      <Head title={`Configuration - ${plugin.name}`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <a
            href="/admin/plugins"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </a>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Puzzle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{plugin.name}</h1>
                <p className="text-muted-foreground">{plugin.description}</p>
              </div>
            </div>
          </div>
          <Badge variant={plugin.enabled ? 'default' : 'secondary'}>
            {plugin.enabled ? 'Activé' : 'Désactivé'}
          </Badge>
        </div>

        {/* Plugin Info */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Version</p>
                <p className="font-semibold">{plugin.version}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Auteur</p>
                <p className="font-semibold">{plugin.author}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ID</p>
                <p className="font-semibold">{plugin.id}</p>
              </div>
              {plugin.url && (
                <div>
                  <p className="text-sm text-muted-foreground">Lien</p>
                  <a
                    href={plugin.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Voir sur GitHub
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Configuration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration du plugin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                <Puzzle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>La configuration de ce plugin sera disponible prochainement.</p>
                <p className="text-sm mt-2">
                  Les options de configuration seront définies par le développeur du plugin.
                </p>
              </div>

              {/* Example configuration fields (commented out for now)
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Option de configuration
                  </label>
                  <input
                    type="text"
                    value={data.example_field || ''}
                    onChange={(e) => setData('example_field', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  {errors.example_field && (
                    <p className="text-sm text-red-600 mt-1">{errors.example_field}</p>
                  )}
                </div>
              </div>
              */}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <a href="/admin/plugins">
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </a>
            <Button type="submit" disabled={processing}>
              {processing ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}
