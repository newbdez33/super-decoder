import { View, Text, StyleSheet } from 'react-native';
import { TOTAL_LEVELS } from '@super-decoder/shared';
import { useTheme } from '../themes/useTheme';

interface ProgressBarProps {
  currentLevel: number;
}

export function ProgressBar({ currentLevel }: ProgressBarProps) {
  const theme = useTheme();
  const progress = ((currentLevel - 1) / TOTAL_LEVELS) * 100;

  return (
    <View testID="progress-bar" accessibilityLabel={`Level ${currentLevel} / ${TOTAL_LEVELS}`} style={styles.container}>
      <Text style={[styles.label, { color: theme['--text-secondary'] }]}>
        Level {currentLevel} / {TOTAL_LEVELS}
      </Text>
      <View style={[styles.track, { backgroundColor: theme['--border-subtle'] }]}>
        <View
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 1, max: TOTAL_LEVELS, now: currentLevel }}
          style={[
            styles.fill,
            {
              width: `${progress}%`,
              backgroundColor: theme['--text-accent'],
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
  label: {
    fontFamily: 'Exo2-Regular',
    fontSize: 12,
    marginBottom: 4,
  },
  track: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
  },
});
