import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LevelState, Statistics } from '../types/game';

interface ProgressStore {
  currentLevel: number;
  levelStates: Record<number, LevelState>;
  statistics: Statistics;
  inProgressGame: {
    levelId: number;
    guessHistory: Array<{ colors: string[]; }>;
  } | null;

  // Actions
  completeLevel: (levelId: number, attempts: number, won: boolean) => void;
  advanceLevel: () => void;
  setCurrentLevel: (level: number) => void;
  saveInProgressGame: (levelId: number, guessHistory: Array<{ colors: string[]; }>) => void;
  clearInProgressGame: () => void;
  resetProgress: () => void;
}

const initialStatistics: Statistics = {
  totalPlayed: 0,
  totalWon: 0,
  currentStreak: 0,
  bestStreak: 0,
  averageAttempts: 0,
};

function calculateStars(attempts: number): number {
  if (attempts <= 0) return 0;
  if (attempts <= 3) return 3;
  if (attempts <= 5) return 2;
  return 1;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      currentLevel: 1,
      levelStates: {},
      statistics: { ...initialStatistics },
      inProgressGame: null,

      completeLevel: (levelId: number, attempts: number, won: boolean) => {
        const { levelStates, statistics } = get();
        const existing = levelStates[levelId];
        const stars = won ? calculateStars(attempts) : 0;

        const newLevelState: LevelState = {
          attempts,
          completed: won,
          bestAttempts: existing?.bestAttempts
            ? Math.min(existing.bestAttempts, attempts)
            : attempts,
          stars: existing?.stars ? Math.max(existing.stars, stars) : stars,
        };

        const newStats = { ...statistics };
        newStats.totalPlayed++;
        if (won) {
          newStats.totalWon++;
          newStats.currentStreak++;
          newStats.bestStreak = Math.max(newStats.bestStreak, newStats.currentStreak);
        } else {
          newStats.currentStreak = 0;
        }

        // Update average attempts (only counting wins)
        if (won && newStats.totalWon > 0) {
          const prevTotal = statistics.averageAttempts * (newStats.totalWon - 1);
          newStats.averageAttempts = (prevTotal + attempts) / newStats.totalWon;
        }

        set({
          levelStates: { ...levelStates, [levelId]: newLevelState },
          statistics: newStats,
          inProgressGame: null,
        });
      },

      advanceLevel: () => {
        const { currentLevel } = get();
        if (currentLevel < 600) {
          set({ currentLevel: currentLevel + 1 });
        }
      },

      setCurrentLevel: (level: number) => {
        set({ currentLevel: level });
      },

      saveInProgressGame: (levelId, guessHistory) => {
        set({ inProgressGame: { levelId, guessHistory } });
      },

      clearInProgressGame: () => {
        set({ inProgressGame: null });
      },

      resetProgress: () => {
        set({
          currentLevel: 1,
          levelStates: {},
          statistics: { ...initialStatistics },
          inProgressGame: null,
        });
      },
    }),
    { name: 'super-decoder-progress' }
  )
);
