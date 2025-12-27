import styles from './AnswerDisplay.module.css';
import SourcesList from './SourcesList';
import ChunksCollapsible from './ChunksCollapsible';

function AnswerDisplay({ response }) {
  const { query, answer, sources, chunks } = response;

  return (
    <div className={styles.container}>
      <div className={styles.questionSection}>
        <span className={styles.label}>Your question:</span>
        <p className={styles.question}>{query}</p>
      </div>

      <div className={styles.answerSection}>
        <span className={styles.label}>Answer:</span>
        <div className={styles.answer}>{answer}</div>
      </div>

      {sources && sources.length > 0 && (
        <SourcesList sources={sources} />
      )}

      {chunks && chunks.length > 0 && (
        <ChunksCollapsible chunks={chunks} />
      )}
    </div>
  );
}

export default AnswerDisplay;
