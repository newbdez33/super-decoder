export type Color = 'red' | 'blue' | 'green' | 'yellow' | 'orange' | 'purple' | 'white' | 'pink';

export type HintStatus = 'correct' | 'wrong_position' | 'not_exist';

export interface DirectHint {
  position: number;
  status: HintStatus;
}

export interface IndirectHint {
  correctPosition: number;
  correctColor: number;
}

export interface Level {
  id: number;
  mode: 'easy' | 'advanced';
  hintType: 'direct' | 'indirect';
  availableColors: number;
  secretCode: Color[];
}

export interface Guess {
  colors: Color[];
  directHints?: DirectHint[];
  indirectHint?: IndirectHint;
}

export interface GameState {
  currentLevel: number;
  guesses: Guess[];
  maxGuesses: number;
  isComplete: boolean;
  isWon: boolean;
  secretCode: Color[];
  mode: 'easy' | 'advanced';
  hintType: 'direct' | 'indirect';
  availableColors: Color[];
  currentGuess: (Color | null)[];
  selectedSlot: number;
}

export interface LevelState {
  attempts: number;
  completed: boolean;
  bestAttempts: number;
  stars: number;
}

export interface Statistics {
  totalPlayed: number;
  totalWon: number;
  currentStreak: number;
  bestStreak: number;
  averageAttempts: number;
}

export interface UserProgress {
  currentLevel: number;
  levelStates: Record<number, LevelState>;
  statistics: Statistics;
}

export interface ColorDefinition {
  name: Color;
  hex: string;
  symbol: string;
}

export interface Settings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  language: 'en' | 'ja' | 'zh';
  colorBlindMode: boolean;
  theme: import('./theme').ThemeId;
}

export type SoundName = 'tap' | 'place' | 'submit' | 'win' | 'lose' | 'star' | 'clear';

export type VibrationName = 'tap' | 'place' | 'submit' | 'win' | 'lose' | 'star' | 'clear';
