import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/Install/Toast';

interface Props {
  phpVersion: string;
  minPhpVersion: string;
}

export default function InstallAdmin({ phpVersion, minPhpVersion }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const { toasts, success, error, info, remove } = useToast();

  // Get data from sessionStorage
  const appUrl = sessionStorage.getItem('install_app_url') || window.location.origin;
  const selectedPlugins = JSON.parse(sessionStorage.getItem('install_selected_plugins') || '[]');
  const selectedTheme = sessionStorage.getItem('install_selected_theme') || '';

  const { data, setData } = useForm({
    app_url: appUrl,
    name: 'Admin',
    email: 'admin@example.com',
    password: '',
    password_confirmation: '',
    selected_plugins: selectedPlugins,
    selected_theme: selectedTheme,
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerErrors({});
    setIsSubmitting(true);

    info('Starting installation...');

    // Get the submit URL - use install.admin.save not install.submit!
    let submitUrl: string;
    try {
      if (typeof (window as any).route === 'function') {
        submitUrl = (window as any).route('install.admin.save');
        console.log('[Install] Route URL from ziggy:', submitUrl);
      } else {
        submitUrl = '/install/admin';
        console.log('[Install] Using fallback URL:', submitUrl);
      }
    } catch (err) {
      console.error('[Install] Error getting route:', err);
      error('Failed to get route URL. Please refresh the page.');
      setIsSubmitting(false);
      return;
    }

    if (!submitUrl || typeof submitUrl !== 'string') {
      error('Invalid submit URL. Please refresh the page.');
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('[Install] Submitting form to:', submitUrl);
      console.log('[Install] Form data:', { ...data, password: '***' });

      // Use router.post directly with proper options
      router.post(submitUrl, data, {
        onError: (errors) => {
          console.error('[Install] Validation errors:', errors);
          setServerErrors(errors as Record<string, string>);
          setIsSubmitting(false);
          error('Please fix the errors and try again.');
        },
        onSuccess: () => {
          console.log('[Install] Installation successful!');
          success('Installation completed successfully!');
        },
      });
    } catch (err) {
      console.error('[Install] Submission failed:', err);
      error('Installation failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  const processing = isSubmitting;
  const errors = serverErrors;
  const clearErrors = () => setServerErrors({});

  const phpOk = phpVersion >= minPhpVersion;

  const inputWrapperStyle = { position: 'relative' } as const;
  const toggleButtonStyle = {
    position: 'absolute' as const,
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#666666',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <>
      <Head title="Admin Account - ExilonCMS" />
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
                background: '#333333',
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
                background: '#ffffff',
              }} />
            </div>
            <p style={{ color: '#666666', fontSize: '12px', marginTop: '12px' }}>
              Step 4 of 4: Create admin account
            </p>

            {/* Summary */}
            {selectedPlugins.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <p style={{ color: '#666666', fontSize: '11px', marginBottom: '8px' }}>
                  Plugins to install:
                </p>
                {selectedPlugins.map((plugin: string) => (
                  <div key={plugin} style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    background: '#111111',
                    borderRadius: '4px',
                    color: '#888888',
                    fontSize: '11px',
                    marginRight: '4px',
                    marginBottom: '4px',
                  }}>
                    {plugin}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side - form */}
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
              Create Admin Account
            </h2>
            <p style={{
              color: '#666666',
              fontSize: '13px',
              margin: '0 0 32px 0',
            }}>
              Last step! Create your administrator account
            </p>

            <form onSubmit={submit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  color: '#888888',
                  fontSize: '11px',
                  fontWeight: '500',
                  marginBottom: '6px',
                  letterSpacing: '0.3px',
                }}>
                  Admin Name
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={e => setData('name', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#0a0a0a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    transition: 'all 0.15s',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                    e.target.style.background = '#0f0f0f';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.target.style.background = '#0a0a0a';
                  }}
                  placeholder="Your name"
                  autoComplete="name"
                />
                {errors.name && (
                  <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.name}</div>
                )}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  color: '#888888',
                  fontSize: '11px',
                  fontWeight: '500',
                  marginBottom: '6px',
                  letterSpacing: '0.3px',
                }}>
                  Admin Email
                </label>
                <input
                  type="email"
                  value={data.email}
                  onChange={e => setData('email', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#0a0a0a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    transition: 'all 0.15s',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                    e.target.style.background = '#0f0f0f';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.target.style.background = '#0a0a0a';
                  }}
                  placeholder="admin@example.com"
                  autoComplete="email"
                />
                {errors.email && (
                  <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.email}</div>
                )}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  color: '#888888',
                  fontSize: '11px',
                  fontWeight: '500',
                  marginBottom: '6px',
                  letterSpacing: '0.3px',
                }}>
                  Password
                </label>
                <div style={inputWrapperStyle}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={data.password}
                    onChange={e => setData('password', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 36px 10px 12px',
                      background: '#0a0a0a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                      outline: 'none',
                      transition: 'all 0.15s',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                      e.target.style.background = '#0f0f0f';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                      e.target.style.background = '#0a0a0a';
                    }}
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={toggleButtonStyle}
                  >
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-5.06 5.94M1 1l22 22" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.password}</div>
                )}
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  color: '#888888',
                  fontSize: '11px',
                  fontWeight: '500',
                  marginBottom: '6px',
                  letterSpacing: '0.3px',
                }}>
                  Confirm Password
                </label>
                <div style={inputWrapperStyle}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={data.password_confirmation}
                    onChange={e => setData('password_confirmation', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 36px 10px 12px',
                      background: '#0a0a0a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                      outline: 'none',
                      transition: 'all 0.15s',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                      e.target.style.background = '#0f0f0f';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                      e.target.style.background = '#0a0a0a';
                    }}
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={toggleButtonStyle}
                  >
                    {showConfirmPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-5.06 5.94M1 1l22 22" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password_confirmation && (
                  <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.password_confirmation}</div>
                )}
              </div>

              <button
                type="submit"
                disabled={processing || !phpOk}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: phpOk ? '#ffffff' : '#1a1a1a',
                  border: 'none',
                  borderRadius: '6px',
                  color: phpOk ? '#000000' : '#666666',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: phpOk && !processing ? 'pointer' : 'not-allowed',
                  opacity: processing ? 0.6 : 1,
                  transition: 'all 0.15s',
                }}
                onMouseOver={(e) => {
                  if (phpOk && !processing) {
                    e.currentTarget.style.background = '#f0f0f0';
                  }
                }}
                onMouseOut={(e) => {
                  if (phpOk && !processing) {
                    e.currentTarget.style.background = '#ffffff';
                  }
                }}
              >
                {processing ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Installing...
                  </span>
                ) : (
                  'Complete Installation'
                )}
              </button>

              {processing && (
                <div style={{ textAlign: 'center', marginTop: '12px', color: '#666666', fontSize: '11px' }}>
                  Setting up your site...
                </div>
              )}

              {/* Back button */}
              <a
                href="/install/mode"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  marginTop: '16px',
                  color: '#666666',
                  fontSize: '12px',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
                onMouseOver={(e) => { e.currentTarget.style.color = '#888888'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = '#666666'; }}
              >
                ← Back
              </a>
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
        button[type="button"]:hover {
          color: #888888 !important;
        }
      `}</style>
    </>
  );
}
