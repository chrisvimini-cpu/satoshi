import styles from './HelpModal.module.css';

const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>How to Play</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          <p className={styles.instructions}>
            Guess the <strong>SATOSHI</strong> in 6 tries. Each guess must be a valid 5-letter word.
          </p>

          <p className={styles.instructions}>
            After each guess, the tiles will flip to show how close your guess was to the word.
          </p>

          <div className={styles.examples}>
            <div className={styles.example}>
              <div className={styles.exampleRow}>
                <div className={`${styles.tile} ${styles.tileCorrect}`}>B</div>
                <div className={styles.tile}>L</div>
                <div className={styles.tile}>O</div>
                <div className={styles.tile}>C</div>
                <div className={styles.tile}>K</div>
              </div>
              <p className={styles.exampleText}>
                <strong>B</strong> is in the word and in the correct spot.
              </p>
            </div>

            <div className={styles.example}>
              <div className={styles.exampleRow}>
                <div className={styles.tile}>S</div>
                <div className={`${styles.tile} ${styles.tilePresent}`}>T</div>
                <div className={styles.tile}>A</div>
                <div className={styles.tile}>K</div>
                <div className={styles.tile}>E</div>
              </div>
              <p className={styles.exampleText}>
                <strong>T</strong> is in the word but in the wrong spot.
              </p>
            </div>

            <div className={styles.example}>
              <div className={styles.exampleRow}>
                <div className={styles.tile}>W</div>
                <div className={styles.tile}>H</div>
                <div className={styles.tile}>A</div>
                <div className={`${styles.tile} ${styles.tileAbsent}`}>L</div>
                <div className={styles.tile}>E</div>
              </div>
              <p className={styles.exampleText}>
                <strong>L</strong> is not in the word in any spot.
              </p>
            </div>
          </div>

          <p className={styles.footer}>
            A new <strong>SATOSHI</strong> will be available each day!
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
