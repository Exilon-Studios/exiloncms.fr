import { Head } from '@inertiajs/react';
import PuckLayout from '@/layouts/PuckLayout';
import { Render } from '@measured/puck';
import '@measured/puck/puck.css';
import { puckConfig } from '@/puck/config';
import { Post } from '@/types';
import { trans } from '@/lib/i18n';
import styles from './Home.module.css';
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

interface Server {
  id: number;
  name: string;
  fullAddress: string;
  joinUrl?: string;
  isOnline: boolean;
  onlinePlayers?: number;
  maxPlayers?: number;
  playersPercents?: number;
}

interface LandingSettings {
  [key: string]: any;
}

interface Props {
  message?: string;
  siteName?: string;
  posts: Post[];
  server?: Server;
  servers: Server[];
  landingSettings: LandingSettings;
}

function SplitHomePage({ siteName, servers }: { siteName?: string; servers: Server[] }) {
  const { auth, settings } = usePage<PageProps>().props;
  const isAuthenticated = !!auth.user;
  const onlineServers = servers?.filter(s => s.isOnline) || [];
  const totalPlayers = onlineServers.reduce((sum, s) => sum + (s.onlinePlayers || 0), 0);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - branding */}
      <div className="flex-1 flex flex-col justify-center p-15 bg-muted/30 relative overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />

        {/* Glow effect */}
        <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/5 to-transparent -top-[200px] -left-[200px]" />

        {/* Content */}
        <div className="relative z-10">
          {/* Logo */}
          <div className="w-16 h-16 bg-card rounded-3xl mb-6 flex items-center justify-center border border-border shadow-sm">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>

          <h1 className="text-5xl font-semibold text-foreground tracking-tight mb-3">
            {siteName || settings?.name || 'ExilonCMS'}
          </h1>
          <p className="text-muted-foreground text-base mb-9 max-w-[320px] leading-relaxed">
            Modern CMS for gaming communities
          </p>

          {/* Server Status */}
          {onlineServers.length > 0 && (
            <div className="flex items-center gap-6 mb-9">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-muted-foreground text-sm">
                  {onlineServers.length} server{onlineServers.length > 1 ? 's' : ''} online
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span className="text-muted-foreground text-sm">
                  {totalPlayers} player{totalPlayers > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}

          {/* Features list */}
          <div className="flex gap-6">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Plugin System</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Visual Editor</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - CTA */}
      <div className="flex-[0_0_400px] flex flex-col justify-center p-15 border-l border-border bg-card overflow-y-auto">
        <div className="max-w-[300px] mx-auto w-full">
          <h2 className="text-xl font-medium text-foreground mb-2 tracking-tight">
            {isAuthenticated ? 'Welcome Back' : 'Join Us'}
          </h2>
          <p className="text-muted-foreground text-sm mb-8">
            {isAuthenticated
              ? 'Continue to your dashboard'
              : 'Create your account and join our community'}
          </p>

          {/* Server List */}
          {onlineServers.length > 0 && (
            <div className="mb-8">
              {onlineServers.map((server) => (
                <div
                  key={server.id}
                  className="p-3 mb-2 bg-muted rounded-lg border border-border"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-foreground text-sm font-medium">
                      {server.name}
                    </span>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="text-green-500 text-xs">
                        {server.onlinePlayers} / {server.maxPlayers}
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {server.fullAddress}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                {/* Logged in */}
                <div className="p-4 bg-muted rounded-xl border border-border mb-2">
                  <p className="text-muted-foreground text-xs mb-2">Signed in as</p>
                  <p className="text-foreground text-sm font-medium mb-3">
                    {auth.user?.name}
                  </p>
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-center gap-2 w-full p-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
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
                  className="flex items-center justify-center gap-2 w-full p-3 text-muted-foreground text-xs transition-colors hover:text-foreground"
                >
                  View News
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </Link>

                <Link
                  href="/logout"
                  method="post"
                  as="button"
                  className="flex items-center justify-center gap-2 w-full p-3 text-destructive text-xs font-medium border border-destructive/20 rounded-lg transition-colors hover:bg-destructive/10 hover:border-destructive/40"
                >
                  Sign Out
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </Link>
              </>
            ) : (
              <>
                {/* Not logged in */}
                <Link
                  href="/register"
                  className="flex items-center justify-center gap-2 w-full p-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Create Account
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                </Link>

                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 w-full p-3 bg-transparent text-muted-foreground border border-border rounded-lg text-sm font-medium hover:text-foreground hover:border-border transition-colors"
                >
                  Sign In
                </Link>

                <Link
                  href="/news"
                  className="flex items-center justify-center gap-2 w-full p-3 text-muted-foreground text-xs transition-colors hover:text-foreground"
                >
                  View News
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Responsive: hide left side on mobile */}
      <style>{`@media (max-width: 900px) { .flex-1.flex.flex-col { display: none; } }`}</style>
    </div>
  );
}

export default function Home({ message, siteName, posts, server, servers, landingSettings }: Props) {
  // Check if puck_data exists and is valid
  let puckData = null;
  const hasPuckData = landingSettings?.puck_data;

  if (hasPuckData) {
    try {
      puckData = typeof landingSettings.puck_data === 'string'
        ? JSON.parse(landingSettings.puck_data)
        : landingSettings.puck_data;

      // Inject posts into BlogBlock components
      if (puckData?.content) {
        puckData.content = puckData.content.map((item: any) => {
          if (item.type === 'BlogBlock') {
            return {
              ...item,
              props: {
                ...item.props,
                posts: posts,
              }
            };
          }
          return item;
        });
      }
    } catch (e) {
      console.error('Failed to parse puck_data:', e);
      puckData = null;
    }
  }

  // Check if we have valid Puck content
  const hasPuckContent = puckData && puckData.content && puckData.content.length > 0;

  return (
    <PuckLayout>
      <Head title={trans('messages.pages.title')} />

      {hasPuckContent ? (
        <div className={styles.root}>
          <Render config={puckConfig} data={puckData} />
        </div>
      ) : (
        <SplitHomePage
          siteName={siteName}
          servers={servers}
        />
      )}
    </PuckLayout>
  );
}
