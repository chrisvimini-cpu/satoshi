const GAME_STATE_KEY = 'satoshi-game-state';
const STATS_KEY = 'satoshi-stats';

/**
 * Get today's date string for comparison
 */
const getTodayString = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString().split('T')[0];
};

/**
 * Load game state from localStorage
 */
export const loadGameState = () => {
  try {
    const saved = localStorage.getItem(GAME_STATE_KEY);
    if (!saved) return null;

    const state = JSON.parse(saved);

    // Check if the saved state is from today
    if (state.date !== getTodayString()) {
      return null; // New day, return null to start fresh
    }

    return state;
  } catch (error) {
    console.error('Error loading game state:', error);
    return null;
  }
};

/**
 * Save game state to localStorage
 */
export const saveGameState = (guesses, gameStatus) => {
  try {
    const state = {
      date: getTodayString(),
      guesses,
      gameStatus, // 'playing', 'won', 'lost'
    };
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving game state:', error);
  }
};

/**
 * Load statistics from localStorage
 */
export const loadStats = () => {
  try {
    const saved = localStorage.getItem(STATS_KEY);
    if (!saved) {
      return {
        gamesPlayed: 0,
        gamesWon: 0,
        currentStreak: 0,
        maxStreak: 0,
        guessDistribution: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
        },
        lastPlayedDate: null,
      };
    }

    return JSON.parse(saved);
  } catch (error) {
    console.error('Error loading stats:', error);
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      guessDistribution: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
      },
      lastPlayedDate: null,
    };
  }
};

/**
 * Update statistics after a game ends
 */
export const updateStats = (won, guessCount) => {
  try {
    const stats = loadStats();
    const today = getTodayString();

    stats.gamesPlayed++;

    if (won) {
      stats.gamesWon++;
      stats.guessDistribution[guessCount]++;

      // Update streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toISOString().split('T')[0];

      if (stats.lastPlayedDate === yesterdayString || stats.lastPlayedDate === null) {
        stats.currentStreak++;
      } else if (stats.lastPlayedDate !== today) {
        stats.currentStreak = 1;
      }

      stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
    } else {
      // Lost the game, break streak
      stats.currentStreak = 0;
    }

    stats.lastPlayedDate = today;

    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    return stats;
  } catch (error) {
    console.error('Error updating stats:', error);
    return loadStats();
  }
};

/**
 * Get win percentage
 */
export const getWinPercentage = (stats) => {
  if (stats.gamesPlayed === 0) return 0;
  return Math.round((stats.gamesWon / stats.gamesPlayed) * 100);
};

/**
 * Clear all data (for testing)
 */
export const clearAllData = () => {
  localStorage.removeItem(GAME_STATE_KEY);
  localStorage.removeItem(STATS_KEY);
};
