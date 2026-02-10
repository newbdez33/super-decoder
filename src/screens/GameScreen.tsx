import { useCallback, useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useProgressStore } from '../stores/progressStore';
import { useSettingsStore } from '../stores/settingsStore';
import { GameHeader } from '../components/GameHeader';
import { GameBoard } from '../components/GameBoard';
import { ColorPicker } from '../components/ColorPicker';
import { GameActions } from '../components/GameActions';
import { ResultModal } from '../components/ResultModal';

interface GameScreenProps {
  levelId: number;
  onHome: () => void;
  onNextLevel: () => void;
  onRetry: () => void;
  onSkip?: () => void;
}

export function GameScreen({ levelId, onHome, onNextLevel, onRetry, onSkip }: GameScreenProps) {
  const store = useGameStore();
  const colorBlindMode = useSettingsStore(s => s.colorBlindMode);
  const completeLevel = useProgressStore(s => s.completeLevel);

  useEffect(() => {
    store.initLevel(levelId);
  }, [levelId]); // eslint-disable-line react-hooks/exhaustive-deps

  const canSubmit = store.currentGuess.every(c => c !== null);
  const stars = store.calculateStars(store.guesses.length);

  const handleSubmit = useCallback(() => {
    const success = store.submitGuess();
    if (success) {
      const state = useGameStore.getState();
      if (state.isComplete) {
        completeLevel(levelId, state.guesses.length, state.isWon);
      }
    }
  }, [store, levelId, completeLevel]);

  const handleBack = useCallback(() => {
    if (store.guesses.length > 0 && !store.isComplete) {
      if (window.confirm('Return to menu? Your progress on this level will be lost.')) {
        onHome();
      }
    } else {
      onHome();
    }
  }, [store.guesses.length, store.isComplete, onHome]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100dvh',
      maxWidth: 480,
      margin: '0 auto',
    }}>
      <GameHeader
        levelId={levelId}
        currentRound={store.currentRound}
        mode={store.mode}
        onBack={handleBack}
      />

      <div style={{ flex: 1, padding: '8px 12px', overflow: 'auto' }}>
        <GameBoard />
      </div>

      <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-panel)' }}>
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
      </div>

      <ResultModal
        isOpen={store.isComplete}
        isWon={store.isWon}
        secretCode={store.secretCode}
        attempts={store.guesses.length}
        stars={stars}
        onNext={onNextLevel}
        onRetry={onRetry}
        onHome={onHome}
        onSkip={onSkip}
      />
    </div>
  );
}
