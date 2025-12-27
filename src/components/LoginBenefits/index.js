/**
 * LoginBenefits Component
 *
 * Shows the benefits of creating an account.
 * Displayed as a subtle banner or sidebar widget for non-logged-in users.
 * Encourages signup without blocking content access.
 */

import React, { useState } from 'react';
import { useAuth } from '@site/src/contexts/AuthContext';
import styles from './styles.module.css';

// Benefit items with icons
const BENEFITS = [
  {
    icon: '📚',
    title: 'Save Reading Progress',
    description: 'Pick up where you left off on any device',
  },
  {
    icon: '📝',
    title: 'Personal Notes',
    description: 'Add highlights and notes to any chapter',
  },
  {
    icon: '💬',
    title: 'AI Study Assistant',
    description: 'Ask questions and get instant answers',
  },
  {
    icon: '🔖',
    title: 'Bookmarks',
    description: 'Save important sections for quick access',
  },
];

export default function LoginBenefits() {
  const { isAuthenticated } = useAuth();
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show if user is logged in or has dismissed
  if (isAuthenticated || isDismissed) {
    return null;
  }

  // Check if dismissed in this session
  if (typeof window !== 'undefined' && sessionStorage.getItem('benefitsDismissed')) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('benefitsDismissed', 'true');
    }
  };

  return (
    <div className={styles.benefitsContainer}>
      <button
        className={styles.dismissButton}
        onClick={handleDismiss}
        aria-label="Dismiss"
      >
        &times;
      </button>

      <div className={styles.header}>
        <h3 className={styles.title}>Create a Free Account</h3>
        <p className={styles.subtitle}>Unlock these features while reading:</p>
      </div>

      <div className={styles.benefitsList}>
        {BENEFITS.map((benefit, index) => (
          <div key={index} className={styles.benefitItem}>
            <span className={styles.benefitIcon}>{benefit.icon}</span>
            <div className={styles.benefitContent}>
              <strong className={styles.benefitTitle}>{benefit.title}</strong>
              <span className={styles.benefitDescription}>{benefit.description}</span>
            </div>
          </div>
        ))}
      </div>

      <p className={styles.freeNote}>
        100% free - No credit card required
      </p>
    </div>
  );
}

/**
 * Inline version for embedding in page content
 */
export function LoginBenefitsInline() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.inlineBenefits}>
      <div className={styles.inlineContent}>
        <span className={styles.inlineIcon}>✨</span>
        <span className={styles.inlineText}>
          <strong>Free account</strong> unlocks notes, bookmarks, and AI assistant
        </span>
        <a href="#" className={styles.inlineLink} onClick={(e) => {
          e.preventDefault();
          // Trigger header form
          document.querySelector('[class*="signInToggle"]')?.click();
        }}>
          Sign up free
        </a>
      </div>
    </div>
  );
}
