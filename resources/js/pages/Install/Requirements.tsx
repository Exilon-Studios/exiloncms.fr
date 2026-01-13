import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Requirement } from './types';

interface Props {
  requirements?: Requirement[];
}

export default function Requirements({ requirements: initialRequirements }: Props) {
  const [requirements, setRequirements] = useState<Requirement[]>(
    initialRequirements || [
      { name: 'PHP Version', status: 'pending' },
      { name: 'Extension BCMath', status: 'pending' },
      { name: 'Extension CType', status: 'pending' },
      { name: 'Extension JSON', status: 'pending' },
      { name: 'Extension MBString', status: 'pending' },
      { name: 'Extension OpenSSL', status: 'pending' },
      { name: 'Extension PDO', status: 'pending' },
      { name: 'Extension Tokenizer', status: 'pending' },
      { name: 'Extension XML', status: 'pending' },
      { name: 'Extension FileInfo', status: 'pending' },
      { name: 'Extension Zip', status: 'pending' },
      { name: 'Extension Curl', status: 'pending' },
    ]
  );
  const [checking, setChecking] = useState(!initialRequirements);
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    if (!initialRequirements) {
      checkRequirements();
    } else {
      const allOk = requirements.every(r => r.status === 'success');
      setCanContinue(allOk);
    }
  }, []);

  const checkRequirements = async () => {
    setChecking(true);
    try {
      const response = await router.post(route('install.requirements.check'), {}, {
        onSuccess: (page: any) => {
          const checkedRequirements = page.props.requirements as Requirement[];
          setRequirements(checkedRequirements);
          const allOk = checkedRequirements.every((r: Requirement) => r.status === 'success');
          setCanContinue(allOk);
        },
      });
    } catch (error) {
      console.error('Failed to check requirements:', error);
    } finally {
      setChecking(false);
    }
  };

  const allOk = requirements.every(r => r.status === 'success');
  const hasErrors = requirements.some(r => r.status === 'error');

  return (
    <>
      <Head title="Prérequis - ExilonCMS" />

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
                background: '#333333',
              }} />
              <div style={{
                width: '24px',
                height: '4px',
                borderRadius: '2px',
                background: '#333333',
              }} />
            </div>
            <p style={{ color: '#666666', fontSize: '12px', marginTop: '12px' }}>
              Step 1 of 3: Check requirements
            </p>

            {/* Status indicator */}
            <div style={{ marginTop: '24px' }}>
              {checking && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#888888' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  <span style={{ fontSize: '12px' }}>Checking system...</span>
                </div>
              )}
              {!checking && allOk && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22c55e' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span style={{ fontSize: '12px' }}>All requirements met</span>
                </div>
              )}
              {!checking && hasErrors && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4" />
                    <path d="M12 16h.01" />
                  </svg>
                  <span style={{ fontSize: '12px' }}>Some requirements missing</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side - requirements */}
        <div style={{
          flex: '0 0 ' + Math.min(550, window.innerWidth * 0.60) + 'px',
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
              System Requirements
            </h2>
            <p style={{
              color: '#666666',
              fontSize: '13px',
              margin: '0 0 32px 0',
            }}>
              We're checking if your server is compatible
            </p>

            {/* Requirements List */}
            <div style={{
              background: '#0a0a0a',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px',
            }}>
              {checking ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite', color: '#888888' }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  <span style={{ marginLeft: '12px', color: '#666666', fontSize: '13px' }}>Checking...</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {requirements.map((req, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        background: req.status === 'success'
                          ? 'rgba(34, 197, 94, 0.1)'
                          : req.status === 'error'
                          ? 'rgba(239, 68, 68, 0.1)'
                          : '#0f0f0f',
                        border: '1px solid ' + (
                          req.status === 'success'
                            ? 'rgba(34, 197, 94, 0.2)'
                            : req.status === 'error'
                            ? 'rgba(239, 68, 68, 0.2)'
                            : 'rgba(255,255,255,0.05)'
                        ),
                      }}
                    >
                      <span style={{
                        color: req.status === 'success' ? '#22c55e' :
                               req.status === 'error' ? '#ef4444' :
                               '#888888',
                        fontSize: '13px',
                      }}>
                        {req.name}
                      </span>
                      {req.status === 'success' && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                      {req.status === 'error' && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 8v4" />
                          <path d="M12 16h.01" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Alert */}
            {hasErrors && !checking && (
              <div style={{
                padding: '12px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '6px',
                marginBottom: '24px',
              }}>
                <p style={{ color: '#ef4444', fontSize: '12px', margin: 0 }}>
                  Some requirements are not met. Please contact your hosting provider.
                </p>
              </div>
            )}

            {allOk && !checking && (
              <div style={{
                padding: '12px',
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                borderRadius: '6px',
                marginBottom: '24px',
              }}>
                <p style={{ color: '#22c55e', fontSize: '12px', margin: 0 }}>
                  All requirements are met! You can continue the installation.
                </p>
              </div>
            )}

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={checkRequirements}
                disabled={checking}
                style={{
                  flex: '1',
                  padding: '12px',
                  background: checking ? '#1a1a1a' : 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: checking ? '#666666' : '#ffffff',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: checking ? 'not-allowed' : 'pointer',
                  opacity: checking ? 0.5 : 1,
                  transition: 'all 0.15s',
                }}
                onMouseOver={(e) => {
                  if (!checking) {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!checking) {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  }
                }}
              >
                Recheck
              </button>

              <a
                href={canContinue ? '/install/database' : '#'}
                onClick={(e) => !canContinue && checking && e.preventDefault()}
                style={{
                  flex: '1',
                  padding: '12px',
                  background: canContinue ? '#ffffff' : '#1a1a1a',
                  border: 'none',
                  borderRadius: '6px',
                  color: canContinue ? '#000000' : '#666666',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: canContinue ? 'pointer' : 'not-allowed',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  opacity: checking ? 0.5 : 1,
                  transition: 'all 0.15s',
                }}
                onMouseOver={(e) => {
                  if (canContinue && !checking) {
                    e.currentTarget.style.background = '#f0f0f0';
                  }
                }}
                onMouseOut={(e) => {
                  if (canContinue && !checking) {
                    e.currentTarget.style.background = '#ffffff';
                  }
                }}
              >
                Continue
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
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
