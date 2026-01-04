import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IconDownload, IconRefresh, IconCheck, IconAlertCircle, IconExternalLink, IconDatabase } from '@tabler/icons-react';
import { useState } from 'react';
import { trans } from '@/lib/i18n';

interface Version {
  name: string;
  version: string;
  description?: string;
  released_at?: string;
  github_url?: string;
}

interface Props {
  currentVersion: string;
  lastVersion?: Version;
  hasUpdate: boolean;
  isDownloaded: boolean;
}

export default function UpdatesIndex({ currentVersion, lastVersion, hasUpdate, isDownloaded }: Props) {
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

      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {trans('admin.update.index.title')}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {trans('admin.update.index.description')}
            </p>
          </div>
          <Button
            onClick={fetchUpdates}
            disabled={isFetching}
            variant="outline"
          >
            <IconRefresh className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            {trans('admin.update.index.check')}
          </Button>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{trans('admin.update.index.system_status')}</CardTitle>
              <CardDescription>
                {trans('admin.update.index.status_description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {trans('admin.update.index.current_version')}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">
                      v{currentVersion}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {trans('admin.update.index.status')}
                  </p>
                  {hasUpdate ? (
                    <div className="mt-1 flex items-center gap-2">
                      <IconAlertCircle className="h-5 w-5 text-orange-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {trans('admin.update.index.update_available')}
                      </span>
                    </div>
                  ) : (
                    <div className="mt-1 flex items-center gap-2">
                      <IconCheck className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {trans('admin.update.index.up_to_date')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {hasUpdate && lastVersion && (
                <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {trans('admin.update.index.latest_version')}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="default">v{lastVersion.version || lastVersion.name}</Badge>
                        {isDownloaded && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                            {trans('admin.update.index.downloaded')}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {lastVersion.description && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {trans('admin.update.index.description_label')}
                        </p>
                        <div className="mt-2 max-h-48 overflow-y-auto rounded-md bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                          <pre className="whitespace-pre-wrap font-sans">{formatDescription(lastVersion.description)}</pre>
                        </div>
                      </div>
                    )}

                    {lastVersion.released_at && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {trans('admin.update.index.released')}
                        </p>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {new Date(lastVersion.released_at).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconDatabase className="h-5 w-5" />
                {trans('admin.update.index.info_title')}
              </CardTitle>
              <CardDescription>
                {trans('admin.update.index.info_description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>• {trans('admin.update.index.info_backup')}</p>
                <p>• {trans('admin.update.index.info_downtime')}</p>
                <p>• {trans('admin.update.index.info_changelog')}</p>
                <p>• {trans('admin.update.index.info_staging')}</p>
                <p className="mt-3 text-xs">
                  <strong>GitHub Integration:</strong> Les mises à jour sont récupérées depuis les releases GitHub du projet.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
