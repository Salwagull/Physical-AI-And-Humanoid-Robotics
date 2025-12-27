import styles from './ErrorMessage.module.css';

function ErrorMessage({ message, onDismiss }) {
  return (
    <div className={styles.container} role="alert">
      <div className={styles.content}>
        <span className={styles.icon}>!</span>
        <p className={styles.message}>{message}</p>
      </div>
      <button
        type="button"
        className={styles.dismiss}
        onClick={onDismiss}
        aria-label="Dismiss error"
      >
        &times;
      </button>
    </div>
  );
}

export default ErrorMessage;
