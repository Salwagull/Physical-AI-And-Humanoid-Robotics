import styles from './SourcesList.module.css';

function SourcesList({ sources }) {
  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <span className={styles.label}>Sources:</span>
      <ul className={styles.list}>
        {sources.map((source, index) => (
          <li key={index} className={styles.item}>
            <a
              href={source}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              {source}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SourcesList;
