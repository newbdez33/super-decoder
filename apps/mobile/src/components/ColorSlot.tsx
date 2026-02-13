import { Pressable, Text, StyleSheet } from 'react-native';
import { COLORS } from '@super-decoder/shared';
import type { Color } from '@super-decoder/shared';
import { useTheme } from '../themes/useTheme';

interface ColorSlotProps {
  color: Color | null;
  isSelected: boolean;
  isDisabled: boolean;
  colorBlindMode: boolean;
  onPress: () => void;
  testID?: string;
}

const colorHexMap: Record<Color, string> = Object.fromEntries(
  COLORS.map(c => [c.name, c.hex])
) as Record<Color, string>;

const colorSymbolMap: Record<Color, string> = Object.fromEntries(
  COLORS.map(c => [c.name, c.symbol])
) as Record<Color, string>;

export function ColorSlot({ color, isSelected, isDisabled, colorBlindMode, onPress, testID }: ColorSlotProps) {
  const theme = useTheme();
  const label = color ? `${color} slot` : 'Empty slot';

  return (
    <Pressable
      testID={testID}
      accessibilityLabel={label}
      accessibilityState={{ selected: isSelected, disabled: isDisabled }}
      onPress={isDisabled ? undefined : onPress}
      style={[
        styles.slot,
        color
          ? {
              backgroundColor: colorHexMap[color],
              borderColor: isSelected ? theme['--selection-border'] : 'transparent',
              borderWidth: 2,
            }
          : {
              backgroundColor: theme['--bg-slot'],
              borderColor: isSelected ? theme['--selection-border'] : theme['--border-subtle'],
              borderWidth: isSelected ? 2 : 1,
              borderStyle: isSelected ? 'solid' : 'dashed',
            },
      ]}
    >
      {color && colorBlindMode && (
        <Text style={[styles.symbol, { color: theme['--symbol-color'] }]}>
          {colorSymbolMap[color]}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  slot: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbol: {
    fontSize: 18,
    fontFamily: 'Exo2-Bold',
  },
});
