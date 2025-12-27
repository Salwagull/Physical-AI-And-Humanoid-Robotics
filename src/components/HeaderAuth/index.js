/**
 * HeaderAuth Component
 *
 * Proper dropdown login/signup form in the navbar header.
 * Features:
 * - Clean dropdown panel with proper form layout
 * - Toggle between Sign In and Sign Up modes
 * - Welcome message with avatar when logged in
 * - Responsive design for mobile
 */

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@site/src/contexts/AuthContext';
import styles from './styles.module.css';

export default function HeaderAuth() {
  const { user, isAuthenticated, login, signup, logout, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Don't render anything while checking auth status
  if (loading) {
    return (
      <div className={styles.headerAuth}>
        <div className={styles.loadingIndicator}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    );
  }

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
      // Success - reset form and close dropdown
      setEmail('');
      setPassword('');
      setDisplayName('');
      setIsOpen(false);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError('');
    setEmail('');
    setPassword('');
    setDisplayName('');
  };

  const openDropdown = () => {
    setIsOpen(true);
    setError('');
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (user?.display_name) {
      return user.display_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  // Logged in state - show user info
  if (isAuthenticated && user) {
    return (
      <div className={styles.headerAuth} ref={dropdownRef}>
        <button
          className={styles.userButton}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div className={styles.avatar}>
            {user.avatar_url ? (
              <img src={user.avatar_url} alt="" />
            ) : (
              <span>{getInitials()}</span>
            )}
          </div>
          <span className={styles.userName}>
            {user.display_name || user.email.split('@')[0]}
          </span>
          <svg
            className={`${styles.chevron} ${isOpen ? styles.chevronUp : ''}`}
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {isOpen && (
          <div className={styles.dropdown}>
            <div className={styles.dropdownHeader}>
              <div className={styles.avatarLarge}>
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="" />
                ) : (
                  <span>{getInitials()}</span>
                )}
              </div>
              <div className={styles.userInfo}>
                <span className={styles.userNameLarge}>
                  {user.display_name || 'User'}
                </span>
                <span className={styles.userEmail}>{user.email}</span>
              </div>
            </div>
            <div className={styles.dropdownDivider}></div>
            <button onClick={handleLogout} className={styles.logoutButton}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign Out
            </button>
          </div>
        )}
      </div>
    );
  }

  // Logged out state - show sign in button with dropdown form
  return (
    <div className={styles.headerAuth} ref={dropdownRef}>
      <button
        onClick={openDropdown}
        className={styles.signInButton}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Sign In
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {/* Header */}
          <div className={styles.formHeader}>
            <h3>{isSignup ? 'Create Account' : 'Welcome Back'}</h3>
            <p>{isSignup ? 'Sign up to unlock all features' : 'Sign in to your account'}</p>
            <button
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            {isSignup && (
              <div className={styles.inputGroup}>
                <label htmlFor="header-displayName">Name</label>
                <input
                  id="header-displayName"
                  type="text"
                  placeholder="Your name (optional)"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className={styles.input}
                  autoComplete="name"
                />
              </div>
            )}

            <div className={styles.inputGroup}>
              <label htmlFor="header-email">Email</label>
              <input
                id="header-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
                autoComplete="email"
                autoFocus
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="header-password">Password</label>
              <input
                id="header-password"
                type="password"
                placeholder={isSignup ? 'Min. 8 characters' : 'Your password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className={styles.input}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
              />
            </div>

            {error && (
              <div className={styles.errorMessage}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={styles.submitButton}
            >
              {isLoading ? (
                <span className={styles.buttonLoader}>
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              ) : (
                isSignup ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className={styles.formFooter}>
            <span>{isSignup ? 'Already have an account?' : "Don't have an account?"}</span>
            <button type="button" onClick={toggleMode} className={styles.toggleButton}>
              {isSignup ? 'Sign In' : 'Sign Up'}
            </button>
          </div>

          {/* Benefits reminder for signup */}
          {isSignup && (
            <div className={styles.benefitsReminder}>
              <div className={styles.benefitItem}>
                <span>&#10003;</span> Save reading progress
              </div>
              <div className={styles.benefitItem}>
                <span>&#10003;</span> AI study assistant
              </div>
              <div className={styles.benefitItem}>
                <span>&#10003;</span> Personal notes & bookmarks
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
