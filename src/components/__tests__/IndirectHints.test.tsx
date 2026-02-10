import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IndirectHints } from '../IndirectHints';
import type { IndirectHint } from '../../types/game';

describe('IndirectHints', () => {
  describe('rendering indicators', () => {
    it('should render 4 indicators in total', () => {
      const hint: IndirectHint = { correctPosition: 1, correctColor: 2 };
      render(<IndirectHints hint={hint} />);
      const indicators = screen.getAllByRole('img');
      expect(indicators).toHaveLength(4);
    });
  });

  describe('ordering: green dots first, then white dots, then empty', () => {
    it('should show 1 green, 2 white, 1 empty for correctPosition=1, correctColor=2', () => {
      const hint: IndirectHint = { correctPosition: 1, correctColor: 2 };
      render(<IndirectHints hint={hint} />);
      const indicators = screen.getAllByRole('img');

      // First indicator: green (correct position)
      expect(indicators[0]).toHaveAttribute('aria-label', 'correct position');
      // Next two: white (correct color)
      expect(indicators[1]).toHaveAttribute('aria-label', 'correct color');
      expect(indicators[2]).toHaveAttribute('aria-label', 'correct color');
      // Last: empty (no match)
      expect(indicators[3]).toHaveAttribute('aria-label', 'no match');
    });

    it('should show 4 green for correctPosition=4, correctColor=0', () => {
      const hint: IndirectHint = { correctPosition: 4, correctColor: 0 };
      render(<IndirectHints hint={hint} />);
      const indicators = screen.getAllByRole('img');

      for (const indicator of indicators) {
        expect(indicator).toHaveAttribute('aria-label', 'correct position');
      }
    });

    it('should show 0 green, 4 white for correctPosition=0, correctColor=4', () => {
      const hint: IndirectHint = { correctPosition: 0, correctColor: 4 };
      render(<IndirectHints hint={hint} />);
      const indicators = screen.getAllByRole('img');

      for (const indicator of indicators) {
        expect(indicator).toHaveAttribute('aria-label', 'correct color');
      }
    });

    it('should show 4 empty for correctPosition=0, correctColor=0', () => {
      const hint: IndirectHint = { correctPosition: 0, correctColor: 0 };
      render(<IndirectHints hint={hint} />);
      const indicators = screen.getAllByRole('img');

      for (const indicator of indicators) {
        expect(indicator).toHaveAttribute('aria-label', 'no match');
      }
    });

    it('should show 2 green, 1 white, 1 empty for correctPosition=2, correctColor=1', () => {
      const hint: IndirectHint = { correctPosition: 2, correctColor: 1 };
      render(<IndirectHints hint={hint} />);
      const indicators = screen.getAllByRole('img');

      expect(indicators[0]).toHaveAttribute('aria-label', 'correct position');
      expect(indicators[1]).toHaveAttribute('aria-label', 'correct position');
      expect(indicators[2]).toHaveAttribute('aria-label', 'correct color');
      expect(indicators[3]).toHaveAttribute('aria-label', 'no match');
    });

    it('should show 3 green, 0 white, 1 empty for correctPosition=3, correctColor=0', () => {
      const hint: IndirectHint = { correctPosition: 3, correctColor: 0 };
      render(<IndirectHints hint={hint} />);
      const indicators = screen.getAllByRole('img');

      expect(indicators[0]).toHaveAttribute('aria-label', 'correct position');
      expect(indicators[1]).toHaveAttribute('aria-label', 'correct position');
      expect(indicators[2]).toHaveAttribute('aria-label', 'correct position');
      expect(indicators[3]).toHaveAttribute('aria-label', 'no match');
    });
  });

  describe('2x2 grid layout', () => {
    it('should contain exactly 4 indicator elements regardless of hint values', () => {
      const cases: IndirectHint[] = [
        { correctPosition: 0, correctColor: 0 },
        { correctPosition: 1, correctColor: 1 },
        { correctPosition: 2, correctColor: 2 },
        { correctPosition: 4, correctColor: 0 },
      ];
      for (const hint of cases) {
        const { unmount } = render(<IndirectHints hint={hint} />);
        expect(screen.getAllByRole('img')).toHaveLength(4);
        unmount();
      }
    });
  });
});
