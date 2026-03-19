import { ANSWER_WORDS, VALID_GUESSES } from './words';

// Epoch date for the game (Jan 1, 2025)
const GAME_EPOCH = new Date('2025-01-01T00:00:00Z');

/**
 * Get the daily word index based on days since epoch
 */
export const getDailyWordIndex = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diffTime = Math.abs(now - GAME_EPOCH);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays % ANSWER_WORDS.length;
};

/**
 * Get today's answer word
 */
export const getTodaysWord = () => {
  const index = getDailyWordIndex();
  return ANSWER_WORDS[index];
};

/**
 * Get the day number (for sharing)
 */
export const getDayNumber = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diffTime = Math.abs(now - GAME_EPOCH);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // Start from day 1
};

/**
 * Check if a word is valid (in the valid guesses list)
 */
export const isValidWord = (word) => {
  return VALID_GUESSES.includes(word.toUpperCase());
};

/**
 * Evaluate a guess against the answer
 * Returns an array of tile states: 'correct', 'present', 'absent'
 */
export const evaluateGuess = (guess, answer) => {
  const guessArray = guess.toUpperCase().split('');
  const answerArray = answer.toUpperCase().split('');
  const result = Array(5).fill('absent');
  const answerLetterCount = {};

  // Count letters in answer
  answerArray.forEach(letter => {
    answerLetterCount[letter] = (answerLetterCount[letter] || 0) + 1;
  });

  // First pass: mark correct positions
  guessArray.forEach((letter, i) => {
    if (letter === answerArray[i]) {
      result[i] = 'correct';
      answerLetterCount[letter]--;
    }
  });

  // Second pass: mark present letters (wrong position)
  guessArray.forEach((letter, i) => {
    if (result[i] !== 'correct' && answerLetterCount[letter] > 0) {
      result[i] = 'present';
      answerLetterCount[letter]--;
    }
  });

  return result;
};

/**
 * Get keyboard letter state based on all guesses
 * Returns an object mapping letters to their best state
 */
export const getKeyboardState = (guesses, answer) => {
  const letterStates = {};

  guesses.forEach(guess => {
    const evaluation = evaluateGuess(guess, answer);
    guess.split('').forEach((letter, i) => {
      const upperLetter = letter.toUpperCase();
      const state = evaluation[i];

      // Priority: correct > present > absent
      if (!letterStates[upperLetter]) {
        letterStates[upperLetter] = state;
      } else if (letterStates[upperLetter] === 'absent' && state !== 'absent') {
        letterStates[upperLetter] = state;
      } else if (letterStates[upperLetter] === 'present' && state === 'correct') {
        letterStates[upperLetter] = state;
      }
    });
  });

  return letterStates;
};

/**
 * Get time until next word (midnight UTC)
 */
export const getTimeUntilNextWord = () => {
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setUTCHours(24, 0, 0, 0);
  const diff = tomorrow - now;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, total: diff };
};

/**
 * Check if the game is won
 */
export const isGameWon = (guesses, answer) => {
  return guesses.some(guess => guess.toUpperCase() === answer.toUpperCase());
};

/**
 * Check if the game is over
 */
export const isGameOver = (guesses, answer) => {
  return isGameWon(guesses, answer) || guesses.length >= 6;
};
