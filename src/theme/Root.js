import React from 'react';
import { AuthProvider } from '@site/src/contexts/AuthContext';
import ChatWidget from '@site/src/components/ChatWidget';
import HeaderAuth from '@site/src/components/HeaderAuth';
import LoginBenefits from '@site/src/components/LoginBenefits';

/**
 * Root component that wraps the entire Docusaurus app.
 *
 * Key behaviors:
 * - Book content is ALWAYS public (no blocking)
 * - Auth context provided for optional login
 * - HeaderAuth adds login form to navbar
 * - LoginBenefits shows signup incentives for guests
 * - ChatWidget available to all (prompts login when used)
 *
 * See: https://docusaurus.io/docs/swizzling#wrapper-your-site-with-root
 */
export default function Root({ children }) {
  return (
    <AuthProvider>
      {/* Main content - always rendered, never blocked */}
      {children}

      {/* Header auth form injected into navbar */}
      <HeaderAuthPortal />

      {/* Chat widget - works for all users, prompts signup for guests */}
      <ChatWidget />

      {/* Benefits popup - only shown to non-logged-in users */}
      <LoginBenefits />
    </AuthProvider>
  );
}

/**
 * Portal component to inject HeaderAuth into the navbar.
 * Uses DOM manipulation to place the auth form in the right position.
 */
function HeaderAuthPortal() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);

    // Create container for header auth in navbar
    const injectHeaderAuth = () => {
      const navbar = document.querySelector('.navbar__items--right');
      if (navbar && !document.getElementById('header-auth-container')) {
        const container = document.createElement('div');
        container.id = 'header-auth-container';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        navbar.appendChild(container);
      }
    };

    // Inject after a short delay to ensure navbar is rendered
    const timer = setTimeout(injectHeaderAuth, 100);

    // Also try on DOM changes (for client-side navigation)
    const observer = new MutationObserver(injectHeaderAuth);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  if (!mounted) return null;

  // Render HeaderAuth into the portal container
  const container = document.getElementById('header-auth-container');
  if (container) {
    return require('react-dom').createPortal(<HeaderAuth />, container);
  }

  // Fallback: render in a fixed position if portal fails
  return (
    <div style={{
      position: 'fixed',
      top: '0.75rem',
      right: '1rem',
      zIndex: 1000,
    }}>
      <HeaderAuth />
    </div>
  );
}
