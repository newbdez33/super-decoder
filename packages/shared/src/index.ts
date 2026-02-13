// Logic
export { SeededRandom } from './logic/seededRandom.ts';
export { getDirectHints, getIndirectHints } from './logic/hintEngine.ts';
export { generateLevel } from './logic/levelGenerator.ts';
export { COLORS, COLOR_NAMES, MAX_GUESSES, CODE_LENGTH, TOTAL_LEVELS } from './logic/constants.ts';

// Types
export type {
  Color,
  HintStatus,
  DirectHint,
  IndirectHint,
  Level,
  Guess,
  GameState,
  LevelState,
  Statistics,
  UserProgress,
  ColorDefinition,
  Settings,
  SoundName,
} from './types/game.ts';
export type { ThemeId, ThemeVariables, ThemeDefinition } from './types/theme.ts';

// Themes (pure data)
export { THEMES, THEME_IDS, DEFAULT_THEME } from './themes/themes.ts';

// Stores
export { useGameStore } from './stores/gameStore.ts';
export { createProgressStore } from './stores/createProgressStore.ts';
export type { ProgressStore } from './stores/createProgressStore.ts';
export { createSettingsStore } from './stores/createSettingsStore.ts';
export type { SettingsStore } from './stores/createSettingsStore.ts';
