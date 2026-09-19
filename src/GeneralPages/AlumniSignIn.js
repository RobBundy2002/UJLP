import React, { useMemo, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import ParticleBackground from '../Components/ParticleBackground';
import {
    getAlumniBackendMode,
    getStoredAlumniSession,
    signInAlumni,
    signUpAlumni
} from '../Services/alumniApi';
import '../Styling/AlumniDirectory.css';
import '../Styling/EditorialPages.css';

function AlumniSignIn() {
    const location = useLocation();
    const navigate = useNavigate();
    const [session, setSession] = useState(() => getStoredAlumniSession());
    const [authMode, setAuthMode] = useState('signin');
    const [authForm, setAuthForm] = useState({ email: '', password: '' });
    const [showAuthPassword, setShowAuthPassword] = useState(false);
    const [authMessage, setAuthMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const backendMode = getAlumniBackendMode();

    const redirectTo = useMemo(() => {
        const requested = location.state?.from;
        if (typeof requested === 'string' && requested && requested !== '/alumni/signin') {
            return requested;
        }
        return '/alumni/profile';
    }, [location.state]);

    const handleAuthSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setAuthMessage('');
        try {
            const action = authMode === 'signin' ? signInAlumni : signUpAlumni;
            const result = await action(authForm);
            if (result.needsEmailConfirmation) {
                setAuthMessage('Check your inbox to confirm the account before signing in.');
                return;
            }

            setSession(result.session);
            setAuthForm({ email: '', password: '' });
            navigate(redirectTo, { replace: true });
        } catch (error) {
            setAuthMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (session) {
        return <Navigate to={redirectTo} replace />;
    }

    return (
        <div className="alumni-directory alumni-directory-page alumni-signin-page jh-page fade-in">
            <section className="alumni-hero">
                <ParticleBackground />
                <div className="section-content alumni-hero-grid">
                    <div className="alumni-hero-copy">
                        <p className="jh-eyebrow"><strong>UJLP</strong> / Member Access</p>
                        <h1>Member<br /><em>Sign in.</em></h1>
                        <p>
                            Sign in or create an account before opening the alumni network and profile manager.
                        </p>
                    </div>
                    <div className="alumni-hero-panel">
                        <span>Private access</span>
                        <strong>Profiles stay separate from the directory view</strong>
                        <p>After sign in, you can manage your profile or continue into the network.</p>
                    </div>
                </div>
            </section>

            <section className="alumni-auth-section">
                <div className="section-content alumni-auth-layout">
                    <div className="alumni-auth-copy">
                        <p className="jh-section-label">Account access</p>
                        <h2>Open your member workspace</h2>
                        <div className="alumni-lock-list">
                            <span>Verified accounts</span>
                            <span>Profile manager</span>
                            <span>Alumni network</span>
                            <span>Contact preferences</span>
                        </div>
                    </div>
                    <form className="alumni-auth-panel" onSubmit={handleAuthSubmit}>
                        <div className="alumni-auth-tabs" aria-label="Authentication mode">
                            <button type="button" className={authMode === 'signin' ? 'active' : ''} onClick={() => setAuthMode('signin')}>Sign in</button>
                            <button type="button" className={authMode === 'signup' ? 'active' : ''} onClick={() => setAuthMode('signup')}>Create account</button>
                        </div>
                        <label>
                            <span>Email</span>
                            <input
                                type="email"
                                value={authForm.email}
                                onChange={(event) => setAuthForm(current => ({ ...current, email: event.target.value }))}
                                required
                            />
                        </label>
                        <label>
                            <span>Password</span>
                            <div className="alumni-password-field">
                                <input
                                    type={showAuthPassword ? 'text' : 'password'}
                                    value={authForm.password}
                                    onChange={(event) => setAuthForm(current => ({ ...current, password: event.target.value }))}
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowAuthPassword(current => !current)}
                                    aria-label={showAuthPassword ? 'Hide password' : 'Show password'}
                                >
                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                        {showAuthPassword ? (
                                            <path d="M4 4l16 16M10.6 10.6a2 2 0 0 0 2.8 2.8M8.3 5.9A10.7 10.7 0 0 1 12 5c5 0 8.5 4.5 9.5 7a13.3 13.3 0 0 1-3 4.2M6.1 7.8A13.2 13.2 0 0 0 2.5 12c1 2.5 4.5 7 9.5 7 1.4 0 2.7-.35 3.8-.95" />
                                        ) : (
                                            <path d="M2.5 12c1-2.5 4.5-7 9.5-7s8.5 4.5 9.5 7c-1 2.5-4.5 7-9.5 7S3.5 14.5 2.5 12Zm9.5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                        )}
                                    </svg>
                                </button>
                            </div>
                        </label>
                        <button type="submit" className="alumni-primary-action" disabled={loading}>
                            {loading ? 'Working...' : authMode === 'signin' ? 'Sign in' : 'Create account'}
                        </button>
                        {backendMode === 'preview' && (
                            <p className="alumni-system-note">Preview mode is local to this browser. Supabase env vars switch this to real Postgres/Auth.</p>
                        )}
                        {authMessage && <p className="alumni-form-message">{authMessage}</p>}
                    </form>
                </div>
            </section>
        </div>
    );
}

export default AlumniSignIn;
