import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../gameStore';
import type { Color } from '../../types/game';

// Helper to get store state directly
const getState = () => useGameStore.getState();
const act = (fn: () => void) => fn();

describe('Game Store', () => {
  beforeEach(() => {
    useGameStore.getState().reset();
  });

  describe('Initialize new level', () => {
    it('should initialize with empty guesses, round 1, status playing', () => {
      act(() => getState().initLevel(42));
      const state = getState();
      expect(state.guesses).toEqual([]);
      expect(state.currentRound).toBe(1);
      expect(state.isComplete).toBe(false);
      expect(state.isWon).toBe(false);
      expect(state.currentLevel).toBe(42);
    });

    it('should set correct mode based on level', () => {
      act(() => getState().initLevel(50));
      expect(getState().mode).toBe('easy');
      expect(getState().hintType).toBe('direct');

      act(() => getState().initLevel(150));
      expect(getState().mode).toBe('advanced');
      expect(getState().hintType).toBe('indirect');
    });

    it('should generate a secret code', () => {
      act(() => getState().initLevel(42));
      expect(getState().secretCode).toHaveLength(4);
    });
  });

  describe('Submit valid guess', () => {
    beforeEach(() => {
      act(() => getState().initLevel(1));
    });

    it('should add guess to history with computed hints', () => {
      const guess: Color[] = ['red', 'blue', 'green', 'yellow'];
      act(() => getState().setCurrentGuess(guess));
      act(() => getState().submitGuess());
      const state = getState();
      expect(state.guesses).toHaveLength(1);
      expect(state.guesses[0].colors).toEqual(guess);
      expect(state.currentRound).toBe(2);
    });

    it('should compute direct hints for easy mode', () => {
      act(() => getState().initLevel(1)); // easy mode
      const secret = getState().secretCode;
      // Submit the secret itself to get all correct
      act(() => getState().setCurrentGuess([...secret]));
      act(() => getState().submitGuess());
      const hints = getState().guesses[0].directHints;
      expect(hints).toBeDefined();
      expect(hints!.every(h => h.status === 'correct')).toBe(true);
    });

    it('should compute indirect hints for advanced mode', () => {
      act(() => getState().initLevel(101)); // advanced mode
      const secret = getState().secretCode;
      act(() => getState().setCurrentGuess([...secret]));
      act(() => getState().submitGuess());
      const hint = getState().guesses[0].indirectHint;
      expect(hint).toBeDefined();
      expect(hint!.correctPosition).toBe(4);
      expect(hint!.correctColor).toBe(0);
    });
  });

  describe('Reject invalid guess', () => {
    beforeEach(() => {
      act(() => getState().initLevel(1));
    });

    it('should reject incomplete guess (less than 4 colors)', () => {
      const incomplete: (Color | null)[] = ['red', 'blue', 'green', null];
      act(() => getState().setCurrentGuessRaw(incomplete));
      const result = getState().submitGuess();
      expect(result).toBe(false);
      expect(getState().guesses).toHaveLength(0);
    });

    it('should reject guess with duplicate colors', () => {
      const duplicate: Color[] = ['red', 'red', 'blue', 'green'];
      act(() => getState().setCurrentGuess(duplicate));
      const result = getState().submitGuess();
      expect(result).toBe(false);
      expect(getState().guesses).toHaveLength(0);
    });
  });

  describe('Win detection', () => {
    it('should detect win when guess matches secret', () => {
      act(() => getState().initLevel(1));
      const secret = getState().secretCode;
      act(() => getState().setCurrentGuess([...secret]));
      act(() => getState().submitGuess());
      expect(getState().isComplete).toBe(true);
      expect(getState().isWon).toBe(true);
    });
  });

  describe('Lose detection (7 guesses exhausted)', () => {
    it('should detect loss after 7 wrong guesses', () => {
      act(() => getState().initLevel(1));
      const secret = getState().secretCode;
      // Make a wrong guess that's guaranteed different from secret
      const allColors: Color[] = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'white', 'pink'];
      const wrongGuess = allColors.filter(c => !secret.includes(c)).slice(0, 4);
      // If not enough wrong colors, just rearrange in wrong positions
      const guess = wrongGuess.length === 4
        ? wrongGuess
        : [secret[1], secret[0], secret[3], secret[2]] as Color[];

      for (let i = 0; i < 7; i++) {
        act(() => getState().setCurrentGuess([...guess]));
        getState().submitGuess();
      }
      expect(getState().isComplete).toBe(true);
      expect(getState().isWon).toBe(false);
    });

    it('should not allow more guesses after game is complete', () => {
      act(() => getState().initLevel(1));
      const secret = getState().secretCode;
      act(() => getState().setCurrentGuess([...secret]));
      act(() => getState().submitGuess());
      expect(getState().isComplete).toBe(true);

      // Try to submit another guess
      act(() => getState().setCurrentGuess([...secret]));
      const result = getState().submitGuess();
      expect(result).toBe(false);
      expect(getState().guesses).toHaveLength(1);
    });
  });

  describe('Current guess input management', () => {
    beforeEach(() => {
      act(() => getState().initLevel(1));
    });

    it('should auto-fill next empty slot when selecting a color', () => {
      act(() => getState().selectColor('red'));
      expect(getState().currentGuess[0]).toBe('red');
      expect(getState().selectedSlot).toBe(1);
    });

    it('should fill slots sequentially', () => {
      act(() => getState().selectColor('red'));
      act(() => getState().selectColor('blue'));
      act(() => getState().selectColor('green'));
      expect(getState().currentGuess).toEqual(['red', 'blue', 'green', null]);
      expect(getState().selectedSlot).toBe(3);
    });

    it('should replace color when clicking a filled slot then selecting', () => {
      act(() => getState().selectColor('red'));
      act(() => getState().selectColor('blue'));
      // Click back on slot 0
      act(() => getState().setSelectedSlot(0));
      act(() => getState().selectColor('green'));
      expect(getState().currentGuess[0]).toBe('green');
    });

    it('should clear current row', () => {
      act(() => getState().selectColor('red'));
      act(() => getState().selectColor('blue'));
      act(() => getState().selectColor('green'));
      act(() => getState().selectColor('yellow'));
      act(() => getState().clearCurrentGuess());
      expect(getState().currentGuess).toEqual([null, null, null, null]);
      expect(getState().selectedSlot).toBe(0);
    });

    it('should track used colors in current guess', () => {
      act(() => getState().selectColor('red'));
      act(() => getState().selectColor('blue'));
      expect(getState().usedColors).toEqual(['red', 'blue']);
    });

    it('should prevent selecting already used color', () => {
      act(() => getState().selectColor('red'));
      act(() => getState().selectColor('red')); // duplicate attempt
      // Red should not appear twice
      const reds = getState().currentGuess.filter(c => c === 'red');
      expect(reds).toHaveLength(1);
    });
  });

  describe('Star rating', () => {
    it.each([
      [1, 3], [2, 3], [3, 3],
      [4, 2], [5, 2],
      [6, 1], [7, 1],
    ])('should give %i star(s) for %i attempt(s)', (attempts, expectedStars) => {
      expect(getState().calculateStars(attempts)).toBe(expectedStars);
    });

    it('should return 0 stars for failure (0 or invalid)', () => {
      expect(getState().calculateStars(0)).toBe(0);
    });
  });
});
