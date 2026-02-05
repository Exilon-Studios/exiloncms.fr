import { Head, usePage, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { IconDatabase, IconRefresh, IconTrash, IconCheck } from '@tabler/icons-react';
import { useState } from 'react';

interface Props {
  stats: {
    enabled: boolean;
    duration: number;
    locale: string;
  };
}

export default function DocumentationCache({ stats }: Props) {
  const { settings } = usePage<PageProps>().props;
  const [clearing, setClearing] = useState(false);
  const [warming, setWarming] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleClearCache = async () => {
    setClearing(true);
    setMessage(null);

    try {
      const response = await router.post('/admin/documentation/cache/clear');
      setMessage({ type: 'success', text: 'Cache vidé avec succès.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors du vidage du cache.' });
    } finally {
      setClearing(false);
    }
  };

  const handleWarmCache = async () => {
    setWarming(true);
    setMessage(null);

    try {
      const response = await router.post('/admin/documentation/cache/warm');
      setMessage({ type: 'success', text: response.data.props.flash?.success || 'Cache préchargé avec succès.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors du préchargement du cache.' });
    } finally {
      setWarming(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <Head>
        <title>Gestion Cache Documentation - {settings.name}</title>
      </Head>

      <div className="mb-6">
        <Link href="/admin/documentation" className="text-muted-foreground hover:text-foreground">
          ← Retour
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Gestion du Cache</h1>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Statut</span>
            <IconDatabase className="h-5 w-5 text-primary" />
          </div>
          <p className="text-lg font-semibold">
            {stats.enabled ? 'Activé' : 'Désactivé'}
          </p>
        </div>

        <div className="p-4 border rounded-lg">
          <span className="text-sm text-muted-foreground">Durée</span>
          <p className="text-lg font-semibold">{stats.duration}s</p>
        </div>

        <div className="p-4 border rounded-lg">
          <span className="text-sm text-muted-foreground">Locale actuelle</span>
          <p className="text-lg font-semibold">{stats.locale.toUpperCase()}</p>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <IconCheck className="h-5 w-5" />
          ) : (
            <IconTrash className="h-5 w-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Actions</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={handleClearCache}
            disabled={clearing}
            className="p-4 border rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
          >
            <IconTrash className="h-5 w-5" />
            <div className="text-left">
              <p className="font-medium">Vider le cache</p>
              <p className="text-sm text-muted-foreground">
                Supprimer toutes les données mises en cache
              </p>
            </div>
          </button>

          <button
            onClick={handleWarmCache}
            disabled={warming}
            className="p-4 border rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
          >
            <IconRefresh className="h-5 w-5" />
            <div className="text-left">
              <p className="font-medium">Précharger le cache</p>
              <p className="text-sm text-muted-foreground">
                Charger toutes les pages en cache
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-8 p-4 bg-muted/50 rounded-lg">
        <h3 className="font-semibold mb-2">À propos du cache</h3>
        <p className="text-sm text-muted-foreground">
          Le cache de la documentation stocke les pages traitées et la navigation
          pour améliorer les performances. Le cache est automatiquement invalidé
          lors de la modification d'une page.
        </p>
      </div>
    </AuthenticatedLayout>
  );
}
