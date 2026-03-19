import { useEffect } from 'react';
import styles from './Toast.module.css';

const Toast = ({ message, isVisible, onClose, duration = 2000 }) => {
  useEffect(() => {
    if (isVisible && duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible || !message) return null;

  return (
    <div className={styles.toastContainer}>
      <div className={styles.toast}>
        {message}
      </div>
    </div>
  );
};

export default Toast;
