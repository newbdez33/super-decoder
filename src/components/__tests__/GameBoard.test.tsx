import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameBoard } from '../GameBoard';
import { useGameStore } from '../../stores/gameStore';
import { MAX_GUESSES } from '../../logic/constants';
import type { Color } from '../../types/game';

describe('GameBoard', () => {
  beforeEach(() => {
    useGameStore.getState().reset();
  });

  describe('initial render', () => {
    it('should render 7 guess rows', () => {
      useGameStore.getState().initLevel(1);
      render(<GameBoard />);
      // Each row has 4 color slots; 7 rows = 28 slots total
      // The first row is the current active row with empty slots
      // The remaining 6 rows are inactive with empty slots
      // All empty slots have the "Empty slot" label
      const emptySlots = screen.getAllByLabelText('Empty slot');
      expect(emptySlots).toHaveLength(MAX_GUESSES * 4);
    });

    it('should have the first row as active', () => {
      useGameStore.getState().initLevel(1);
      render(<GameBoard />);
      // The first row's slots should not be disabled (they are active/current)
      const emptySlots = screen.getAllByLabelText('Empty slot');
      // First 4 slots (first row) should not be disabled
      for (let i = 0; i < 4; i++) {
        expect(emptySlots[i]).not.toHaveAttribute('aria-disabled', 'true');
      }
    });

    it('should have rows 2-7 as inactive and disabled', () => {
      useGameStore.getState().initLevel(1);
      render(<GameBoard />);
      const emptySlots = screen.getAllByLabelText('Empty slot');
      // Rows 2-7 (indices 4 through 27) should be disabled
      for (let i = 4; i < MAX_GUESSES * 4; i++) {
        expect(emptySlots[i]).toHaveAttribute('aria-disabled', 'true');
      }
    });
  });

  describe('after submitting a guess', () => {
    it('should show the completed guess in the first row and advance to the second', () => {
      useGameStore.getState().initLevel(1);
      const store = useGameStore.getState();
      const availableColors = store.availableColors;

      // Pick 4 distinct colors for a valid guess
      const guessColors: Color[] = availableColors.slice(0, 4);
      useGameStore.getState().setCurrentGuess(guessColors);
      useGameStore.getState().submitGuess();

      render(<GameBoard />);

      // The submitted guess row should show the colors
      for (const color of guessColors) {
        expect(screen.getByLabelText(`${color} slot`)).toBeInTheDocument();
      }

      // After 1 submitted guess, there should be (MAX_GUESSES - 1) * 4 empty slots
      // plus the 4 empty slots in the new current row = (MAX_GUESSES - 1) * 4
      const emptySlots = screen.getAllByLabelText('Empty slot');
      expect(emptySlots).toHaveLength((MAX_GUESSES - 1) * 4);
    });

    it('should show hints for the completed guess row', () => {
      useGameStore.getState().initLevel(1); // easy mode = direct hints
      const store = useGameStore.getState();
      const guessColors: Color[] = store.availableColors.slice(0, 4);
      useGameStore.getState().setCurrentGuess(guessColors);
      useGameStore.getState().submitGuess();

      render(<GameBoard />);

      // Direct hints produce hint indicators with accessible labels
      const hintIndicators = screen.getAllByRole('img');
      expect(hintIndicators).toHaveLength(4);
    });
  });

  describe('game progression', () => {
    it('should advance the active row after each guess', () => {
      useGameStore.getState().initLevel(1);
      const store = useGameStore.getState();
      const available = store.availableColors;

      // Submit 2 guesses
      const guess1: Color[] = available.slice(0, 4);
      useGameStore.getState().setCurrentGuess(guess1);
      useGameStore.getState().submitGuess();

      const guess2: Color[] = available.slice(0, 4);
      useGameStore.getState().setCurrentGuess(guess2);
      useGameStore.getState().submitGuess();

      render(<GameBoard />);

      // 2 rows filled, 5 rows empty
      const emptySlots = screen.getAllByLabelText('Empty slot');
      expect(emptySlots).toHaveLength((MAX_GUESSES - 2) * 4);
    });

    it('should have the correct number of hint indicator rows after multiple guesses', () => {
      useGameStore.getState().initLevel(1);
      const store = useGameStore.getState();
      const available = store.availableColors;

      // Submit 3 guesses
      for (let i = 0; i < 3; i++) {
        const guess: Color[] = available.slice(0, 4);
        useGameStore.getState().setCurrentGuess(guess);
        useGameStore.getState().submitGuess();
      }

      render(<GameBoard />);

      // 3 completed rows, each with 4 hint indicators = 12 hint indicators
      const hintIndicators = screen.getAllByRole('img');
      expect(hintIndicators).toHaveLength(3 * 4);
    });
  });
});
