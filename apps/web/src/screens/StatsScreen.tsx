import { useProgressStore } from '../stores/progressStore';

interface StatsScreenProps {
  onBack: () => void;
}

export function StatsScreen({ onBack }: StatsScreenProps) {
  const stats = useProgressStore(s => s.statistics);
  const currentLevel = useProgressStore(s => s.currentLevel);

  const winRate = stats.totalPlayed > 0
    ? Math.round((stats.totalWon / stats.totalPlayed) * 100)
    : 0;

  return (
    <div style={{
      minHeight: '100dvh',
      maxWidth: 480,
      margin: '0 auto',
      padding: '16px 24px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: 'var(--text-primary)',
          fontSize: 20, cursor: 'pointer', padding: 8, minWidth: 44, minHeight: 44,
        }}>
          &larr;
        </button>
        <h2 className="font-display" style={{
          fontSize: 18, fontWeight: 700, color: 'var(--text-accent)', letterSpacing: 2,
        }}>
          STATISTICS
        </h2>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
      }}>
        <StatCard label="Games Played" value={stats.totalPlayed} />
        <StatCard label="Games Won" value={stats.totalWon} />
        <StatCard label="Win Rate" value={`${winRate}%`} />
        <StatCard label="Current Level" value={currentLevel} accent />
        <StatCard label="Current Streak" value={stats.currentStreak} />
        <StatCard label="Best Streak" value={stats.bestStreak} accent />
        <StatCard
          label="Avg Attempts"
          value={stats.averageAttempts > 0 ? stats.averageAttempts.toFixed(1) : '-'}
        />
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div style={{
      padding: '16px',
      borderRadius: 12,
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      textAlign: 'center',
    }}>
      <div className="font-display" style={{
        fontSize: 24, fontWeight: 700,
        color: accent ? 'var(--text-accent)' : 'var(--text-primary)',
        textShadow: accent ? '0 0 8px var(--text-accent)' : 'none',
      }}>
        {value}
      </div>
      <div style={{
        fontSize: 11, color: 'var(--text-secondary)',
        textTransform: 'uppercase', letterSpacing: 1, marginTop: 4,
      }}>
        {label}
      </div>
    </div>
  );
}
