import { router } from '@inertiajs/react';

interface FirstPageStepProps {
  data: Record<string, any>;
  setData: (data: any) => void;
  settings: Record<string, any>;
}

export function FirstPageStep({ data, setData, settings }: FirstPageStepProps) {
  const goToEditor = () => {
    // This will mark the step as complete and redirect to the page editor
    router.post(route('admin.onboarding.save', 'first_page'), {}, {
      onSuccess: () => {
        router.visit(route('admin.pages.index'));
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
            <path d="M12 19l7-7 3 3-7 7-3-3" />
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            <path d="M2 2l7.586 7.586" />
            <circle cx="11" cy="11" r="2" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Créez votre première page
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Utilisez notre éditeur visuel Puck pour créer votre page d'accueil avec un système de drag & drop intuitif.
        </p>
      </div>

      {/* Feature highlights */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-muted/20 border border-border rounded-lg">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
              <path d="M15 3h6v6" />
              <path d="M10 14L21 3" />
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            </svg>
          </div>
          <h4 className="font-medium text-foreground mb-1">Drag & Drop</h4>
          <p className="text-xs text-muted-foreground">
            Ajoutez des éléments simplement en les glissant sur votre page
          </p>
        </div>

        <div className="p-4 bg-muted/20 border border-border rounded-lg">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 3v18" />
              <path d="M15 9h-6" />
              <path d="M15 15h-6" />
            </svg>
          </div>
          <h4 className="font-medium text-foreground mb-1">Composants</h4>
          <p className="text-xs text-muted-foreground">
            Titres, textes, images, boutons, grilles et plus encore
          </p>
        </div>

        <div className="p-4 bg-muted/20 border border-border rounded-lg">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h4 className="font-medium text-foreground mb-1">Aperçu en direct</h4>
          <p className="text-xs text-muted-foreground">
            Voyez le résultat instantanément pendant l'édition
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="button"
          onClick={goToEditor}
          className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Ouvrir l'éditeur de page
        </button>
        <button
          type="button"
          onClick={() => router.post(route('admin.onboarding.save', 'first_page'))}
          className="flex-1 px-6 py-3 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
        >
          Plus tard
        </button>
      </div>

      <div className="p-4 bg-muted/30 border border-border rounded-lg">
        <p className="text-xs text-muted-foreground text-center">
          Cette étape marque la fin du onboarding. Vous pourrez toujours accéder à l'éditeur de page depuis le panneau d'administration.
        </p>
      </div>
    </div>
  );
}
