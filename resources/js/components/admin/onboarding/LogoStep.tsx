import { useState, useRef } from 'react';

interface LogoStepProps {
  data: Record<string, any>;
  setData: (data: any) => void;
  settings: Record<string, any>;
}

export function LogoStep({ data, setData, settings }: LogoStepProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(settings.logo || null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(settings.favicon || null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData({ ...data, logo: file });
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData({ ...data, favicon: file });
      setFaviconPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-8">
      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Logo du site
        </label>
        <div className="flex items-start gap-6">
          <div
            onClick={() => logoInputRef.current?.click()}
            className={`w-32 h-32 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
              logoPreview
                ? 'border-border bg-background'
                : 'border-muted-foreground/30 hover:border-primary/50 bg-muted/20'
            }`}
          >
            {logoPreview ? (
              <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain rounded-lg p-2" />
            ) : (
              <>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span className="text-xs text-muted-foreground mt-2">Logo</span>
              </>
            )}
          </div>
          <div className="flex-1">
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Choisir un logo
            </button>
            <p className="mt-2 text-xs text-muted-foreground">
              Format recommandé : PNG ou SVG avec fond transparent. Taille maximale : 2 Mo.
            </p>
            {logoPreview && (
              <button
                type="button"
                onClick={() => {
                  setData({ ...data, logo: null });
                  setLogoPreview(null);
                  if (logoInputRef.current) logoInputRef.current.value = '';
                }}
                className="mt-2 text-xs text-red-500 hover:text-red-600 transition-colors"
              >
                Supprimer le logo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Favicon Upload */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Favicon (icône de l'onglet)
        </label>
        <div className="flex items-start gap-6">
          <div
            onClick={() => faviconInputRef.current?.click()}
            className={`w-16 h-16 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
              faviconPreview
                ? 'border-border bg-background'
                : 'border-muted-foreground/30 hover:border-primary/50 bg-muted/20'
            }`}
          >
            {faviconPreview ? (
              <img src={faviconPreview} alt="Favicon preview" className="w-full h-full object-contain rounded-lg p-2" />
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </>
            )}
          </div>
          <div className="flex-1">
            <input
              ref={faviconInputRef}
              type="file"
              accept="image/*,.ico"
              onChange={handleFaviconChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => faviconInputRef.current?.click()}
              className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors"
            >
              Choisir un favicon
            </button>
            <p className="mt-2 text-xs text-muted-foreground">
              Format recommandé : PNG (32x32px) ou ICO. Taille maximale : 500 Ko.
            </p>
            {faviconPreview && (
              <button
                type="button"
                onClick={() => {
                  setData({ ...data, favicon: null });
                  setFaviconPreview(null);
                  if (faviconInputRef.current) faviconInputRef.current.value = '';
                }}
                className="mt-2 text-xs text-red-500 hover:text-red-600 transition-colors"
              >
                Supprimer le favicon
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 bg-muted/30 border border-border rounded-lg">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">Optionnel :</span> Vous pouvez ajouter votre logo et favicon plus tard dans les paramètres si vous le souhaitez.
        </p>
      </div>
    </div>
  );
}
