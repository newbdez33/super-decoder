# Super Decoder — Claude Code Guide

## Project Overview
Super Decoder is a Mastermind-based code-breaking puzzle game with 600 levels, solo/duo/free play modes, LED retro-futuristic UI. Monorepo with PWA (web) and React Native (mobile) apps sharing game logic.

## Tech Stack
- **Monorepo**: npm workspaces (`packages/*`, `apps/*`)
- **Shared**: TypeScript (strict mode), Zustand 5
- **Web**: React 19 + Vite 7, Tailwind CSS 4, Framer Motion, Howler.js, Playwright
- **Mobile**: Expo SDK 52 + React Native 0.76, Reanimated, expo-haptics, expo-router
- **Testing**: Vitest + React Testing Library + Playwright

## Commands
- `npm test` — Run all Vitest tests (shared + web)
- `npm run build` — Build web app
- `npm run dev` — Start web dev server
- `npm test -w @super-decoder/shared` — Shared package tests only
- `npm test -w @super-decoder/web` — Web app tests only
- `npm run test:e2e -w @super-decoder/web` — Playwright E2E tests
- `npm run lint -w @super-decoder/web` — ESLint
- `npm start -w @super-decoder/mobile` — Start Expo dev server (mobile)
- `npx expo start --android` — Run mobile app on Android emulator (from `apps/mobile/`)

## Project Structure
```
super-decoder/
├── package.json                    # workspaces: ["packages/*", "apps/*"]
├── tsconfig.base.json              # shared TS strict config
├── packages/
│   └── shared/                     # @super-decoder/shared
│       └── src/
│           ├── logic/              # seededRandom, constants, hintEngine, levelGenerator
│           ├── types/              # game.ts, theme.ts
│           ├── themes/             # themes.ts (pure data, NOT applyTheme)
│           ├── stores/             # gameStore, createProgressStore, createSettingsStore
│           └── index.ts            # barrel export
├── apps/
│   ├── web/                        # @super-decoder/web (PWA)
│   │   ├── src/
│   │   │   ├── stores/             # progressStore.ts, settingsStore.ts (localStorage wrappers)
│   │   │   ├── themes/             # applyTheme.ts (web-only, uses document)
│   │   │   ├── components/         # 12 web components (HTML + CSS vars)
│   │   │   ├── screens/            # 5 screens (HTML + framer-motion)
│   │   │   └── test/               # Vitest setup
│   │   └── e2e/                    # Playwright tests
│   └── mobile/                     # @super-decoder/mobile (Expo)
│       ├── app/                    # expo-router pages (_layout, index, game, settings, stats)
│       ├── src/
│       │   ├── components/         # 12 RN components (View, Pressable, Reanimated)
│       │   ├── screens/            # 5 screens (RN + Reanimated)
│       │   ├── stores/             # AsyncStorage wrappers
│       │   └── themes/             # useTheme hook
│       ├── assets/fonts/           # Orbitron + Exo 2 TTFs
│       └── metro.config.js         # monorepo watchFolders config
```

## Architecture: Shared vs Platform-Specific

| Shared (`@super-decoder/shared`) | Web-only (`apps/web`) |
|---|---|
| `logic/*` (seededRandom, hintEngine, levelGenerator, constants) | `applyTheme.ts` (document.documentElement) |
| `types/*` (game.ts, theme.ts) | 12 HTML components (div, button, CSS vars) |
| `themes/themes.ts` (pure data) | 5 screens (framer-motion, window.confirm) |
| `gameStore.ts` (no persistence) | `useSound` (Howler.js), `useVibrate` (navigator) |
| `createProgressStore(storage)` factory | Store wrappers with localStorage |
| `createSettingsStore(storage)` factory | Playwright E2E tests |

| Mobile-only (`apps/mobile`) |
|---|
| `useTheme` hook (pure RN, no CSS vars) |
| 12 RN components (View, Pressable, Reanimated) |
| 5 screens (expo-router navigation) |
| Store wrappers with AsyncStorage |
| expo-haptics for vibration |

## Store Pattern
Persisted stores use factory functions accepting `StateStorage`:
```typescript
// packages/shared: factory
export function createSettingsStore(storage: StateStorage) { ... }

// apps/web: wrapper with localStorage
export const useSettingsStore = createSettingsStore(localStorage);

// apps/mobile: wrapper with AsyncStorage
export const useSettingsStore = createSettingsStore(AsyncStorage);
```

## Development Methodology: BDD (Behavior-Driven Development)
- **Tests first**: Write failing tests (RED), then implement code to pass (GREEN)
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
- All animations via Framer Motion (web) / Reanimated (mobile)

## Android Development Setup
- **Android SDK**: `C:\Users\newbd\Android\Sdk`
- **JDK**: Microsoft OpenJDK 17 (`C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot`)
- **Emulator AVD**: `SuperDecoder` (Pixel 6, Android 14/API 34, Google APIs x86_64)
- **Start emulator**: `emulator -avd SuperDecoder`
- **Metro monorepo**: `metro.config.js` uses `watchFolders = [monorepoRoot]` to resolve `@super-decoder/shared`
