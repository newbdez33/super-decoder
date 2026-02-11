import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MAX_GUESSES } from '@super-decoder/shared';
import { useTheme } from '../themes/useTheme';

interface GameHeaderProps {
  levelId: number;
  currentRound: number;
  mode: 'easy' | 'advanced';
  onBack: () => void;
}

export function GameHeader({ levelId, currentRound, mode, onBack }: GameHeaderProps) {
  const theme = useTheme();
  const formattedLevel = String(levelId).padStart(3, '0');
  const dots = Array.from({ length: MAX_GUESSES }, (_, i) => i < currentRound - 1);

  return (
    <View style={styles.container}>
      <Pressable
        testID="btn-back"
        accessibilityLabel="Back"
        onPress={onBack}
        style={styles.backBtn}
      >
        <Text style={[styles.backText, { color: theme['--text-primary'] }]}>{'\u2190'}</Text>
      </Pressable>

      <View style={styles.center}>
        <Text
          testID="level-display"
          style={[
            styles.level,
            { color: theme['--text-accent'] },
          ]}
        >
          LV.{formattedLevel}
        </Text>
        <View style={styles.dots}>
          {dots.map((used, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: used ? theme['--text-accent'] : theme['--border-subtle'] },
              ]}
            />
          ))}
        </View>
      </View>

      <Text
        testID="mode-badge"
        style={[
          styles.mode,
          { color: mode === 'easy' ? theme['--hint-correct'] : '#FF9F0A' },
        ]}
      >
        {mode.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backBtn: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
  },
  backText: {
    fontSize: 20,
  },
  center: {
    alignItems: 'center',
  },
  level: {
    fontSize: 18,
    fontFamily: 'Orbitron-Bold',
    letterSpacing: 2,
  },
  dots: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    marginTop: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  mode: {
    fontSize: 11,
    fontFamily: 'Exo2-SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    minWidth: 44,
    textAlign: 'right',
  },
});
