import { AlertTriangle, RotateCcw } from 'lucide-react';
import styles from './ErrorState.module.css';

function ErrorState({
  title = "Couldn't load this",
  message = 'Something went wrong. Please try again.',
  onRetry,
}) {
  return (
    <div className={styles.card} role="alert">
      <div className={styles.iconWrap} aria-hidden="true">
        <AlertTriangle size={20} strokeWidth={2} />
      </div>
      <div className={styles.body}>
        <p className={styles.title}>{title}</p>
        <p className={styles.message}>{message}</p>
      </div>
      {onRetry && (
        <button type="button" className={styles.retryBtn} onClick={onRetry}>
          <RotateCcw size={14} strokeWidth={2} aria-hidden="true" />
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorState;