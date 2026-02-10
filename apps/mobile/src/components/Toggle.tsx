import { Pressable, View, StyleSheet } from 'react-native';
import { useTheme } from '../themes/useTheme';

interface ToggleProps {
  enabled: boolean;
  onToggle: (value: boolean) => void;
  label: string;
}

export function Toggle({ enabled, onToggle, label }: ToggleProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: enabled }}
      accessibilityLabel={label}
      onPress={() => onToggle(!enabled)}
      style={[
        styles.track,
        { backgroundColor: enabled ? theme['--text-accent'] : theme['--border-subtle'] },
      ]}
    >
      <View
        style={[
          styles.knob,
          {
            backgroundColor: theme['--toggle-knob'],
            left: enabled ? 23 : 3,
          },
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 48,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
  },
  knob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    position: 'absolute',
    top: 3,
  },
});
