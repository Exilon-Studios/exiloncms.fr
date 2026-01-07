import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IconDownload, IconRefresh, IconCheck, IconAlertCircle, IconExternalLink, IconCpu, IconPalette, IconPuzzle } from '@tabler/icons-react';
import { useState } from 'react';
import { trans } from '@/lib/i18n';
import { AdminLayout, AdminLayoutHeader, AdminLayoutTitle, AdminLayoutContent } from '@/components/admin/AdminLayout';

interface UpdateItem {
  id: string;
  name: string;
  currentVersion: string;
  latestVersion: string;
  description?: string;
  changelogUrl?: string;
  requiredApi?: string;
  isCompatible?: boolean;
}

interface Props {
  currentVersion: string;
  lastVersion?: Version;
  hasUpdate: boolean;
  isDownloaded: boolean;
  pluginsUpdates?: UpdateItem[];
  themesUpdates?: UpdateItem[];
}

export default function UpdatesIndex({ currentVersion, lastVersion, hasUpdate, isDownloaded, pluginsUpdates = [], themesUpdates = [] }: Props) {
  const [isFetching, setIsFetching] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  const fetchUpdates = () => {
    setIsFetching(true);
    router.post(route('admin.update.fetch'), {}, {
      onFinish: () => {
        setIsFetching(false);
      },
    });
  };

  const downloadUpdate = () => {
    setIsDownloading(true);
    router.post(route('admin.update.download'), {}, {
      onFinish: () => {
        setIsDownloading(false);
      },
    });
  };

  const installUpdate = () => {
    if (!confirm(trans('admin.update.index.install_confirm'))) {
      return;
    }

    setIsInstalling(true);
    router.post(route('admin.update.install'), {}, {
      onFinish: () => {
        setIsInstalling(false);
      },
    });
  };

  const updatePlugin = (pluginId: string) => {
    router.post(`/admin/plugins/${pluginId}/update`);
  };

  const updateTheme = (themeId: string) => {
    router.post(`/admin/themes/${themeId}/update`);
  };

  // Format description for display (convert markdown-like to plain text)
  const formatDescription = (description?: string): string => {
    if (!description) return '';

    return description
      .replace(/#{1,6}\s/g, '') // Remove markdown headers
      .replace(/\*\*/g, '') // Remove bold markdown
      .replace(/\*/g, '') // Remove italic markdown
      .replace(/`/g, '') // Remove code markdown
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert markdown links to text
      .substring(0, 500); // Limit length
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.nav.other.update')} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title={trans('admin.update.index.title')}
            description={trans('admin.update.index.description')}
          />
          <Button
            onClick={fetchUpdates}
            disabled={isFetching}
            variant="outline"
          >
            <IconRefresh className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            {trans('admin.update.index.check')}
          </Button>
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <div className="space-y-6">
            {/* CMS Updates */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <IconCpu className="h-5 w-5" />
                  <CardTitle>{trans('admin.update.index.system_status')}</CardTitle>
                </div>
                <CardDescription>
                  {trans('admin.update.index.status_description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {trans('admin.update.index.current_version')}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">
                        v{currentVersion}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t pt-4">
                  <div>
                    <p className="text-sm font-medium">
                      {trans('admin.update.index.status')}
                    </p>
                    {hasUpdate ? (
                      <div className="mt-1 flex items-center gap-2">
                        <IconAlertCircle className="h-5 w-5 text-orange-500" />
                        <span className="text-sm text-muted-foreground">
                          {trans('admin.update.index.update_available')}
                        </span>
                      </div>
                    ) : (
                      <div className="mt-1 flex items-center gap-2">
                        <IconCheck className="h-5 w-5 text-green-500" />
                        <span className="text-sm text-muted-foreground">
                          {trans('admin.update.index.up_to_date')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {hasUpdate && lastVersion && (
                  <div className="border-t pt-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium">
                          {trans('admin.update.index.latest_version')}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge>v{lastVersion.version || lastVersion.name}</Badge>
                          {isDownloaded && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                              {trans('admin.update.index.downloaded')}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {lastVersion.description && (
                        <div>
                          <p className="text-sm font-medium">
                            {trans('admin.update.index.description_label')}
                          </p>
                          <div className="mt-2 max-h-48 overflow-y-auto rounded-md bg-muted p-3 text-sm">
                            <pre className="whitespace-pre-wrap font-sans">{formatDescription(lastVersion.description)}</pre>
                          </div>
                        </div>
                      )}

                      {lastVersion.released_at && (
                        <div>
                          <p className="text-sm font-medium">
                            {trans('admin.update.index.released')}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {new Date(lastVersion.released_at).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        {lastVersion.github_url && (
                          <Button
                            variant="outline"
                            onClick={() => window.open(lastVersion.github_url, '_blank')}
                          >
                            <IconExternalLink className="mr-2 h-4 w-4" />
                            {trans('admin.update.index.view_changelog')}
                          </Button>
                        )}
                        {!isDownloaded ? (
                          <Button
                            onClick={downloadUpdate}
                            disabled={isDownloading}
                          >
                            <IconDownload className="mr-2 h-4 w-4" />
                            {isDownloading ? trans('admin.update.index.downloading') : trans('admin.update.index.download')}
                          </Button>
                        ) : (
                          <Button
                            onClick={installUpdate}
                            disabled={isInstalling}
                          >
                            <IconDownload className="mr-2 h-4 w-4" />
                            {isInstalling ? trans('admin.update.index.installing') : trans('admin.update.index.install')}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Plugins Updates */}
            {pluginsUpdates.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <IconPuzzle className="h-5 w-5" />
                    <CardTitle>Mises à jour des plugins</CardTitle>
                  </div>
                  <CardDescription>
                    {pluginsUpdates.length} plugin(s) à mettre à jour
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pluginsUpdates.map((plugin) => (
                      <div key={plugin.id} className="border p-4 rounded-lg space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{plugin.name}</h4>
                              <Badge variant="outline" className="text-xs shrink-0">
                                {plugin.currentVersion} → {plugin.latestVersion}
                              </Badge>
                            </div>

                            {/* Compatibility Check */}
                            {plugin.isCompatible !== undefined && (
                              <div className={`flex items-center gap-2 text-xs ${plugin.isCompatible ? 'text-green-600' : 'text-amber-600'}`}>
                                <IconCheck className="h-3.5 w-3.5" />
                                <span>
                                  {plugin.isCompatible
                                    ? `Votre système est compatible (API ${plugin.requiredApi})`
                                    : `API requise: ${plugin.requiredApi}`}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {/* Changelog Button */}
                            {plugin.changelogUrl && (
                              <Button
                                onClick={() => window.open(plugin.changelogUrl, '_blank')}
                                variant="outline"
                                size="sm"
                              >
                                <IconExternalLink className="h-4 w-4 mr-1.5" />
                                Changelog
                              </Button>
                            )}

                            <Button
                              onClick={() => updatePlugin(plugin.id)}
                              size="sm"
                            >
                              <IconDownload className="h-4 w-4 mr-1.5" />
                              Mettre à jour
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Themes Updates */}
            {themesUpdates.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <IconPalette className="h-5 w-5" />
                    <CardTitle>Mises à jour des thèmes</CardTitle>
                  </div>
                  <CardDescription>
                    {themesUpdates.length} thème(s) à mettre à jour
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {themesUpdates.map((theme) => (
                      <div key={theme.id} className="border p-4 rounded-lg space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{theme.name}</h4>
                              <Badge variant="outline" className="text-xs shrink-0">
                                {theme.currentVersion} → {theme.latestVersion}
                              </Badge>
                            </div>

                            {/* Compatibility Check */}
                            {theme.isCompatible !== undefined && (
                              <div className={`flex items-center gap-2 text-xs ${theme.isCompatible ? 'text-green-600' : 'text-amber-600'}`}>
                                <IconCheck className="h-3.5 w-3.5" />
                                <span>
                                  {theme.isCompatible
                                    ? `Votre système est compatible (API ${theme.requiredApi})`
                                    : `API requise: ${theme.requiredApi}`}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {/* Changelog Button */}
                            {theme.changelogUrl && (
                              <Button
                                onClick={() => window.open(theme.changelogUrl, '_blank')}
                                variant="outline"
                                size="sm"
                              >
                                <IconExternalLink className="h-4 w-4 mr-1.5" />
                                Changelog
                              </Button>
                            )}

                            <Button
                              onClick={() => updateTheme(theme.id)}
                              size="sm"
                            >
                              <IconDownload className="h-4 w-4 mr-1.5" />
                              Mettre à jour
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </AdminLayoutContent>
      </AdminLayout>
    </AuthenticatedLayout>
  );
}
