import { describe, it, expect, beforeEach } from 'vitest';
import { useProgressStore } from '../progressStore';

describe('Progress Store', () => {
  beforeEach(() => {
    useProgressStore.getState().resetProgress();
  });

  describe('Level completion', () => {
    it('should save completion after winning a level', () => {
      useProgressStore.getState().completeLevel(1, 3, true);
      const state = useProgressStore.getState();
      expect(state.levelStates[1]).toBeDefined();
      expect(state.levelStates[1].completed).toBe(true);
      expect(state.levelStates[1].attempts).toBe(3);
    });

    it('should update best attempts on repeat completion', () => {
      useProgressStore.getState().completeLevel(1, 5, true);
      useProgressStore.getState().completeLevel(1, 3, true);
      expect(useProgressStore.getState().levelStates[1].bestAttempts).toBe(3);
    });

    it('should keep higher star rating', () => {
      useProgressStore.getState().completeLevel(1, 5, true); // 2 stars
      useProgressStore.getState().completeLevel(1, 2, true); // 3 stars
      expect(useProgressStore.getState().levelStates[1].stars).toBe(3);
    });
  });

  describe('Level advancement', () => {
    it('should advance to next level', () => {
      expect(useProgressStore.getState().currentLevel).toBe(1);
      useProgressStore.getState().advanceLevel();
      expect(useProgressStore.getState().currentLevel).toBe(2);
    });

    it('should not advance past level 600', () => {
      useProgressStore.getState().setCurrentLevel(600);
      useProgressStore.getState().advanceLevel();
      expect(useProgressStore.getState().currentLevel).toBe(600);
    });
  });

  describe('Statistics tracking', () => {
    it('should update totalPlayed and totalWon', () => {
      useProgressStore.getState().completeLevel(1, 3, true);
      useProgressStore.getState().completeLevel(2, 5, true);
      useProgressStore.getState().completeLevel(3, 7, false);
      const stats = useProgressStore.getState().statistics;
      expect(stats.totalPlayed).toBe(3);
      expect(stats.totalWon).toBe(2);
    });

    it('should track current streak', () => {
      useProgressStore.getState().completeLevel(1, 3, true);
      useProgressStore.getState().completeLevel(2, 3, true);
      expect(useProgressStore.getState().statistics.currentStreak).toBe(2);
    });

    it('should reset currentStreak on loss, keep bestStreak', () => {
      useProgressStore.getState().completeLevel(1, 3, true);
      useProgressStore.getState().completeLevel(2, 3, true);
      useProgressStore.getState().completeLevel(3, 7, false);
      const stats = useProgressStore.getState().statistics;
      expect(stats.currentStreak).toBe(0);
      expect(stats.bestStreak).toBe(2);
    });

    it('should calculate averageAttempts', () => {
      useProgressStore.getState().completeLevel(1, 3, true);
      useProgressStore.getState().completeLevel(2, 5, true);
      expect(useProgressStore.getState().statistics.averageAttempts).toBe(4);
    });
  });

  describe('In-progress game saving', () => {
    it('should save and retrieve in-progress game', () => {
      useProgressStore.getState().saveInProgressGame(42, [
        { colors: ['red', 'blue', 'green', 'yellow'] },
      ]);
      const saved = useProgressStore.getState().inProgressGame;
      expect(saved).not.toBeNull();
      expect(saved!.levelId).toBe(42);
      expect(saved!.guessHistory).toHaveLength(1);
    });

    it('should clear in-progress game on completion', () => {
      useProgressStore.getState().saveInProgressGame(1, []);
      useProgressStore.getState().completeLevel(1, 3, true);
      expect(useProgressStore.getState().inProgressGame).toBeNull();
    });
  });

  describe('Reset progress', () => {
    it('should reset all progress to initial state', () => {
      useProgressStore.getState().completeLevel(1, 3, true);
      useProgressStore.getState().advanceLevel();
      useProgressStore.getState().resetProgress();
      const state = useProgressStore.getState();
      expect(state.currentLevel).toBe(1);
      expect(state.levelStates).toEqual({});
      expect(state.statistics.totalPlayed).toBe(0);
    });
  });
});
