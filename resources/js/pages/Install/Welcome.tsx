import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Download, Rocket, Shield, Zap } from 'lucide-react';

export default function Welcome() {
  return (
    <>
      <Head title="Installation - ExilonCMS" />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Rocket className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Bienvenue sur ExilonCMS
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Le CMS moderne pour serveurs de gaming
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Installation Rapide
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Installez votre CMS en quelques minutes grâce à notre assistant d'installation guidé
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Sécurisé
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Authentification sécurisée, protection CSRF et permissions granulaires
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Facile à Utiliser
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Interface moderne et intuitive pour gérer votre serveur
              </p>
            </div>
          </div>

          {/* Important Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Installation simplifiée
            </h3>
            <p className="text-blue-800 dark:text-blue-200">
              Toutes les dépendances sont déjà incluses dans ce zip ! Aucune installation de Composer, NPM ou autre n'est nécessaire sur votre hébergement.
            </p>
          </div>

          {/* Steps Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Comment ça marche ?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Vérification des prérequis</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Nous vérifions que votre serveur répond aux exigences techniques
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Configuration de la base de données</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Connectez votre base de données MySQL, PostgreSQL ou utilisez SQLite
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Création du compte administrateur</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Créez votre compte administrateur pour accéder au panneau d'administration
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                  4
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">C'est terminé !</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Votre CMS est installé et prêt à être utilisé
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <Link href={route('install.requirements')}>
              <Button size="lg" className="shadow-lg">
                Commencer l'installation
                <Download className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Durée estimée : 2-3 minutes
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
