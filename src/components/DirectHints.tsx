import type { DirectHint } from '../types/game';

interface DirectHintsProps {
  hints: DirectHint[];
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

export function DirectHints({ hints }: DirectHintsProps) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {hints.map((hint, i) => (
        <div
          key={i}
          role="img"
          aria-label={statusLabels[hint.status]}
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: statusColors[hint.status],
            boxShadow: hint.status === 'correct'
              ? '0 0 4px var(--hint-correct)'
              : hint.status === 'wrong_position'
                ? '0 0 4px var(--hint-glow)'
                : 'none',
          }}
        />
      ))}
    </div>
  );
}
