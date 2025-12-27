import { useState } from 'react';
import styles from './ChunksCollapsible.module.css';

function ChunksCollapsible({ chunks }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!chunks || chunks.length === 0) {
    return null;
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.toggle}
        onClick={toggleExpanded}
        aria-expanded={isExpanded}
      >
        <span className={styles.icon}>{isExpanded ? '\u25BC' : '\u25B6'}</span>
        View retrieved chunks ({chunks.length})
      </button>

      {isExpanded && (
        <div className={styles.chunks}>
          {chunks.map((chunk, index) => (
            <div key={index} className={styles.chunk}>
              <div className={styles.chunkHeader}>
                <span className={styles.chunkNumber}>Chunk {index + 1}</span>
                <span className={styles.score}>
                  Score: {(chunk.score * 100).toFixed(1)}%
                </span>
              </div>
              <p className={styles.chunkText}>{chunk.text}</p>
              <a
                href={chunk.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.chunkSource}
              >
                Source: {chunk.url}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChunksCollapsible;
