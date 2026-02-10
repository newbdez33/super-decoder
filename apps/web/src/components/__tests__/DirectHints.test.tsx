import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DirectHints } from '../DirectHints';
import type { DirectHint } from '@super-decoder/shared';

describe('DirectHints', () => {
  describe('rendering indicators', () => {
    it('should render 4 hint indicators', () => {
      const hints: DirectHint[] = [
        { position: 0, status: 'correct' },
        { position: 1, status: 'wrong_position' },
        { position: 2, status: 'not_exist' },
        { position: 3, status: 'correct' },
      ];
      render(<DirectHints hints={hints} />);
      const indicators = screen.getAllByRole('img');
      expect(indicators).toHaveLength(4);
    });
  });

  describe('correct status', () => {
    it('should label correct hints with "correct" aria-label', () => {
      const hints: DirectHint[] = [
        { position: 0, status: 'correct' },
        { position: 1, status: 'correct' },
        { position: 2, status: 'correct' },
        { position: 3, status: 'correct' },
      ];
      render(<DirectHints hints={hints} />);
      const correctIndicators = screen.getAllByLabelText('correct');
      expect(correctIndicators).toHaveLength(4);
    });
  });

  describe('wrong_position status', () => {
    it('should label wrong position hints with "wrong position" aria-label', () => {
      const hints: DirectHint[] = [
        { position: 0, status: 'wrong_position' },
        { position: 1, status: 'wrong_position' },
        { position: 2, status: 'wrong_position' },
        { position: 3, status: 'wrong_position' },
      ];
      render(<DirectHints hints={hints} />);
      const wrongPosIndicators = screen.getAllByLabelText('wrong position');
      expect(wrongPosIndicators).toHaveLength(4);
    });
  });

  describe('not_exist status', () => {
    it('should label not-exist hints with "not exist" aria-label', () => {
      const hints: DirectHint[] = [
        { position: 0, status: 'not_exist' },
        { position: 1, status: 'not_exist' },
        { position: 2, status: 'not_exist' },
        { position: 3, status: 'not_exist' },
      ];
      render(<DirectHints hints={hints} />);
      const notExistIndicators = screen.getAllByLabelText('not exist');
      expect(notExistIndicators).toHaveLength(4);
    });
  });

  describe('mixed statuses', () => {
    it('should render each status with the correct accessible label', () => {
      const hints: DirectHint[] = [
        { position: 0, status: 'correct' },
        { position: 1, status: 'wrong_position' },
        { position: 2, status: 'not_exist' },
        { position: 3, status: 'correct' },
      ];
      render(<DirectHints hints={hints} />);
      expect(screen.getAllByLabelText('correct')).toHaveLength(2);
      expect(screen.getAllByLabelText('wrong position')).toHaveLength(1);
      expect(screen.getAllByLabelText('not exist')).toHaveLength(1);
    });

    it('should render 1 correct, 2 wrong position, 1 not exist', () => {
      const hints: DirectHint[] = [
        { position: 0, status: 'correct' },
        { position: 1, status: 'wrong_position' },
        { position: 2, status: 'wrong_position' },
        { position: 3, status: 'not_exist' },
      ];
      render(<DirectHints hints={hints} />);
      expect(screen.getAllByLabelText('correct')).toHaveLength(1);
      expect(screen.getAllByLabelText('wrong position')).toHaveLength(2);
      expect(screen.getAllByLabelText('not exist')).toHaveLength(1);
    });
  });
});
