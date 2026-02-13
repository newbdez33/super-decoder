import { useCallback, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGameStore } from '@super-decoder/shared';
import type { Color } from '@super-decoder/shared';
import { useProgressStore } from '../stores/progressStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useSound } from '../hooks/useSound';
import { GameHeader } from '../components/GameHeader';
import { GameBoard } from '../components/GameBoard';
import { ColorPicker } from '../components/ColorPicker';
import { GameActions } from '../components/GameActions';
import { ResultModal } from '../components/ResultModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useTheme } from '../themes/useTheme';

export function GameScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const store = useGameStore();
  const colorBlindMode = useSettingsStore(s => s.colorBlindMode);
  const completeLevel = useProgressStore(s => s.completeLevel);
  const advanceLevel = useProgressStore(s => s.advanceLevel);
  const currentLevel = useProgressStore(s => s.currentLevel);

  const { play } = useSound();
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  const levelId = store.currentLevel;
  const isFreeOrDuo = mode === 'free' || mode === 'duo';
  const canSubmit = store.currentGuess.every(c => c !== null);
  const stars = store.calculateStars(store.guesses.length);

  const handleColorSelect = useCallback((color: Color) => {
    const before = useGameStore.getState().currentGuess;
    store.selectColor(color);
    const after = useGameStore.getState().currentGuess;
    if (before !== after) play('place');
  }, [store, play]);

  const handleClear = useCallback(() => {
    store.clearCurrentGuess();
    play('clear');
  }, [store, play]);

  const handleSubmit = useCallback(() => {
    const success = store.submitGuess();
    if (success) {
      play('submit');
      const state = useGameStore.getState();
      if (state.isComplete && !isFreeOrDuo) {
        completeLevel(levelId, state.guesses.length, state.isWon);
      }
      if (state.isComplete) {
        if (state.isWon) {
          const earnedStars = store.calculateStars(state.guesses.length);
          setTimeout(() => play('win'), 300);
          for (let i = 0; i < earnedStars; i++) {
            setTimeout(() => play('star'), 700 + i * 300);
          }
        } else {
          setTimeout(() => play('lose'), 300);
        }
      }
    }
  }, [store, levelId, completeLevel, isFreeOrDuo, play]);

  const handleBack = useCallback(() => {
    if (store.guesses.length > 0 && !store.isComplete) {
      setShowLeaveDialog(true);
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

      <View style={[styles.bottom, { backgroundColor: theme['--bg-panel'], paddingBottom: 12 + insets.bottom }]}>
        <ColorPicker
          availableColors={store.availableColors}
          usedColors={store.usedColors}
          onColorSelect={handleColorSelect}
          colorBlindMode={colorBlindMode}
        />
        <GameActions
          canSubmit={canSubmit}
          isComplete={store.isComplete}
          onSubmit={handleSubmit}
          onClear={handleClear}
        />
      </View>

      <ConfirmDialog
        visible={showLeaveDialog}
        title="Leave game?"
        message="Your progress on this level will be lost."
        confirmLabel="Leave"
        destructive
        onCancel={() => setShowLeaveDialog(false)}
        onConfirm={() => { setShowLeaveDialog(false); router.back(); }}
      />

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
        colorBlindMode={colorBlindMode}
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
