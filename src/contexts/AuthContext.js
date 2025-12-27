/**
 * Authentication Context for the Docusaurus site.
 *
 * Provides global authentication state and methods for:
 * - Login/signup with email and password
 * - OAuth login (Google, GitHub)
 * - Token management (access + refresh)
 * - User session persistence
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

// API base URL - backend server
// In production: uses REACT_APP_API_URL from Docusaurus customFields
// In development: falls back to localhost
const API_BASE_URL = (() => {
  // Server-side rendering check
  if (typeof window === 'undefined') {
    return 'http://127.0.0.1:8000';
  }
  // Check for Docusaurus siteConfig (set in docusaurus.config.js)
  if (typeof window !== 'undefined' && window.__DOCUSAURUS__?.siteConfig?.customFields?.apiUrl) {
    return window.__DOCUSAURUS__.siteConfig.customFields.apiUrl;
  }
  // Fallback to localhost for development
  return 'http://127.0.0.1:8000';
})();

/**
 * Helper function to make API requests with proper error handling.
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    return response;
  } catch (error) {
    // Network error - backend might not be running
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running on port 8000.');
    }
    throw error;
  }
}

// Create context
const AuthContext = createContext(null);

/**
 * Check if a JWT token is expired.
 */
function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token);
    // Token exp is in seconds, Date.now() is in milliseconds
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

/**
 * AuthProvider component - wraps the app to provide auth state.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  /**
   * Refresh the access token using the refresh token.
   */
  const refreshAccessToken = useCallback(async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return null;

    try {
      const response = await apiRequest('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Refresh failed');
      }

      const data = await response.json();
      localStorage.setItem('accessToken', data.access_token);
      localStorage.setItem('refreshToken', data.refresh_token);
      setAccessToken(data.access_token);
      return data.access_token;
    } catch (error) {
      // Refresh failed - clear tokens and force re-login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setAccessToken(null);
      setUser(null);
      return null;
    }
  }, []);

  /**
   * Fetch user profile from the API.
   */
  const fetchUser = useCallback(async (token) => {
    try {
      const response = await apiRequest('/auth/me', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        return userData;
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
    return null;
  }, []);

  /**
   * Initialize auth state on mount.
   */
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');

      if (token && !isTokenExpired(token)) {
        setAccessToken(token);
        await fetchUser(token);
      } else if (localStorage.getItem('refreshToken')) {
        // Try to refresh the token
        const newToken = await refreshAccessToken();
        if (newToken) {
          await fetchUser(newToken);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [fetchUser, refreshAccessToken]);

  /**
   * Login with email and password.
   */
  const login = async (email, password) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('accessToken', data.access_token);
    localStorage.setItem('refreshToken', data.refresh_token);
    setAccessToken(data.access_token);
    await fetchUser(data.access_token);
    return data;
  };

  /**
   * Sign up with email and password.
   */
  const signup = async (email, password, displayName) => {
    const response = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, display_name: displayName }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Signup failed');
    }

    const data = await response.json();
    localStorage.setItem('accessToken', data.access_token);
    localStorage.setItem('refreshToken', data.refresh_token);
    setAccessToken(data.access_token);
    await fetchUser(data.access_token);
    return data;
  };

  /**
   * Logout the current user.
   */
  const logout = async () => {
    try {
      if (accessToken) {
        await apiRequest('/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }
    } catch (error) {
      // Ignore logout errors - we'll clear local state anyway
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAccessToken(null);
    setUser(null);
  };

  /**
   * Get a valid access token, refreshing if necessary.
   */
  const getValidToken = async () => {
    if (accessToken && !isTokenExpired(accessToken)) {
      return accessToken;
    }
    return refreshAccessToken();
  };

  /**
   * Initiate Google OAuth login.
   */
  const loginWithGoogle = () => {
    // Store current path for redirect after auth
    sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  /**
   * Initiate GitHub OAuth login.
   */
  const loginWithGithub = () => {
    // Store current path for redirect after auth
    sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
    window.location.href = `${API_BASE_URL}/auth/github`;
  };

  /**
   * Handle OAuth callback - process tokens from URL params.
   */
  const handleOAuthCallback = (accessToken, refreshToken) => {
    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setAccessToken(accessToken);
      fetchUser(accessToken);
      return true;
    }
    return false;
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    loginWithGoogle,
    loginWithGithub,
    handleOAuthCallback,
    getValidToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
