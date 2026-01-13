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
  const { auth } = usePage<PageProps>().props;
  const isAuthenticated = !!auth.user;
  const onlineServers = servers?.filter(s => s.isOnline) || [];
  const totalPlayers = onlineServers.reduce((sum, s) => sum + (s.onlinePlayers || 0), 0);

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      background: '#000000',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
      overflow: 'hidden',
    }}>
      {/* Left side - content */}
      <div style={{
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px',
        background: '#0a0a0a',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle grid pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />

        {/* Subtle glow */}
        <div style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
          top: '-200px',
          left: '-200px',
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: '#111111',
            borderRadius: '14px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '600',
            color: '#ffffff',
            margin: '0 0 12px 0',
            letterSpacing: '-1.5px',
          }}>
            {siteName || 'ExilonCMS'}
          </h1>
          <p style={{
            fontSize: '15px',
            color: '#666666',
            margin: '0 0 36px 0',
            maxWidth: '320px',
            lineHeight: '1.5',
          }}>
            Modern CMS for gaming communities
          </p>

          {/* Server Status */}
          {onlineServers.length > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              marginBottom: '36px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#22c55e',
                }} />
                <span style={{ color: '#888888', fontSize: '13px' }}>
                  {onlineServers.length} server{onlineServers.length > 1 ? 's' : ''} online
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: '#666666' }}>
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span style={{ color: '#888888', fontSize: '13px' }}>
                  {totalPlayers} player{totalPlayers > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}

          {/* Features list */}
          <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#444444', fontSize: '13px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Plugin System</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#444444', fontSize: '13px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Visual Editor</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - CTA */}
      <div style={{
        flex: '0 0 ' + Math.min(400, window.innerWidth * 0.5) + 'px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 48px',
        background: '#000000',
        borderLeft: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ maxWidth: '300px', margin: '0 auto', width: '100%' }}>
          <h2 style={{
            fontSize: '22px',
            fontWeight: '500',
            color: '#ffffff',
            margin: '0 0 8px 0',
            letterSpacing: '-0.5px',
          }}>
            Join Us
          </h2>
          <p style={{
            color: '#666666',
            fontSize: '13px',
            margin: '0 0 32px 0',
          }}>
            Create your account and join our community
          </p>

          {/* Server List */}
          {onlineServers.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              {onlineServers.map((server) => (
                <div
                  key={server.id}
                  style={{
                    padding: '12px',
                    marginBottom: '8px',
                    background: '#0a0a0a',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '6px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: '500' }}>
                      {server.name}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#22c55e',
                      }} />
                      <span style={{ color: '#22c55e', fontSize: '11px' }}>
                        {server.onlinePlayers} / {server.maxPlayers}
                      </span>
                    </div>
                  </div>
                  <p style={{ color: '#666666', fontSize: '11px' }}>
                    {server.fullAddress}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* CTA Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {isAuthenticated ? (
              <>
                {/* Logged in: Show user info and dashboard link */}
                <div style={{
                  padding: '16px',
                  background: '#0a0a0a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  marginBottom: '8px',
                }}>
                  <p style={{ color: '#888888', fontSize: '11px', margin: '0 0 8px 0' }}>
                    Welcome back,
                  </p>
                  <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: '500', margin: '0 0 12px 0' }}>
                    {auth.user?.name}
                  </p>
                  <Link
                    href="/dashboard"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '10px',
                      background: '#ffffff',
                      color: '#000000',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '500',
                      textDecoration: 'none',
                      transition: 'all 0.15s',
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = '#f0f0f0'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = '#ffffff'; }}
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
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '12px',
                    background: 'transparent',
                    color: '#666666',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    textDecoration: 'none',
                    transition: 'color 0.15s',
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.color = '#888888'; }}
                  onMouseOut={(e) => { e.currentTarget.style.color = '#666666'; }}
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
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '12px',
                    background: 'transparent',
                    color: '#ef4444',
                    border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)';
                    e.currentTarget.style.background = 'rgba(239,68,68,0.05)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)';
                    e.currentTarget.style.background = 'transparent';
                  }}
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
                {/* Not logged in: Show register and sign in */}
                <Link
                  href="/register"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '12px',
                    background: '#ffffff',
                    color: '#000000',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    textDecoration: 'none',
                    transition: 'all 0.15s',
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = '#f0f0f0'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = '#ffffff'; }}
                >
                  Create Account
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                </Link>

                <Link
                  href="/login"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '12px',
                    background: 'transparent',
                    color: '#888888',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    textDecoration: 'none',
                    transition: 'all 0.15s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.color = '#888888';
                  }}
                >
                  Sign In
                </Link>

                <Link
                  href="/news"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '12px',
                    background: 'transparent',
                    color: '#666666',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    textDecoration: 'none',
                    transition: 'color 0.15s',
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.color = '#888888'; }}
                  onMouseOut={(e) => { e.currentTarget.style.color = '#666666'; }}
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

      <style>{`
        @media (max-width: 900px) {
          div[style*="flex: 1; display: flex; flex-direction: column"] {
            display: none !important;
          }
          div[style*="flex: 0 0"] {
            flex: '1 !important';
            padding: '32px 24px !important';
          }
        }
      `}</style>
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
