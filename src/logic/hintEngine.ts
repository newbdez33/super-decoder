import type { Color, DirectHint, IndirectHint } from '../types/game';

/**
 * Direct hints: per-position feedback (Easy mode).
 * Each position gets: correct / wrong_position / not_exist.
 */
export function getDirectHints(secret: Color[], guess: Color[]): DirectHint[] {
  return guess.map((color, i) => {
    if (color === secret[i]) {
      return { position: i, status: 'correct' as const };
    } else if (secret.includes(color)) {
      return { position: i, status: 'wrong_position' as const };
    } else {
      return { position: i, status: 'not_exist' as const };
    }
  });
}

/**
 * Indirect hints: aggregate feedback (Advanced mode / Mastermind standard).
 * Two-pass algorithm to prevent double-counting:
 *   Pass 1: Count exact position matches, mark them as consumed.
 *   Pass 2: Count color-only matches from remaining positions.
 */
export function getIndirectHints(secret: Color[], guess: Color[]): IndirectHint {
  let correctPosition = 0;
  let correctColor = 0;

  const secretRemaining: (Color | null)[] = [...secret];
  const guessRemaining: (Color | null)[] = [...guess];

  // Pass 1: exact matches
  for (let i = 0; i < 4; i++) {
    if (guess[i] === secret[i]) {
      correctPosition++;
      secretRemaining[i] = null;
      guessRemaining[i] = null;
    }
  }

  // Pass 2: color-only matches
  for (let i = 0; i < 4; i++) {
    if (guessRemaining[i] === null) continue;
    const matchIndex = secretRemaining.findIndex(
      (c) => c !== null && c === guessRemaining[i]
    );
    if (matchIndex !== -1) {
      correctColor++;
      secretRemaining[matchIndex] = null;
    }
  }

  return { correctPosition, correctColor };
}
