import type { Color, Guess } from '@super-decoder/shared';
import { ColorSlot } from './ColorSlot';
import { DirectHints } from './DirectHints';
import { IndirectHints } from './IndirectHints';

interface GuessRowProps {
  guess: Guess | null;
  isActive: boolean;
  isCurrent: boolean;
  hintType: 'direct' | 'indirect';
  currentGuess: (Color | null)[];
  selectedSlot: number;
  onSlotClick: (index: number) => void;
  colorBlindMode: boolean;
}

export function GuessRow({
  guess,
  isActive,
  isCurrent,
  hintType,
  currentGuess,
  selectedSlot,
  onSlotClick,
  colorBlindMode,
}: GuessRowProps) {
  const isCompleted = guess !== null;
  const isDisabled = !isActive && !isCurrent;

  const colors = isCompleted
    ? guess.colors
    : isCurrent
      ? currentGuess
      : [null, null, null, null];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 12px',
        borderRadius: 8,
        backgroundColor: isCurrent ? 'var(--bg-card)' : 'transparent',
        border: isCurrent ? '1px solid var(--border-subtle)' : '1px solid transparent',
        opacity: isCompleted ? 0.7 : 1,
      }}
    >
      <div style={{ display: 'flex', gap: 6 }}>
        {colors.map((color, i) => (
          <ColorSlot
            key={i}
            color={color}
            isSelected={isCurrent && i === selectedSlot}
            isDisabled={isCompleted || isDisabled}
            colorBlindMode={colorBlindMode}
            onClick={() => onSlotClick(i)}
          />
        ))}
      </div>

      <div style={{ marginLeft: 8, minWidth: 28 }}>
        {isCompleted && guess.directHints && hintType === 'direct' && (
          <DirectHints hints={guess.directHints} />
        )}
        {isCompleted && guess.indirectHint && hintType === 'indirect' && (
          <IndirectHints hint={guess.indirectHint} />
        )}
      </div>
    </div>
  );
}
