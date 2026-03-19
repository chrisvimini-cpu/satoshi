import { useEffect, useState } from 'react';
import { getWinPercentage } from '../lib/storage';
import { getDayNumber, getTimeUntilNextWord } from '../lib/gameLogic';
import styles from './StatsModal.module.css';

const StatsModal = ({ isOpen, onClose, stats, onShare, gameWon, guessCount }) => {
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!isOpen) return;

    const updateCountdown = () => {
      const time = getTimeUntilNextWord();
      setCountdown(time);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const winPercentage = getWinPercentage(stats);
  const maxGuessCount = Math.max(...Object.values(stats.guessDistribution));

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>STATISTICS</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statValue}>{stats.gamesPlayed}</div>
            <div className={styles.statLabel}>Played</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>{winPercentage}</div>
            <div className={styles.statLabel}>Win %</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>{stats.currentStreak}</div>
            <div className={styles.statLabel}>Current Streak</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>{stats.maxStreak}</div>
            <div className={styles.statLabel}>Max Streak</div>
          </div>
        </div>

        <div className={styles.distribution}>
          <h3>GUESS DISTRIBUTION</h3>
          <div className={styles.distributionBars}>
            {[1, 2, 3, 4, 5, 6].map((num) => {
              const count = stats.guessDistribution[num] || 0;
              const percentage = maxGuessCount > 0 ? (count / maxGuessCount) * 100 : 0;
              const isCurrentGuess = gameWon && num === guessCount;

              return (
                <div key={num} className={styles.barRow}>
                  <div className={styles.barLabel}>{num}</div>
                  <div
                    className={`${styles.bar} ${isCurrentGuess ? styles.barCurrent : ''}`}
                    style={{ width: `${Math.max(percentage, count > 0 ? 7 : 0)}%` }}
                  >
                    {count > 0 && <span className={styles.barCount}>{count}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {gameWon !== null && (
          <>
            <div className={styles.nextWord}>
              <div className={styles.nextWordLabel}>NEXT SATOSHI</div>
              <div className={styles.countdown}>
                {String(countdown.hours).padStart(2, '0')}:
                {String(countdown.minutes).padStart(2, '0')}:
                {String(countdown.seconds).padStart(2, '0')}
              </div>
            </div>

            <button className={styles.shareButton} onClick={onShare}>
              SHARE
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginLeft: '8px' }}>
                <path
                  d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12C3 13.66 4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.35C15.11 18.56 15.08 18.78 15.08 19C15.08 20.61 16.39 21.92 18 21.92C19.61 21.92 20.92 20.61 20.92 19C20.92 17.39 19.61 16.08 18 16.08Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default StatsModal;
