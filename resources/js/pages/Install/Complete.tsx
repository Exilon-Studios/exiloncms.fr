import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, Shield, Rocket, Home, LayoutGrid } from 'lucide-react';

interface Props {
  adminEmail?: string;
  adminPassword?: string;
}

export default function Complete({ adminEmail = '', adminPassword = '' }: Props) {
  return (
    <>
      <Head title="Installation terminée - ExilonCMS" />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full">
          {/* Success Animation */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Installation terminée !
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              ExilonCMS a été installé avec succès
            </p>
          </div>

          {/* Credentials */}
          {(adminEmail || adminPassword) && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
              <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Vos identifiants de connexion
              </h2>
              <div className="space-y-3">
                {adminEmail && (
                  <div className="flex items-center justify-between">
                    <span className="text-blue-800 dark:text-blue-200">Email :</span>
                    <span className="font-mono font-medium text-blue-900 dark:text-white">{adminEmail}</span>
                  </div>
                )}
                {adminPassword && (
                  <div className="flex items-center justify-between">
                    <span className="text-blue-800 dark:text-blue-200">Mot de passe :</span>
                    <span className="font-mono font-medium text-blue-900 dark:text-white">{adminPassword}</span>
                  </div>
                )}
              </div>
              <p className="mt-4 text-sm text-blue-700 dark:text-blue-300">
                ⚠️ Sauvegardez ces identifiants ! Cette page ne sera plus accessible.
              </p>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Que faire maintenant ?
            </h2>
            <div className="space-y-4">
              <Link href={route('login')}>
                <div className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4">
                    <LayoutGrid className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Accéder au panneau d'administration
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Configurez votre site, ajoutez des plugins, personnalisez le thème
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </Link>

              <Link href="/">
                <div className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-4">
                    <Home className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Voir votre site
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Découvrez votre nouveau site ExilonCMS
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </Link>

              <a
                href="https://github.com/Exilon-Studios/ExilonCMS/wiki"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-4">
                    <Rocket className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Lire la documentation
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Apprenez à utiliser ExilonCMS avec nos guides
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </a>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center">
            <Link href={route('login')}>
              <Button size="lg" className="shadow-lg">
                Commencer avec ExilonCMS
                <Rocket className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Merci d'avoir choisi ExilonCMS ! 🎉
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
