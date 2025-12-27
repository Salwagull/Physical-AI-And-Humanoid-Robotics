/**
 * OAuth Callback Page
 *
 * Handles OAuth redirects from Google/GitHub.
 * Extracts tokens from URL and stores them in localStorage.
 */

import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from '@docusaurus/router';
import Layout from '@theme/Layout';
import { useAuth } from '@site/src/contexts/AuthContext';
import styles from './callback.module.css';

export default function AuthCallback() {
  const location = useLocation();
  const history = useHistory();
  const { handleOAuthCallback } = useAuth();
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);

  useEffect(() => {
    const processCallback = async () => {
      const params = new URLSearchParams(location.search);
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const errorMsg = params.get('error');

      if (errorMsg) {
        setError(errorMsg);
        setStatus('error');
        return;
      }

      if (accessToken && refreshToken) {
        // Store tokens and update auth context
        const success = handleOAuthCallback(accessToken, refreshToken);

        if (success) {
          setStatus('success');

          // Redirect to intended destination after a short delay
          const redirect = sessionStorage.getItem('redirectAfterLogin') || '/';
          sessionStorage.removeItem('redirectAfterLogin');

          setTimeout(() => {
            // Use window.location for full page refresh to reinitialize auth
            window.location.href = redirect;
          }, 1000);
        } else {
          setError('Failed to process authentication');
          setStatus('error');
        }
      } else {
        setError('Invalid authentication response');
        setStatus('error');
      }
    };

    processCallback();
  }, [location.search, handleOAuthCallback, history]);

  return (
    <Layout title="Authentication">
      <div className={styles.container}>
        <div className={styles.card}>
          {status === 'processing' && (
            <>
              <div className={styles.spinner}></div>
              <h2>Authenticating...</h2>
              <p>Please wait while we complete your sign-in.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className={styles.successIcon}>
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#10b981" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h2>Success!</h2>
              <p>Redirecting you to the application...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className={styles.errorIcon}>
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#ef4444" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h2>Authentication Failed</h2>
              <p className={styles.errorMessage}>{error}</p>
              <a href="/" className={styles.retryButton}>
                Try Again
              </a>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
