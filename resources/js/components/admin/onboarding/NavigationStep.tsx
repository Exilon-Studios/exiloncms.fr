import { useState, useEffect } from 'react';

interface SocialLink {
  id?: number;
  title: string;
  url: string;
  icon: string;
  color: string;
}

interface NavigationStepProps {
  data: Record<string, any>;
  setData: (data: any) => void;
  settings: Record<string, any>;
}

const SOCIAL_PLATFORMS = [
  { name: 'Discord', icon: 'discord', color: '#5865F2', placeholder: 'https://discord.gg/...' },
  { name: 'Twitter', icon: 'twitter', color: '#1DA1F2', placeholder: 'https://twitter.com/...' },
  { name: 'YouTube', icon: 'youtube', color: '#FF0000', placeholder: 'https://youtube.com/...' },
  { name: 'TikTok', icon: 'tiktok', color: '#000000', placeholder: 'https://tiktok.com/@...' },
  { name: 'Instagram', icon: 'instagram', color: '#E4405F', placeholder: 'https://instagram.com/...' },
  { name: 'Facebook', icon: 'facebook', color: '#1877F2', placeholder: 'https://facebook.com/...' },
];

export function NavigationStep({ data, setData, settings }: NavigationStepProps) {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    data.social_links || settings.social_links || []
  );

  useEffect(() => {
    setData({ ...data, social_links });
  }, [socialLinks]);

  const addSocialLink = (platform: typeof SOCIAL_PLATFORMS[0]) => {
    setSocialLinks([
      ...socialLinks,
      {
        title: platform.name,
        url: '',
        icon: platform.icon,
        color: platform.color,
      },
    ]);
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    const updated = [...socialLinks];
    updated[index] = { ...updated[index], [field]: value };
    setSocialLinks(updated);
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Social Links */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Réseaux sociaux
        </label>
        <p className="text-xs text-muted-foreground mb-4">
          Ajoutez vos réseaux sociaux pour que vos visiteurs puissent vous suivre.
        </p>

        {/* Add New Link Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {SOCIAL_PLATFORMS.filter(
            p => !socialLinks.some(l => l.icon === p.icon)
          ).map((platform) => (
            <button
              key={platform.icon}
              type="button"
              onClick={() => addSocialLink(platform)}
              className="px-3 py-2 text-sm border border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-colors flex items-center gap-2"
            >
              <span>{platform.icon === 'discord' ? '💬' :
                     platform.icon === 'twitter' ? '🐦' :
                     platform.icon === 'youtube' ? '📺' :
                     platform.icon === 'tiktok' ? '🎵' :
                     platform.icon === 'instagram' ? '📷' :
                     platform.icon === 'facebook' ? '👥' : '🔗'}</span>
              {platform.name}
            </button>
          ))}
        </div>

        {/* Social Links List */}
        {socialLinks.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-border rounded-lg">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto text-muted-foreground mb-3">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            <p className="text-sm text-muted-foreground">
              Aucun réseau social ajouté. Cliquez sur un bouton ci-dessus pour en ajouter un.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {socialLinks.map((link, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: link.color }}
                >
                  {link.icon === 'discord' ? '💬' :
                   link.icon === 'twitter' ? '🐦' :
                   link.icon === 'youtube' ? '📺' :
                   link.icon === 'tiktok' ? '🎵' :
                   link.icon === 'instagram' ? '📷' :
                   link.icon === 'facebook' ? '👥' : '🔗'}
                </div>
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                  placeholder={SOCIAL_PLATFORMS.find(p => p.icon === link.icon)?.placeholder || 'https://...'}
                  className="flex-1 px-3 py-2 bg-muted/30 border border-border rounded-lg text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => removeSocialLink(index)}
                  className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="p-4 bg-muted/30 border border-border rounded-lg">
        <div className="flex items-start gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary mt-0.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          <div>
            <p className="text-sm font-medium text-foreground">Navigation complète</p>
            <p className="text-xs text-muted-foreground mt-1">
              Vous pourrez configurer le menu de navigation complet dans les paramètres du site (liens vers les pages, catégories, etc.).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
