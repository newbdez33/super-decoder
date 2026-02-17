# Super Decoder

A Mastermind-based code-breaking puzzle game with 600 levels, multiple game modes, and a retro-futuristic LED UI. Available as a **PWA** (web) and **native iOS/Android app** (React Native).

**[Play Now](https://newbdez33.github.io/super-decoder/)**

## Features

- **600 Levels** — Progressive difficulty from 4-color direct hints to 8-color indirect (Mastermind) hints
- **3 Game Modes** — Solo (campaign), Duo (pass-and-play), Free Play (practice)
- **3 Themes** — LED Classic, Modern Flat, Cyberpunk — switchable in settings, persisted across sessions
- **Seeded RNG** — Same level ID produces the same secret code on every device
- **Star Rating** — 1-3 steps = 3 stars, 4-5 = 2 stars, 6-7 = 1 star
- **Color Blind Mode** — Symbol overlays on game pieces
- **Cross-Platform** — PWA for web/desktop, Expo app for iOS/Android

## Monorepo Structure

```
super-decoder/
├── packages/shared/       @super-decoder/shared — game logic, types, themes, stores
├── apps/web/              @super-decoder/web — React 19 PWA (Vite + Tailwind + Framer Motion)
└── apps/mobile/           @super-decoder/mobile — React Native app (Expo SDK 52 + Expo Router)
```

## Tech Stack

| Layer | Web (PWA) | Mobile (iOS/Android) | Shared |
|-------|-----------|---------------------|--------|
| Framework | React 19 + Vite 7 | Expo SDK 52 + React Native | TypeScript (strict) |
| Styling | Tailwind CSS 4 + CSS Variables | StyleSheet + theme hook | — |
| Animation | Framer Motion | React Native Reanimated | — |
| State | Zustand 5 (localStorage) | Zustand 5 (AsyncStorage) | Store factories |
| Navigation | useState-based | Expo Router | — |
| Testing | Vitest + RTL + Playwright | — | Vitest |

## Getting Started

```bash
npm install
```

### Web (PWA)

```bash
npm run dev              # Start dev server (http://localhost:5173)
npm run build            # Type-check + production build
npm test                 # Run shared + web tests
npm run test:e2e         # Playwright E2E tests
```

### Mobile (iOS/Android)

```bash
cd apps/mobile
npx expo start           # Start Expo dev server
npx expo start --ios     # Open in iOS Simulator
npx expo start --android # Open in Android Emulator
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start web dev server |
| `npm run build` | Type-check + production build (web) |
| `npm test` | Run all unit/component tests (shared + web) |
| `npm run test:e2e` | Playwright E2E tests (iPhone 14, Pixel 7, iPad Mini) |
| `npm run lint` | ESLint (web) |

## Project Structure

```
packages/shared/src/
  logic/        Pure functions: seededRandom, hintEngine, levelGenerator, constants
  stores/       gameStore + factory functions (createProgressStore, createSettingsStore)
  themes/       Theme definitions (pure data)
  types/        TypeScript type definitions (game.ts, theme.ts)

apps/web/src/
  components/   12 React components (HTML + CSS variables)
  screens/      5 screens (Framer Motion animations)
  stores/       Store wrappers (localStorage persistence)
  themes/       applyTheme.ts (CSS variable injection)

apps/mobile/src/
  components/   12 React Native components (View, Pressable, StyleSheet)
  screens/      5 screens (native navigation)
  stores/       Store wrappers (AsyncStorage persistence)
  themes/       useTheme.ts hook (reads theme variables directly)

apps/web/e2e/   Playwright E2E tests
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
