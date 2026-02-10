import { useSettingsStore } from '../stores/settingsStore';
import { useProgressStore } from '../stores/progressStore';
import { Toggle } from '../components/Toggle';
import { THEMES } from '../themes/themes';

interface SettingsScreenProps {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const settings = useSettingsStore();
  const resetProgress = useProgressStore(s => s.resetProgress);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      resetProgress();
    }
  };

  return (
    <div style={{
      minHeight: '100dvh',
      maxWidth: 480,
      margin: '0 auto',
      padding: '16px 24px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: 'var(--text-primary)',
          fontSize: 20, cursor: 'pointer', padding: 8, minWidth: 44, minHeight: 44,
        }}>
          &larr;
        </button>
        <h2 className="font-display" style={{
          fontSize: 18, fontWeight: 700, color: 'var(--text-accent)', letterSpacing: 2,
        }}>
          SETTINGS
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SettingRow label="Sound Effects">
          <Toggle
            enabled={settings.soundEnabled}
            onToggle={settings.setSoundEnabled}
            label="Sound effects"
          />
        </SettingRow>

        <SettingRow label="Vibration">
          <Toggle
            enabled={settings.vibrationEnabled}
            onToggle={settings.setVibrationEnabled}
            label="Vibration"
          />
        </SettingRow>

        <Divider label="Theme" />

        <div style={{ display: 'flex', gap: 10 }}>
          {THEMES.map(theme => (
            <ThemeCard
              key={theme.id}
              name={theme.name}
              accent={theme.variables['--text-accent']}
              bg={theme.variables['--bg-deepest']}
              isActive={settings.theme === theme.id}
              onClick={() => settings.setTheme(theme.id)}
            />
          ))}
        </div>

        <Divider label="Gameplay" />

        <SettingRow label="Color Blind Mode">
          <Toggle
            enabled={settings.colorBlindMode}
            onToggle={settings.setColorBlindMode}
            label="Color blind mode"
          />
        </SettingRow>

        <SettingRow label="Language">
          <select
            value={settings.language}
            onChange={(e) => settings.setLanguage(e.target.value as 'en' | 'ja' | 'zh')}
            aria-label="Language"
            style={{
              padding: '8px 12px', borderRadius: 8,
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              fontSize: 14, fontFamily: "'Exo 2', sans-serif",
            }}
          >
            <option value="en">English</option>
            <option value="ja">Japanese</option>
            <option value="zh">Chinese</option>
          </select>
        </SettingRow>

        <Divider label="Data" />

        <button
          onClick={handleReset}
          style={{
            padding: '14px 20px', borderRadius: 12,
            border: '1px solid var(--failure)',
            backgroundColor: 'transparent',
            color: 'var(--failure)',
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
            fontFamily: "'Exo 2', sans-serif", minHeight: 48,
          }}
        >
          Reset All Progress
        </button>
      </div>
    </div>
  );
}

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 0',
    }}>
      <span style={{ color: 'var(--text-primary)', fontSize: 15 }}>{label}</span>
      {children}
    </div>
  );
}

function ThemeCard({ name, accent, bg, isActive, onClick }: {
  name: string;
  accent: string;
  bg: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={isActive}
      onClick={onClick}
      style={{
        flex: 1,
        padding: '12px 8px',
        borderRadius: 12,
        border: isActive ? `2px solid ${accent}` : '2px solid var(--border-subtle)',
        backgroundColor: bg,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        minHeight: 80,
      }}
    >
      <div style={{ display: 'flex', gap: 4 }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: accent }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'var(--text-primary)' }} />
      </div>
      <span style={{
        fontSize: 11,
        fontWeight: 600,
        color: isActive ? accent : 'var(--text-secondary)',
        fontFamily: "'Exo 2', sans-serif",
      }}>
        {name}
      </span>
    </button>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div style={{
      color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600,
      textTransform: 'uppercase', letterSpacing: 1,
      paddingTop: 16, borderTop: '1px solid var(--border-subtle)',
    }}>
      {label}
    </div>
  );
}
