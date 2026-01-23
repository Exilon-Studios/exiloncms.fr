import { useState, useEffect } from 'react';
import { fetchInstallerInfo, downloadCms, extractCms, finalizeInstall } from './api';
import type { SystemInfo, Step } from './types';

function App() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    fetchInstallerInfo()
      .then(setSystemInfo)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleNext = () => {
    const steps: Step[] = ['welcome', 'requirements', 'download', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: Step[] = ['welcome', 'requirements', 'download', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleStartInstall = async () => {
    setInstalling(true);
    setError(null);

    try {
      setCurrentStep('requirements');
      await new Promise(resolve => setTimeout(resolve, 500));

      setCurrentStep('download');
      let info = await downloadCms();

      if (!info.downloaded) {
        throw new Error('Failed to download CMS');
      }

      info = await extractCms();
      if (!info.extracted) {
        throw new Error('Failed to extract CMS');
      }

      if (info.version) {
        await finalizeInstall(info.version);
      }

      setCurrentStep('complete');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setInstalling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error && !systemInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-500 text-white px-6 py-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-5xl flex flex-col md:flex-row">
        {/* Left Panel - Version Info */}
        <div className="md:w-1/3 bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white">
          <div className="mb-8">
            <div className="text-4xl mb-4">🚀</div>
            <h1 className="text-2xl font-bold mb-2">ExilonCMS</h1>
            <p className="text-white/80 text-sm">Content Management System pour serveurs de jeu</p>
          </div>

          {systemInfo && (
            <div className="space-y-4 text-sm">
              <div>
                <div className="text-white/60 mb-1">Version de l'installateur</div>
                <div className="font-medium">v{systemInfo.installerVersion}</div>
              </div>

              {systemInfo.version && (
                <div>
                  <div className="text-white/60 mb-1">Version à installer</div>
                  <div className="font-medium">v{systemInfo.version}</div>
                </div>
              )}

              <div>
                <div className="text-white/60 mb-1">Version PHP requise</div>
                <div className="font-medium">{systemInfo.minPhpVersion}+</div>
              </div>

              <div>
                <div className="text-white/60 mb-1">Version PHP actuelle</div>
                <div className={`font-medium ${systemInfo.requirements.php ? 'text-green-300' : 'text-red-300'}`}>
                  {systemInfo.phpVersion} ({systemInfo.phpFullVersion})
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-white/20">
            <a
              href="https://exiloncms.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white text-sm transition-colors"
            >
             Documentation →
            </a>
          </div>
        </div>

        {/* Right Panel - Installation Steps */}
        <div className="md:w-2/3 p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
              <button onClick={() => setError(null)} className="ml-4 underline">Fermer</button>
            </div>
          )}

          {currentStep === 'welcome' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Bienvenue !</h2>
                <p className="text-gray-600">
                  Cet installateur va télécharger et configurer ExilonCMS sur votre serveur.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Ce qui va être installé :</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• ExilonCMS (dernière version stable)</li>
                  <li>• Toutes les dépendances nécessaires</li>
                  <li>• Configuration de base</li>
                </ul>
              </div>

              <div className="text-sm text-gray-500">
                <p><strong>Temps estimé :</strong> 2-5 minutes</p>
                <p><strong>Espace requis :</strong> ~100 MB</p>
              </div>

              {systemInfo && !systemInfo.compatible && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  <strong>Attention :</strong> Votre serveur ne rencontre pas tous les prérequis.
                  Veuillez vérifier les exigences avant de continuer.
                </div>
              )}

              <div className="flex gap-4">
                {systemInfo?.compatible !== false && (
                  <button
                    onClick={handleStartInstall}
                    disabled={installing}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {installing ? 'Installation en cours...' : 'Commencer l\'installation'}
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Vérifier les prérequis
                </button>
              </div>
            </div>
          )}

          {currentStep === 'requirements' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Vérification des prérequis</h2>
                <p className="text-gray-600">
                  Assurez-vous que tous les éléments ci-dessous sont valides.
                </p>
              </div>

              {systemInfo && (
                <div className="space-y-3">
                  <RequirementItem
                    name="Version PHP"
                    required={`>= ${systemInfo.minPhpVersion}`}
                    current={systemInfo.phpFullVersion}
                    ok={systemInfo.requirements.php}
                  />
                  <RequirementItem
                    name="Permissions d'écriture"
                    required="Écriture autorisée"
                    current="Détecté"
                    ok={systemInfo.requirements.writable}
                  />
                  <RequirementItem
                    name="Extension bcmath"
                    required="Activée"
                    current={systemInfo.requirements['extension-bcmath'] ? 'Activée' : 'Manquante'}
                    ok={systemInfo.requirements['extension-bcmath']}
                  />
                  <RequirementItem
                    name="Extension ctype"
                    required="Activée"
                    current={systemInfo.requirements['extension-ctype'] ? 'Activée' : 'Manquante'}
                    ok={systemInfo.requirements['extension-ctype']}
                  />
                  <RequirementItem
                    name="Extension json"
                    required="Activée"
                    current={systemInfo.requirements['extension-json'] ? 'Activée' : 'Manquante'}
                    ok={systemInfo.requirements['extension-json']}
                  />
                  <RequirementItem
                    name="Extension mbstring"
                    required="Activée"
                    current={systemInfo.requirements['extension-mbstring'] ? 'Activée' : 'Manquante'}
                    ok={systemInfo.requirements['extension-mbstring']}
                  />
                  <RequirementItem
                    name="Extension openssl"
                    required="Activée"
                    current={systemInfo.requirements['extension-openssl'] ? 'Activée' : 'Manquante'}
                    ok={systemInfo.requirements['extension-openssl']}
                  />
                  <RequirementItem
                    name="Extension PDO"
                    required="Activée"
                    current={systemInfo.requirements['extension-PDO'] ? 'Activée' : 'Manquante'}
                    ok={systemInfo.requirements['extension-PDO']}
                  />
                  <RequirementItem
                    name="Extension curl"
                    required="Activée"
                    current={systemInfo.requirements['extension-curl'] ? 'Activée' : 'Manquante'}
                    ok={systemInfo.requirements['extension-curl']}
                  />
                  <RequirementItem
                    name="Extension zip"
                    required="Activée"
                    current={systemInfo.requirements['extension-zip'] ? 'Activée' : 'Manquante'}
                    ok={systemInfo.requirements['extension-zip']}
                  />
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleBack}
                  disabled={installing}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Retour
                </button>
                {systemInfo?.compatible !== false && (
                  <button
                    onClick={handleStartInstall}
                    disabled={installing}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {installing ? 'Installation en cours...' : 'Commencer l\'installation'}
                  </button>
                )}
              </div>
            </div>
          )}

          {currentStep === 'download' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Installation en cours</h2>
                <p className="text-gray-600">
                  Veuillez patienter pendant le téléchargement et l'extraction des fichiers.
                </p>
              </div>

              <div className="space-y-4">
                <StepItem
                  title="Téléchargement depuis GitHub"
                  status={systemInfo?.downloaded ? 'done' : installing ? 'loading' : 'pending'}
                />
                <StepItem
                  title="Extraction des fichiers"
                  status={systemInfo?.extracted ? 'done' : installing && systemInfo?.downloaded ? 'loading' : 'pending'}
                />
                <StepItem
                  title="Configuration de base"
                  status={systemInfo?.installed ? 'done' : installing && systemInfo?.extracted ? 'loading' : 'pending'}
                />
              </div>

              {installing && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
                  <p className="font-medium">Ne fermez pas cette page</p>
                  <p className="text-sm">L'installation peut prendre plusieurs minutes selon votre connexion.</p>
                </div>
              )}
            </div>
          )}

          {currentStep === 'complete' && (
            <div className="space-y-6 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Installation terminée !</h2>
                <p className="text-gray-600">
                  ExilonCMS a été installé avec succès.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
                <p className="font-medium">Prochaines étapes :</p>
                <ol className="text-sm text-left mt-2 space-y-1 list-decimal list-inside">
                  <li>Supprimez le dossier <code className="bg-green-100 px-1 rounded">installer</code></li>
                  <li>Accédez à votre site pour terminer la configuration</li>
                </ol>
              </div>

              <a
                href="/"
                className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all"
              >
                Accéder à mon site
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RequirementItem({ name, required, current, ok }: { name: string; required: string; current: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border">
      <div>
        <div className="font-medium text-gray-900">{name}</div>
        <div className="text-sm text-gray-500">Requis: {required}</div>
      </div>
      <div className={`text-sm font-medium ${ok ? 'text-green-600' : 'text-red-600'}`}>
        {ok ? '✓ ' : '✗ '}
        {current}
      </div>
    </div>
  );
}

function StepItem({ title, status }: { title: string; status: 'pending' | 'loading' | 'done' }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border">
      {status === 'pending' && <div className="w-6 h-6 rounded-full border-2 border-gray-300" />}
      {status === 'loading' && <div className="w-6 h-6 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />}
      {status === 'done' && <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm">✓</div>}
      <span className={`flex-1 ${status === 'done' ? 'text-gray-900' : 'text-gray-600'}`}>{title}</span>
    </div>
  );
}

export default App;
