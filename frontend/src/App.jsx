import { useState } from 'react';
import styles from './App.module.css';
import { askQuestion } from './api/askApi';
import QuestionInput from './components/QuestionInput';
import AnswerDisplay from './components/AnswerDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

function App() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!query.trim()) {
      setError('Please enter a question');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const data = await askQuestion(query);
      setResponse(data);
    } catch (err) {
      setError(err.message || 'Unable to reach the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismissError = () => {
    setError(null);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Physical AI & Humanoid Robotics</h1>
        <p className={styles.subtitle}>Ask questions about the textbook</p>
      </header>

      <main className={styles.main}>
        <QuestionInput
          query={query}
          onQueryChange={setQuery}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />

        {isLoading && <LoadingSpinner />}

        {error && (
          <ErrorMessage message={error} onDismiss={handleDismissError} />
        )}

        {response && !isLoading && (
          <AnswerDisplay response={response} />
        )}
      </main>
    </div>
  );
}

export default App;
