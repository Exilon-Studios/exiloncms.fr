import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, RefreshCw, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { trans } from '@/lib/i18n';
import { useForm } from '@inertiajs/react';

interface UpdateProps {
  currentVersion: string;
  lastVersion?: {
    tag_name: string;
    name: string;
    body: string;
    html_url: string;
    published_at: string;
    author?: {
      login: string;
      avatar_url: string;
    };
  };
  hasUpdate: boolean;
  isDownloaded: boolean;
}

export default function UpdatesIndex({ currentVersion, lastVersion, hasUpdate, isDownloaded }: UpdateProps) {
  const fetchForm = useForm({});
  const downloadForm = useForm({});
  const installForm = useForm({});

  const handleFetch = () => {
    fetchForm.post(route('admin.update.fetch'));
  };

  const handleDownload = () => {
    downloadForm.post(route('admin.update.download'));
  };

  const handleInstall = () => {
    if (confirm(trans('admin.update.confirm_install'))) {
      installForm.post(route('admin.update.install'));
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.update.title')} />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{trans('admin.update.title')}</h1>
          <p className="text-muted-foreground mt-2">{trans('admin.update.description')}</p>
        </div>

        {/* Current Version */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{trans('admin.update.current_version')}</span>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {currentVersion}
              </Badge>
            </CardTitle>
            <CardDescription>
              {trans('admin.update.currently_running')}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Update Available */}
        {hasUpdate && lastVersion ? (
          <Card className={hasUpdate ? 'border-primary' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {hasUpdate ? (
                  <>
                    <AlertCircle className="h-5 w-5 text-primary" />
                    {trans('admin.update.available')}
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    {trans('admin.update.latest')}
                  </>
                )}
                <Badge variant="secondary" className="ml-2">
                  {lastVersion.tag_name}
                </Badge>
              </CardTitle>
              <CardDescription>
                {trans('admin.update.published')} {new Date(lastVersion.published_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {lastVersion.body && (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <h4 className="font-semibold">{trans('admin.update.changelog')}</h4>
                  <div
                    className="bg-muted p-4 rounded-lg text-sm"
                    dangerouslySetInnerHTML={{ __html: lastVersion.body.replace(/\n/g, '<br>') }}
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {!isDownloaded ? (
                  <>
                    <Button
                      onClick={handleFetch}
                      disabled={fetchForm.processing}
                      variant="outline"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${fetchForm.processing ? 'animate-spin' : ''}`} />
                      {trans('admin.update.check')}
                    </Button>
                    <Button
                      onClick={handleDownload}
                      disabled={downloadForm.processing}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {trans('admin.update.download')}
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleInstall}
                    disabled={installForm.processing}
                    className="bg-primary"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {trans('admin.update.install')}
                  </Button>
                )}
              </div>

              {hasUpdate && !isDownloaded && (
                <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-500">
                    {trans('admin.update.backup_warning')}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <h3 className="font-semibold">{trans('admin.update.latest')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {trans('admin.update.up_to_date')}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleFetch}
                  disabled={fetchForm.processing}
                  variant="outline"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${fetchForm.processing ? 'animate-spin' : ''}`} />
                  {trans('admin.update.check')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
