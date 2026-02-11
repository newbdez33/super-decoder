import { useCallback } from 'react';
import { View, ScrollView, Alert, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGameStore } from '@super-decoder/shared';
import { useProgressStore } from '../stores/progressStore';
import { useSettingsStore } from '../stores/settingsStore';
import { GameHeader } from '../components/GameHeader';
import { GameBoard } from '../components/GameBoard';
import { ColorPicker } from '../components/ColorPicker';
import { GameActions } from '../components/GameActions';
import { ResultModal } from '../components/ResultModal';
import { useTheme } from '../themes/useTheme';

export function GameScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const store = useGameStore();
  const colorBlindMode = useSettingsStore(s => s.colorBlindMode);
  const completeLevel = useProgressStore(s => s.completeLevel);
  const advanceLevel = useProgressStore(s => s.advanceLevel);
  const currentLevel = useProgressStore(s => s.currentLevel);

  const levelId = store.currentLevel;
  const isFreeOrDuo = mode === 'free' || mode === 'duo';
  const canSubmit = store.currentGuess.every(c => c !== null);
  const stars = store.calculateStars(store.guesses.length);

  const handleSubmit = useCallback(() => {
    const success = store.submitGuess();
    if (success) {
      const state = useGameStore.getState();
      if (state.isComplete && !isFreeOrDuo) {
        completeLevel(levelId, state.guesses.length, state.isWon);
      }
    }
  }, [store, levelId, completeLevel, isFreeOrDuo]);

  const handleBack = useCallback(() => {
    if (store.guesses.length > 0 && !store.isComplete) {
      Alert.alert(
        'Leave game?',
        'Your progress on this level will be lost.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Leave', style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  }, [store.guesses.length, store.isComplete, router]);

  const handleNext = useCallback(() => {
    if (isFreeOrDuo) {
      router.back();
    } else {
      advanceLevel();
      const nextLevel = useProgressStore.getState().currentLevel;
      useGameStore.getState().initLevel(nextLevel);
    }
  }, [isFreeOrDuo, advanceLevel, router]);

  const handleRetry = useCallback(() => {
    if (isFreeOrDuo) {
      router.back();
    } else {
      useGameStore.getState().initLevel(currentLevel);
    }
  }, [isFreeOrDuo, currentLevel, router]);

  return (
    <View testID="game-screen" style={[styles.container, { backgroundColor: theme['--bg-deepest'] }]}>
      <GameHeader
        levelId={levelId}
        currentRound={store.currentRound}
        mode={store.mode}
        onBack={handleBack}
      />

      <ScrollView style={styles.board} contentContainerStyle={styles.boardContent}>
        <GameBoard colorBlindMode={colorBlindMode} />
      </ScrollView>

      <View style={[styles.bottom, { backgroundColor: theme['--bg-panel'] }]}>
        <ColorPicker
          availableColors={store.availableColors}
          usedColors={store.usedColors}
          onColorSelect={store.selectColor}
          colorBlindMode={colorBlindMode}
        />
        <GameActions
          canSubmit={canSubmit}
          isComplete={store.isComplete}
          onSubmit={handleSubmit}
          onClear={store.clearCurrentGuess}
        />
      </View>

      <ResultModal
        isOpen={store.isComplete}
        isWon={store.isWon}
        secretCode={store.secretCode}
        attempts={store.guesses.length}
        stars={stars}
        onNext={handleNext}
        onRetry={handleRetry}
        onHome={() => router.back()}
        onSkip={isFreeOrDuo ? undefined : () => {
          advanceLevel();
          const nextLevel = useProgressStore.getState().currentLevel;
          useGameStore.getState().initLevel(nextLevel);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  board: {
    flex: 1,
    paddingHorizontal: 12,
  },
  boardContent: {
    paddingVertical: 8,
  },
  bottom: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
