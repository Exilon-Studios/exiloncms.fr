import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Requirement } from './types';

interface Props {
  requirements?: Requirement[];
}

export default function Requirements({ requirements: initialRequirements }: Props) {
  const [requirements, setRequirements] = useState<Requirement[]>(
    initialRequirements || [
      { name: 'PHP Version', status: 'pending' },
      { name: 'Extension BCMath', status: 'pending' },
      { name: 'Extension CType', status: 'pending' },
      { name: 'Extension JSON', status: 'pending' },
      { name: 'Extension MBString', status: 'pending' },
      { name: 'Extension OpenSSL', status: 'pending' },
      { name: 'Extension PDO', status: 'pending' },
      { name: 'Extension Tokenizer', status: 'pending' },
      { name: 'Extension XML', status: 'pending' },
      { name: 'Extension FileInfo', status: 'pending' },
      { name: 'Extension Zip', status: 'pending' },
      { name: 'Extension Curl', status: 'pending' },
    ]
  );
  const [checking, setChecking] = useState(!initialRequirements);
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    if (!initialRequirements) {
      checkRequirements();
    } else {
      const allOk = requirements.every(r => r.status === 'success');
      setCanContinue(allOk);
    }
  }, []);

  const checkRequirements = async () => {
    setChecking(true);
    try {
      const response = await router.post(route('install.requirements.check'), {}, {
        onSuccess: (page: any) => {
          const checkedRequirements = page.props.requirements as Requirement[];
          setRequirements(checkedRequirements);
          const allOk = checkedRequirements.every((r: Requirement) => r.status === 'success');
          setCanContinue(allOk);
        },
      });
    } catch (error) {
      console.error('Failed to check requirements:', error);
    } finally {
      setChecking(false);
    }
  };

  const allOk = requirements.every(r => r.status === 'success');
  const hasErrors = requirements.some(r => r.status === 'error');

  return (
    <>
      <Head title="Prérequis - Installation - ExilonCMS" />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Vérification des prérequis
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Nous vérifions que votre serveur est compatible avec ExilonCMS
            </p>
          </div>

          {/* Requirements List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            {checking ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <span className="ml-3 text-gray-600 dark:text-gray-400">Vérification en cours...</span>
              </div>
            ) : (
              <div className="space-y-3">
                {requirements.map((req, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border ${
                      req.status === 'success'
                        ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                        : req.status === 'error'
                        ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                        : 'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-700'
                    }"
                  >
                    <div className="flex items-center gap-3">
                      {req.status === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : req.status === 'error' ? (
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      ) : (
                        <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                      )}
                      <span className="font-medium text-gray-900 dark:text-white">
                        {req.name}
                      </span>
                    </div>
                    {req.message && (
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {req.message}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Alert */}
          {hasErrors && (
            <Alert variant="destructive" className="mb-6">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                Certains prérequis ne sont pas remplis. Veuillez contacter votre hébergeur ou installer les extensions manquantes.
              </AlertDescription>
            </Alert>
          )}

          {allOk && !checking && (
            <Alert className="mb-6 border-green-200 bg-green-50 dark:bg-green-900/20">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Tous les prérequis sont remplis ! Vous pouvez continuer l'installation.
              </AlertDescription>
            </Alert>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Link href={route('install.welcome')}>
              <Button variant="outline">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Retour
              </Button>
            </Link>

            <div className="flex items-center gap-3">
              {!checking && (
                <Button
                  onClick={checkRequirements}
                  variant="outline"
                >
                  Revérifier
                </Button>
              )}
              <Link href={canContinue ? route('install.database') : '#'}>
                <Button disabled={!canContinue || checking}>
                  Continuer
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
