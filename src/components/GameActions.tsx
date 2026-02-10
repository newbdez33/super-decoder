interface GameActionsProps {
  canSubmit: boolean;
  isComplete: boolean;
  onSubmit: () => void;
  onClear: () => void;
}

export function GameActions({ canSubmit, isComplete, onSubmit, onClear }: GameActionsProps) {
  if (isComplete) return null;

  return (
    <div style={{
      display: 'flex',
      gap: 12,
      justifyContent: 'center',
      padding: '12px 16px',
    }}>
      <button
        aria-label="Clear"
        onClick={onClear}
        style={{
          padding: '12px 24px',
          borderRadius: 12,
          border: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-card)',
          color: 'var(--text-secondary)',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          minHeight: 48,
          fontFamily: "'Exo 2', sans-serif",
        }}
      >
        Clear
      </button>
      <button
        aria-label="Submit guess"
        onClick={onSubmit}
        disabled={!canSubmit}
        style={{
          padding: '12px 32px',
          borderRadius: 12,
          border: 'none',
          backgroundColor: canSubmit ? 'var(--text-accent)' : 'var(--border-subtle)',
          color: canSubmit ? 'var(--bg-deepest)' : 'var(--text-secondary)',
          fontSize: 14,
          fontWeight: 700,
          cursor: canSubmit ? 'pointer' : 'default',
          opacity: canSubmit ? 1 : 0.4,
          minHeight: 48,
          fontFamily: "'Exo 2', sans-serif",
        }}
      >
        Submit
      </button>
    </div>
  );
}
