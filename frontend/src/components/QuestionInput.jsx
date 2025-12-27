import styles from './QuestionInput.module.css';

function QuestionInput({ query, onQueryChange, onSubmit, isLoading }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          className={styles.input}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about Physical AI and Humanoid Robotics..."
          disabled={isLoading}
          autoFocus
        />
        <button
          type="submit"
          className={styles.button}
          disabled={isLoading}
        >
          {isLoading ? 'Asking...' : 'Ask'}
        </button>
      </div>
    </form>
  );
}

export default QuestionInput;
