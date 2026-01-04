/**
 * Manage Two-Factor Authentication
 */

import { Head, useForm, router, usePage } from '@inertiajs/react';
import { FormEvent, useState, useEffect } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps, User } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Download, AlertCircle, Copy, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { trans } from '@/lib/i18n';

interface TwoFactorIndexProps extends PageProps {
  user: User;
  codesBackupName: string;
}

export default function TwoFactorIndex({ user, codesBackupName }: TwoFactorIndexProps) {
  const { flash } = usePage<PageProps>().props;
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCodes, setShowCodes] = useState(false);

  // Show codes after enabling 2FA (check for success flash)
  useEffect(() => {
    if (flash?.success) {
      setShowCodes(true);
    }
  }, [flash]);

  const { data, setData, post, processing, errors } = useForm({
    current_password: '',
  });

  const handleDisable = (e: FormEvent) => {
    e.preventDefault();
    post(route('profile.2fa.disable'), {
      onSuccess: () => toast.success(trans('admin.users.edit.2fa_disabled')),
      onError: () => toast.error(trans('admin.users.edit.2fa_error')),
    });
  };

  const handleClose = () => {
    router.get(route('profile.index'));
  };

  const handleDownloadCodes = () => {
    window.location.href = route('profile.2fa.codes');
    toast.success(trans('admin.users.edit.2fa_codes_downloading'));
  };

  const copyCodes = () => {
    const codes = user.two_factor_recovery_codes?.join('\n') || '';
    navigator.clipboard.writeText(codes);
    setCopied(true);
    toast.success(trans('admin.users.edit.2fa_codes_copied'));
    setTimeout(() => setCopied(false), 2000);
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <AuthenticatedLayout>
      <Head title={trans('messages.profile.2fa.manage')} />

      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <Card className="w-full max-w-5xl shadow-2xl relative my-8">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">{trans('messages.actions.close')}</span>
          </button>

          <CardHeader className="pr-12">
            <CardTitle className="flex items-center gap-2 text-green-600">
              <Shield className="h-6 w-6" />
              {trans('messages.profile.2fa.manage')}
            </CardTitle>
            <CardDescription>
              {trans('admin.users.edit.2fa_enabled_description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column - Status & Recovery Codes */}
              <div className="space-y-6">
                {/* Status Card */}
                <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600 dark:text-green-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">{trans('admin.users.edit.2fa_status_enabled')}</p>
                    <p className="text-sm text-green-700 dark:text-green-300">{trans('admin.users.edit.2fa_protected')}</p>
                  </div>
                </div>

                {/* Recovery Codes Section */}
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Copy className="h-5 w-5" />
                      <h3 className="font-semibold">{trans('admin.users.edit.2fa_recovery_codes')}</h3>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCodes(!showCodes)}
                    >
                      {showCodes ? trans('messages.actions.hide') : trans('messages.actions.show')}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {trans('admin.users.edit.2fa_recovery_codes_description')}
                  </p>

                  {showCodes && (
                    <>
                      <div className="p-4 bg-muted rounded-lg max-h-48 overflow-y-auto">
                        <code className="text-sm font-mono">
                          {user.two_factor_recovery_codes?.slice(0, 5).map((code: string, i: number) => (
                            <div key={i} className="py-1">{code}</div>
                          ))}
                          {user.two_factor_recovery_codes && user.two_factor_recovery_codes.length > 5 && (
                            <div className="py-1 text-muted-foreground">... {trans('admin.users.edit.2fa_codes_more', { count: user.two_factor_recovery_codes.length - 5 })}</div>
                          )}
                        </code>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleDownloadCodes}
                          className="flex-1"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          {trans('messages.actions.download')}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={copyCodes}
                          className="flex-1"
                        >
                          {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                          {copied ? trans('messages.actions.copied') : trans('messages.actions.copy')}
                        </Button>
                      </div>
                    </>
                  )}

                  <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500 flex-shrink-0" />
                    <p className="text-xs text-yellow-800 dark:text-yellow-200">
                      <strong>{trans('admin.users.edit.2fa_warning_title')} :</strong> {trans('admin.users.edit.2fa_recovery_codes_warning')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Disable 2FA */}
              <div className="space-y-6">
                <div className="border border-destructive rounded-lg p-4 space-y-4 h-full">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-destructive" />
                    <h3 className="font-semibold text-destructive">{trans('admin.users.edit.2fa_disable_title')}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {trans('admin.users.edit.2fa_disable_description')}
                  </p>

                  <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                    <p className="text-xs text-destructive">
                      <strong>{trans('admin.users.edit.2fa_disable_warning_title')} :</strong> {trans('admin.users.edit.2fa_disable_warning')}
                    </p>
                  </div>

                  {showDisableConfirm ? (
                    <form onSubmit={handleDisable} className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="current_password">{trans('admin.users.edit.current_password')}</Label>
                        <Input
                          id="current_password"
                          type="password"
                          value={data.current_password}
                          onChange={(e) => setData('current_password', e.target.value)}
                          placeholder={trans('admin.users.edit.2fa_password_placeholder')}
                          required
                          autoFocus
                        />
                        {errors.current_password && (
                          <p className="text-sm text-destructive">{errors.current_password}</p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowDisableConfirm(false);
                            setData('current_password', '');
                          }}
                          disabled={processing}
                          className="flex-1"
                        >
                          {trans('messages.actions.cancel')}
                        </Button>
                        <Button
                          type="submit"
                          variant="destructive"
                          disabled={processing}
                          className="flex-1"
                        >
                          {processing ? trans('admin.users.edit.2fa_disabling') : trans('admin.users.edit.2fa_confirm_disable')}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="pt-4">
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => setShowDisableConfirm(true)}
                        className="w-full"
                      >
                        {trans('messages.profile.2fa.disable')}
                      </Button>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground text-center pt-2">
                    {trans('admin.users.edit.2fa_escape_hint')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
