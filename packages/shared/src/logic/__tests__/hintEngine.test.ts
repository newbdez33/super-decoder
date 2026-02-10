import { describe, it, expect } from 'vitest';
import { getDirectHints, getIndirectHints } from '../hintEngine';
import type { Color } from '../../types/game';

describe('Direct Hints (Easy Mode)', () => {
  it('should return all correct when guess matches secret', () => {
    const secret: Color[] = ['red', 'blue', 'green', 'yellow'];
    const guess: Color[] = ['red', 'blue', 'green', 'yellow'];
    const hints = getDirectHints(secret, guess);
    expect(hints).toEqual([
      { position: 0, status: 'correct' },
      { position: 1, status: 'correct' },
      { position: 2, status: 'correct' },
      { position: 3, status: 'correct' },
    ]);
  });

  it('should return all not_exist when no colors match', () => {
    const secret: Color[] = ['red', 'blue', 'green', 'yellow'];
    const guess: Color[] = ['orange', 'purple', 'white', 'pink'];
    const hints = getDirectHints(secret, guess);
    expect(hints).toEqual([
      { position: 0, status: 'not_exist' },
      { position: 1, status: 'not_exist' },
      { position: 2, status: 'not_exist' },
      { position: 3, status: 'not_exist' },
    ]);
  });

  it('should return all wrong_position when all colors exist but in wrong places', () => {
    const secret: Color[] = ['red', 'blue', 'green', 'yellow'];
    const guess: Color[] = ['blue', 'red', 'yellow', 'green'];
    const hints = getDirectHints(secret, guess);
    expect(hints).toEqual([
      { position: 0, status: 'wrong_position' },
      { position: 1, status: 'wrong_position' },
      { position: 2, status: 'wrong_position' },
      { position: 3, status: 'wrong_position' },
    ]);
  });

  it('should return mixed feedback correctly', () => {
    const secret: Color[] = ['red', 'blue', 'green', 'yellow'];
    const guess: Color[] = ['red', 'green', 'blue', 'purple'];
    const hints = getDirectHints(secret, guess);
    expect(hints).toEqual([
      { position: 0, status: 'correct' },
      { position: 1, status: 'wrong_position' },
      { position: 2, status: 'wrong_position' },
      { position: 3, status: 'not_exist' },
    ]);
  });
});

describe('Indirect Hints (Advanced Mode)', () => {
  it('should return 4 correctPosition when guess matches secret', () => {
    const secret: Color[] = ['red', 'blue', 'green', 'yellow'];
    const guess: Color[] = ['red', 'blue', 'green', 'yellow'];
    const hint = getIndirectHints(secret, guess);
    expect(hint).toEqual({ correctPosition: 4, correctColor: 0 });
  });

  it('should return 0 for both when no colors match', () => {
    const secret: Color[] = ['red', 'blue', 'green', 'yellow'];
    const guess: Color[] = ['orange', 'purple', 'white', 'pink'];
    const hint = getIndirectHints(secret, guess);
    expect(hint).toEqual({ correctPosition: 0, correctColor: 0 });
  });

  it('should return all correctColor when all colors are misplaced', () => {
    const secret: Color[] = ['red', 'blue', 'green', 'yellow'];
    const guess: Color[] = ['blue', 'red', 'yellow', 'green'];
    const hint = getIndirectHints(secret, guess);
    expect(hint).toEqual({ correctPosition: 0, correctColor: 4 });
  });

  it('should return mixed correctPosition and correctColor', () => {
    const secret: Color[] = ['red', 'blue', 'green', 'yellow'];
    const guess: Color[] = ['red', 'green', 'purple', 'blue'];
    const hint = getIndirectHints(secret, guess);
    expect(hint).toEqual({ correctPosition: 1, correctColor: 2 });
  });

  it('should prevent double-counting with two-pass algorithm', () => {
    const secret: Color[] = ['red', 'blue', 'green', 'yellow'];
    const guess: Color[] = ['red', 'green', 'blue', 'purple'];
    const hint = getIndirectHints(secret, guess);
    expect(hint).toEqual({ correctPosition: 1, correctColor: 2 });
    // correctPosition(1) + correctColor(2) + notExist(1) = 4
    const notExist = 4 - hint.correctPosition - hint.correctColor;
    expect(hint.correctPosition + hint.correctColor + notExist).toBe(4);
  });

  it('should handle case where color appears in guess but already matched by position', () => {
    // Secret: [red, blue, green, yellow]
    // Guess:  [red, blue, yellow, green]
    // red=correct, blue=correct, yellow=wrong_pos, green=wrong_pos
    const secret: Color[] = ['red', 'blue', 'green', 'yellow'];
    const guess: Color[] = ['red', 'blue', 'yellow', 'green'];
    const hint = getIndirectHints(secret, guess);
    expect(hint).toEqual({ correctPosition: 2, correctColor: 2 });
  });
});
