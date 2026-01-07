import { Head, router } from '@inertiajs/react';
import { trans } from '@/lib/i18n';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Puzzle,
  Download,
  Trash2,
  Power,
  PowerOff,
  RefreshCw,
  Search,
  Star,
  GitBranch,
  Package,
  AlertCircle,
  CheckCircle2,
  Github
} from 'lucide-react';
import { useState } from 'react';

interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  url: string | null;
  enabled: boolean;
  hasUpdate: boolean;
  latestVersion?: string;
  apiId?: string;
  icon?: string;
  requirements?: {
    game?: string[];
    plugins?: string[];
  };
}

interface OnlinePlugin {
  id: string;
  extension_id?: string;
  name: string;
  description: string;
  version: string;
  author: string;
  stars: number;
  url: string;
  downloaded: number;
  repo_url?: string;
}

interface Props {
  plugins: Record<string, Plugin>;
  availablePlugins: OnlinePlugin[];
  pluginsUpdates: string[];
}

export default function PluginsIndex({ plugins, availablePlugins, pluginsUpdates }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'installed' | 'available'>('installed');

  const installedPlugins = Object.entries(plugins);

  const filteredInstalled = installedPlugins.filter(([id, plugin]) => {
    if (searchQuery) {
      return plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             plugin.description?.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const filteredAvailable = availablePlugins.filter((plugin) => {
    if (searchQuery) {
      return plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             plugin.description.toLowerCase().includes(searchQuery.toLowerCase());
    }
    // Ne pas afficher les plugins déjà installés
    return !Object.keys(plugins).includes(plugin.id);
  });

  const handleEnable = (pluginId: string) => {
    router.post(`/admin/plugins/${pluginId}/enable`);
  };

  const handleDisable = (pluginId: string) => {
    router.post(`/admin/plugins/${pluginId}/disable`);
  };

  const handleDelete = (pluginId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce plugin ?')) {
      router.delete(`/admin/plugins/${pluginId}`);
    }
  };

  const handleDownload = (pluginId: string) => {
    router.post(`/admin/plugins/${pluginId}/download`);
  };

  const getRepoUrl = (plugin: OnlinePlugin) => {
    // Utiliser repo_url si disponible
    if (plugin.repo_url) {
      return plugin.repo_url;
    }

    // Fallback: essayer d'extraire l'URL du repo depuis l'URL du zip
    try {
      const url = plugin.url;
      if (url.includes('raw.githubusercontent.com/')) {
        const match = url.match(/raw\.githubusercontent\.com\/([^\/]+\/[^\/]+)/);
        if (match) {
          return `https://github.com/${match[1]}`;
        }
      }
    } catch {
      // Ignore les erreurs
    }

    return null;
  };

  const handleUpdate = (pluginId: string) => {
    router.post(`/admin/plugins/${pluginId}/update`);
  };

  const handleReload = () => {
    router.post('/admin/plugins/reload');
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.plugins.title')} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{trans('admin.plugins.title')}</h1>
            <p className="text-muted-foreground mt-1">
              Gérez vos plugins et installez-en de nouveaux depuis le marketplace
            </p>
          </div>
          <Button onClick={handleReload} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2">
            <Button
              variant={filterTab === 'installed' ? 'default' : 'outline'}
              onClick={() => setFilterTab('installed')}
            >
              <Package className="h-4 w-4 mr-2" />
              Installés ({Object.keys(plugins).length})
            </Button>
            <Button
              variant={filterTab === 'available' ? 'default' : 'outline'}
              onClick={() => setFilterTab('available')}
            >
              <Download className="h-4 w-4 mr-2" />
              Marketplace ({availablePlugins.length})
            </Button>
          </div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un plugin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Updates Available Banner */}
        {pluginsUpdates.length > 0 && (
          <Card className="border-amber-500 bg-amber-50 dark:bg-amber-950/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <div className="flex-1">
                  <p className="font-semibold text-amber-900 dark:text-amber-100">
                    {pluginsUpdates.length} mise(s) à jour disponible(s)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Installed Plugins */}
        {filterTab === 'installed' && (
          <div className="grid gap-4">
            {filteredInstalled.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {searchQuery ? 'Aucun plugin trouvé' : 'Aucun plugin installé'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredInstalled.map(([id, plugin]) => (
                <Card key={id} className={plugin.enabled ? '' : 'opacity-60'}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                          <Puzzle className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-semibold truncate">{plugin.name}</h3>
                            <Badge variant={plugin.enabled ? 'default' : 'secondary'} className="shrink-0">
                              {plugin.enabled ? 'Activé' : 'Désactivé'}
                            </Badge>
                            {plugin.hasUpdate && (
                              <Badge variant="outline" className="border-amber-500 text-amber-600 shrink-0">
                                Mise à jour
                              </Badge>
                            )}
                          </div>

                          <p className="text-muted-foreground text-sm mb-1.5 line-clamp-1">{plugin.description}</p>

                          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                            <span>v{plugin.version}</span>
                            <span>•</span>
                            <span className="truncate">{plugin.author}</span>
                            {plugin.url && (
                              <>
                                <span>•</span>
                                <a href={plugin.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline whitespace-nowrap">
                                  GitHub
                                </a>
                              </>
                            )}
                            {plugin.hasUpdate && plugin.latestVersion && (
                              <>
                                <span>•</span>
                                <span className="text-green-600 font-medium">
                                  v{plugin.latestVersion} disponible
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {plugin.hasUpdate ? (
                          <Button
                            size="sm"
                            onClick={() => handleUpdate(id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                            Mettre à jour
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant={plugin.enabled ? 'destructive' : 'default'}
                            onClick={() => plugin.enabled ? handleDisable(id) : handleEnable(id)}
                          >
                            {plugin.enabled ? (
                              <>
                                <PowerOff className="h-3.5 w-3.5 mr-1.5" />
                                Désactiver
                              </>
                            ) : (
                              <>
                                <Power className="h-3.5 w-3.5 mr-1.5" />
                                Activer
                              </>
                            )}
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(id)}
                          disabled={plugin.enabled}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Available Plugins - Marketplace */}
        {filterTab === 'available' && (
          <div className="grid gap-4 grid-cols-[repeat(4,minmax(350px,1fr))]">
            {filteredAvailable.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {searchQuery ? 'Aucun plugin trouvé' : 'Aucun plugin disponible sur le marketplace'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredAvailable.map((plugin) => {
                const isInstalled = Object.keys(plugins).includes(plugin.id);

                return (
                  <Card key={plugin.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg shrink-0">
                          <Puzzle className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-semibold truncate">{plugin.name}</h3>
                            {isInstalled && (
                              <Badge variant="secondary" className="shrink-0">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Installé
                              </Badge>
                            )}
                          </div>

                          <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                            {plugin.description}
                          </p>

                          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2 flex-wrap">
                            <span>v{plugin.version}</span>
                            <span>•</span>
                            <span className="truncate">{plugin.author}</span>
                            {plugin.stars > 0 && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                  {plugin.stars}
                                </span>
                              </>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleDownload(plugin.id)}
                              disabled={isInstalled}
                            >
                              <Download className="h-3.5 w-3.5 mr-1.5" />
                              {isInstalled ? 'Déjà installé' : 'Installer'}
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const repoUrl = getRepoUrl(plugin);
                                if (repoUrl) {
                                  window.open(repoUrl, '_blank');
                                }
                              }}
                              title="Voir sur GitHub"
                            >
                              <Github className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
