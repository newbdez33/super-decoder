import { View, Pressable, Text, StyleSheet } from 'react-native';
import { COLORS } from '@super-decoder/shared';
import type { Color } from '@super-decoder/shared';
import { useTheme } from '../themes/useTheme';

interface ColorPickerProps {
  availableColors: Color[];
  usedColors: Color[];
  onColorSelect: (color: Color) => void;
  colorBlindMode: boolean;
}

const colorHexMap: Record<Color, string> = Object.fromEntries(
  COLORS.map(c => [c.name, c.hex])
) as Record<Color, string>;

const colorSymbolMap: Record<Color, string> = Object.fromEntries(
  COLORS.map(c => [c.name, c.symbol])
) as Record<Color, string>;

export function ColorPicker({ availableColors, usedColors, onColorSelect, colorBlindMode }: ColorPickerProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {availableColors.map(color => {
        const isUsed = usedColors.includes(color);
        return (
          <Pressable
            key={color}
            accessibilityLabel={color}
            accessibilityState={{ disabled: isUsed }}
            onPress={() => onColorSelect(color)}
            style={[
              styles.circle,
              {
                backgroundColor: colorHexMap[color],
                borderColor: theme['--border-subtle'],
                opacity: isUsed ? 0.4 : 1,
              },
            ]}
          >
            {colorBlindMode && (
              <Text style={[styles.symbol, { color: theme['--symbol-color'] }]}>
                {colorSymbolMap[color]}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbol: {
    fontSize: 18,
    fontFamily: 'Exo2-Bold',
  },
});
