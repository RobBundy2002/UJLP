import React, { useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import ParticleBackground from '../Components/ParticleBackground';
import { getStoredAlumniSession, signInAlumni } from '../Services/alumniApi';
import '../Styling/AlumniDirectory.css';
import '../Styling/EditorialPages.css';

function AlumniEmailConfirmed() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [session, setSession] = useState(() => getStoredAlumniSession());
    const [authForm, setAuthForm] = useState({
        email: searchParams.get('email') || '',
        password: ''
    });
    const [showAuthPassword, setShowAuthPassword] = useState(true);
    const [authMessage, setAuthMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAuthSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setAuthMessage('');

        try {
            const result = await signInAlumni(authForm);
            setSession(result.session);
            setAuthForm({ email: '', password: '' });
            navigate('/alumni/profile', { replace: true });
        } catch (error) {
            setAuthMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (session) {
        return <Navigate to="/alumni/profile" replace />;
    }

    return (
        <div className="alumni-directory alumni-directory-page alumni-signin-page jh-page fade-in">
            <section className="alumni-hero">
                <ParticleBackground />
                <div className="section-content alumni-hero-grid">
                    <div className="alumni-hero-copy">
                        <p className="jh-eyebrow"><strong>UJLP</strong> / Account Confirmed</p>
                        <h1>Success!<br /><em>Email confirmed.</em></h1>
                        <p>
                            Use your email and password to sign in to your new account.
                        </p>
                    </div>
                    <div className="alumni-hero-panel">
                        <span>Account ready</span>
                        <strong>Sign in to finish setup</strong>
                        <p>After sign in, you can create or update your member profile.</p>
                    </div>
                </div>
            </section>

            <section className="alumni-auth-section">
                <div className="section-content alumni-auth-layout alumni-confirmed-auth-layout">
                    <div className="alumni-auth-copy">
                        <p className="jh-section-label">Confirmed</p>
                        <h2>Your account is ready.</h2>
                        <p>Enter the same email and password you used when creating the account.</p>
                    </div>
                    <form className="alumni-auth-panel" onSubmit={handleAuthSubmit}>
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
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                        {authMessage && <p className="alumni-form-message">{authMessage}</p>}
                    </form>
                </div>
            </section>
        </div>
    );
}

export default AlumniEmailConfirmed;
