import { MAX_GUESSES } from '../logic/constants';

interface GameHeaderProps {
  levelId: number;
  currentRound: number;
  mode: 'easy' | 'advanced';
  onBack: () => void;
}

export function GameHeader({ levelId, currentRound, mode, onBack }: GameHeaderProps) {
  const formattedLevel = String(levelId).padStart(3, '0');
  const dots = Array.from({ length: MAX_GUESSES }, (_, i) => i < currentRound - 1);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 16px',
    }}>
      <button
        aria-label="Back"
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-primary)',
          fontSize: 20,
          cursor: 'pointer',
          padding: 8,
          minWidth: 44,
          minHeight: 44,
        }}
      >
        &larr;
      </button>

      <div style={{ textAlign: 'center' }}>
        <div className="font-display" style={{
          fontSize: 18,
          fontWeight: 700,
          color: 'var(--text-accent)',
          letterSpacing: 2,
        }}>
          LV.{formattedLevel}
        </div>
        <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginTop: 4 }}>
          {dots.map((used, i) => (
            <div
              key={i}
              aria-label={used ? 'used attempt' : 'remaining attempt'}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: used ? 'var(--text-accent)' : 'var(--border-subtle)',
              }}
            />
          ))}
        </div>
      </div>

      <span style={{
        fontSize: 11,
        fontWeight: 600,
        color: mode === 'easy' ? 'var(--hint-correct)' : 'var(--led-orange)',
        textTransform: 'uppercase',
        letterSpacing: 1,
        minWidth: 44,
        textAlign: 'right',
      }}>
        {mode}
      </span>
    </div>
  );
}
