import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

interface OnboardingChecklistProps {
  onboardingComplete: boolean;
  onboardingProgress: OnboardingProgress[];
}

interface OnboardingProgress {
  key: string;
  title: string;
  description: string;
  icon: string;
  importance: number;
  completed: boolean;
}

export function OnboardingChecklist({ onboardingComplete, onboardingProgress }: OnboardingChecklistProps) {
  const [items, setItems] = useState<OnboardingProgress[]>(onboardingProgress);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  useEffect(() => {
    setItems(onboardingProgress);
  }, [onboardingProgress]);

  const completeItem = async (stepKey: string) => {
    setActionInProgress(stepKey);

    // Navigate to the onboarding wizard for this specific step
    await router.get(route('admin.onboarding.index', { step: stepKey }));
  };

  const skipAll = async () => {
    if (confirm('Voulez-vous vraiment passer toute la configuration ?')) {
      await router.post(route('admin.onboarding.complete'));
    }
  };

  const uncompletedItems = items.filter(item => !item.completed).sort((a, b) => a.importance - b.importance);
  const completedItems = items.filter(item => item.completed);

  if (onboardingComplete) {
    return null;
  }

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'type': return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 7V4h16v3M9 20h6M12 4v16" />
        </svg>
      );
      case 'image': return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      );
      case 'palette': return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2.69l5.74 5.74a5.74 5.74 0 0 1-8.12 8.12L3.87 12.87a5.74 5.74 0 0 1 8.13-8.18z" />
          <path d="M12 2.69l5.74 5.74" />
        </svg>
      );
      case 'server': return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
          <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
          <line x1="6" y1="6" x2="6.01" y2="6" />
          <line x1="6" y1="18" x2="6.01" y2="18" />
        </svg>
      );
      case 'navigation': return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      );
      case 'file': return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      );
      default: return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Configuration du site</h3>
            <p className="text-xs text-muted-foreground">
              {uncompletedItems.length} étape{uncompletedItems.length > 1 ? 's' : ''} restante{uncompletedItems.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <button
          onClick={skipAll}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Passer tout →
        </button>
      </div>

      {/* Progress Bar */}
      <div className="px-5 pt-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>Progression</span>
          <span>{Math.round((completedItems.length / items.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${(completedItems.length / items.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Uncompleted Items */}
      {uncompletedItems.length > 0 && (
        <div className="p-5 space-y-2">
          {uncompletedItems.map((item) => (
            <div
              key={item.key}
              className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg hover:border-primary/30 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
                {getIcon(item.icon)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground truncate">{item.description}</p>
              </div>
              <button
                onClick={() => completeItem(item.key)}
                disabled={actionInProgress === item.key}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-nowrap flex items-center gap-1.5 flex-shrink-0"
              >
                {actionInProgress === item.key ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="animate-spin">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Chargement...
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                    Configurer
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Completed Items */}
      {completedItems.length > 0 && (
        <div className="p-5 pt-0">
          <details className="group">
            <summary className="cursor-pointer list-none flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors select-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-open:rotate-90">
                <polyline points="9 18 15 12 9 6" />
              </svg>
              Voir les terminés ({completedItems.length})
            </summary>
            <div className="mt-3 space-y-2 pl-6">
              {completedItems.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center gap-3 p-3 bg-green-500/5 border border-green-500/20 rounded-lg"
                >
                  <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-500">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground line-through opacity-60">{item.title}</p>
                    <p className="text-xs text-green-600">Terminé</p>
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
