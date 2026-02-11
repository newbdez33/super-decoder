import { View, Text, Pressable, Modal, StyleSheet, ScrollView } from 'react-native';
import type { Color } from '@super-decoder/shared';
import { StarRating } from './StarRating';
import { ColorSlot } from './ColorSlot';
import { useTheme } from '../themes/useTheme';

interface ResultModalProps {
  isOpen: boolean;
  isWon: boolean;
  secretCode: Color[];
  attempts: number;
  stars: number;
  onNext: () => void;
  onRetry: () => void;
  onHome: () => void;
  onSkip?: () => void;
}

export function ResultModal({
  isOpen,
  isWon,
  secretCode,
  attempts,
  stars,
  onNext,
  onRetry,
  onHome,
  onSkip,
}: ResultModalProps) {
  const theme = useTheme();

  return (
    <Modal visible={isOpen} transparent animationType="slide">
      <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
        <View testID="result-modal" style={[styles.sheet, { backgroundColor: theme['--bg-panel'] }]}>
          <ScrollView contentContainerStyle={styles.content}>
            <Text
              testID="result-title"
              accessibilityLabel={isWon ? 'CODE CRACKED!' : 'CODE INTACT'}
              style={[
                styles.title,
                {
                  color: isWon ? theme['--success'] : theme['--failure'],
                  textShadowColor: isWon ? theme['--success'] : theme['--failure'],
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 15,
                },
              ]}
            >
              {isWon ? 'CODE CRACKED!' : 'CODE INTACT'}
            </Text>

            <View style={styles.codeRow}>
              {secretCode.map((color, i) => (
                <ColorSlot
                  key={i}
                  color={color}
                  isSelected={false}
                  isDisabled={true}
                  colorBlindMode={false}
                  onPress={() => {}}
                />
              ))}
            </View>

            {isWon && (
              <>
                <Text accessibilityLabel={`Solved in ${attempts} / 7 steps`} style={[styles.subtitle, { color: theme['--text-secondary'] }]}>
                  Solved in {attempts} / 7 steps
                </Text>
                <StarRating stars={stars} />
              </>
            )}

            <View style={styles.buttons}>
              {isWon ? (
                <>
                  <Pressable
                    testID="btn-next"
                    accessibilityLabel="Next Level"
                    onPress={onNext}
                    style={[styles.primaryBtn, { backgroundColor: theme['--text-accent'] }]}
                  >
                    <Text style={[styles.primaryBtnText, { color: theme['--bg-deepest'] }]}>
                      Next Level
                    </Text>
                  </Pressable>
                  <View style={styles.buttonRow}>
                    <Pressable
                      testID="btn-home"
                      accessibilityLabel="Home"
                      onPress={onHome}
                      style={[styles.secondaryBtn, { backgroundColor: theme['--bg-card'], borderColor: theme['--border-subtle'] }]}
                    >
                      <Text style={[styles.secondaryBtnText, { color: theme['--text-primary'] }]}>
                        Home
                      </Text>
                    </Pressable>
                    <Pressable
                      testID="btn-replay"
                      accessibilityLabel="Replay"
                      onPress={onRetry}
                      style={[styles.secondaryBtn, { backgroundColor: theme['--bg-card'], borderColor: theme['--border-subtle'] }]}
                    >
                      <Text style={[styles.secondaryBtnText, { color: theme['--text-primary'] }]}>
                        Replay
                      </Text>
                    </Pressable>
                  </View>
                </>
              ) : (
                <>
                  <Pressable
                    testID="btn-retry"
                    accessibilityLabel="Retry"
                    onPress={onRetry}
                    style={[styles.primaryBtn, { backgroundColor: theme['--text-accent'] }]}
                  >
                    <Text style={[styles.primaryBtnText, { color: theme['--bg-deepest'] }]}>
                      Retry
                    </Text>
                  </Pressable>
                  {onSkip && (
                    <Pressable
                      testID="btn-skip"
                      accessibilityLabel="Skip"
                      onPress={onSkip}
                      style={[styles.secondaryBtn, { backgroundColor: theme['--bg-card'], borderColor: theme['--border-subtle'] }]}
                    >
                      <Text style={[styles.secondaryBtnText, { color: theme['--text-primary'] }]}>
                        Skip
                      </Text>
                    </Pressable>
                  )}
                </>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  content: {
    padding: 32,
    paddingHorizontal: 24,
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontFamily: 'Orbitron-Black',
    marginBottom: 16,
    letterSpacing: 2,
  },
  codeRow: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    marginBottom: 16,
  },
  subtitle: {
    textAlign: 'center',
    fontFamily: 'Exo2-Regular',
    marginBottom: 8,
  },
  buttons: {
    gap: 10,
    marginTop: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryBtn: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 16,
    fontFamily: 'Exo2-Bold',
  },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 14,
    fontFamily: 'Exo2-SemiBold',
  },
});
