/**
 * Puck Edit - Éditeur visuel drag-and-drop pour la landing page
 *
 * Accès: http://localhost:8002/edit
 * Permission: Nécessite d'être connecté et avoir le permission 'admin.pages.puck-edit'
 */

import { Head } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { Puck } from '@measured/puck';
import '@measured/puck/puck.css';
import { puckConfig } from '@/puck/config';
import { PageProps } from '@/types';
import { toast, Toaster } from 'sonner';

interface PuckEditProps extends PageProps {
  landingSettings?: Record<string, any>;
  initialData?: any;
}

// Default landing page data - empty for now, user can add blocks
const DEFAULT_LANDING_PAGE = {
  root: { props: { title: 'Accueil' } },
  content: [],
  zones: {}
};

/**
 * Sanitize Puck data to ensure it's valid for the editor
 */
function sanitizePuckData(data: any): any {
  if (!data || typeof data !== 'object') {
    return DEFAULT_LANDING_PAGE;
  }

  // Ensure root exists
  if (!data.root || typeof data.root !== 'object') {
    data.root = { props: { title: 'Accueil' } };
  }

  // Ensure root.props exists
  if (!data.root.props || typeof data.root.props !== 'object') {
    data.root.props = { title: 'Accueil' };
  }

  // Ensure content array exists and is valid
  if (!Array.isArray(data.content)) {
    data.content = [];
  }

  // Sanitize each content item
  data.content = data.content.map((item: any, index: number) => {
    if (!item || typeof item !== 'object') {
      return null;
    }

    // Ensure required properties exist
    if (!item.type) {
      return null;
    }

    // Ensure props exists and is an object
    if (!item.props || typeof item.props !== 'object') {
      item.props = {};
    }

    // Ensure each item has a unique identifier
    if (!item.id) {
      item.id = `${item.type}-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    return item;
  }).filter((item: any) => item !== null);

  // Ensure zones exists
  if (!data.zones || typeof data.zones !== 'object') {
    data.zones = {};
  }

  return data;
}

/**
 * Initialize data from props
 */
function getInitialData(landingSettings?: Record<string, any>, initialData?: any): any {
  // Check if URL has ?reset=true parameter to force reset
  const urlParams = new URLSearchParams(window.location.search);
  const forceReset = urlParams.has('reset');

  if (forceReset) {
    // Clear the URL parameter after reset
    window.history.replaceState({}, '', window.location.pathname);
    return DEFAULT_LANDING_PAGE;
  }

  // Try to use existing data
  if (initialData && typeof initialData === 'object' && initialData.content && initialData.content.length > 0) {
    return sanitizePuckData(initialData);
  }

  if (landingSettings?.puck_data) {
    try {
      const parsed = typeof landingSettings.puck_data === 'string'
        ? JSON.parse(landingSettings.puck_data)
        : landingSettings.puck_data;

      if (parsed && typeof parsed === 'object' && parsed.content && parsed.content.length > 0) {
        return sanitizePuckData(parsed);
      }
    } catch (e) {
      console.error('Failed to parse puck_data:', e);
    }
  }

  return DEFAULT_LANDING_PAGE;
}

export default function PuckEdit({ landingSettings, initialData }: PuckEditProps) {
  const [isSaving, setIsSaving] = useState(false);

  // Initialize data directly without useEffect
  const [data, setData] = useState(() => getInitialData(landingSettings, initialData));
  const currentDataRef = useRef(data);

  // Update ref whenever data changes
  const updateRef = (newData: any) => {
    currentDataRef.current = newData;
    setData(newData);
  };

  // Save handler
  const handlePublish = async (newData?: any) => {
    const dataToSave = newData || currentDataRef.current;

    setIsSaving(true);
    try {
      console.log('Saving Puck data...', dataToSave);

      const response = await fetch(route('puck.save'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
        },
        body: JSON.stringify({ puck_data: JSON.stringify(dataToSave) })
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Page sauvegardée avec succès !', result);
        toast.success('Page sauvegardée avec succès !');
      } else {
        console.error('Erreur lors de la sauvegarde:', result);
        toast.error(`Erreur: ${result.message || 'Erreur lors de la sauvegarde'}`);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error(`Erreur: ${error instanceof Error ? error.message : 'Erreur lors de la sauvegarde'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Button click handler
  const handleSaveClick = () => {
    handlePublish(currentDataRef.current);
  };

  // Reset handler
  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser la page ? Tous les blocs seront supprimés.')) {
      setData(DEFAULT_LANDING_PAGE);
      currentDataRef.current = DEFAULT_LANDING_PAGE;
    }
  };

  return (
    <>
      <Head title="Éditeur de page" />
      <Toaster position="top-right" richColors />

      <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{
          padding: '12px 20px',
          borderBottom: '1px solid #e2e8f0',
          background: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a
              href="/"
              style={{ textDecoration: 'none', color: '#64748b', fontSize: '14px' }}
            >
              ← Retour au site
            </a>
            <div style={{ height: '20px', width: '1px', background: '#e2e8f0' }}></div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
              Éditeur de page d'accueil
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleReset}
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: '500',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                background: '#fff',
                color: '#64748b',
                cursor: 'pointer',
              }}
            >
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Puck Editor */}
        <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
          <Puck
            config={puckConfig}
            data={data}
            onPublish={handlePublish}
            onChange={(newData) => {
              // Update both ref and state
              currentDataRef.current = newData;
              setData(newData);
            }}
            headerPath={false}
            overrides={{
              headerActions: () => (
                <button
                  onClick={handleSaveClick}
                  disabled={isSaving}
                  style={{
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#3b82f6',
                    color: '#fff',
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    opacity: isSaving ? 0.6 : 1,
                  }}
                >
                  {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
              ),
            }}
          />
        </div>
      </div>
    </>
  );
}
