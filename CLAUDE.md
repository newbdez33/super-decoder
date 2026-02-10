# Super Decoder — Claude Code Guide

## Project Overview
Super Decoder is a Mastermind-based code-breaking puzzle PWA with 600 levels, solo/duo/free play modes, LED retro-futuristic UI.

## Tech Stack
- **Framework**: React 19 + TypeScript (strict mode) + Vite 7
- **Styling**: Tailwind CSS 4 + CSS Variables (LED glow effects)
- **Animation**: Framer Motion
- **State**: Zustand 5 (with persist middleware for localStorage)
- **Audio**: Howler.js
- **PWA**: vite-plugin-pwa
- **Testing**: Vitest + React Testing Library + Playwright

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Type-check and build
- `npm test` — Run all Vitest tests
- `npm run test:watch` — Vitest in watch mode
- `npm run test:coverage` — Vitest with coverage
- `npm run test:e2e` — Playwright E2E tests
- `npm run lint` — ESLint

## Project Structure
```
src/
├── logic/          # Pure functions: seededRandom, hintEngine, levelGenerator, constants
├── stores/         # Zustand stores: gameStore, progressStore, settingsStore
├── components/     # UI components: ColorSlot, ColorPicker, Hints, GuessRow, GameBoard
├── screens/        # Full pages: HomeScreen, GameScreen, DuoSetterScreen, Settings
├── hooks/          # Custom hooks: useSound, useVibrate
├── types/          # TypeScript type definitions
├── utils/          # Utilities: sound management
└── test/           # Test setup files
e2e/                # Playwright E2E tests
docs/               # Spec documents and UI mockups
```

## Development Methodology: BDD (Behavior-Driven Development)
- **Tests first**: Write failing tests (RED), then implement code to pass (GREEN)
- **Phase order**: P0 (core engine) → P1 (state) → P2 (UI) → P3 (integration) → P4-P8
- **P0 target**: 100% coverage on pure logic functions

## Key Specs
- 8 colors: red, blue, green, yellow, orange, purple, white, pink
- 4-slot secret code, no duplicate colors
- 7 max guesses per level
- 600 levels: 1-100 easy (direct hints), 101-600 advanced (indirect hints)
- Star rating: 1-3 steps = 3★, 4-5 = 2★, 6-7 = 1★
- Seeded RNG ensures same level ID → same secret code across all devices

## Key Algorithms
- **Direct hints**: Per-position feedback (correct / wrong_position / not_exist)
- **Indirect hints**: Two-pass Mastermind algorithm — first pass counts exact matches, second pass counts color-only matches from remaining. Prevents double-counting.
- **Level generator**: Seeded RNG from level ID, difficulty curve controls color pool size

## Difficulty Curve
| Levels   | Mode     | Hint Type | Colors |
|----------|----------|-----------|--------|
| 1-30     | easy     | direct    | 4      |
| 31-60    | easy     | direct    | 5      |
| 61-100   | easy     | direct    | 6      |
| 101-200  | advanced | indirect  | 5      |
| 201-350  | advanced | indirect  | 6      |
| 351-500  | advanced | indirect  | 7      |
| 501-600  | advanced | indirect  | 8      |

## Testing Guidelines
- Component tests: Use semantic queries (`getByRole`, `getByText`), not CSS class assertions
- Store tests: Test Zustand stores directly without UI rendering
- Each test file uses `beforeEach` to reset state
- No `any` types — full TypeScript strict mode

## Design Rules
- Deep dark theme only (--bg-deepest: #0A0A12)
- LED glow effects via multi-layer box-shadow
- Fonts: Orbitron (numbers), Exo 2 (text), JetBrains Mono (code)
- Touch targets minimum 44px
- Max game width 480px, centered on larger screens
- Safe Area Insets for notch devices
- All animations via Framer Motion
