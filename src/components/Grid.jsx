import Tile from './Tile';
import styles from './Grid.module.css';

const Grid = ({
  guesses,
  currentGuess,
  evaluations,
  isRevealing,
  revealingRow,
  wonRow,
  shakeRow
}) => {
  const empties = 6 - guesses.length - (currentGuess ? 1 : 0);

  return (
    <div className={styles.grid}>
      {/* Submitted guesses */}
      {guesses.map((guess, rowIndex) => (
        <div
          key={rowIndex}
          className={`${styles.row} ${
            revealingRow === rowIndex && isRevealing ? styles.revealing : ''
          }`}
        >
          {guess.split('').map((letter, i) => (
            <Tile
              key={i}
              letter={letter}
              state={evaluations[rowIndex]?.[i]}
              position={i}
              isRevealing={revealingRow === rowIndex && isRevealing}
              shouldBounce={wonRow === rowIndex}
            />
          ))}
        </div>
      ))}

      {/* Current guess being typed */}
      {currentGuess && (
        <div className={`${styles.row} ${shakeRow === guesses.length ? styles.shake : ''}`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Tile
              key={i}
              letter={currentGuess[i] || ''}
              state={null}
              position={i}
            />
          ))}
        </div>
      )}

      {/* Empty rows */}
      {Array.from({ length: empties }).map((_, rowIndex) => (
        <div key={`empty-${rowIndex}`} className={styles.row}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Tile key={i} letter="" state={null} position={i} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
