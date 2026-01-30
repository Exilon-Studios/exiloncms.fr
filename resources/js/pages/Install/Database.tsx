import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { DatabaseConfig } from './types';

interface Props {
  errors?: Record<string, string>;
}

export default function Database({ errors: initialErrors = {} }: Props) {
  const [data, setData] = useState<DatabaseConfig>({
    connection: 'sqlite',
    host: 'localhost',
    port: 3306,
    database: '',
    username: '',
    password: '',
  });
  const [testing, setTesting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>(initialErrors);
  const [testSuccess, setTestSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTesting(true);
    setTestSuccess(false);

    try {
      await router.post(route('install.database.save'), data, {
        onSuccess: () => {
          setTestSuccess(true);
          setTimeout(() => {
            router.visit(route('install.admin'));
          }, 1000);
        },
        onError: (errors) => {
          setErrors(errors as Record<string, string>);
          setTesting(false);
        },
      });
    } catch {
      setTesting(false);
    }
  };

  const isMySQL = data.connection === 'mysql';
  const isPgSQL = data.connection === 'pgsql';
  const isSQLite = data.connection === 'sqlite';

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    background: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '13px',
    boxSizing: 'border-box' as const,
    outline: 'none',
    transition: 'all 0.15s',
  };

  const focusProps = {
    onFocus: (e: any) => {
      e.target.style.borderColor = 'rgba(255,255,255,0.2)';
      e.target.style.background = '#0f0f0f';
    },
    onBlur: (e: any) => {
      e.target.style.borderColor = 'rgba(255,255,255,0.1)';
      e.target.style.background = '#0a0a0a';
    },
  };

  const selectStyle = {
    ...inputStyle,
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat' as const,
    backgroundPosition: 'right 12px center' as const,
    paddingRight: '36px',
  };

  return (
    <>
      <Head title="Database - ExilonCMS" />

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
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
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
            </div>
            <p style={{ color: '#666666', fontSize: '12px', marginTop: '12px' }}>
              Step 1 of 2: Configure database
            </p>

            {/* Database type info */}
            <div style={{ marginTop: '24px' }}>
              <p style={{ color: '#888888', fontSize: '11px', marginBottom: '8px' }}>
                Selected: {isSQLite ? 'SQLite' : isMySQL ? 'MySQL' : 'PostgreSQL'}
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                background: '#111111',
                borderRadius: '6px',
              }}>
                {isSQLite ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                    <ellipse cx="12" cy="5" rx="9" ry="3" />
                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                  </svg>
                )}
                <span style={{ color: '#888888', fontSize: '12px' }}>
                  {isSQLite ? 'No configuration needed' : 'Requires connection details'}
                </span>
              </div>
            </div>
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
              Database Configuration
            </h2>
            <p style={{
              color: '#666666',
              fontSize: '13px',
              margin: '0 0 32px 0',
            }}>
              Connect your database to store site data
            </p>

            {/* Success Alert */}
            {testSuccess && (
              <div style={{
                padding: '12px',
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                borderRadius: '6px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span style={{ color: '#22c55e', fontSize: '12px' }}>
                  Connection successful! Redirecting...
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Database Type */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  color: '#888888',
                  fontSize: '11px',
                  fontWeight: '500',
                  marginBottom: '6px',
                  letterSpacing: '0.3px',
                }}>
                  Database Type
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    id="connection"
                    value={data.connection}
                    onChange={(e) => setData({ ...data, connection: e.target.value as any })}
                    style={selectStyle}
                  >
                    <option value="sqlite">SQLite (Recommended - No config needed)</option>
                    <option value="mysql">MySQL / MariaDB</option>
                    <option value="pgsql">PostgreSQL</option>
                  </select>
                </div>
                <p style={{
                  marginTop: '8px',
                  color: '#666666',
                  fontSize: '11px',
                }}>
                  {isSQLite && 'Uses a local file, no additional configuration needed'}
                  {isMySQL && 'Used by most web hosting providers'}
                  {isPgSQL && 'Performant and robust database'}
                </p>
              </div>

              {/* MySQL/PGSQL Fields */}
              {(isMySQL || isPgSQL) && (
                <>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      color: '#888888',
                      fontSize: '11px',
                      fontWeight: '500',
                      marginBottom: '6px',
                      letterSpacing: '0.3px',
                    }}>
                      Host
                    </label>
                    <input
                      id="host"
                      type="text"
                      value={data.host}
                      onChange={(e) => setData({ ...data, host: e.target.value })}
                      placeholder="localhost"
                      style={inputStyle}
                      {...focusProps}
                    />
                    {errors.host && (
                      <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.host}</p>
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
                      Port
                    </label>
                    <input
                      id="port"
                      type="number"
                      value={data.port}
                      onChange={(e) => setData({ ...data, port: parseInt(e.target.value) || 3306 })}
                      placeholder={isMySQL ? '3306' : '5432'}
                      style={inputStyle}
                      {...focusProps}
                    />
                    {errors.port && (
                      <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.port}</p>
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
                      Database Name
                    </label>
                    <input
                      id="database"
                      type="text"
                      value={data.database}
                      onChange={(e) => setData({ ...data, database: e.target.value })}
                      placeholder="exiloncms"
                      style={inputStyle}
                      {...focusProps}
                    />
                    {errors.database && (
                      <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.database}</p>
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
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={data.username}
                      onChange={(e) => setData({ ...data, username: e.target.value })}
                      placeholder="root"
                      style={inputStyle}
                      {...focusProps}
                    />
                    {errors.username && (
                      <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.username}</p>
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
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={data.password}
                      onChange={(e) => setData({ ...data, password: e.target.value })}
                      placeholder="••••••••"
                      style={inputStyle}
                      {...focusProps}
                    />
                    {errors.password && (
                      <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.password}</p>
                    )}
                  </div>
                </>
              )}

              {/* SQLite Info */}
              {isSQLite && (
                <div style={{
                  padding: '12px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '6px',
                  marginBottom: '24px',
                }}>
                  <p style={{ color: '#3b82f6', fontSize: '12px', margin: 0 }}>
                    <strong>SQLite</strong> will be used. Data will be stored in
                    <code style={{
                      marginLeft: '4px',
                      padding: '2px 6px',
                      background: 'rgba(59, 130, 246, 0.2)',
                      borderRadius: '3px',
                      fontSize: '11px',
                    }}>
                      database/database.sqlite
                    </code>
                  </p>
                </div>
              )}

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  disabled={testing}
                  style={{
                    flex: '1',
                    padding: '12px',
                    background: testing ? '#1a1a1a' : '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    color: testing ? '#666666' : '#000000',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: testing ? 'not-allowed' : 'pointer',
                    opacity: testing ? 0.5 : 1,
                    transition: 'all 0.15s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                  onMouseOver={(e) => {
                    if (!testing) {
                      e.currentTarget.style.background = '#f0f0f0';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!testing) {
                      e.currentTarget.style.background = '#ffffff';
                    }
                  }}
                >
                  {testing ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Testing...
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
