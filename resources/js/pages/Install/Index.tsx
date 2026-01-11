import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';

interface Props {
    phpVersion: string;
    minPhpVersion: string;
}

export default function InstallIndex({ phpVersion, minPhpVersion }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: 'Admin',
        email: 'admin@example.com',
        password: '',
        password_confirmation: '',
        app_url: window.location.origin,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('install.submit'));
    };

    const phpOk = phpVersion >= minPhpVersion;

    return (
        <>
            <Head title="Installation" />
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '20px'
            }}>
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    maxWidth: '500px',
                    width: '100%',
                    padding: '40px'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>🚀 ExilonCMS</h1>
                        <p style={{ color: '#666' }}>Complete your installation</p>
                    </div>

                    {/* PHP Version Check */}
                    <div style={{
                        padding: '15px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        background: phpOk ? '#d4edda' : '#f8d7da',
                        color: phpOk ? '#155724' : '#721c24'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontSize: '20px', marginRight: '10px' }}>
                                {phpOk ? '✅' : '❌'}
                            </span>
                            <div>
                                <strong>PHP {phpVersion}</strong>
                                {!phpOk && <span style={{ marginLeft: '10px' }}>(requires {minPhpVersion}+)</span>}
                            </div>
                        </div>
                    </div>

                    <form onSubmit={submit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                fontWeight: '600',
                                marginBottom: '8px',
                                fontSize: '14px'
                            }}>
                                Site URL
                            </label>
                            <input
                                type="url"
                                value={data.app_url}
                                onChange={e => setData('app_url', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                                placeholder="https://example.com"
                            />
                            {errors.app_url && <div style={{ color: '#c33', marginTop: '5px', fontSize: '13px' }}>{errors.app_url}</div>}
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                fontWeight: '600',
                                marginBottom: '8px',
                                fontSize: '14px'
                            }}>
                                Admin Name
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                                placeholder="Admin"
                            />
                            {errors.name && <div style={{ color: '#c33', marginTop: '5px', fontSize: '13px' }}>{errors.name}</div>}
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                fontWeight: '600',
                                marginBottom: '8px',
                                fontSize: '14px'
                            }}>
                                Admin Email
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                                placeholder="admin@example.com"
                            />
                            {errors.email && <div style={{ color: '#c33', marginTop: '5px', fontSize: '13px' }}>{errors.email}</div>}
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                fontWeight: '600',
                                marginBottom: '8px',
                                fontSize: '14px'
                            }}>
                                Admin Password
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                                placeholder="••••••••"
                            />
                            {errors.password && <div style={{ color: '#c33', marginTop: '5px', fontSize: '13px' }}>{errors.password}</div>}
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <label style={{
                                display: 'block',
                                fontWeight: '600',
                                marginBottom: '8px',
                                fontSize: '14px'
                            }}>
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={e => setData('password_confirmation', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing || !phpOk}
                            style={{
                                width: '100%',
                                padding: '15px',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: phpOk ? 'pointer' : 'not-allowed',
                                background: phpOk ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#ccc',
                                color: 'white',
                                opacity: processing ? 0.5 : 1,
                                transition: 'transform 0.2s'
                            }}
                            onMouseOver={(e) => {
                                if (phpOk && !processing) {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            {processing ? 'Installing...' : 'Complete Installation'}
                        </button>

                        {processing && (
                            <div style={{ textAlign: 'center', marginTop: '20px', color: '#666', fontSize: '14px' }}>
                                This may take a minute...
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
}
