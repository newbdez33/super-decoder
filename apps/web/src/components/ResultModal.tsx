import { motion, AnimatePresence } from 'framer-motion';
import type { Color } from '@super-decoder/shared';
import { StarRating } from './StarRating';
import { ColorSlot } from './ColorSlot';

interface ResultModalProps {
  isOpen: boolean;
  isWon: boolean;
  secretCode: Color[];
  attempts: number;
  stars: number;
  onNext: () => void;
  onRetry: () => void;
  onHome: () => void;
  onSkip?: () => void;
}

export function ResultModal({
  isOpen,
  isWon,
  secretCode,
  attempts,
  stars,
  onNext,
  onRetry,
  onHome,
  onSkip,
}: ResultModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'var(--overlay-bg)',
              backdropFilter: 'blur(8px)',
              zIndex: 50,
            }}
          />
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            role="dialog"
            aria-label={isWon ? 'Victory' : 'Defeat'}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 51,
              backgroundColor: 'var(--bg-panel)',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: '32px 24px',
              maxWidth: 480,
              margin: '0 auto',
            }}
          >
            <h2
              className="font-display"
              style={{
                textAlign: 'center',
                fontSize: 22,
                fontWeight: 900,
                color: isWon ? 'var(--success)' : 'var(--failure)',
                marginBottom: 16,
                letterSpacing: 2,
                textShadow: isWon
                  ? '0 0 12px var(--success)'
                  : '0 0 12px var(--failure)',
              }}
            >
              {isWon ? 'CODE CRACKED!' : 'CODE INTACT'}
            </h2>

            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 16 }}>
              {secretCode.map((color, i) => (
                <ColorSlot
                  key={i}
                  color={color}
                  isSelected={false}
                  isDisabled={true}
                  colorBlindMode={false}
                  onClick={() => {}}
                />
              ))}
            </div>

            {isWon && (
              <>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 8 }}>
                  Solved in {attempts} / 7 steps
                </p>
                <StarRating stars={stars} />
              </>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24 }}>
              {isWon ? (
                <>
                  <button onClick={onNext} style={primaryBtnStyle}>
                    Next Level
                  </button>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={onHome} style={secondaryBtnStyle}>
                      Home
                    </button>
                    <button onClick={onRetry} style={secondaryBtnStyle}>
                      Replay
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button onClick={onRetry} style={primaryBtnStyle}>
                    Retry
                  </button>
                  {onSkip && (
                    <button onClick={onSkip} style={secondaryBtnStyle}>
                      Skip
                    </button>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const primaryBtnStyle: React.CSSProperties = {
  padding: '14px 24px',
  borderRadius: 12,
  border: 'none',
  backgroundColor: 'var(--text-accent)',
  color: 'var(--bg-deepest)',
  fontSize: 16,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: "'Exo 2', sans-serif",
  minHeight: 48,
};

const secondaryBtnStyle: React.CSSProperties = {
  flex: 1,
  padding: '12px 16px',
  borderRadius: 12,
  border: '1px solid var(--border-subtle)',
  backgroundColor: 'var(--bg-card)',
  color: 'var(--text-primary)',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: "'Exo 2', sans-serif",
  minHeight: 48,
};
