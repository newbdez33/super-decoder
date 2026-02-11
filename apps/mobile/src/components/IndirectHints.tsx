import { View, StyleSheet } from 'react-native';
import type { IndirectHint } from '@super-decoder/shared';
import { useTheme } from '../themes/useTheme';

interface IndirectHintsProps {
  hint: IndirectHint;
  rowIndex?: number;
}

export function IndirectHints({ hint, rowIndex }: IndirectHintsProps) {
  const theme = useTheme();
  const { correctPosition, correctColor } = hint;
  const empty = 4 - correctPosition - correctColor;

  const dots: Array<{ label: string; color: string }> = [
    ...Array(correctPosition).fill({ label: 'correct position', color: theme['--hint-correct'] }),
    ...Array(correctColor).fill({ label: 'correct color', color: theme['--hint-misplaced'] }),
    ...Array(empty).fill({ label: 'no match', color: theme['--hint-absent'] }),
  ];

  return (
    <View
      testID={rowIndex !== undefined ? `indirect-hints-${rowIndex}` : undefined}
      accessibilityLabel={`${correctPosition} exact, ${correctColor} color`}
      style={styles.grid}
    >
      {dots.map((dot, i) => (
        <View
          key={i}
          accessibilityLabel={dot.label}
          style={[styles.dot, { backgroundColor: dot.color }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 28,
    height: 28,
    gap: 3,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
