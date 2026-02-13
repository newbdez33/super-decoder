import { View, Text, StyleSheet } from 'react-native';
import type { IndirectHint } from '@super-decoder/shared';
import { useTheme } from '../themes/useTheme';

interface IndirectHintsProps {
  hint: IndirectHint;
  rowIndex?: number;
  colorBlindMode: boolean;
}

const symbolMap: Record<string, string> = {
  'correct position': '\u2713',
  'correct color': '~',
  'no match': '\u2014',
};

export function IndirectHints({ hint, rowIndex, colorBlindMode }: IndirectHintsProps) {
  const theme = useTheme();
  const { correctPosition, correctColor } = hint;
  const empty = 4 - correctPosition - correctColor;

  const dots: Array<{ label: string; color: string }> = [
    ...Array(correctPosition).fill({ label: 'correct position', color: theme['--hint-correct'] }),
    ...Array(correctColor).fill({ label: 'correct color', color: theme['--hint-misplaced'] }),
    ...Array(empty).fill({ label: 'no match', color: theme['--hint-absent'] }),
  ];

  const dotSize = colorBlindMode ? 14 : 10;
  const gridSize = colorBlindMode ? 30 : 28;

  return (
    <View
      testID={rowIndex !== undefined ? `indirect-hints-${rowIndex}` : undefined}
      accessibilityLabel={`${correctPosition} exact, ${correctColor} color`}
      style={[styles.grid, { width: gridSize, height: gridSize }]}
    >
      {dots.map((dot, i) => (
        <View
          key={i}
          accessibilityLabel={dot.label}
          style={[
            styles.dot,
            {
              backgroundColor: dot.color,
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
            },
          ]}
        >
          {colorBlindMode && (
            <Text style={styles.symbol}>{symbolMap[dot.label]}</Text>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  dot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbol: {
    fontSize: 9,
    lineHeight: 14,
    color: '#000',
    fontWeight: '700',
    textAlign: 'center',
  },
});
