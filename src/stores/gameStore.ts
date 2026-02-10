import { create } from 'zustand';
import type { Color, Guess } from '../types/game';
import { generateLevel } from '../logic/levelGenerator';
import { getDirectHints, getIndirectHints } from '../logic/hintEngine';
import { MAX_GUESSES, COLOR_NAMES } from '../logic/constants';

interface GameStore {
  // State
  currentLevel: number;
  secretCode: Color[];
  mode: 'easy' | 'advanced';
  hintType: 'direct' | 'indirect';
  availableColors: Color[];
  guesses: Guess[];
  currentRound: number;
  isComplete: boolean;
  isWon: boolean;
  currentGuess: (Color | null)[];
  selectedSlot: number;

  // Computed
  usedColors: Color[];

  // Actions
  initLevel: (levelId: number) => void;
  initCustomGame: (opts: {
    secretCode: Color[];
    mode: 'easy' | 'advanced';
    availableColors: Color[];
  }) => void;
  selectColor: (color: Color) => void;
  setSelectedSlot: (slot: number) => void;
  setCurrentGuess: (colors: Color[]) => void;
  setCurrentGuessRaw: (colors: (Color | null)[]) => void;
  clearCurrentGuess: () => void;
  submitGuess: () => boolean;
  calculateStars: (attempts: number) => number;
  reset: () => void;
}

const initialState = {
  currentLevel: 0,
  secretCode: [] as Color[],
  mode: 'easy' as const,
  hintType: 'direct' as const,
  availableColors: [] as Color[],
  guesses: [] as Guess[],
  currentRound: 1,
  isComplete: false,
  isWon: false,
  currentGuess: [null, null, null, null] as (Color | null)[],
  selectedSlot: 0,
  usedColors: [] as Color[],
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  initLevel: (levelId: number) => {
    const level = generateLevel(levelId);
    set({
      currentLevel: levelId,
      secretCode: level.secretCode,
      mode: level.mode,
      hintType: level.hintType,
      availableColors: COLOR_NAMES.slice(0, level.availableColors),
      guesses: [],
      currentRound: 1,
      isComplete: false,
      isWon: false,
      currentGuess: [null, null, null, null],
      selectedSlot: 0,
      usedColors: [],
    });
  },

  initCustomGame: ({ secretCode, mode, availableColors }) => {
    set({
      currentLevel: 0,
      secretCode,
      mode,
      hintType: mode === 'easy' ? 'direct' : 'indirect',
      availableColors,
      guesses: [],
      currentRound: 1,
      isComplete: false,
      isWon: false,
      currentGuess: [null, null, null, null],
      selectedSlot: 0,
      usedColors: [],
    });
  },

  selectColor: (color: Color) => {
    const { currentGuess, selectedSlot, isComplete } = get();
    if (isComplete) return;

    // Prevent duplicate colors
    const existingIndex = currentGuess.indexOf(color);
    if (existingIndex !== -1 && existingIndex !== selectedSlot) {
      return;
    }

    const newGuess = [...currentGuess];
    newGuess[selectedSlot] = color;

    // Find next empty slot
    let nextSlot = selectedSlot;
    for (let i = 1; i <= 4; i++) {
      const idx = (selectedSlot + i) % 4;
      if (newGuess[idx] === null) {
        nextSlot = idx;
        break;
      }
    }
    // If no empty slot found, stay at current+1 (clamped)
    if (newGuess.every(c => c !== null)) {
      nextSlot = Math.min(selectedSlot + 1, 3);
    }

    const usedColors = newGuess.filter((c): c is Color => c !== null);

    set({
      currentGuess: newGuess,
      selectedSlot: nextSlot,
      usedColors,
    });
  },

  setSelectedSlot: (slot: number) => {
    if (!get().isComplete && slot >= 0 && slot < 4) {
      set({ selectedSlot: slot });
    }
  },

  setCurrentGuess: (colors: Color[]) => {
    const guess: (Color | null)[] = [...colors];
    while (guess.length < 4) guess.push(null);
    set({
      currentGuess: guess.slice(0, 4),
      usedColors: colors.filter((c): c is Color => c !== null),
    });
  },

  setCurrentGuessRaw: (colors: (Color | null)[]) => {
    set({
      currentGuess: [...colors],
      usedColors: colors.filter((c): c is Color => c !== null),
    });
  },

  clearCurrentGuess: () => {
    set({
      currentGuess: [null, null, null, null],
      selectedSlot: 0,
      usedColors: [],
    });
  },

  submitGuess: (): boolean => {
    const { currentGuess, secretCode, hintType, guesses, isComplete } = get();

    // Reject if game is complete
    if (isComplete) return false;

    // Reject incomplete guess
    if (currentGuess.some(c => c === null)) return false;

    const colors = currentGuess as Color[];

    // Reject duplicate colors
    if (new Set(colors).size !== colors.length) return false;

    // Compute hints
    const guess: Guess = { colors: [...colors] };

    if (hintType === 'direct') {
      guess.directHints = getDirectHints(secretCode, colors);
    } else {
      guess.indirectHint = getIndirectHints(secretCode, colors);
    }

    // Check win
    const won =
      hintType === 'direct'
        ? guess.directHints!.every(h => h.status === 'correct')
        : guess.indirectHint!.correctPosition === 4;

    const newGuesses = [...guesses, guess];
    const newRound = newGuesses.length + 1;
    const complete = won || newGuesses.length >= MAX_GUESSES;

    set({
      guesses: newGuesses,
      currentRound: newRound,
      isComplete: complete,
      isWon: won,
      currentGuess: [null, null, null, null],
      selectedSlot: 0,
      usedColors: [],
    });

    return true;
  },

  calculateStars: (attempts: number): number => {
    if (attempts <= 0) return 0;
    if (attempts <= 3) return 3;
    if (attempts <= 5) return 2;
    return 1;
  },

  reset: () => {
    set({ ...initialState, currentGuess: [null, null, null, null], usedColors: [] });
  },
}));
