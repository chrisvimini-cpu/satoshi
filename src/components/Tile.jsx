import { useEffect, useState } from 'react';
import styles from './Tile.module.css';

const Tile = ({ letter, state, position, isRevealing, shouldBounce }) => {
  const [showFront, setShowFront] = useState(true);

  useEffect(() => {
    if (isRevealing) {
      const delay = position * 150; // Stagger the flip animation
      const timer = setTimeout(() => {
        setShowFront(false);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isRevealing, position]);

  const tileClasses = [
    styles.tile,
    letter && !state ? styles.filled : '',
    state === 'correct' ? styles.correct : '',
    state === 'present' ? styles.present : '',
    state === 'absent' ? styles.absent : '',
    isRevealing && !showFront ? styles.flip : '',
    shouldBounce ? styles.bounce : ''
  ].filter(Boolean).join(' ');

  return (
    <div
      className={tileClasses}
      style={{
        animationDelay: shouldBounce ? `${position * 100}ms` : undefined
      }}
    >
      <div className={styles.tileFront}>
        {letter}
      </div>
      <div className={styles.tileBack}>
        {letter}
      </div>
    </div>
  );
};

export default Tile;
