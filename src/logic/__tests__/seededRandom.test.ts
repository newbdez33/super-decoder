import { describe, it, expect } from 'vitest';
import { SeededRandom } from '../seededRandom';

describe('SeededRandom', () => {
  describe('Deterministic sequences', () => {
    it('should produce the same sequence for the same seed', () => {
      const rng1 = new SeededRandom(42);
      const rng2 = new SeededRandom(42);
      const seq1 = Array.from({ length: 10 }, () => rng1.next());
      const seq2 = Array.from({ length: 10 }, () => rng2.next());
      expect(seq1).toEqual(seq2);
    });

    it('should produce different sequences for different seeds', () => {
      const rng1 = new SeededRandom(42);
      const rng2 = new SeededRandom(43);
      const seq1 = Array.from({ length: 10 }, () => rng1.next());
      const seq2 = Array.from({ length: 10 }, () => rng2.next());
      expect(seq1).not.toEqual(seq2);
    });
  });

  describe('nextInt - bounded random integers', () => {
    it('should generate integers within [0, max) range', () => {
      const rng = new SeededRandom(99);
      const results = Array.from({ length: 1000 }, () => rng.nextInt(8));
      for (const r of results) {
        expect(r).toBeGreaterThanOrEqual(0);
        expect(r).toBeLessThan(8);
        expect(Number.isInteger(r)).toBe(true);
      }
    });

    it('should cover the full range over many samples', () => {
      const rng = new SeededRandom(123);
      const seen = new Set<number>();
      for (let i = 0; i < 1000; i++) {
        seen.add(rng.nextInt(8));
      }
      for (let i = 0; i < 8; i++) {
        expect(seen.has(i)).toBe(true);
      }
    });
  });

  describe('shuffle - Fisher-Yates deterministic shuffle', () => {
    it('should produce the same result for the same seed', () => {
      const arr = [0, 1, 2, 3, 4, 5, 6, 7];
      const rng1 = new SeededRandom(100);
      const rng2 = new SeededRandom(100);
      const result1 = rng1.shuffle([...arr]);
      const result2 = rng2.shuffle([...arr]);
      expect(result1).toEqual(result2);
    });

    it('should contain all original elements', () => {
      const arr = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'white', 'pink'];
      const rng = new SeededRandom(42);
      const shuffled = rng.shuffle([...arr]);
      expect(shuffled).toHaveLength(arr.length);
      expect(shuffled.sort()).toEqual([...arr].sort());
    });

    it('should not modify the input array', () => {
      const arr = [1, 2, 3, 4];
      const original = [...arr];
      const rng = new SeededRandom(50);
      rng.shuffle(arr);
      expect(arr).toEqual(original);
    });
  });
});
