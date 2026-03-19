import styles from './Keyboard.module.css';

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']
];

const Keyboard = ({ onKeyPress, letterStates, disabled }) => {
  const handleClick = (key) => {
    if (disabled) return;
    onKeyPress(key);
  };

  const getKeyClass = (key) => {
    const baseClass = styles.key;
    const state = letterStates[key];

    if (key === 'ENTER' || key === 'BACK') {
      return `${baseClass} ${styles.keyWide}`;
    }

    if (!state) return baseClass;

    if (state === 'correct') return `${baseClass} ${styles.keyCorrect}`;
    if (state === 'present') return `${baseClass} ${styles.keyPresent}`;
    if (state === 'absent') return `${baseClass} ${styles.keyAbsent}`;

    return baseClass;
  };

  const getKeyLabel = (key) => {
    if (key === 'BACK') {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M22 3H7C6.31 3 5.77 3.35 5.41 3.88L0 12L5.41 20.11C5.77 20.64 6.31 21 7 21H22C23.1 21 24 20.1 24 19V5C24 3.9 23.1 3 22 3ZM19 15.59L17.59 17L14 13.41L10.41 17L9 15.59L12.59 12L9 8.41L10.41 7L14 10.59L17.59 7L19 8.41L15.41 12L19 15.59Z"
            fill="currentColor"
          />
        </svg>
      );
    }
    return key;
  };

  return (
    <div className={styles.keyboard}>
      {KEYBOARD_ROWS.map((row, i) => (
        <div key={i} className={styles.row}>
          {row.map((key) => (
            <button
              key={key}
              className={getKeyClass(key)}
              onClick={() => handleClick(key)}
              disabled={disabled}
              aria-label={key === 'BACK' ? 'Backspace' : key}
            >
              {getKeyLabel(key)}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
