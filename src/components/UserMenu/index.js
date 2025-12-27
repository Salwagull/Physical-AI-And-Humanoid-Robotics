/**
 * UserMenu Component
 *
 * Navbar dropdown showing user info and logout button.
 * Displays user avatar/initial and name when logged in.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@site/src/contexts/AuthContext';
import styles from './styles.module.css';

export default function UserMenu() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    // Page will re-render and show login
  };

  // Get initials for avatar placeholder
  const getInitials = () => {
    if (user?.display_name) {
      return user.display_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  return (
    <div className={styles.userMenu} ref={menuRef}>
      <button
        className={styles.avatarButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={user?.display_name || user?.email}
      >
        {user?.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.display_name || 'User avatar'}
            className={styles.avatar}
          />
        ) : (
          <div className={styles.avatarPlaceholder}>
            {getInitials()}
          </div>
        )}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>
              {user?.display_name || 'User'}
            </span>
            <span className={styles.userEmail}>
              {user?.email}
            </span>
            {user?.oauth_provider && (
              <span className={styles.authBadge}>
                via {user.oauth_provider}
              </span>
            )}
          </div>

          <div className={styles.divider} />

          <button
            onClick={handleLogout}
            className={styles.logoutButton}
          >
            <LogoutIcon />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}

// Logout icon component
function LogoutIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
