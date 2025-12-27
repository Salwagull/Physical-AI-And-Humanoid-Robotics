/**
 * AuthGuard Component
 *
 * Protects routes by checking authentication state.
 * Redirects unauthenticated users to the login page.
 */

import React from 'react';
import { useAuth } from '@site/src/contexts/AuthContext';
import { useLocation } from '@docusaurus/router';
import LoginPage from '@site/src/components/LoginPage';
import styles from './styles.module.css';

// Pages that don't require authentication
const PUBLIC_PATHS = ['/login', '/signup', '/auth/callback'];

export default function AuthGuard({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Check if current path is public
  const isPublicPath = PUBLIC_PATHS.some(path =>
    location.pathname.startsWith(path) ||
    location.pathname.endsWith(path)
  );

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Loading...</p>
      </div>
    );
  }

  // Allow public paths without authentication
  if (isPublicPath) {
    return children;
  }

  // Require authentication for all other paths
  if (!isAuthenticated) {
    // Store intended destination for redirect after login
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('redirectAfterLogin', location.pathname);
    }
    return <LoginPage />;
  }

  return children;
}
