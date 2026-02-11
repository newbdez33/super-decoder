import { View, StyleSheet } from 'react-native';
import type { DirectHint } from '@super-decoder/shared';
import { useTheme } from '../themes/useTheme';

interface DirectHintsProps {
  hints: DirectHint[];
  rowIndex?: number;
}

export function DirectHints({ hints, rowIndex }: DirectHintsProps) {
  const theme = useTheme();

  const statusColors: Record<string, string> = {
    correct: theme['--hint-correct'],
    wrong_position: theme['--hint-misplaced'],
    not_exist: theme['--hint-absent'],
  };

  return (
    <View style={styles.container}>
      {hints.map((hint, i) => (
        <View
          key={i}
          testID={rowIndex !== undefined ? `direct-hint-${rowIndex}-${i}` : undefined}
          accessibilityLabel={
            hint.status === 'correct' ? 'correct' :
            hint.status === 'wrong_position' ? 'wrong position' : 'not exist'
          }
          style={[styles.dot, { backgroundColor: statusColors[hint.status] }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
