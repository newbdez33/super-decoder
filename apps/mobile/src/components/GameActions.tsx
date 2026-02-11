import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '../themes/useTheme';

interface GameActionsProps {
  canSubmit: boolean;
  isComplete: boolean;
  onSubmit: () => void;
  onClear: () => void;
}

export function GameActions({ canSubmit, isComplete, onSubmit, onClear }: GameActionsProps) {
  const theme = useTheme();

  if (isComplete) return null;

  return (
    <View style={styles.container}>
      <Pressable
        testID="btn-clear"
        accessibilityLabel="Clear"
        onPress={onClear}
        style={[
          styles.button,
          {
            backgroundColor: theme['--bg-card'],
            borderColor: theme['--border-subtle'],
            borderWidth: 1,
          },
        ]}
      >
        <Text style={[styles.clearText, { color: theme['--text-secondary'] }]}>Clear</Text>
      </Pressable>
      <Pressable
        testID="btn-submit"
        accessibilityLabel="Submit guess"
        onPress={canSubmit ? onSubmit : undefined}
        style={[
          styles.button,
          styles.submitButton,
          {
            backgroundColor: canSubmit ? theme['--text-accent'] : theme['--border-subtle'],
            opacity: canSubmit ? 1 : 0.4,
          },
        ]}
      >
        <Text
          style={[
            styles.submitText,
            { color: canSubmit ? theme['--bg-deepest'] : theme['--text-secondary'] },
          ]}
        >
          Submit
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    paddingHorizontal: 32,
  },
  clearText: {
    fontSize: 14,
    fontFamily: 'Exo2-SemiBold',
  },
  submitText: {
    fontSize: 14,
    fontFamily: 'Exo2-Bold',
  },
});
