import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@site/src/contexts/AuthContext';
import styles from './styles.module.css';

// Backend API URL - configurable for production
// In production: uses apiUrl from Docusaurus customFields
// In development: falls back to localhost
const API_BASE_URL = (() => {
  if (typeof window === 'undefined') {
    return 'http://127.0.0.1:8000';
  }
  if (window.__DOCUSAURUS__?.siteConfig?.customFields?.apiUrl) {
    return window.__DOCUSAURUS__.siteConfig.customFields.apiUrl;
  }
  return 'http://127.0.0.1:8000';
})();

async function askQuestion(query, token) {
  const headers = {
    'Content-Type': 'application/json',
  };

  // Add authorization header if token is available
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/ask`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, top_k: 5 }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Please sign in to use the chat assistant.');
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Request failed with status ${response.status}`);
  }

  return response.json();
}

// Example questions to show non-logged-in users
const EXAMPLE_QUESTIONS = [
  "What is ROS 2?",
  "How does Gazebo simulation work?",
  "Explain VLA systems",
];

export default function ChatWidget() {
  const { isAuthenticated, getValidToken } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Set initial message based on auth state
  useEffect(() => {
    if (isAuthenticated) {
      setMessages([{
        type: 'assistant',
        content: 'Hello! I\'m your study assistant for Physical AI & Humanoid Robotics. Ask me anything about the textbook!',
      }]);
    } else {
      setMessages([{
        type: 'assistant',
        content: 'Hi! I\'m your AI study assistant. Sign in for free to ask me questions about the textbook.',
      }]);
    }
  }, [isAuthenticated]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // For non-authenticated users, prompt to sign in
    if (!isAuthenticated) {
      setMessages((prev) => [
        ...prev,
        { type: 'user', content: input.trim() },
        {
          type: 'prompt',
          content: 'Sign in for free to get AI-powered answers to your questions!',
        },
      ]);
      setInput('');
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { type: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Get a valid token (will refresh if needed)
      const token = await getValidToken();

      if (!token) {
        throw new Error('Session expired. Please sign in again.');
      }

      const data = await askQuestion(userMessage, token);
      setMessages((prev) => [
        ...prev,
        {
          type: 'assistant',
          content: data.answer,
          sources: data.sources,
          chunks: data.chunks,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          type: 'error',
          content: error.message || 'Unable to reach the server. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger sign-in form in header
  const handleSignInClick = () => {
    const signInButton = document.querySelector('[class*="signInToggle"]');
    if (signInButton) {
      signInButton.click();
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={styles.chatWidget}>
      {/* Floating Button */}
      <button
        className={`${styles.floatingButton} ${isOpen ? styles.floatingButtonOpen : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat' : 'Open study assistant'}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
          </svg>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className={styles.chatPanel}>
          <div className={styles.chatHeader}>
            <div className={styles.headerContent}>
              <span className={styles.headerIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </span>
              <span className={styles.headerTitle}>Study Assistant</span>
            </div>
            <button
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className={styles.messagesContainer}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${styles.message} ${styles[`message${message.type.charAt(0).toUpperCase() + message.type.slice(1)}`]}`}
              >
                <div className={styles.messageContent}>
                  {message.content}
                </div>
                {/* Sign-in prompt with button */}
                {message.type === 'prompt' && (
                  <button
                    onClick={handleSignInClick}
                    className={styles.signInPromptButton}
                  >
                    Sign In Free
                  </button>
                )}
                {message.sources && message.sources.length > 0 && (
                  <div className={styles.sources}>
                    <span className={styles.sourcesLabel}>Sources:</span>
                    <ul className={styles.sourcesList}>
                      {message.sources.slice(0, 3).map((source, idx) => (
                        <li key={idx}>
                          <a href={source} target="_blank" rel="noopener noreferrer">
                            {source.length > 50 ? source.substring(0, 50) + '...' : source}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}

            {/* Example questions for non-authenticated users */}
            {!isAuthenticated && messages.length <= 1 && (
              <div className={styles.exampleQuestions}>
                <p className={styles.exampleLabel}>Try asking:</p>
                {EXAMPLE_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    className={styles.exampleQuestion}
                    onClick={() => setInput(q)}
                  >
                    "{q}"
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className={`${styles.message} ${styles.messageAssistant}`}>
                <div className={styles.typingIndicator}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className={styles.inputForm} onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about the textbook..."
              disabled={isLoading}
              className={styles.input}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={styles.sendButton}
              aria-label="Send message"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
