import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';

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
  return (
    <AuthenticatedLayout>
      <Head title="Plugins" />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Plugins</h1>
          <p className="text-muted-foreground mt-2">
            Manage your plugins
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plugins.map((plugin) => (
            <div
              key={plugin.id}
              className="relative rounded-lg border p-4 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{plugin.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {plugin.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span>v{plugin.version}</span>
                    <span>•</span>
                    <span>{plugin.author}</span>
                  </div>
                </div>
                <div className={`ml-2 h-2 w-2 rounded-full ${
                  plugin.enabled ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                {plugin.has_routes && <span>Routes</span>}
                {plugin.has_admin_routes && <span>Admin</span>}
                {plugin.has_migrations && <span>DB</span>}
                {plugin.has_settings && <span>Settings</span>}
              </div>
            </div>
          ))}
        </div>

        {plugins.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No plugins found</p>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
