import { View, Text, StyleSheet } from 'react-native';
import type { DirectHint } from '@super-decoder/shared';
import { useTheme } from '../themes/useTheme';

interface DirectHintsProps {
  hints: DirectHint[];
  rowIndex?: number;
  colorBlindMode: boolean;
}

const statusSymbols: Record<string, string> = {
  correct: '\u2713',
  wrong_position: '~',
  not_exist: '\u2014',
};

export function DirectHints({ hints, rowIndex, colorBlindMode }: DirectHintsProps) {
  const theme = useTheme();

  const statusColors: Record<string, string> = {
    correct: theme['--hint-correct'],
    wrong_position: theme['--hint-misplaced'],
    not_exist: theme['--hint-absent'],
  };

  const dotSize = colorBlindMode ? 14 : 10;
  const gridSize = colorBlindMode ? 30 : 28;

  return (
    <View style={[styles.container, { width: gridSize, height: gridSize }]}>
      {hints.map((hint, i) => (
        <View
          key={i}
          testID={rowIndex !== undefined ? `direct-hint-${rowIndex}-${i}` : undefined}
          accessibilityLabel={
            hint.status === 'correct' ? 'correct' :
            hint.status === 'wrong_position' ? 'wrong position' : 'not exist'
          }
          style={[
            styles.dot,
            {
              backgroundColor: statusColors[hint.status],
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
            },
          ]}
        >
          {colorBlindMode && (
            <Text style={styles.symbol}>{statusSymbols[hint.status]}</Text>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
