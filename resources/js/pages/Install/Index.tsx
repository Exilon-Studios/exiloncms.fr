import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/Install/Toast';

interface Props {
    phpVersion: string;
    minPhpVersion: string;
}

export default function InstallIndex({ phpVersion, minPhpVersion }: Props) {
    const { toasts, error, remove } = useToast();

    const { data, setData, get, processing } = useForm({
        app_url: window.location.origin,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log('[Install/Index] Navigating to plugins step...');

        // Store app_url in sessionStorage and go to plugins step
        sessionStorage.setItem('install_app_url', data.app_url);

        try {
            let targetUrl: string;
            if (typeof (window as any).route === 'function') {
                targetUrl = (window as any).route('install.plugins');
                console.log('[Install/Index] Route URL from ziggy:', targetUrl);
            } else {
                targetUrl = '/install/plugins';
                console.log('[Install/Index] Using fallback URL:', targetUrl);
            }
            get(targetUrl as any);
        } catch (err) {
            console.error('[Install/Index] Navigation failed:', err);
            error('Navigation failed. Please try refreshing the page.');
        }
    };

    const phpOk = phpVersion >= minPhpVersion;

    return (
        <>
            <Head title="Installation - ExilonCMS" />
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
                            Step 1 of 3: Configuration
                        </p>
                    </div>
                </div>

                {/* Right side - form */}
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
                            margin: '0 0 6px 0',
                            letterSpacing: '-0.5px',
                        }}>
                            Installation
                        </h2>
                        <p style={{
                            color: '#666666',
                            fontSize: '13px',
                            margin: '0 0 32px 0',
                        }}>
                            Let's get started with your site
                        </p>

                        {/* PHP Status */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '10px 12px',
                            borderRadius: '6px',
                            marginBottom: '24px',
                            background: phpOk ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                            border: '1px solid ' + (phpOk ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)'),
                        }}>
                            {phpOk ? (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.5" style={{ marginRight: '8px' }}>
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" style={{ marginRight: '8px' }}>
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="15" y1="9" x2="9" y2="15" />
                                    <line x1="9" y1="9" x2="15" y2="15" />
                                </svg>
                            )}
                            <span style={{ color: phpOk ? '#22c55e' : '#ef4444', fontSize: '12px', fontWeight: '500' }}>
                                PHP {phpVersion} {phpOk ? 'compatible' : `requires ${minPhpVersion}+`}
                            </span>
                        </div>

                        <form onSubmit={submit}>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{
                                    display: 'block',
                                    color: '#888888',
                                    fontSize: '11px',
                                    fontWeight: '500',
                                    marginBottom: '6px',
                                    letterSpacing: '0.3px',
                                }}>
                                    Site URL
                                </label>
                                <input
                                    type="url"
                                    value={data.app_url}
                                    onChange={e => setData('app_url', e.target.value)}
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
                                    placeholder="https://yourdomain.com"
                                />
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
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
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
                                Continue
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14" />
                                    <path d="M12 5l7 7-7 7" />
                                </svg>
                            </button>
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
