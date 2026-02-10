import { TOTAL_LEVELS } from '@super-decoder/shared';

interface ProgressBarProps {
  currentLevel: number;
}

export function ProgressBar({ currentLevel }: ProgressBarProps) {
  const progress = ((currentLevel - 1) / TOTAL_LEVELS) * 100;

  return (
    <div style={{ padding: '0 24px' }}>
      <div style={{
        color: 'var(--text-secondary)',
        fontSize: 12,
        marginBottom: 4,
        fontFamily: "'Exo 2', sans-serif",
      }}>
        Level {currentLevel} / {TOTAL_LEVELS}
      </div>
      <div style={{
        height: 4,
        backgroundColor: 'var(--border-subtle)',
        borderRadius: 2,
        overflow: 'hidden',
      }}>
        <div
          role="progressbar"
          aria-valuenow={currentLevel}
          aria-valuemin={1}
          aria-valuemax={TOTAL_LEVELS}
          style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: 'var(--text-accent)',
            borderRadius: 2,
            boxShadow: '0 0 8px var(--text-accent)',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  );
}
