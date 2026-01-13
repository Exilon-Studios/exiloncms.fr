import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/Install/Toast';

interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
}

interface Theme {
  id: string;
  name: string;
  description: string;
  version: string;
}

interface Props {
  availablePlugins: Plugin[];
  availableThemes: Theme[];
}

export default function InstallPlugins({ availablePlugins, availableThemes }: Props) {
  const [selectedPlugins, setSelectedPlugins] = useState<string[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const { toasts, error, remove } = useToast();

  const togglePlugin = (pluginId: string) => {
    setSelectedPlugins(prev =>
      prev.includes(pluginId)
        ? prev.filter(id => id !== pluginId)
        : [...prev, pluginId]
    );
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('[Install/Plugins] Proceeding to admin step...');
    console.log('[Install/Plugins] Selected plugins:', selectedPlugins);
    console.log('[Install/Plugins] Selected theme:', selectedTheme);

    // Store selections in sessionStorage and go to admin step
    sessionStorage.setItem('install_selected_plugins', JSON.stringify(selectedPlugins));
    sessionStorage.setItem('install_selected_theme', selectedTheme || '');

    try {
      let targetUrl: string;
      if (typeof (window as any).route === 'function') {
        targetUrl = (window as any).route('install.admin');
        console.log('[Install/Plugins] Route URL from ziggy:', targetUrl);
      } else {
        targetUrl = '/install/admin';
        console.log('[Install/Plugins] Using fallback URL:', targetUrl);
      }
      router.get(targetUrl);
    } catch (err) {
      console.error('[Install/Plugins] Navigation failed:', err);
      error('Navigation failed. Please try refreshing the page.');
    }
  };

  return (
    <>
      <Head title="Plugins & Themes - ExilonCMS" />
      <ToastContainer toasts={toasts} onRemove={remove} />

      <div style={{
        height: '100vh',
        display: 'flex',
        background: '#000000',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
        overflow: 'hidden',
      }}>
        {/* Left side - branding */}
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
              ExilonCMS
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

            {/* Steps indicator */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{
                width: '24px',
                height: '4px',
                borderRadius: '2px',
                background: '#333333',
              }} />
              <div style={{
                width: '24px',
                height: '4px',
                borderRadius: '2px',
                background: '#ffffff',
              }} />
              <div style={{
                width: '24px',
                height: '4px',
                borderRadius: '2px',
                background: '#333333',
              }} />
            </div>
            <p style={{ color: '#666666', fontSize: '12px', marginTop: '12px' }}>
              Step 2 of 3: Choose plugins
            </p>
          </div>
        </div>

        {/* Right side - plugin selection */}
        <div style={{
          flex: '0 0 550px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 48px',
          background: '#000000',
          borderLeft: '1px solid rgba(255,255,255,0.05)',
          overflowY: 'auto',
        }}>
          <div style={{ maxWidth: '460px', margin: '0 auto', width: '100%' }}>
            <h2 style={{
              fontSize: '22px',
              fontWeight: '500',
              color: '#ffffff',
              margin: '0 0 6px 0',
              letterSpacing: '-0.5px',
            }}>
              Plugins & Themes
            </h2>
            <p style={{
              color: '#666666',
              fontSize: '13px',
              margin: '0 0 32px 0',
            }}>
              Select the plugins and themes you want to install
            </p>

            <form onSubmit={submit}>
              {/* Plugins Section */}
              {availablePlugins.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    color: '#888888',
                    fontSize: '11px',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '12px',
                  }}>
                    Plugins ({selectedPlugins.length} selected)
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {availablePlugins.map((plugin) => (
                      <div
                        key={plugin.id}
                        onClick={() => togglePlugin(plugin.id)}
                        style={{
                          padding: '12px 14px',
                          background: selectedPlugins.includes(plugin.id)
                            ? 'rgba(255,255,255,0.05)'
                            : '#0a0a0a',
                          border: '1px solid ' + (
                            selectedPlugins.includes(plugin.id)
                              ? 'rgba(255,255,255,0.15)'
                              : 'rgba(255,255,255,0.05)'
                          ),
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                        onMouseOver={(e) => {
                          if (!selectedPlugins.includes(plugin.id)) {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                            e.currentTarget.style.background = '#0f0f0f';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!selectedPlugins.includes(plugin.id)) {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.background = '#0a0a0a';
                          }
                        }}
                      >
                        <div>
                          <div style={{ color: '#ffffff', fontSize: '13px', fontWeight: '500' }}>
                            {plugin.name}
                          </div>
                          <div style={{ color: '#666666', fontSize: '11px', marginTop: '2px' }}>
                            {plugin.description}
                          </div>
                        </div>
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '4px',
                          border: '1px solid ' + (
                            selectedPlugins.includes(plugin.id)
                              ? '#ffffff'
                              : 'rgba(255,255,255,0.2)'
                          ),
                          background: selectedPlugins.includes(plugin.id)
                            ? '#ffffff'
                            : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          {selectedPlugins.includes(plugin.id) && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Themes Section */}
              {availableThemes.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{
                    color: '#888888',
                    fontSize: '11px',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '12px',
                  }}>
                    Themes
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {availableThemes.map((theme) => (
                      <div
                        key={theme.id}
                        onClick={() => setSelectedTheme(theme.id)}
                        style={{
                          padding: '12px 14px',
                          background: selectedTheme === theme.id
                            ? 'rgba(255,255,255,0.05)'
                            : '#0a0a0a',
                          border: '1px solid ' + (
                            selectedTheme === theme.id
                              ? 'rgba(255,255,255,0.15)'
                              : 'rgba(255,255,255,0.05)'
                          ),
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                        onMouseOver={(e) => {
                          if (selectedTheme !== theme.id) {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                            e.currentTarget.style.background = '#0f0f0f';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (selectedTheme !== theme.id) {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.background = '#0a0a0a';
                          }
                        }}
                      >
                        <div>
                          <div style={{ color: '#ffffff', fontSize: '13px', fontWeight: '500' }}>
                            {theme.name}
                          </div>
                          <div style={{ color: '#666666', fontSize: '11px', marginTop: '2px' }}>
                            {theme.description}
                          </div>
                        </div>
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: '1px solid ' + (
                            selectedTheme === theme.id
                              ? '#ffffff'
                              : 'rgba(255,255,255,0.2)'
                          ),
                          background: selectedTheme === theme.id
                            ? '#ffffff'
                            : 'transparent',
                        }} />
                      </div>
                    ))}
                    {/* None option */}
                    <div
                      onClick={() => setSelectedTheme(null)}
                      style={{
                        padding: '12px 14px',
                        background: selectedTheme === null
                          ? 'rgba(255,255,255,0.05)'
                          : '#0a0a0a',
                        border: '1px solid ' + (
                          selectedTheme === null
                            ? 'rgba(255,255,255,0.15)'
                            : 'rgba(255,255,255,0.05)'
                        ),
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        color: '#888888',
                        fontSize: '13px',
                      }}
                      onMouseOver={(e) => {
                        if (selectedTheme !== null) {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                          e.currentTarget.style.background = '#0f0f0f';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (selectedTheme !== null) {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                          e.currentTarget.style.background = '#0a0a0a';
                        }
                      }}
                    >
                      Default Theme (None)
                    </div>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  style={{
                    flex: '1',
                    padding: '12px',
                    background: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#000000',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#f0f0f0';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                  }}
                >
                  Continue
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </button>

                <a
                  href="/install"
                  style={{
                    padding: '12px 20px',
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
                  Back
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          div[style*="flex: 1; display: flex; flex-direction: column"] {
            display: none !important;
          }
          div[style*="flex: 0 0"] {
            flex: 1 !important;
            padding: 32px 24px !important;
          }
        }
      `}</style>
    </>
  );
}
