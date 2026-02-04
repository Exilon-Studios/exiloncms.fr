/**
 * Enable Two-Factor Authentication
 */

import { Head, useForm, router } from '@inertiajs/react';
import { FormEvent, useEffect } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps, User } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import { trans } from '@/lib/i18n';

interface TwoFactorEnableProps extends PageProps {
  secret: string;
  qrCode: string;
}

export default function TwoFactorEnable({ secret, qrCode }: TwoFactorEnableProps) {
  const { data, setData, post, processing, errors } = useForm({
    code: '',
  });

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        router.get(route('profile.index'));
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('profile.2fa.enable'), {
      onSuccess: () => toast.success(trans('admin.users.edit.2fa_enabled')),
      onError: () => toast.error(errors.code || trans('admin.users.edit.2fa_error')),
    });
  };

  const handleClose = () => {
    router.get(route('profile.index'));
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('messages.profile.2fa.enable')} />

      {/* Backdrop */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden z-50">
        <Card className="w-full max-w-4xl shadow-2xl relative">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>

          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6" />
              {trans('messages.profile.2fa.enable')}
            </CardTitle>
            <CardDescription>
              {trans('admin.users.edit.2fa_scan_description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
              {/* Left Column - QR Code and Secret */}
              <div className="space-y-6">
                {/* QR Code */}
                <div className="flex justify-center p-6 bg-white rounded-lg border-2 border-border">
                  <div dangerouslySetInnerHTML={{ __html: qrCode }} className="w-64 h-64" />
                </div>

                {/* Secret Key */}
                <div className="space-y-2">
                  <Label>{trans('admin.users.edit.2fa_secret')}</Label>
                  <Input
                    value={secret}
                    readOnly
                    className="font-mono text-center text-lg bg-muted"
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    {trans('admin.users.edit.2fa_secret_description')}
                  </p>
                </div>
              </div>

              {/* Right Column - Verification Form */}
              <div className="space-y-6 flex flex-col justify-center">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-lg">
                    <Shield className="h-5 w-5 text-blue-600 dark:text-blue-500 flex-shrink-0" />
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>{trans('admin.users.edit.2fa_instructions_title')} :</strong> {trans('admin.users.edit.2fa_instructions')}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="code" className="text-lg">{trans('admin.users.edit.2fa_code')}</Label>
                    <div className="flex justify-center py-2">
                      <Input
                        id="code"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        value={data.code}
                        onChange={(e) => setData('code', e.target.value)}
                        className="w-64 text-center text-2xl tracking-widest"
                        placeholder="000000"
                        autoComplete="one-time-code"
                      />
                    </div>
                    {errors.code && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.code}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0" />
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>{trans('admin.users.edit.2fa_warning_title')} :</strong> {trans('admin.users.edit.2fa_warning')}
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      className="flex-1"
                    >
                      {trans('messages.actions.cancel')}
                    </Button>
                    <Button
                      type="submit"
                      disabled={processing || data.code.length !== 6}
                      className="flex-1"
                    >
                      {processing ? trans('admin.users.edit.2fa_verifying') : trans('messages.profile.2fa.enable')}
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    {trans('admin.users.edit.2fa_escape_hint')}
                  </p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
