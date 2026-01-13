import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ReactNode } from 'react';

interface Server {
  id: number;
  name: string;
  fullAddress: string;
  joinUrl?: string;
  isOnline: boolean;
  onlinePlayers?: number;
  maxPlayers?: number;
}

interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

interface HeroProps {
  title?: string;
  description?: string;
  siteName?: string;
  servers?: Server[];
  showCustomizationNote?: boolean;
  children?: ReactNode;
  socialLinks?: SocialLink[];
}

/**
 * Hero Section with Vertical Social Links (Left Side)
 * Gaming-style layout with grid background
 */
export default function HeroWithSocial({
  title,
  description,
  siteName,
  servers = [],
  showCustomizationNote = true,
  children,
  socialLinks,
}: HeroProps) {
  const { auth, settings } = usePage<PageProps>().props;
  const isAuthenticated = !!auth?.user;
  const onlineServers = servers?.filter(s => s.isOnline) || [];
  const totalPlayers = onlineServers.reduce((sum, s) => sum + (s.onlinePlayers || 0), 0);

  // Default social links from settings
  const defaultSocialLinks: SocialLink[] = [
    { name: 'discord', url: '#', icon: 'discord' },
    { name: 'twitter', url: '#', icon: 'twitter' },
    { name: 'youtube', url: '#', icon: 'youtube' },
    { name: 'tiktok', url: '#', icon: 'tiktok' },
    { name: 'instagram', url: '#', icon: 'instagram' },
  ];

  const links = socialLinks || defaultSocialLinks;

  // Social icons SVG
  const socialIcons: Record<string, string> = {
    discord: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>`,
    twitter: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    youtube: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
    tiktok: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 3.02 1.12.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>`,
    instagram: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M7.03.084c-1.277.06-2.149.264-2.92.632a5.874 5.874 0 0 0-2.424 2.422c-.369.772-.574 1.645-.633 2.92-.06 1.303-.074 1.723-.074 5.082s.014 3.779.074 5.082c.059 1.277.264 2.148.633 2.92a5.874 5.874 0 0 0 2.424 2.424c.771.368 1.643.573 2.92.632 1.303.06 1.723.074 5.082.074 3.358 0 3.779-.014 5.082-.074 1.277-.059 2.148-.264 2.92-.632a5.874 5.874 0 0 0 2.424-2.424c.368-.772.573-1.643.632-2.92.06-1.303.074-1.723.074-5.082s-.014-3.779-.074-5.082c-.059-1.277-.264-2.149-.632-2.92a5.874 5.874 0 0 0-2.424-2.422c-.772-.368-1.643-.573-2.92-.632-1.303-.06-1.724-.074-5.082-.074-3.359 0-3.779.014-5.082.074zm10.16 1.774c.59.028 1.135.15 1.574.357.447.21.787.464 1.127.804.34.34.594.68.804 1.127.207.44.329.985.357 1.574.058 1.268.072 1.688.072 5.017s-.014 3.749-.072 5.017c-.028.59-.15 1.135-.357 1.574-.21.447-.464.787-.804 1.127-.34.34-.68.594-1.127.804-.44.207-.985.329-1.574.357-1.268.058-1.688.072-5.017.072s-3.749-.014-5.017-.072c-.59-.028-1.135-.15-1.574-.357a3.168 3.168 0 0 1-1.127-.804c-.34-.34-.594-.68-.804-1.127-.207-.44-.329-.985-.357-1.574-.058-1.268-.072-1.688-.072-5.017s.014-3.749.072-5.017c.028-.59.15-1.135.357-1.574.21-.447.464-.787.804-1.127.34-.34.68-.594 1.127-.804.44-.207.985-.329 1.574-.357 1.268-.058 1.688-.072 5.017-.072s3.749.014 5.017.072zm-5.178 1.656a5.347 5.347 0 1 0 0 10.694 5.347 5.347 0 0 0 0-10.694zm0 1.774a3.573 3.573 0 1 1 0 7.146 3.573 3.573 0 0 1 0-7.146zm6.96-1.91a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0z"/></svg>`,
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Vertical Social Links - Left Side */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 p-3">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary hover:shadow-lg hover:scale-110 transition-all duration-200 group"
            title={link.name}
          >
            <span dangerouslySetInnerHTML={{ __html: socialIcons[link.icon] || socialIcons.discord }} />
          </a>
        ))}
      </div>

      {/* Main Content - with margin for social links */}
      <div className="flex-1 flex bg-background">
        {/* Left side - branding */}
        <div className="flex-1 flex flex-col justify-center px-20 py-15 pl-24 bg-muted/30 relative overflow-hidden">
          {/* Grid pattern - Gaming style */}
          <div className="absolute inset-0 opacity-[0.05]" style={{
            backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />

          {/* Gaming-style diagonal lines */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, currentColor 35px, currentColor 36px)',
          }} />

          {/* Glow effects */}
          <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/10 via-primary/5 to-transparent -top-[200px] -left-[200px]" />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-accent/10 via-accent/5 to-transparent -bottom-[100px] -right-[100px]" />

          {/* Content */}
          <div className="relative z-10">
            {/* Logo with gaming-style glow */}
            <div className="w-20 h-20 bg-card rounded-2xl mb-8 flex items-center justify-center border border-border shadow-xl shadow-primary/20">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>

            <h1 className="text-6xl font-bold text-foreground tracking-tight mb-4 gaming-title">
              {title || siteName || settings?.name || 'ExilonCMS'}
            </h1>

            <p className="text-muted-foreground text-lg mb-8 max-w-[400px] leading-relaxed">
              {description || 'Join the ultimate gaming experience. Modern CMS for gaming communities.'}
            </p>

            {/* Customization note */}
            {showCustomizationNote && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg mb-8">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                  <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                </svg>
                <span className="text-primary text-xs font-medium">
                  Customize everything in Admin → Pages → Add components freely
                </span>
              </div>
            )}

            {/* Server Status - Gaming style */}
            {onlineServers.length > 0 && (
              <div className="flex items-center gap-6 mb-10">
                <div className="flex items-center gap-3 px-4 py-2 bg-card/50 border border-border rounded-lg">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50" />
                  <div>
                    <div className="text-xs text-muted-foreground">Servers</div>
                    <div className="text-sm font-bold text-foreground">{onlineServers.length} Online</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-card/50 border border-border rounded-lg">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <div>
                    <div className="text-xs text-muted-foreground">Players</div>
                    <div className="text-sm font-bold text-foreground">{totalPlayers}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Features list - Gaming style badges */}
            <div className="flex flex-wrap gap-3">
              {['Plugin System', 'Visual Editor', 'Real-time Stats', 'Custom Themes'].map((feature) => (
                <div key={feature} className="flex items-center gap-2 px-4 py-2 bg-muted/80 border border-border rounded-full text-sm text-muted-foreground">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - CTA or custom content */}
        <div className="flex-[0_0_450px] flex flex-col justify-center px-20 py-15 pr-24 border-l border-border bg-card/50 backdrop-blur-sm overflow-y-auto">
          {children || (
            <div className="max-w-[340px] mx-auto w-full">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2 tracking-tight">
                  {isAuthenticated ? 'Welcome Back' : 'Join The Community'}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {isAuthenticated
                    ? 'Continue your gaming journey'
                    : 'Create your account and start playing'}
                </p>
              </div>

              {/* Server List - Gaming style */}
              {onlineServers.length > 0 && (
                <div className="mb-8 space-y-3">
                  {onlineServers.map((server) => (
                    <div
                      key={server.id}
                      className="p-4 bg-muted/50 border border-border rounded-xl hover:border-primary/50 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-foreground font-semibold group-hover:text-primary transition-colors">
                          {server.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-green-500 text-sm font-bold">
                            {server.onlinePlayers}/{server.maxPlayers}
                          </span>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-xs mb-3">{server.fullAddress}</p>
                      <a
                        href={server.joinUrl || '#'}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14" />
                          <path d="M12 5l7 7-7 7" />
                        </svg>
                        Connect Now
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col gap-3">
                {isAuthenticated ? (
                  <>
                    <div className="p-5 bg-muted rounded-xl border border-border">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Signed in as</p>
                          <p className="text-sm font-bold text-foreground">{auth.user?.name}</p>
                        </div>
                      </div>
                      <Link
                        href="/dashboard"
                        className="flex items-center justify-center gap-2 w-full p-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25"
                      >
                        Go to Dashboard
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14" />
                          <path d="M12 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>

                    <Link
                      href="/news"
                      className="flex items-center justify-center gap-2 w-full p-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14" />
                        <path d="M12 5l7 7-7 7" />
                      </svg>
                      View News
                    </Link>

                    <Link
                      href="/logout"
                      method="post"
                      as="button"
                      className="flex items-center justify-center gap-2 w-full p-3 text-destructive border border-destructive/20 rounded-lg font-medium transition-all hover:bg-destructive/10 hover:border-destructive/40"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Sign Out
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/register"
                      className="flex items-center justify-center gap-2 w-full p-4 bg-primary text-primary-foreground rounded-xl font-bold transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                      </svg>
                      Create Account
                    </Link>

                    <Link
                      href="/login"
                      className="flex items-center justify-center gap-2 w-full p-4 bg-transparent text-foreground border-2 border-border rounded-xl font-bold transition-all hover:border-primary hover:text-primary"
                    >
                      Sign In
                    </Link>

                    <Link
                      href="/news"
                      className="flex items-center justify-center gap-2 w-full p-3 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14" />
                        <path d="M12 5l7 7-7 7" />
                      </svg>
                      Browse News First
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gaming title animation styles */}
      <style>{`
        .gaming-title {
          background: linear-gradient(135deg, hsl(var(--foreground)) 0%, hsl(var(--primary)) 50%, hsl(var(--foreground)) 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shine 3s linear infinite;
        }
        @keyframes shine {
          to { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
}
