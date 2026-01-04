/**
 * Two-Factor Authentication Page - For login
 */

import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEvent } from 'react';
import { PageProps } from '@/types';
import { useTrans } from '@/lib/trans';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { ArrowLeft, Lock } from 'lucide-react';

export default function TwoFactor() {
  const { settings } = usePage<PageProps>().props;
  const siteName = settings?.site_name || settings?.name || 'MC-CMS';
  const t = useTrans();

  const { data, setData, post, processing, errors } = useForm({
    code: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('login.2fa-verify'));
  };

  return (
    <>
      <Head title={t('auth.2fa.title')} />
      <div className="h-screen w-full bg-background relative overflow-hidden flex items-center justify-center">
        {/* Grid Pattern Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30" />

        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 w-full max-w-md mx-auto px-4 text-center">
          {/* Title */}
          <h1 className="text-4xl font-bold text-foreground mb-3">
            {t('auth.2fa.title')}
          </h1>

          {/* Description */}
          <p className="text-muted-foreground mb-12">
            {t('auth.2fa.description')}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Code Input */}
            <div className="space-y-4">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={data.code}
                  onChange={(value) => setData('code', value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="w-12 h-14 text-lg text-center" />
                    <InputOTPSlot index={1} className="w-12 h-14 text-lg text-center" />
                    <InputOTPSlot index={2} className="w-12 h-14 text-lg text-center" />
                    <InputOTPSlot index={3} className="w-12 h-14 text-lg text-center" />
                    <InputOTPSlot index={4} className="w-12 h-14 text-lg text-center" />
                    <InputOTPSlot index={5} className="w-12 h-14 text-lg text-center" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {errors.code && (
                <p className="text-sm text-destructive flex items-center justify-center gap-1">
                  <Lock className="h-4 w-4" />
                  {errors.code}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={processing || data.code.length !== 6}
              className="w-full h-12 rounded-xl bg-primary px-4 py-2.5 text-base font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                  {t('auth.2fa.verifying')}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Lock className="h-5 w-5" />
                  {t('auth.2fa.verify')}
                </span>
              )}
            </button>

            {/* Back to Login */}
            <a
              href="/login"
              className="inline-flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors hover:underline"
            >
              <ArrowLeft className="h-3 w-3" />
              {t('auth.2fa.back')}
            </a>
          </form>

          {/* Footer */}
          <p className="mt-12 text-xs text-muted-foreground">
            {siteName} {t('auth.2fa.protected')}
          </p>
        </div>
      </div>
    </>
  );
}
