import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { useTheme } from '../themes/useTheme';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  cancelLabel?: string;
  confirmLabel: string;
  destructive?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  cancelLabel = 'Cancel',
  confirmLabel,
  destructive,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const theme = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.dialog, { backgroundColor: theme['--bg-panel'] }]}>
          <Text style={[styles.title, { color: theme['--text-accent'], textShadowColor: theme['--text-accent'], textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 }]}>
            {title}
          </Text>
          <Text style={[styles.message, { color: theme['--text-secondary'] }]}>
            {message}
          </Text>
          <View style={styles.buttons}>
            <Pressable
              onPress={onCancel}
              style={[styles.btn, { backgroundColor: theme['--bg-card'], borderColor: theme['--border-subtle'], borderWidth: 1 }]}
            >
              <Text style={[styles.btnText, { color: theme['--text-primary'] }]}>{cancelLabel}</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              style={[styles.btn, { backgroundColor: destructive ? theme['--failure'] : theme['--text-accent'] }]}
            >
              <Text style={[styles.btnText, { color: theme['--bg-deepest'] }]}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  dialog: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 16,
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Orbitron-Bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
  message: {
    fontSize: 14,
    fontFamily: 'Exo2-Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 14,
    fontFamily: 'Exo2-SemiBold',
  },
});
