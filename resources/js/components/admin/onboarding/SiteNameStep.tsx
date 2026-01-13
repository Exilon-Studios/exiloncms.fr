interface SiteNameStepProps {
  data: Record<string, any>;
  setData: (data: any) => void;
  settings: Record<string, any>;
}

export function SiteNameStep({ data, setData, settings }: SiteNameStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Nom du site <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.name || settings.name || ''}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          placeholder="Mon Serveur Minecraft"
          className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Ce nom apparaîtra dans l'en-tête de votre site et les résultats de recherche.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Description du site
        </label>
        <textarea
          value={data.description || settings.description || ''}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          placeholder="Le meilleur serveur Minecraft PvP et Survie..."
          rows={3}
          className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Une courte description qui apparaîtra sous le nom de votre site.
        </p>
      </div>

      <div className="p-4 bg-muted/30 border border-border rounded-lg">
        <div className="flex items-start gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary mt-0.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          <div>
            <p className="text-sm font-medium text-foreground">Conseil</p>
            <p className="text-xs text-muted-foreground mt-1">
              Choisissez un nom court et mémorable. Vous pourrez toujours le modifier plus tard dans les paramètres.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
