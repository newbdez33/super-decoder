import type { Level } from '../types/game';
import { COLOR_NAMES, TOTAL_LEVELS } from './constants';
import { SeededRandom } from './seededRandom';

/**
 * Generate a level definition from a level ID (1-600).
 * Uses seeded RNG so the same level ID always produces the same secret code.
 */
export function generateLevel(levelId: number): Level {
  if (levelId < 1 || levelId > TOTAL_LEVELS) {
    throw new RangeError(
      `Level ID must be between 1 and ${TOTAL_LEVELS}, got ${levelId}`
    );
  }

  const rng = new SeededRandom(levelId);

  let mode: 'easy' | 'advanced';
  let numColors: number;

  if (levelId <= 100) {
    mode = 'easy';
    if (levelId <= 30) numColors = 4;
    else if (levelId <= 60) numColors = 5;
    else numColors = 6;
  } else {
    mode = 'advanced';
    if (levelId <= 200) numColors = 5;
    else if (levelId <= 350) numColors = 6;
    else if (levelId <= 500) numColors = 7;
    else numColors = 8;
  }

  const availableColors = COLOR_NAMES.slice(0, numColors);
  const shuffled = rng.shuffle(availableColors);
  const secretCode = shuffled.slice(0, 4);

  return {
    id: levelId,
    mode,
    hintType: mode === 'easy' ? 'direct' : 'indirect',
    availableColors: numColors,
    secretCode,
  };
}
