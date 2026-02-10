interface ToggleProps {
  enabled: boolean;
  onToggle: (value: boolean) => void;
  label: string;
}

export function Toggle({ enabled, onToggle, label }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={() => onToggle(!enabled)}
      style={{
        width: 48,
        height: 28,
        borderRadius: 14,
        border: 'none',
        backgroundColor: enabled ? 'var(--text-accent)' : 'var(--border-subtle)',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        padding: 0,
      }}
    >
      <div style={{
        width: 22,
        height: 22,
        borderRadius: '50%',
        backgroundColor: 'var(--toggle-knob)',
        position: 'absolute',
        top: 3,
        left: enabled ? 23 : 3,
        transition: 'left 0.2s ease',
        boxShadow: `0 1px 3px var(--toggle-shadow)`,
      }} />
    </button>
  );
}
