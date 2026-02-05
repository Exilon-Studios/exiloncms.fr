import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, RefreshCw, CheckCircle, AlertCircle, Info, Loader2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { trans } from '@/lib/i18n';

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

type UpdateStep = 'idle' | 'downloading' | 'downloaded' | 'installing' | 'complete' | 'error';

interface UpdateProgress {
  step: UpdateStep;
  message: string;
  progress: number;
  details?: string;
}

export default function UpdatesIndex({ currentVersion, lastVersion, hasUpdate, isDownloaded }: UpdateProps) {
  const [progress, setProgress] = useState<UpdateProgress>({ step: 'idle', message: '', progress: 0 });
  const [error, setError] = useState<string>('');

  const handleFetch = () => {
    setProgress({ step: 'idle', message: 'Checking for updates...', progress: 0 });
    router.get(route('admin.update.fetch'), {}, {
      onSuccess: () => {
        setProgress({ step: 'idle', message: '', progress: 0 });
        window.location.reload();
      },
      onError: (errors) => {
        setProgress({ step: 'error', message: 'Failed to check for updates', progress: 0 });
        setError(Object.values(errors)[0]?.toString() || 'Unknown error');
      },
    });
  };

  const handleDownload = () => {
    setProgress({ step: 'downloading', message: 'Downloading update package...', progress: 10 });
    setError('');

    router.post(route('admin.update.download'), {}, {
      onBefore: () => {
        setProgress({ step: 'downloading', message: 'Connecting to GitHub...', progress: 20 });
      },
      onSuccess: () => {
        setProgress({ step: 'downloaded', message: 'Update downloaded successfully!', progress: 100 });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      onError: (errors) => {
        setProgress({ step: 'error', message: 'Download failed', progress: 0 });
        setError(Object.values(errors)[0]?.toString() || 'Failed to download update');
      },
    });
  };

  const handleInstall = () => {
    if (!confirm(trans('admin.update.index.install_confirm_with_backup'))) {
      return;
    }

    setProgress({ step: 'installing', message: 'Creating backup...', progress: 5 });
    setError('');

    // Simulate progress since the actual install takes time
    const simulateProgress = () => {
      const steps = [
        { progress: 10, message: 'Creating backup...' },
        { progress: 20, message: 'Extracting files...' },
        { progress: 35, message: 'Copying files...' },
        { progress: 50, message: 'Installing dependencies (composer)...' },
        { progress: 65, message: 'Installing dependencies (npm)...' },
        { progress: 80, message: 'Building assets...' },
        { progress: 90, message: 'Running migrations...' },
        { progress: 95, message: 'Clearing caches...' },
      ];

      let index = 0;
      const interval = setInterval(() => {
        if (index < steps.length) {
          setProgress({ step: 'installing', message: steps[index].message, progress: steps[index].progress });
          index++;
        } else {
          clearInterval(interval);
        }
      }, 500);

      return interval;
    };

    const progressInterval = simulateProgress();

    router.post(route('admin.update.install'), {}, {
      onSuccess: () => {
        clearInterval(progressInterval);
        setProgress({ step: 'complete', message: 'Update installed successfully!', progress: 100 });
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      },
      onError: (errors) => {
        clearInterval(progressInterval);
        setProgress({ step: 'error', message: 'Installation failed', progress: 0 });
        setError(Object.values(errors)[0]?.toString() || 'Installation failed. Check logs for details.');
      },
    });
  };

  const renderProgressCard = () => {
    if (progress.step === 'idle' && !error) return null;

    return (
      <Card className={progress.step === 'error' ? 'border-red-500' : 'border-primary'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {progress.step === 'installing' && <Loader2 className="h-5 w-5 animate-spin" />}
            {progress.step === 'complete' && <CheckCircle className="h-5 w-5 text-green-500" />}
            {progress.step === 'error' && <AlertTriangle className="h-5 w-5 text-red-500" />}
            {progress.step === 'downloading' && <Download className="h-5 w-5 animate-bounce" />}
            <span>
              {progress.step === 'installing' && 'Installing Update'}
              {progress.step === 'complete' && 'Installation Complete'}
              {progress.step === 'error' && 'Error'}
              {progress.step === 'downloading' && 'Downloading'}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{progress.message}</span>
              <span className="font-medium">{progress.progress}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-500 ease-out"
                style={{ width: `${progress.progress}%` }}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-500 font-mono">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {progress.step === 'complete' && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-sm text-green-500">
                ✓ CMS updated successfully! Redirecting to homepage...
              </p>
            </div>
          )}

          {/* Installation Info */}
          {progress.step === 'installing' && (
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-sm text-blue-500">
                <Info className="h-4 w-4 inline mr-2" />
                Please wait while the update is being installed. This may take a few minutes...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <AuthenticatedLayout>
      <Head title="Updates" />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Updates</h1>
          <p className="text-muted-foreground mt-2">
            Manage ExilonCMS updates and installations
          </p>
        </div>

        {/* Progress Card */}
        {renderProgressCard()}

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
              {trans('admin.update.current_version_description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleFetch}
              variant="outline"
              disabled={progress.step === 'downloading' || progress.step === 'installing'}
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {trans('admin.update.check_button')}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <h3 className="font-semibold">{trans('admin.update.up_to_date')}</h3>
                <p className="text-sm text-muted-foreground">
                  {trans('admin.update.latest_version')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
