import type { IndirectHint } from '@super-decoder/shared';

interface IndirectHintsProps {
  hint: IndirectHint;
}

export function IndirectHints({ hint }: IndirectHintsProps) {
  const { correctPosition, correctColor } = hint;
  const empty = 4 - correctPosition - correctColor;

  // Build ordered array: green first, then white, then empty
  const dots: Array<{ label: string; color: string }> = [
    ...Array(correctPosition).fill({ label: 'correct position', color: 'var(--hint-correct)' }),
    ...Array(correctColor).fill({ label: 'correct color', color: 'var(--hint-misplaced)' }),
    ...Array(empty).fill({ label: 'no match', color: 'var(--hint-absent)' }),
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '1fr 1fr',
      gap: 3,
      width: 28,
      height: 28,
    }}>
      {dots.map((dot, i) => (
        <div
          key={i}
          role="img"
          aria-label={dot.label}
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: dot.color,
            boxShadow: dot.label === 'correct position'
              ? '0 0 4px var(--hint-correct)'
              : dot.label === 'correct color'
                ? '0 0 4px var(--hint-glow)'
                : 'none',
          }}
        />
      ))}
    </div>
  );
}
