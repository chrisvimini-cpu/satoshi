import { useState, useEffect, useCallback, useRef } from 'react';
import Grid from './Grid';
import Keyboard from './Keyboard';
import StatsModal from './StatsModal';
import HelpModal from './HelpModal';
import Toast from './Toast';
import {
  getTodaysWord,
  isValidWord,
  evaluateGuess,
  getKeyboardState,
  getDayNumber,
} from '../lib/gameLogic';
import {
  loadGameState,
  saveGameState,
  loadStats,
  updateStats,
} from '../lib/storage';
import styles from './Game.module.css';

const Game = () => {
  const answer = useRef(getTodaysWord());
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
  const [stats, setStats] = useState(loadStats());
  const [showStats, setShowStats] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [toast, setToast] = useState({ message: '', visible: false });
  const [isRevealing, setIsRevealing] = useState(false);
  const [revealingRow, setRevealingRow] = useState(null);
  const [wonRow, setWonRow] = useState(null);
  const [shakeRow, setShakeRow] = useState(null);

  // Load saved game state on mount
  useEffect(() => {
    const savedState = loadGameState();
    if (savedState) {
      setGuesses(savedState.guesses);
      setGameStatus(savedState.gameStatus);

      // Recalculate evaluations
      const evals = savedState.guesses.map(guess =>
        evaluateGuess(guess, answer.current)
      );
      setEvaluations(evals);

      // If game is over, set wonRow
      if (savedState.gameStatus === 'won') {
        const winIndex = savedState.guesses.findIndex(
          g => g.toUpperCase() === answer.current.toUpperCase()
        );
        if (winIndex !== -1) {
          setWonRow(winIndex);
        }
      }
    }
  }, []);

  const showToast = (message) => {
    setToast({ message, visible: true });
  };

  const hideToast = () => {
    setToast({ message: '', visible: false });
  };

  const handleSubmitGuess = useCallback(() => {
    if (currentGuess.length !== 5) {
      showToast('Not enough letters');
      setShakeRow(guesses.length);
      setTimeout(() => setShakeRow(null), 600);
      return;
    }

    if (!isValidWord(currentGuess)) {
      showToast('Not in word list');
      setShakeRow(guesses.length);
      setTimeout(() => setShakeRow(null), 600);
      return;
    }

    const evaluation = evaluateGuess(currentGuess, answer.current);
    const newGuesses = [...guesses, currentGuess];
    const newEvaluations = [...evaluations, evaluation];

    setIsRevealing(true);
    setRevealingRow(guesses.length);

    // Wait for flip animation to complete
    setTimeout(() => {
      setGuesses(newGuesses);
      setEvaluations(newEvaluations);
      setCurrentGuess('');
      setIsRevealing(false);
      setRevealingRow(null);

      // Check win condition
      const won = currentGuess.toUpperCase() === answer.current.toUpperCase();
      const lost = newGuesses.length >= 6 && !won;

      if (won) {
        setGameStatus('won');
        setWonRow(newGuesses.length - 1);
        const updatedStats = updateStats(true, newGuesses.length);
        setStats(updatedStats);
        saveGameState(newGuesses, 'won');

        // Show stats after bounce animation
        setTimeout(() => {
          showToast('Excellent!');
          setTimeout(() => setShowStats(true), 1500);
        }, 500);
      } else if (lost) {
        setGameStatus('lost');
        const updatedStats = updateStats(false, 0);
        setStats(updatedStats);
        saveGameState(newGuesses, 'lost');

        setTimeout(() => {
          showToast(answer.current);
          setTimeout(() => setShowStats(true), 2000);
        }, 1000);
      } else {
        saveGameState(newGuesses, 'playing');
      }
    }, 2000); // Time for all tiles to flip
  }, [currentGuess, guesses, evaluations]);

  const handleKeyPress = useCallback((key) => {
    if (gameStatus !== 'playing' || isRevealing) return;

    if (key === 'ENTER') {
      handleSubmitGuess();
    } else if (key === 'BACK') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < 5) {
      setCurrentGuess(prev => prev + key);
    }
  }, [currentGuess, gameStatus, isRevealing, handleSubmitGuess]);

  // Physical keyboard handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showStats || showHelp) return;

      if (e.key === 'Enter') {
        handleKeyPress('ENTER');
      } else if (e.key === 'Backspace') {
        handleKeyPress('BACK');
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress, showStats, showHelp]);

  const handleShare = () => {
    const dayNumber = getDayNumber();
    const guessCountText = gameStatus === 'won' ? guesses.length : 'X';

    // Generate emoji grid
    const emojiGrid = evaluations.map(evaluation =>
      evaluation.map(state => {
        if (state === 'correct') return '🟨'; // Yellow square for correct
        if (state === 'present') return '🟡'; // Gold circle for present
        return '⬜'; // White square for absent
      }).join('')
    ).join('\n');

    const shareText = `🟨 Satoshi #${dayNumber} ${guessCountText}/6\n\n${emojiGrid}\n\ncoindesk.com/games/satoshi`;

    // Copy to clipboard
    navigator.clipboard.writeText(shareText).then(() => {
      showToast('Copied to clipboard');
    }).catch(() => {
      showToast('Failed to copy');
    });
  };

  const handleRestart = () => {
    setCurrentGuess('');
    setGuesses([]);
    setEvaluations([]);
    setGameStatus('playing');
    setWonRow(null);
    setShowStats(false);
    localStorage.removeItem('gameState');
    showToast('Game restarted');
  };

  const letterStates = getKeyboardState(guesses, answer.current);

  return (
    <div className={styles.game}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            className={styles.menuButton}
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M2.5 5H17.5M2.5 10H17.5M2.5 15H17.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div className={styles.headerCenter}>
          <h1 className={styles.title}>Satoshi</h1>
          <span className={styles.byLine}>by</span>
          <img
            src="/coindesk-logo.svg"
            alt="CoinDesk"
            className={styles.logo}
          />
        </div>
        <div className={styles.headerRight}>
          <button
            className={styles.iconButton}
            onClick={() => setShowStats(true)}
            aria-label="Statistics"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M16 11V3H8V9H2V21H22V11H16ZM10 5H14V19H10V5ZM4 11H8V19H4V11ZM20 19H16V13H20V19Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <button
            className={styles.iconButton}
            onClick={() => setShowHelp(true)}
            aria-label="Help"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M11 18H13V16H11V18ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12 6C9.79 6 8 7.79 8 10H10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 12 11 11.75 11 15H13C13 12.75 16 12.5 16 10C16 7.79 14.21 6 12 6Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </header>

      <Grid
        guesses={guesses}
        currentGuess={currentGuess}
        evaluations={evaluations}
        isRevealing={isRevealing}
        revealingRow={revealingRow}
        wonRow={wonRow}
        shakeRow={shakeRow}
      />

      <Keyboard
        onKeyPress={handleKeyPress}
        letterStates={letterStates}
        disabled={gameStatus !== 'playing' || isRevealing}
      />

      <StatsModal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        stats={stats}
        onShare={handleShare}
        onRestart={handleRestart}
        gameWon={gameStatus === 'won'}
        guessCount={guesses.length}
      />

      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />

      <Toast message={toast.message} isVisible={toast.visible} onClose={hideToast} />
    </div>
  );
};

export default Game;
