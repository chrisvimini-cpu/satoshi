# Satoshi — A Daily Crypto Word Game by CoinDesk

A mobile-first daily word guessing game featuring crypto and blockchain terminology. Built with React and Vite.

## Features

- **Daily Puzzle**: One new 5-letter crypto term each day
- **6 Attempts**: Players have 6 tries to guess the correct word
- **Visual Feedback**: Color-coded tiles show correct letters and positions
  - 🟨 CoinDesk Yellow = Correct letter, correct position
  - 🟡 Muted Gold = Correct letter, wrong position
  - ⬜ Charcoal = Letter not in the word
- **Statistics Tracking**: Games played, win percentage, streaks, and guess distribution
- **Share Results**: Copy emoji grid to share on social media
- **Clean Design**: Light theme with CoinDesk branding and custom "Family" font
- **Persistent State**: Game progress and stats saved in localStorage
- **Mobile-First**: Optimized for touch and responsive across all devices

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open your browser to the localhost URL shown (typically `http://localhost:5173`).

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
satoshi/
├── public/
│   ├── fonts/                    # CoinDesk Family font files (to be added)
│   ├── coindesk-logo.svg         # CoinDesk logo mark
│   └── manifest.json             # PWA manifest
├── src/
│   ├── components/
│   │   ├── Game.jsx              # Main game orchestrator
│   │   ├── Grid.jsx              # 6x5 tile grid
│   │   ├── Tile.jsx              # Individual tile with flip animation
│   │   ├── Keyboard.jsx          # Virtual keyboard
│   │   ├── StatsModal.jsx        # Statistics and share
│   │   ├── HelpModal.jsx         # How to play instructions
│   │   └── Toast.jsx             # Toast notifications
│   ├── lib/
│   │   ├── words.js              # Word lists (answers + valid guesses)
│   │   ├── gameLogic.js          # Core game logic
│   │   └── storage.js            # localStorage helpers
│   ├── styles/
│   │   ├── variables.css         # CSS custom properties
│   │   └── fonts.css             # Font declarations
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
└── package.json
```

## Custom Fonts

The game uses CoinDesk's custom "Family" font. Place the font files in `public/fonts/`:

- `Family-Regular.woff2`
- `Family-Bold.woff2`

The game will gracefully fall back to Helvetica Neue and Arial if font files are not present.

## Game Logic

### Daily Word Selection

- Words are selected using a deterministic algorithm based on days since epoch (Jan 1, 2025)
- Formula: `daysSinceEpoch % wordList.length`
- Ensures everyone gets the same word on the same day

### Word Lists

- **200+ Answer Words**: Curated crypto/blockchain/finance terms
- **2000+ Valid Guesses**: Includes answer words plus common English words

### Letter Evaluation

1. First pass: Mark correct positions (green)
2. Second pass: Mark present letters in wrong positions (yellow)
3. Remaining: Mark absent letters (gray)

### Statistics

- Games Played
- Win Percentage
- Current Streak
- Max Streak
- Guess Distribution (1-6)

All stats persist in localStorage and update after each game.

## Share Format

```
🟨 Satoshi #142 4/6

⬜⬜🟡⬜⬜
⬜🟨⬜⬜🟡
🟨🟨🟨⬜🟨
🟨🟨🟨🟨🟨

coindesk.com/games/satoshi
```

- 🟨 = Correct position (CoinDesk Yellow)
- 🟡 = Wrong position (Muted Gold)
- ⬜ = Not in word

## Animations

- **Tile Flip**: 400ms flip animation on guess submission (staggered by 150ms per tile)
- **Shake**: 600ms shake animation for invalid words
- **Bounce**: 500ms bounce animation for winning row
- **Pop**: Quick scale animation when typing letters

## Browser Support

- Modern browsers with ES6+ support
- Mobile Safari, Chrome, Firefox
- PWA-ready for "Add to Home Screen" functionality

## Development Notes

### IP Considerations

This game is an original product built for CoinDesk. It does NOT use:
- The word "Wordle" anywhere in the codebase
- NYT's specific color scheme or UI layout
- Any trademarked elements from other games

The concept of color-coded letter feedback in word games predates Wordle and is a common game mechanic (see: Lingo, Jotto, Mastermind).

### Future Enhancements

- Hard mode (revealed letters must be used)
- Dark theme toggle
- Accessibility improvements (screen reader support)
- Additional word categories
- Multiplayer mode
- Backend integration for global stats

## License

Copyright © 2026 CoinDesk. All rights reserved.

## Credits

Built with React, Vite, and modern web standards.
