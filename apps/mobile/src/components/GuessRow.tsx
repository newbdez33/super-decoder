import { View, StyleSheet } from 'react-native';
import type { Color, Guess } from '@super-decoder/shared';
import { ColorSlot } from './ColorSlot';
import { DirectHints } from './DirectHints';
import { IndirectHints } from './IndirectHints';
import { useTheme } from '../themes/useTheme';

interface GuessRowProps {
  guess: Guess | null;
  isActive: boolean;
  isCurrent: boolean;
  hintType: 'direct' | 'indirect';
  currentGuess: (Color | null)[];
  selectedSlot: number;
  onSlotPress: (index: number) => void;
  colorBlindMode: boolean;
  testID?: string;
  rowIndex?: number;
}

export function GuessRow({
  guess,
  isCurrent,
  hintType,
  currentGuess,
  selectedSlot,
  onSlotPress,
  colorBlindMode,
  testID,
  rowIndex,
}: GuessRowProps) {
  const theme = useTheme();
  const isCompleted = guess !== null;
  const isDisabled = !isCurrent && !isCompleted;

  const colors = isCompleted
    ? guess.colors
    : isCurrent
      ? currentGuess
      : [null, null, null, null];

  return (
    <View
      testID={testID}
      style={[
        styles.row,
        {
          backgroundColor: isCurrent ? theme['--bg-card'] : 'transparent',
          borderColor: isCurrent ? theme['--border-subtle'] : 'transparent',
          borderWidth: 1,
          opacity: isCompleted ? 0.7 : 1,
        },
      ]}
    >
      <View style={styles.slots}>
        {colors.map((color, i) => (
          <ColorSlot
            key={i}
            testID={rowIndex !== undefined ? `slot-${rowIndex}-${i}` : undefined}
            color={color}
            isSelected={isCurrent && i === selectedSlot}
            isDisabled={isCompleted || isDisabled}
            colorBlindMode={colorBlindMode}
            onPress={() => onSlotPress(i)}
          />
        ))}
      </View>

      <View style={styles.hints}>
        {isCompleted && guess.directHints && hintType === 'direct' && (
          <DirectHints hints={guess.directHints} rowIndex={rowIndex} />
        )}
        {isCompleted && guess.indirectHint && hintType === 'indirect' && (
          <IndirectHints hint={guess.indirectHint} rowIndex={rowIndex} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  slots: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
  },
  hints: {
    marginLeft: 8,
    minWidth: 28,
  },
});
