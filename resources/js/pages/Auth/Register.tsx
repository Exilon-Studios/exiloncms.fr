import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEvent } from 'react';
import { PageProps } from '@/types';
import { RegisterProps, RegisterFormData } from '@/types/auth';
import { RegisterFormWithGradient } from '@/components/auth/RegisterForm';
import { useTrans } from '@/lib/trans';

export default function Register({ captcha, registerConditions }: RegisterProps) {
  const { settings } = usePage<PageProps>().props;
  const t = useTrans();
  const { data, setData, post, processing, errors } = useForm<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    conditions: false,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('register'));
  };

  return (
    <>
      <Head title={t('auth.register')} />
      <div className="min-h-screen h-screen w-full bg-background relative overflow-hidden fixed inset-0">
        {/* Grid Pattern Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30" />

        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative flex min-h-screen w-full items-center justify-center">
          <RegisterFormWithGradient
            data={data}
            setData={setData}
            onSubmit={handleSubmit}
            processing={processing}
            errors={errors}
            siteName={settings?.site_name || 'ExilonCMS'}
            siteDescription={settings?.site_description || 'Modern Content Management System for Game Servers'}
            registerConditions={registerConditions}
          />
        </div>
      </div>
    </>
  );
}
