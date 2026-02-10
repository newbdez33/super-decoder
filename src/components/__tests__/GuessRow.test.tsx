import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GuessRow } from '../GuessRow';
import type { Color, Guess } from '../../types/game';

describe('GuessRow', () => {
  const completedGuess: Guess = {
    colors: ['red', 'blue', 'green', 'yellow'],
    directHints: [
      { position: 0, status: 'correct' },
      { position: 1, status: 'wrong_position' },
      { position: 2, status: 'not_exist' },
      { position: 3, status: 'correct' },
    ],
  };

  const completedGuessIndirect: Guess = {
    colors: ['red', 'blue', 'green', 'yellow'],
    indirectHint: { correctPosition: 2, correctColor: 1 },
  };

  describe('completed row', () => {
    it('should display the guess colors', () => {
      render(
        <GuessRow
          guess={completedGuess}
          isActive={false}
          isCurrent={false}
          hintType="direct"
          currentGuess={[null, null, null, null]}
          selectedSlot={0}
          onSlotClick={() => {}}
          colorBlindMode={false}
        />
      );
      expect(screen.getByLabelText('red slot')).toBeInTheDocument();
      expect(screen.getByLabelText('blue slot')).toBeInTheDocument();
      expect(screen.getByLabelText('green slot')).toBeInTheDocument();
      expect(screen.getByLabelText('yellow slot')).toBeInTheDocument();
    });

    it('should display direct hints alongside the guess', () => {
      render(
        <GuessRow
          guess={completedGuess}
          isActive={false}
          isCurrent={false}
          hintType="direct"
          currentGuess={[null, null, null, null]}
          selectedSlot={0}
          onSlotClick={() => {}}
          colorBlindMode={false}
        />
      );
      expect(screen.getAllByLabelText('correct')).toHaveLength(2);
      expect(screen.getAllByLabelText('wrong position')).toHaveLength(1);
      expect(screen.getAllByLabelText('not exist')).toHaveLength(1);
    });

    it('should have dimmed appearance (reduced opacity) for completed rows', () => {
      const { container } = render(
        <GuessRow
          guess={completedGuess}
          isActive={false}
          isCurrent={false}
          hintType="direct"
          currentGuess={[null, null, null, null]}
          selectedSlot={0}
          onSlotClick={() => {}}
          colorBlindMode={false}
        />
      );
      const row = container.firstElementChild as HTMLElement;
      const opacity = row.style.opacity;
      expect(Number(opacity)).toBeLessThan(1);
    });
  });

  describe('current active row', () => {
    it('should render currentGuess slots', () => {
      const currentGuess: (Color | null)[] = ['red', null, 'green', null];
      render(
        <GuessRow
          guess={null}
          isActive={true}
          isCurrent={true}
          hintType="direct"
          currentGuess={currentGuess}
          selectedSlot={1}
          onSlotClick={() => {}}
          colorBlindMode={false}
        />
      );
      expect(screen.getByLabelText('red slot')).toBeInTheDocument();
      expect(screen.getByLabelText('green slot')).toBeInTheDocument();
      expect(screen.getAllByLabelText('Empty slot')).toHaveLength(2);
    });

    it('should mark the selected slot with aria-selected', () => {
      const currentGuess: (Color | null)[] = [null, null, null, null];
      render(
        <GuessRow
          guess={null}
          isActive={true}
          isCurrent={true}
          hintType="direct"
          currentGuess={currentGuess}
          selectedSlot={2}
          onSlotClick={() => {}}
          colorBlindMode={false}
        />
      );
      const emptySlots = screen.getAllByLabelText('Empty slot');
      expect(emptySlots[2]).toHaveAttribute('aria-selected', 'true');
    });

    it('should fire onSlotClick when a slot is clicked', () => {
      const handleSlotClick = vi.fn();
      const currentGuess: (Color | null)[] = ['red', null, null, null];
      render(
        <GuessRow
          guess={null}
          isActive={true}
          isCurrent={true}
          hintType="direct"
          currentGuess={currentGuess}
          selectedSlot={0}
          onSlotClick={handleSlotClick}
          colorBlindMode={false}
        />
      );
      fireEvent.click(screen.getByLabelText('red slot'));
      expect(handleSlotClick).toHaveBeenCalledWith(0);
    });

    it('should not display any hint indicators', () => {
      render(
        <GuessRow
          guess={null}
          isActive={true}
          isCurrent={true}
          hintType="direct"
          currentGuess={[null, null, null, null]}
          selectedSlot={0}
          onSlotClick={() => {}}
          colorBlindMode={false}
        />
      );
      expect(screen.queryByLabelText('correct')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('wrong position')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('not exist')).not.toBeInTheDocument();
    });
  });

  describe('unused row (future row)', () => {
    it('should render empty slots', () => {
      render(
        <GuessRow
          guess={null}
          isActive={false}
          isCurrent={false}
          hintType="direct"
          currentGuess={[null, null, null, null]}
          selectedSlot={0}
          onSlotClick={() => {}}
          colorBlindMode={false}
        />
      );
      expect(screen.getAllByLabelText('Empty slot')).toHaveLength(4);
    });

    it('should have disabled slots that are not clickable', () => {
      const handleSlotClick = vi.fn();
      render(
        <GuessRow
          guess={null}
          isActive={false}
          isCurrent={false}
          hintType="direct"
          currentGuess={[null, null, null, null]}
          selectedSlot={0}
          onSlotClick={handleSlotClick}
          colorBlindMode={false}
        />
      );
      const slots = screen.getAllByLabelText('Empty slot');
      for (const slot of slots) {
        expect(slot).toHaveAttribute('aria-disabled', 'true');
      }
      fireEvent.click(slots[0]);
      expect(handleSlotClick).not.toHaveBeenCalled();
    });
  });

  describe('hint type display', () => {
    it('should show DirectHints when hintType is "direct"', () => {
      render(
        <GuessRow
          guess={completedGuess}
          isActive={false}
          isCurrent={false}
          hintType="direct"
          currentGuess={[null, null, null, null]}
          selectedSlot={0}
          onSlotClick={() => {}}
          colorBlindMode={false}
        />
      );
      // Direct hints render individual statuses as aria-labels
      expect(screen.getAllByLabelText('correct')).toHaveLength(2);
    });

    it('should show IndirectHints when hintType is "indirect"', () => {
      render(
        <GuessRow
          guess={completedGuessIndirect}
          isActive={false}
          isCurrent={false}
          hintType="indirect"
          currentGuess={[null, null, null, null]}
          selectedSlot={0}
          onSlotClick={() => {}}
          colorBlindMode={false}
        />
      );
      // Indirect hints use correct position / correct color labels
      expect(screen.getAllByLabelText('correct position')).toHaveLength(2);
      expect(screen.getAllByLabelText('correct color')).toHaveLength(1);
      expect(screen.getAllByLabelText('no match')).toHaveLength(1);
    });
  });

  describe('color blind mode', () => {
    it('should pass colorBlindMode to slots in the current row', () => {
      render(
        <GuessRow
          guess={null}
          isActive={true}
          isCurrent={true}
          hintType="direct"
          currentGuess={['red', null, null, null]}
          selectedSlot={1}
          onSlotClick={() => {}}
          colorBlindMode={true}
        />
      );
      // The red slot should show its symbol (circle) in color blind mode
      expect(screen.getByText('\u25CF')).toBeInTheDocument();
    });
  });
});
