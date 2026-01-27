import { Head, router } from '@inertiajs/react';
import { useState, FormEvent } from 'react';

interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  icon?: string;
}

interface Theme {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  screenshot?: string;
}

interface PageProps {
  plugins: Plugin[];
  themes: Theme[];
  selectedPlugins: string[];
  selectedTheme: string | null;
}

export default function Extensions({ plugins, themes, selectedPlugins, selectedTheme }: PageProps) {
  const [selectedPluginsList, setSelectedPluginsList] = useState<string[]>(selectedPlugins);
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(selectedTheme);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      await router.post(route('install.extensions.save'), {
        plugins: selectedPluginsList,
        theme: selectedThemeId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePlugin = (pluginId: string) => {
    setSelectedPluginsList(prev =>
      prev.includes(pluginId)
        ? prev.filter(id => id !== pluginId)
        : [...prev, pluginId]
    );
  };

  const selectTheme = (themeId: string | null) => {
    setSelectedThemeId(themeId);
  };

  const pluginCardStyle = (pluginId: string) => ({
    padding: '14px',
    background: selectedPluginsList.includes(pluginId) ? 'rgba(255,255,255,0.05)' : '#0a0a0a',
    border: '1px solid ' + (
      selectedPluginsList.includes(pluginId)
        ? 'rgba(255,255,255,0.15)'
        : 'rgba(255,255,255,0.05)'
    ),
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    transition: 'all 0.15s',
  });

  const themeCardStyle = (themeId: string | null) => ({
    padding: '14px',
    background: selectedThemeId === themeId ? 'rgba(255,255,255,0.05)' : '#0a0a0a',
    border: '1px solid ' + (
      selectedThemeId === themeId
        ? 'rgba(255,255,255,0.15)'
        : 'rgba(255,255,255,0.05)'
    ),
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    transition: 'all 0.15s',
  });

  const checkboxStyle = (selected: boolean) => ({
    width: '18px',
    height: '18px',
    borderRadius: '4px',
    border: '1px solid ' + (selected ? '#ffffff' : 'rgba(255,255,255,0.2)'),
    background: selected ? '#ffffff' : 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  });

  const radioStyle = (selected: boolean) => ({
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    border: '1px solid ' + (selected ? '#ffffff' : 'rgba(255,255,255,0.2)'),
    background: selected ? '#ffffff' : 'transparent',
    flexShrink: 0,
  });

  return (
    <>
      <Head title="Plugins & Themes - ExilonCMS" />

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
                background: '#ffffff',
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
              Step 3 of 4: Choose plugins and themes
            </p>
          </div>
        </div>

        {/* Right side - extensions selection */}
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
              Select the plugins and theme you want to install. You can always add more later.
            </p>

            <form onSubmit={handleSubmit}>
              {/* Plugins Section */}
              {plugins.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    color: '#888888',
                    fontSize: '11px',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '12px',
                  }}>
                    Plugins ({selectedPluginsList.length} selected)
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {plugins.map((plugin) => (
                      <div
                        key={plugin.id}
                        onClick={() => togglePlugin(plugin.id)}
                        style={pluginCardStyle(plugin.id)}
                        onMouseOver={(e) => {
                          if (!selectedPluginsList.includes(plugin.id)) {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                            e.currentTarget.style.background = '#0f0f0f';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!selectedPluginsList.includes(plugin.id)) {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.background = '#0a0a0a';
                          }
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ color: '#ffffff', fontSize: '13px', fontWeight: '500' }}>
                            {plugin.name}
                          </div>
                          <div style={{ color: '#666666', fontSize: '11px', marginTop: '2px' }}>
                            {plugin.description}
                          </div>
                          {plugin.author && (
                            <div style={{ color: '#555555', fontSize: '10px', marginTop: '2px' }}>
                              by {plugin.author} • v{plugin.version}
                            </div>
                          )}
                        </div>
                        <div style={checkboxStyle(selectedPluginsList.includes(plugin.id))}>
                          {selectedPluginsList.includes(plugin.id) && (
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
              {themes.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{
                    color: '#888888',
                    fontSize: '11px',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '12px',
                  }}>
                    Theme
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {themes.map((theme) => (
                      <div
                        key={theme.id}
                        onClick={() => selectTheme(theme.id)}
                        style={themeCardStyle(theme.id)}
                        onMouseOver={(e) => {
                          if (selectedThemeId !== theme.id) {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                            e.currentTarget.style.background = '#0f0f0f';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (selectedThemeId !== theme.id) {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.background = '#0a0a0a';
                          }
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ color: '#ffffff', fontSize: '13px', fontWeight: '500' }}>
                            {theme.name}
                          </div>
                          <div style={{ color: '#666666', fontSize: '11px', marginTop: '2px' }}>
                            {theme.description}
                          </div>
                          {theme.author && (
                            <div style={{ color: '#555555', fontSize: '10px', marginTop: '2px' }}>
                              by {theme.author} • v{theme.version}
                            </div>
                          )}
                        </div>
                        <div style={radioStyle(selectedThemeId === theme.id)} />
                      </div>
                    ))}
                    {/* None option */}
                    <div
                      onClick={() => selectTheme(null)}
                      style={themeCardStyle(null)}
                      onMouseOver={(e) => {
                        if (selectedThemeId !== null) {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                          e.currentTarget.style.background = '#0f0f0f';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (selectedThemeId !== null) {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                          e.currentTarget.style.background = '#0a0a0a';
                        }
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#ffffff', fontSize: '13px', fontWeight: '500' }}>
                          Default Theme
                        </div>
                        <div style={{ color: '#666666', fontSize: '11px', marginTop: '2px' }}>
                          Use the default ExilonCMS theme
                        </div>
                      </div>
                      <div style={radioStyle(selectedThemeId === null)} />
                    </div>
                  </div>
                </div>
              )}

              {/* Info box */}
              <div style={{
                marginTop: '8px',
                padding: '12px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '6px',
              }}>
                <p style={{
                  color: '#888888',
                  fontSize: '11px',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                  You can add or remove plugins and change themes later from the admin panel
                </p>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    flex: '1',
                    padding: '12px',
                    background: isSubmitting ? '#1a1a1a' : '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    color: isSubmitting ? '#666666' : '#000000',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.5 : 1,
                    transition: 'all 0.15s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                  onMouseOver={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.background = '#f0f0f0';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.background = '#ffffff';
                    }
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      Continue
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14" />
                        <path d="M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>

                <a
                  href="/wizard/mode"
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
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
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
