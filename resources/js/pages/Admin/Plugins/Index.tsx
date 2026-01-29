import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { route } from 'ziggy-js';
import { IconToggleLeft, IconToggleRight, IconTrash } from '@tabler/icons-react';

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
    if (confirm('Are you sure you want to delete this plugin? This action cannot be undone.')) {
      router.delete(route('admin.plugins.destroy', pluginId));
    }
  };

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

              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => togglePlugin(plugin.id)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    plugin.enabled
                      ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30'
                      : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30'
                  }`}
                >
                  {plugin.enabled ? (
                    <>
                      <IconToggleLeft className="h-3.5 w-3.5" />
                      Disable
                    </>
                  ) : (
                    <>
                      <IconToggleRight className="h-3.5 w-3.5" />
                      Enable
                    </>
                  )}
                </button>

                <button
                  onClick={() => deletePlugin(plugin.id)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                >
                  <IconTrash className="h-3.5 w-3.5" />
                  Delete
                </button>
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
