/**
 * LoginPage Component
 *
 * Full-page login/signup form with:
 * - Email/password authentication
 * - OAuth buttons (Google, GitHub) - only shown if enabled on backend
 * - Toggle between login and signup modes
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@site/src/contexts/AuthContext';
import { useHistory } from '@docusaurus/router';
import styles from './styles.module.css';

// Backend API URL
const API_BASE_URL = 'http://127.0.0.1:8000';

// SVG Icons
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [providers, setProviders] = useState({ google: false, github: false });

  const { login, signup, loginWithGoogle, loginWithGithub } = useAuth();
  const history = useHistory();

  // Fetch available auth providers on mount
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/providers`);
        if (response.ok) {
          const data = await response.json();
          setProviders({ google: data.google, github: data.github });
        }
      } catch (err) {
        // Backend not reachable - OAuth buttons stay hidden
        console.warn('Could not fetch auth providers:', err.message);
      }
    };
    fetchProviders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignup) {
        await signup(email, password, displayName || undefined);
      } else {
        await login(email, password);
      }

      // Redirect to intended destination or home
      const redirect = sessionStorage.getItem('redirectAfterLogin') || '/';
      sessionStorage.removeItem('redirectAfterLogin');
      history.push(redirect);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logo}>
            <img src="/img/logo.svg" alt="Logo" />
          </div>
          <h1>{isSignup ? 'Create Account' : 'Welcome Back'}</h1>
          <p>Sign in to access Physical AI & Humanoid Robotics</p>
        </div>

        {/* OAuth Buttons - only shown if providers are enabled */}
        {(providers.google || providers.github) && (
          <>
            <div className={styles.oauthButtons}>
              {providers.google && (
                <button
                  type="button"
                  onClick={loginWithGoogle}
                  className={styles.oauthButton}
                >
                  <GoogleIcon />
                  <span>Continue with Google</span>
                </button>
              )}
              {providers.github && (
                <button
                  type="button"
                  onClick={loginWithGithub}
                  className={styles.oauthButton}
                >
                  <GithubIcon />
                  <span>Continue with GitHub</span>
                </button>
              )}
            </div>

            {/* Divider - only show if OAuth is available */}
            <div className={styles.divider}>
              <span>or</span>
            </div>
          </>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {isSignup && (
            <div className={styles.inputGroup}>
              <label htmlFor="displayName">Display Name (optional)</label>
              <input
                id="displayName"
                type="text"
                placeholder="John Doe"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className={styles.input}
                autoComplete="name"
              />
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              autoComplete="email"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder={isSignup ? 'Minimum 8 characters' : 'Enter your password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className={styles.input}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
            />
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? 'Loading...' : (isSignup ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        {/* Toggle Login/Signup */}
        <p className={styles.toggleMode}>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setError('');
            }}
          >
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}
