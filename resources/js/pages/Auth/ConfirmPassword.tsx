import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEvent } from 'react';
import { PageProps } from '@/types';
import { useTrans } from '@/lib/trans';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ConfirmPassword() {
  const { settings } = usePage<PageProps>().props;
  const t = useTrans();
  const { data, setData, post, processing, errors } = useForm({
    password: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('password.confirm'));
  };

  return (
    <>
      <Head title={t('auth.password_confirm')} />
      <div className="min-h-screen h-screen w-full bg-background relative overflow-hidden fixed inset-0">
        {/* Grid Pattern Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30" />

        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative flex min-h-screen w-full items-center justify-center">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground">
                {settings?.site_name || 'MC-CMS'}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {settings?.site_description || 'Modern Content Management System for Game Servers'}
              </p>
            </div>

            <div className="border border-border rounded-lg bg-card p-6 shadow-lg">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-card-foreground">
                  {t('auth.password_confirm')}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t('auth.password_confirm_description')}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">{t('auth.password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    required
                    autoFocus
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                <Button type="submit" disabled={processing} className="w-full">
                  {processing ? t('auth.confirming') : t('auth.confirm')}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
