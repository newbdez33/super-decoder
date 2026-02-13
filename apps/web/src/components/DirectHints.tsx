import type { DirectHint } from '@super-decoder/shared';

interface DirectHintsProps {
  hints: DirectHint[];
  colorBlindMode: boolean;
}

const statusLabels: Record<string, string> = {
  correct: 'correct',
  wrong_position: 'wrong position',
  not_exist: 'not exist',
};

const statusColors: Record<string, string> = {
  correct: 'var(--hint-correct)',
  wrong_position: 'var(--hint-misplaced)',
  not_exist: 'var(--hint-absent)',
};

const statusSymbols: Record<string, string> = {
  correct: '\u2713',
  wrong_position: '~',
  not_exist: '\u2014',
};

export function DirectHints({ hints, colorBlindMode }: DirectHintsProps) {
  const dotSize = colorBlindMode ? 14 : 8;

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {hints.map((hint, i) => (
        <div
          key={i}
          role="img"
          aria-label={statusLabels[hint.status]}
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            backgroundColor: statusColors[hint.status],
            boxShadow: hint.status === 'correct'
              ? '0 0 4px var(--hint-correct)'
              : hint.status === 'wrong_position'
                ? '0 0 4px var(--hint-glow)'
                : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {colorBlindMode && (
            <span style={{
              fontSize: 9,
              lineHeight: 1,
              color: '#000',
              fontWeight: 700,
            }}>
              {statusSymbols[hint.status]}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
