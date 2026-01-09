import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2, User } from 'lucide-react';
import { useState } from 'react';
import { AdminConfig } from './types';

interface Props {
  errors?: Record<string, string>;
  siteName?: string;
}

export default function Admin({ errors: initialErrors = {}, siteName = 'Mon Site ExilonCMS' }: Props) {
  const [data, setData] = useState<AdminConfig>({
    name: 'Admin',
    email: 'admin@example.com',
    password: '',
    password_confirmation: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>(initialErrors);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await router.post(route('install.admin.save'), data, {
        onSuccess: () => {
          setSuccess(true);
          setTimeout(() => {
            router.visit(route('install.complete'));
          }, 1000);
        },
        onError: (errors) => {
          setErrors(errors as Record<string, string>);
        },
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head title="Administrateur - Installation - ExilonCMS" />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Création du compte administrateur
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Créez votre compte pour accéder au panneau d'administration
            </p>
          </div>

          {/* Success Alert */}
          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50 dark:bg-green-900/20">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Installation en cours... Redirection...
              </AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  placeholder="Jean Dupont"
                  className="mt-2"
                  required
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  placeholder="admin@example.com"
                  className="mt-2"
                  required
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                  placeholder="••••••••"
                  className="mt-2"
                  required
                  minLength={8}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                )}
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Minimum 8 caractères
                </p>
              </div>

              <div>
                <Label htmlFor="password_confirmation">Confirmer le mot de passe</Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  value={data.password_confirmation}
                  onChange={(e) => setData({ ...data, password_confirmation: e.target.value })}
                  placeholder="••••••••"
                  className="mt-2"
                  required
                  minLength={8}
                />
                {errors.password_confirmation && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password_confirmation}</p>
                )}
              </div>

              {/* Security Notice */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Important :</strong> Choisissez un mot de passe sécurisé. Vous pourrez le modifier plus tard depuis le panneau d'administration.
                </p>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link href={route('install.database')}>
                  <Button type="button" variant="outline">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Retour
                  </Button>
                </Link>

                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      Installation en cours...
                    </>
                  ) : (
                    <>
                      Terminer l'installation
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
