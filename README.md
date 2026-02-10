# Super Decoder

A Mastermind-based code-breaking puzzle PWA with 600 levels, multiple game modes, and a retro-futuristic LED UI.

## Features

- **600 Levels** — Progressive difficulty from 4-color direct hints to 8-color indirect (Mastermind) hints
- **3 Game Modes** — Solo (campaign), Duo (pass-and-play), Free Play (practice)
- **3 Themes** — LED Classic, Modern Flat, Cyberpunk — switchable in settings, persisted across sessions
- **Seeded RNG** — Same level ID produces the same secret code on every device
- **Star Rating** — 1-3 steps = 3 stars, 4-5 = 2 stars, 6-7 = 1 star
- **Color Blind Mode** — Symbol overlays on game pieces
- **Mobile-First** — Touch targets 44px+, max 480px game width, safe area insets

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript (strict) + Vite 7 |
| Styling | Tailwind CSS 4 + CSS Variables |
| Animation | Framer Motion |
| State | Zustand 5 (with persist middleware) |
| Audio | Howler.js |
| Testing | Vitest + React Testing Library + Playwright |

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check + production build |
| `npm test` | Run all unit/component tests (Vitest) |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:coverage` | Vitest with coverage report |
| `npm run test:e2e` | Playwright E2E tests (iPhone 14, Pixel 7, iPad Mini) |
| `npm run lint` | ESLint |

## Project Structure

```
src/
  logic/        Pure functions: seededRandom, hintEngine, levelGenerator, constants
  stores/       Zustand stores: gameStore, progressStore, settingsStore
  components/   UI: ColorSlot, ColorPicker, Hints, GuessRow, GameBoard, ResultModal
  screens/      Pages: HomeScreen, GameScreen, DuoSetterScreen, SettingsScreen, StatsScreen
  themes/       Theme definitions + CSS variable injection
  types/        TypeScript type definitions
  hooks/        Custom hooks: useSound, useVibrate
  utils/        Sound management utilities
e2e/            Playwright E2E tests
docs/           Spec documents and UI mockups
```

## Game Rules

- 8 possible colors: red, blue, green, yellow, orange, purple, white, pink
- 4-slot secret code, no duplicate colors
- 7 guesses maximum per level
- **Direct hints** (levels 1-100): Per-position feedback — correct, wrong position, or not in code
- **Indirect hints** (levels 101-600): Mastermind-style — count of exact matches + color-only matches

## Difficulty Curve

| Levels | Hint Type | Available Colors |
|--------|-----------|-----------------|
| 1-30 | Direct | 4 |
| 31-60 | Direct | 5 |
| 61-100 | Direct | 6 |
| 101-200 | Indirect | 5 |
| 201-350 | Indirect | 6 |
| 351-500 | Indirect | 7 |
| 501-600 | Indirect | 8 |

## Themes

| Theme | Accent | Style |
|-------|--------|-------|
| LED Classic | `#00FFAA` cyan-green | Retro LED glow effects |
| Modern Flat | `#7C8CF8` periwinkle | Soft dark, no glow, minimal |
| Cyberpunk | `#00F0FF` cyan | Neon glow, magenta accents |

## Test Coverage

- **171 unit/component tests** (Vitest) — logic, stores, components
- **123 E2E tests** (Playwright) — across iPhone 14, Pixel 7, iPad Mini simulators
- Screenshot baselines for visual regression across all 3 themes and devices

## License

MIT
