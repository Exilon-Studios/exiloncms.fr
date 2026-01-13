import { Head, router } from '@inertiajs/react';
import { useState, FormEvent } from 'react';

export default function Mode() {
  const [selectedMode, setSelectedMode] = useState<'production' | 'demo' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedMode) return;

    setIsSubmitting(true);

    try {
      await router.post(route('install.mode.save'), { mode: selectedMode });
    } finally {
      setIsSubmitting(false);
    }
  };

  const cardStyle = (mode: 'production' | 'demo') => ({
    padding: '20px',
    background: selectedMode === mode ? 'rgba(255,255,255,0.05)' : '#0a0a0a',
    border: '1px solid ' + (
      selectedMode === mode
        ? 'rgba(255,255,255,0.15)'
        : 'rgba(255,255,255,0.05)'
    ),
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.15s',
    display: 'flex',
    gap: '16px',
  });

  const iconContainerStyle = (mode: 'production' | 'demo') => ({
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    background: selectedMode === mode
      ? (mode === 'production' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(59, 130, 246, 0.2)')
      : '#111111',
  });

  return (
    <>
      <Head title="Installation Mode - ExilonCMS" />

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
              Step 3 of 4: Choose installation mode
            </p>
          </div>
        </div>

        {/* Right side - mode selection */}
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
              Installation Mode
            </h2>
            <p style={{
              color: '#666666',
              fontSize: '13px',
              margin: '0 0 32px 0',
            }}>
              Choose how you want to use ExilonCMS
            </p>

            <form onSubmit={handleSubmit}>
              {/* Production Mode */}
              <div
                onClick={() => setSelectedMode('production')}
                style={cardStyle('production')}
                onMouseOver={(e) => {
                  if (selectedMode !== 'production') {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.background = '#0f0f0f';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedMode !== 'production') {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.background = '#0a0a0a';
                  }
                }}
              >
                <div style={iconContainerStyle('production')}>
                  {selectedMode === 'production' ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.5">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    color: '#ffffff',
                    fontSize: '15px',
                    fontWeight: '500',
                    margin: '0 0 4px 0',
                  }}>
                    Production Mode
                  </h3>
                  <p style={{
                    color: '#888888',
                    fontSize: '12px',
                    margin: '0 0 8px 0',
                    lineHeight: '1.4',
                  }}>
                    Full-featured installation for your live server
                  </p>
                  <ul style={{
                    color: '#666666',
                    fontSize: '11px',
                    margin: 0,
                    paddingLeft: '16px',
                    lineHeight: '1.5',
                  }}>
                    <li>User registration enabled</li>
                    <li>All features available</li>
                    <li>Standard authentication</li>
                    <li>Ready for production use</li>
                  </ul>
                </div>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: '1px solid ' + (
                    selectedMode === 'production'
                      ? '#22c55e'
                      : 'rgba(255,255,255,0.2)'
                  ),
                  background: selectedMode === 'production'
                    ? '#22c55e'
                    : 'transparent',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {selectedMode === 'production' && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Demo Mode */}
              <div
                onClick={() => setSelectedMode('demo')}
                style={{
                  ...cardStyle('demo'),
                  marginTop: '16px',
                }}
                onMouseOver={(e) => {
                  if (selectedMode !== 'demo') {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.background = '#0f0f0f';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedMode !== 'demo') {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.background = '#0a0a0a';
                  }
                }}
              >
                <div style={iconContainerStyle('demo')}>
                  {selectedMode === 'demo' ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <polygon points="10 8 16 12 10 16 10 8" />
                    </svg>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    color: '#ffffff',
                    fontSize: '15px',
                    fontWeight: '500',
                    margin: '0 0 4px 0',
                  }}>
                    Demo Mode
                  </h3>
                  <p style={{
                    color: '#888888',
                    fontSize: '12px',
                    margin: '0 0 8px 0',
                    lineHeight: '1.4',
                  }}>
                    Safe presentation mode for showcasing ExilonCMS
                  </p>
                  <ul style={{
                    color: '#666666',
                    fontSize: '11px',
                    margin: 0,
                    paddingLeft: '16px',
                    lineHeight: '1.5',
                  }}>
                    <li>Registration disabled</li>
                    <li>Special quick login buttons</li>
                    <li>Admin-only user management</li>
                    <li>Safe for public demonstrations</li>
                  </ul>
                </div>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: '1px solid ' + (
                    selectedMode === 'demo'
                      ? '#3b82f6'
                      : 'rgba(255,255,255,0.2)'
                  ),
                  background: selectedMode === 'demo'
                    ? '#3b82f6'
                    : 'transparent',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {selectedMode === 'demo' && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Info box */}
              <div style={{
                marginTop: '24px',
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
                  You can change these settings later in the admin panel
                </p>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  type="submit"
                  disabled={!selectedMode || isSubmitting}
                  style={{
                    flex: '1',
                    padding: '12px',
                    background: (!selectedMode || isSubmitting) ? '#1a1a1a' : '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    color: (!selectedMode || isSubmitting) ? '#666666' : '#000000',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: (!selectedMode || isSubmitting) ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.5 : 1,
                    transition: 'all 0.15s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                  onMouseOver={(e) => {
                    if (selectedMode && !isSubmitting) {
                      e.currentTarget.style.background = '#f0f0f0';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedMode && !isSubmitting) {
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
                  href="/install/database"
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
