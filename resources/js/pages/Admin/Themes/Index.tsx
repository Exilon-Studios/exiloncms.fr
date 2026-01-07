import { Head, router } from '@inertiajs/react';
import { trans } from '@/lib/i18n';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Palette,
  Download,
  Trash2,
  RefreshCw,
  Search,
  Eye,
  EyeOff,
  Settings,
  Star,
  GitBranch,
  Layout,
  CheckCircle2,
  Github
} from 'lucide-react';
import { useState } from 'react';

interface Theme {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  url: string | null;
  hasUpdate: boolean;
  latestVersion?: string;
  apiId?: string;
  screenshot?: string;
}

interface OnlineTheme {
  id: string;
  extension_id?: string;
  name: string;
  description: string;
  version: string;
  author: string;
  stars: number;
  url: string;
  downloaded: number;
  screenshot?: string;
  repo_url?: string;
}

interface Props {
  themes: Record<string, Theme>;
  current: Theme | null;
  currentPath: string;
  currentHasConfig: boolean;
  availableThemes: OnlineTheme[];
  themesUpdates: string[];
}

export default function ThemesIndex({
  themes,
  current,
  currentPath,
  currentHasConfig,
  availableThemes,
  themesUpdates
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'installed' | 'available'>('installed');

  const installedThemes = Object.entries(themes);

  const filteredInstalled = installedThemes.filter(([id, theme]) => {
    if (searchQuery) {
      return theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             theme.description?.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const filteredAvailable = availableThemes.filter((theme) => {
    if (searchQuery) {
      return theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             theme.description.toLowerCase().includes(searchQuery.toLowerCase());
    }
    // Ne pas afficher les thèmes déjà installés
    return !Object.keys(themes).includes(theme.id);
  });

  const handleActivate = (themeId: string | null) => {
    router.post(`/admin/themes/change`, { theme: themeId });
  };

  const handleDelete = (themeId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce thème ?')) {
      router.delete(`/admin/themes/${themeId}`);
    }
  };

  const handleDownload = (themeId: string) => {
    router.post(`/admin/themes/${themeId}/download`);
  };

  const handleDownloadZip = (theme: OnlineTheme) => {
    const link = document.createElement('a');
    link.href = theme.url;
    link.download = `exiloncms-theme-${theme.extension_id || theme.id}.zip`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getGithubRepoUrl = (theme: OnlineTheme) => {
    // Si githubUrl est définie, l'utiliser
    if (theme.githubUrl) {
      return theme.githubUrl;
    }

    // Sinon, essayer d'extraire l'URL du repo depuis l'URL du zip
    try {
      const url = theme.url;
      if (url.includes('raw.githubusercontent.com/')) {
        const match = url.match(/raw\.githubusercontent\.com\/([^\/]+\/[^\/]+)/);
        if (match) {
          return `https://github.com/${match[1]}`;
        }
      }
    } catch {
      // Ignore les erreurs
    }

    // Fallback: retourner l'URL du zip
    return theme.url;
  };

  const handleUpdate = (themeId: string) => {
    router.post(`/admin/themes/${themeId}/update`);
  };

  const handleReload = () => {
    router.post('/admin/themes/reload');
  };

  const handleConfigure = (themeId: string) => {
    router.visit(`/admin/themes/${themeId}/edit`);
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.themes.title')} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{trans('admin.themes.title')}</h1>
            <p className="text-muted-foreground mt-1">
              Gérez vos thèmes et installez-en de nouveaux depuis le marketplace
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
              <Layout className="h-4 w-4 mr-2" />
              Installés ({Object.keys(themes).length + (current ? 1 : 0)})
            </Button>
            <Button
              variant={filterTab === 'available' ? 'default' : 'outline'}
              onClick={() => setFilterTab('available')}
            >
              <Download className="h-4 w-4 mr-2" />
              Marketplace ({availableThemes.length})
            </Button>
          </div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un thème..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Updates Available Banner */}
        {themesUpdates.length > 0 && (
          <Card className="border-amber-500 bg-amber-50 dark:bg-amber-950/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <RefreshCw className="h-5 w-5 text-amber-600" />
                <div className="flex-1">
                  <p className="font-semibold text-amber-900 dark:text-amber-100">
                    {themesUpdates.length} mise(s) à jour disponible(s)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Theme */}
        {current && (
          <Card className="border-primary bg-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Thème actif
                </CardTitle>
                <Badge>{currentPath}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Palette className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{current.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {current.description} • v{current.version} • {current.author}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {currentHasConfig && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConfigure(current.id)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Configurer
                    </Button>
                  )}
                  {current.hasUpdate && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdate(current.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Mettre à jour
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(current.url || '', '_blank')}
                  >
                    <GitBranch className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Installed Themes */}
        {filterTab === 'installed' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Thèmes installés</h2>
            <div className="grid gap-4">
              {filteredInstalled.length === 0 && !current ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Layout className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      {searchQuery ? 'Aucun thème trouvé' : 'Aucun thème installé'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredInstalled.map(([id, theme]) => (
                  <Card key={id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="p-3 bg-blue-500/10 rounded-lg">
                            <Palette className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold">{theme.name}</h3>
                              {theme.hasUpdate && (
                                <Badge variant="outline" className="border-amber-500 text-amber-600">
                                  Mise à jour disponible
                                </Badge>
                              )}
                            </div>

                            <p className="text-muted-foreground text-sm">
                              {theme.description}
                            </p>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                              <span>v{theme.version}</span>
                              <span>•</span>
                              <span>{theme.author}</span>
                              {theme.url && (
                                <>
                                  <span>•</span>
                                  <a href={theme.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    Voir sur GitHub
                                  </a>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          {theme.hasUpdate ? (
                            <Button
                              size="sm"
                              onClick={() => handleUpdate(id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Mettre à jour
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleActivate(id)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Activer
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(id)}
                            disabled={current?.id === id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* Available Themes - Marketplace */}
        {filterTab === 'available' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Marketplace</h2>
            <div className="grid gap-4 grid-cols-[repeat(4,minmax(350px,1fr))]">
              {filteredAvailable.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="py-12 text-center">
                    <Palette className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      {searchQuery ? 'Aucun thème trouvé' : 'Aucun thème disponible sur le marketplace'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredAvailable.map((theme) => {
                  const isInstalled = Object.keys(themes).includes(theme.id);

                  return (
                    <Card key={theme.id}>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Screenshot */}
                          {theme.screenshot && (
                            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                              <img
                                src={theme.screenshot}
                                alt={theme.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          {/* Info */}
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold truncate">{theme.name}</h3>
                              {isInstalled && (
                                <Badge variant="secondary" className="shrink-0">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Installé
                                </Badge>
                              )}
                            </div>

                            <p className="text-muted-foreground text-sm line-clamp-2">
                              {theme.description}
                            </p>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>v{theme.version}</span>
                              <span>•</span>
                              <span>{theme.author}</span>
                              {theme.stars > 0 && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                    {theme.stars}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => handleDownload(theme.id)}
                              disabled={isInstalled}
                            >
                              <Download className="h-4 w-4 mr-1.5" />
                              {isInstalled ? 'Déjà installé' : 'Installer'}
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(getGithubRepoUrl(theme), '_blank')}
                              title="Voir sur GitHub"
                            >
                              <Github className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
