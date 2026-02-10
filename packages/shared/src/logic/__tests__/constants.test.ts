import { describe, it, expect } from 'vitest';
import { COLORS, MAX_GUESSES, CODE_LENGTH, TOTAL_LEVELS } from '../constants';

describe('Color System', () => {
  it('should define exactly 8 colors', () => {
    expect(COLORS).toHaveLength(8);
  });

  it('should have unique color names', () => {
    const names = COLORS.map(c => c.name);
    expect(new Set(names).size).toBe(8);
  });

  it('should have hex values for each color', () => {
    for (const color of COLORS) {
      expect(color.hex).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it('should have colorblind symbols for each color', () => {
    for (const color of COLORS) {
      expect(color.symbol).toBeTruthy();
      expect(typeof color.symbol).toBe('string');
    }
  });

  it('should have unique symbols', () => {
    const symbols = COLORS.map(c => c.symbol);
    expect(new Set(symbols).size).toBe(8);
  });
});

describe('Game Parameters', () => {
  it('should define max guesses as 7', () => {
    expect(MAX_GUESSES).toBe(7);
  });

  it('should define code length as 4', () => {
    expect(CODE_LENGTH).toBe(4);
  });

  it('should define total levels as 600', () => {
    expect(TOTAL_LEVELS).toBe(600);
  });
});
