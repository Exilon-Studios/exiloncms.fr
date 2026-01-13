import { Head, useForm } from '@inertiajs/react';
import { useState, FormEvent } from 'react';

interface DemoLoginButtonsProps {
  siteName: string;
  siteDescription: string;
}

export function DemoLoginButtons({ siteName, siteDescription }: DemoLoginButtonsProps) {
  const [isLoading, setIsLoading] = useState<'admin' | 'player' | null>(null);

  const loginAsAdmin = () => {
    setIsLoading('admin');
    // Create a form and submit it to log in as demo admin
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/login';

    const emailInput = document.createElement('input');
    emailInput.type = 'hidden';
    emailInput.name = 'email';
    emailInput.value = 'admin@demo.local';

    const passwordInput = document.createElement('input');
    passwordInput.type = 'hidden';
    passwordInput.name = 'password';
    passwordInput.value = 'demo123';

    form.appendChild(emailInput);
    form.appendChild(passwordInput);
    document.body.appendChild(form);
    form.submit();
  };

  const loginAsPlayer = () => {
    setIsLoading('player');
    // Create a form and submit it to log in as demo player
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/login';

    const emailInput = document.createElement('input');
    emailInput.type = 'hidden';
    emailInput.name = 'email';
    emailInput.value = 'player@demo.local';

    const passwordInput = document.createElement('input');
    passwordInput.type = 'hidden';
    passwordInput.name = 'password';
    passwordInput.value = 'demo123';

    form.appendChild(emailInput);
    form.appendChild(passwordInput);
    document.body.appendChild(form);
    form.submit();
  };

  return (
    <>
      <Head title="Demo Login - ExilonCMS" />

      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          margin: '0 auto',
          padding: '40px',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Logo/Icon */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 20px',
              background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.7) 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(var(--primary-rgb), 0.3)',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: '700',
              color: 'hsl(var(--foreground))',
              margin: '0 0 12px 0',
              letterSpacing: '-0.5px',
            }}
          >
            {siteName}
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: 'hsl(var(--muted-foreground))',
              margin: 0,
            }}
          >
            {siteDescription}
          </p>
        </div>

        {/* Demo Mode Badge */}
        <div
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '32px',
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>Demo Mode</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px', margin: 0 }}>
            Quick login to explore {siteName}
          </p>
        </div>

        {/* Login Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Admin Login Button */}
          <button
            type="button"
            onClick={loginAsAdmin}
            disabled={isLoading !== null}
            style={{
              width: '100%',
              padding: '18px 24px',
              background: isLoading === 'admin'
                ? 'hsl(var(--muted))'
                : 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 100%)',
              border: 'none',
              borderRadius: '14px',
              color: isLoading === 'admin' ? 'hsl(var(--muted-foreground))' : 'white',
              fontSize: '15px',
              fontWeight: '600',
              cursor: isLoading === null ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              boxShadow: isLoading === null
                ? '0 4px 20px rgba(var(--primary-rgb), 0.3)'
                : 'none',
              opacity: isLoading === 'admin' ? 0.7 : 1,
            }}
            onMouseOver={(e) => {
              if (isLoading === null) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 30px rgba(var(--primary-rgb), 0.4)';
              }
            }}
            onMouseOut={(e) => {
              if (isLoading === null) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(var(--primary-rgb), 0.3)';
              }
            }}
          >
            {isLoading === 'admin' ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Logging in as Admin...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Login as Admin
              </>
            )}
          </button>

          {/* Player Login Button */}
          <button
            type="button"
            onClick={loginAsPlayer}
            disabled={isLoading !== null}
            style={{
              width: '100%',
              padding: '18px 24px',
              background: isLoading === 'player'
                ? 'hsl(var(--muted))'
                : 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '14px',
              color: 'hsl(var(--foreground))',
              fontSize: '15px',
              fontWeight: '600',
              cursor: isLoading === null ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              opacity: isLoading === 'player' ? 0.7 : 1,
            }}
            onMouseOver={(e) => {
              if (isLoading === null) {
                e.currentTarget.style.background = 'hsl(var(--accent))';
                e.currentTarget.style.borderColor = 'hsl(var(--accent) / 0.3)';
              }
            }}
            onMouseOut={(e) => {
              if (isLoading === null) {
                e.currentTarget.style.background = 'hsl(var(--card))';
                e.currentTarget.style.borderColor = 'hsl(var(--border))';
              }
            }}
          >
            {isLoading === 'player' ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Logging in as Player...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Login as Player
              </>
            )}
          </button>
        </div>

        {/* Info Box */}
        <div
          style={{
            marginTop: '32px',
            padding: '16px',
            background: 'hsl(var(--muted) / 0.5)',
            borderRadius: '12px',
            border: '1px solid hsl(var(--border))',
          }}
        >
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            <div>
              <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '12px', margin: '0 0 8px 0', fontWeight: '500' }}>
                Demo Account Credentials
              </p>
              <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '11px', margin: 0 }}>
                Admin: <span style={{ fontFamily: 'monospace' }}>admin@demo.local</span> / <span style={{ fontFamily: 'monospace' }}>demo123</span>
              </p>
              <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '11px', margin: '4px 0 0 0' }}>
                Player: <span style={{ fontFamily: 'monospace' }}>player@demo.local</span> / <span style={{ fontFamily: 'monospace' }}>demo123</span>
              </p>
            </div>
          </div>
        </div>

        {/* Demo Mode Notice */}
        <p
          style={{
            marginTop: '24px',
            textAlign: 'center',
            fontSize: '11px',
            color: 'hsl(var(--muted-foreground))',
            margin: '24px 0 0 0',
          }}
        >
          This is a demo installation. Registration is disabled in demo mode.
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
