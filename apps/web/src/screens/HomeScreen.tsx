import { motion } from 'framer-motion';
import { useProgressStore } from '../stores/progressStore';
import { ProgressBar } from '../components/ProgressBar';

type Screen = 'home' | 'game' | 'duo-setup' | 'free-play' | 'settings' | 'stats';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const currentLevel = useProgressStore(s => s.currentLevel);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100dvh',
      padding: '40px 24px',
      maxWidth: 480,
      margin: '0 auto',
    }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: 32 }}
      >
        <h1
          className="font-display"
          style={{
            fontSize: 28,
            fontWeight: 900,
            color: 'var(--text-accent)',
            letterSpacing: 4,
            textShadow: '0 0 20px var(--text-accent), 0 0 40px var(--title-glow)',
            lineHeight: 1.3,
          }}
        >
          SUPER<br />DECODER
        </h1>
      </motion.div>

      <div style={{ width: '100%', marginBottom: 32 }}>
        <ProgressBar currentLevel={currentLevel} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
        <MenuButton
          label="SOLO MODE"
          sublabel="Single player"
          icon="▶"
          onClick={() => onNavigate('game')}
          primary
          delay={0.1}
        />
        <MenuButton
          label="DUO MODE"
          sublabel="Two players"
          icon="👥"
          onClick={() => onNavigate('duo-setup')}
          delay={0.2}
        />
        <MenuButton
          label="FREE PLAY"
          sublabel="Practice"
          icon="🎲"
          onClick={() => onNavigate('free-play')}
          delay={0.3}
        />

        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => onNavigate('stats')}
            style={smallBtnStyle}
          >
            Stats
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            onClick={() => onNavigate('settings')}
            style={smallBtnStyle}
          >
            Settings
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function MenuButton({ label, sublabel, icon, onClick, primary, delay }: {
  label: string;
  sublabel: string;
  icon: string;
  onClick: () => void;
  primary?: boolean;
  delay: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '16px 20px',
        borderRadius: 12,
        border: primary ? '1px solid var(--text-accent)' : '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-card)',
        color: 'var(--text-primary)',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        minHeight: 64,
        fontFamily: "'Exo 2', sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 3,
        backgroundColor: primary ? 'var(--text-accent)' : 'var(--border-subtle)',
      }} />
      <span style={{ fontSize: 20, marginLeft: 8 }}>{icon}</span>
      <div>
        <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: 1 }}>{label}</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{sublabel}</div>
      </div>
    </motion.button>
  );
}

const smallBtnStyle: React.CSSProperties = {
  flex: 1,
  padding: '12px 16px',
  borderRadius: 12,
  border: '1px solid var(--border-subtle)',
  backgroundColor: 'var(--bg-card)',
  color: 'var(--text-secondary)',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: "'Exo 2', sans-serif",
  minHeight: 48,
};
