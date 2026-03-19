# Interactive Game Builder

A comprehensive guide for building and deploying mobile-first interactive web games with React, Vite, and Vercel auto-deployment.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Initial Setup](#initial-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Design System Integration](#design-system-integration)
- [Deployment Setup](#deployment-setup)
- [Troubleshooting](#troubleshooting)
- [Making Changes](#making-changes)

---

## Overview

This guide documents the complete workflow for building interactive web games like Satoshi - from initial scaffolding through production deployment with automatic updates.

**Use this workflow when you want to:**
- Build a mobile-first web game (word games, puzzles, quizzes, etc.)
- Create an interactive prototype that's playable on mobile devices
- Deploy a game with auto-updates via GitHub integration
- Integrate CoinDesk branding and custom fonts

---

## Tech Stack

### Core Framework
- **React 18+** - Component-based UI
- **Vite** - Fast build tool with HMR (Hot Module Replacement)
- **CSS Modules** - Scoped component styling (no Tailwind - need precise custom styling)

### Deployment
- **GitHub** - Version control and code hosting
- **Vercel** - Automated deployment with GitHub integration
- **PWA-ready** - Can be added to mobile home screen

### Why This Stack?

- **React + Vite**: Fast development with instant feedback
- **CSS Modules**: Precise control over game UI (animations, layouts, transitions)
- **No backend needed**: Game logic runs entirely in browser with localStorage
- **Vercel auto-deploy**: Push to GitHub → automatic rebuild → live on mobile in 1-2 minutes

---

## Initial Setup

### Step 1: Create Vite + React Project

```bash
# Navigate to your workspace
cd "/path/to/your/workspace"

# Create project (will prompt for project name)
npm create vite@latest game-name -- --template react

# Navigate into project
cd game-name

# Install dependencies
npm install
```

**Corporate Network Note:** If you get SSL certificate errors (`UNABLE_TO_GET_ISSUER_CERT_LOCALLY`), use:
```bash
npm install --strict-ssl=false
```

### Step 2: Create Folder Structure

```bash
# Create organized folders
mkdir -p src/components src/lib src/styles public/fonts
```

### Step 3: Configure Vite for Network Access

Update `vite.config.js` to allow testing on mobile devices:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allow external access (for testing on mobile)
    port: 5173,
  }
})
```

---

## Project Structure

```
game-name/
├── public/
│   ├── fonts/                    # Custom brand fonts
│   │   ├── Family-Regular.otf
│   │   └── Family-Bold.otf
│   ├── brand-logo.svg            # Brand logo
│   └── manifest.json             # PWA manifest
├── src/
│   ├── components/
│   │   ├── Game.jsx              # Main game orchestrator
│   │   ├── Grid.jsx              # Game board/grid
│   │   ├── Tile.jsx              # Individual game pieces
│   │   ├── Keyboard.jsx          # Virtual keyboard (if needed)
│   │   ├── StatsModal.jsx        # Stats/results modal
│   │   ├── HelpModal.jsx         # Instructions modal
│   │   └── Toast.jsx             # Notifications
│   ├── lib/
│   │   ├── gameLogic.js          # Core game rules
│   │   ├── storage.js            # localStorage helpers
│   │   └── data.js               # Static game data
│   ├── styles/
│   │   ├── variables.css         # CSS custom properties
│   │   └── fonts.css             # Font declarations
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

### Key Files Explained

**`src/lib/gameLogic.js`**
- Pure functions for game rules
- No UI logic - just game mechanics
- Easy to test and reuse

**`src/lib/storage.js`**
- localStorage wrappers
- State persistence
- Statistics tracking

**`src/components/Game.jsx`**
- Main game orchestrator
- Manages state and user interactions
- Delegates to child components

**`src/styles/variables.css`**
- CSS custom properties (colors, spacing, timing)
- Makes theming and updates easier

---

## Development Workflow

### 1. Start Dev Server

```bash
npm run dev
```

This starts a local server at `http://localhost:5173` with hot reload.

### 2. Test on Mobile (Same WiFi Network)

The Vite config allows network access, but if you're on different networks (e.g., work computer + personal phone), you'll need to deploy to test on mobile.

### 3. Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### 4. Preview Production Build

```bash
npm run preview
```

Tests the production build locally before deploying.

---

## Design System Integration

### Adding Custom Fonts

**Step 1:** Copy font files to `public/fonts/`

```bash
cp /path/to/fonts/*.otf public/fonts/
```

**Step 2:** Create font declarations in `src/styles/fonts.css`

```css
@font-face {
  font-family: 'YourFont';
  src: url('/fonts/YourFont-Regular.otf') format('opentype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'YourFont';
  src: url('/fonts/YourFont-Bold.otf') format('opentype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

**Step 3:** Import fonts in `src/App.jsx`

```javascript
import './styles/fonts.css';
import './styles/variables.css';
```

**Step 4:** Use in CSS variables

```css
:root {
  --font-family: "YourFont", "Helvetica Neue", Arial, sans-serif;
}
```

### Brand Colors

Define brand colors in `src/styles/variables.css`:

```css
:root {
  /* Brand Colors */
  --color-brand-primary: #F8BF1E;
  --color-brand-secondary: #000000;
  --color-bg-cream: #F6F6F2;
  --color-white: #FFFFFF;

  /* Game-specific colors */
  --tile-bg-correct: var(--color-brand-primary);
  --tile-bg-present: #C9A836;
  --tile-bg-absent: #787C7E;
}
```

### Using SVG Logos

**Option 1:** Direct `<img>` tag (simplest)

```jsx
<img src="/logo.svg" alt="Brand Logo" className={styles.logo} />
```

**Option 2:** Inline SVG (for dynamic styling)

```jsx
<svg className={styles.logo}>
  {/* SVG content */}
</svg>
```

Place SVG files in `public/` folder and reference with `/logo.svg` path.

---

## Deployment Setup

### Step 1: Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit: [Game Name]

- Complete React + Vite implementation
- [Key features list]
- Mobile-first responsive design
- Brand integration

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

### Step 2: Configure Git User (if needed)

```bash
git config user.name "your-github-username"
git config user.email "your-email@example.com"
```

### Step 3: Create GitHub Repository

Using GitHub CLI:

```bash
gh repo create game-name --public --source=. --remote=origin --push
```

Or manually:
1. Create repo on github.com
2. Add remote: `git remote add origin https://github.com/username/game-name.git`
3. Push: `git push -u origin main`

### Step 4: Connect to Vercel (One-Time Setup)

**Manual Setup (Recommended for Corporate Networks):**

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your GitHub repo (`username/game-name`)
4. Configure project:
   - **Framework Preset:** Vite (auto-detected)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Click "Deploy"

**Result:** You get a permanent URL like `https://game-name.vercel.app`

### Step 5: Auto-Deploy Setup

Once connected, **every push to GitHub automatically triggers a new deployment**:

```bash
# Make changes to your code
git add .
git commit -m "Update game mechanics"
git push
```

Vercel will:
1. Detect the push
2. Build the project
3. Deploy to production
4. Update your URL (same URL, new content)
5. Complete in 1-2 minutes

---

## Troubleshooting

### SSL Certificate Errors (Corporate Networks)

**Problem:** `npm install` fails with `UNABLE_TO_GET_ISSUER_CERT_LOCALLY`

**Solution:** Bypass SSL checking temporarily

```bash
npm install --strict-ssl=false
```

Or configure permanently:
```bash
npm config set strict-ssl false
```

(Remember to re-enable later: `npm config set strict-ssl true`)

### Font Not Loading

**Check:**
1. Font files are in `public/fonts/`
2. Font paths use `/fonts/` (leading slash)
3. `fonts.css` is imported in `App.jsx`
4. Browser console shows no 404 errors

**Test:** Open DevTools → Network tab → reload → verify `.otf` files load

### Vercel Build Fails

**Common causes:**
1. Missing dependencies in `package.json`
2. Build command incorrect
3. Output directory wrong (should be `dist`)

**Fix:** Check Vercel build logs for specific errors

### Can't Test on iPhone

**If on same WiFi:** Use network URL from Vite (e.g., `http://192.168.x.x:5173`)

**If on different networks:** Deploy to Vercel first, then use the Vercel URL

---

## Making Changes

### Typical Development Cycle

```bash
# 1. Make changes locally
# Edit files in src/

# 2. Test in browser
# Dev server auto-reloads at localhost:5173

# 3. Commit changes
git add .
git commit -m "Description of changes"

# 4. Push to GitHub (triggers auto-deploy)
git push

# 5. Check Vercel
# Visit your Vercel URL in 1-2 minutes to see changes live
```

### Updating Brand Assets

**Fonts:**
1. Replace files in `public/fonts/`
2. Commit and push
3. Auto-deploys with new fonts

**Logo:**
1. Replace `public/logo.svg`
2. Commit and push
3. Auto-deploys with new logo

**Colors:**
1. Update `src/styles/variables.css`
2. Commit and push
3. Auto-deploys with new colors

### Adding New Features

1. Create new component in `src/components/`
2. Add game logic to `src/lib/gameLogic.js`
3. Import and use in `src/components/Game.jsx`
4. Test locally
5. Commit, push, auto-deploy

---

## Best Practices

### Mobile-First Design

- Design for **375px width** as primary viewport
- Test on actual mobile devices (use Vercel URL)
- Touch targets minimum **44px**
- Avoid hover states (use :active instead)

### Performance

- Keep bundle size small (check `dist/` folder after build)
- Use CSS Modules (scoped styles, tree-shaking)
- Lazy load modals/heavy components if needed
- Optimize images (use SVG for logos/icons)

### State Management

- Use localStorage for persistence
- Keep game state in top-level component
- Pass state down via props
- Avoid prop drilling with composition

### Git Workflow

- Commit frequently with clear messages
- One feature per commit
- Push when ready to deploy (triggers auto-build)
- Use branches for experimental features

---

## Example: Satoshi Word Game

This guide was created while building **Satoshi** - a daily crypto word game.

**Key Features Implemented:**
- 6x5 letter grid with flip animations
- Virtual keyboard with state tracking
- Daily word rotation (deterministic based on date)
- Statistics with streaks and distribution
- Share functionality with emoji grid
- Mobile-first responsive design
- CoinDesk branding (Family font, yellow tiles, cream background)

**Deployment:**
- GitHub: `https://github.com/chrisvimini-cpu/satoshi`
- Auto-deploys to Vercel on every push
- Playable on any device via Vercel URL

**Development Time:**
- Initial setup: 10 minutes
- Core game logic: 1 hour
- Components and UI: 2 hours
- Styling and branding: 1 hour
- Deployment setup: 15 minutes
- **Total: ~4.5 hours from zero to deployed**

---

## Summary

This workflow enables rapid development and deployment of interactive web games:

1. ✅ **Fast setup** - Vite + React scaffolding in minutes
2. ✅ **Organized structure** - Clear separation of logic, UI, and styles
3. ✅ **Brand integration** - Custom fonts, colors, logos
4. ✅ **Mobile-first** - Optimized for touch and small screens
5. ✅ **Auto-deploy** - Push to GitHub → live on mobile in minutes
6. ✅ **No backend needed** - Everything runs in browser
7. ✅ **PWA-ready** - Can be installed as app icon

Use this guide as a template for future interactive game projects!

---

**Created:** March 19, 2026
**Last Updated:** March 19, 2026
**Author:** Chris Vimini (Head of Product Design)
**Example Project:** Satoshi - Daily Crypto Word Game
