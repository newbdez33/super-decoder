import type { IndirectHint } from '@super-decoder/shared';

interface IndirectHintsProps {
  hint: IndirectHint;
  colorBlindMode: boolean;
}

const symbolMap = {
  'correct position': '\u2713',
  'correct color': '~',
  'no match': '\u2014',
};

export function IndirectHints({ hint, colorBlindMode }: IndirectHintsProps) {
  const { correctPosition, correctColor } = hint;
  const empty = 4 - correctPosition - correctColor;

  // Build ordered array: green first, then white, then empty
  const dots: Array<{ label: string; color: string }> = [
    ...Array(correctPosition).fill({ label: 'correct position', color: 'var(--hint-correct)' }),
    ...Array(correctColor).fill({ label: 'correct color', color: 'var(--hint-misplaced)' }),
    ...Array(empty).fill({ label: 'no match', color: 'var(--hint-absent)' }),
  ];

  const dotSize = colorBlindMode ? 14 : 10;
  const gridSize = colorBlindMode ? 30 : 28;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '1fr 1fr',
      gap: 3,
      width: gridSize,
      height: gridSize,
    }}>
      {dots.map((dot, i) => (
        <div
          key={i}
          role="img"
          aria-label={dot.label}
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            backgroundColor: dot.color,
            boxShadow: dot.label === 'correct position'
              ? '0 0 4px var(--hint-correct)'
              : dot.label === 'correct color'
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
              {symbolMap[dot.label as keyof typeof symbolMap]}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
