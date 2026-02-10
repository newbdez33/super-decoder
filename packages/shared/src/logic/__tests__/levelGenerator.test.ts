import { describe, it, expect } from 'vitest';
import { generateLevel } from '../levelGenerator';
import { COLORS } from '../constants';

describe('Level Generator', () => {
  describe('Difficulty curve - color pool', () => {
    const cases = [
      { level: 1, mode: 'easy', hintType: 'direct', colors: 4 },
      { level: 30, mode: 'easy', hintType: 'direct', colors: 4 },
      { level: 31, mode: 'easy', hintType: 'direct', colors: 5 },
      { level: 60, mode: 'easy', hintType: 'direct', colors: 5 },
      { level: 61, mode: 'easy', hintType: 'direct', colors: 6 },
      { level: 100, mode: 'easy', hintType: 'direct', colors: 6 },
      { level: 101, mode: 'advanced', hintType: 'indirect', colors: 5 },
      { level: 200, mode: 'advanced', hintType: 'indirect', colors: 5 },
      { level: 201, mode: 'advanced', hintType: 'indirect', colors: 6 },
      { level: 350, mode: 'advanced', hintType: 'indirect', colors: 6 },
      { level: 351, mode: 'advanced', hintType: 'indirect', colors: 7 },
      { level: 500, mode: 'advanced', hintType: 'indirect', colors: 7 },
      { level: 501, mode: 'advanced', hintType: 'indirect', colors: 8 },
      { level: 600, mode: 'advanced', hintType: 'indirect', colors: 8 },
    ];

    it.each(cases)(
      'level $level should be mode=$mode, hintType=$hintType, colors=$colors',
      ({ level, mode, hintType, colors }) => {
        const result = generateLevel(level);
        expect(result.mode).toBe(mode);
        expect(result.hintType).toBe(hintType);
        expect(result.availableColors).toBe(colors);
      }
    );
  });

  describe('Secret code generation', () => {
    it('should generate a 4-color secret with no duplicates', () => {
      const level = generateLevel(42);
      expect(level.secretCode).toHaveLength(4);
      expect(new Set(level.secretCode).size).toBe(4);
    });

    it('should only use colors from the available pool', () => {
      const allColorNames = COLORS.map(c => c.name);
      for (const levelId of [1, 50, 100, 200, 400, 600]) {
        const level = generateLevel(levelId);
        const pool = allColorNames.slice(0, level.availableColors);
        for (const color of level.secretCode) {
          expect(pool).toContain(color);
        }
      }
    });
  });

  describe('Deterministic generation', () => {
    it('should produce the same secret for the same level ID', () => {
      const level1 = generateLevel(42);
      const level2 = generateLevel(42);
      expect(level1.secretCode).toEqual(level2.secretCode);
    });

    it('should produce different secrets for different level IDs', () => {
      // Not guaranteed to be different for any two, but very likely
      // Test across many to ensure at least some differ
      const secrets = new Set(
        Array.from({ length: 20 }, (_, i) =>
          generateLevel(i + 1).secretCode.join(',')
        )
      );
      expect(secrets.size).toBeGreaterThan(1);
    });
  });

  describe('Boundary checks', () => {
    it('should throw for level 0', () => {
      expect(() => generateLevel(0)).toThrow();
    });

    it('should throw for level 601', () => {
      expect(() => generateLevel(601)).toThrow();
    });

    it('should throw for negative level', () => {
      expect(() => generateLevel(-1)).toThrow();
    });

    it('should not throw for level 1', () => {
      expect(() => generateLevel(1)).not.toThrow();
    });

    it('should not throw for level 600', () => {
      expect(() => generateLevel(600)).not.toThrow();
    });
  });
});
