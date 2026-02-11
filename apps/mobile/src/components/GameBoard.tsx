import { View, StyleSheet } from 'react-native';
import { useGameStore, MAX_GUESSES } from '@super-decoder/shared';
import { GuessRow } from './GuessRow';

interface GameBoardProps {
  colorBlindMode: boolean;
}

export function GameBoard({ colorBlindMode }: GameBoardProps) {
  const guesses = useGameStore(s => s.guesses);
  const currentGuess = useGameStore(s => s.currentGuess);
  const selectedSlot = useGameStore(s => s.selectedSlot);
  const hintType = useGameStore(s => s.hintType);
  const isComplete = useGameStore(s => s.isComplete);
  const setSelectedSlot = useGameStore(s => s.setSelectedSlot);

  return (
    <View style={styles.container}>
      {Array.from({ length: MAX_GUESSES }, (_, i) => {
        const isCompleted = i < guesses.length;
        const isCurrent = i === guesses.length && !isComplete;

        return (
          <GuessRow
            key={i}
            testID={`row-${i}`}
            rowIndex={i}
            guess={isCompleted ? guesses[i] : null}
            isActive={isCurrent}
            isCurrent={isCurrent}
            hintType={hintType}
            currentGuess={currentGuess}
            selectedSlot={selectedSlot}
            onSlotPress={(slotIndex) => setSelectedSlot(slotIndex)}
            colorBlindMode={colorBlindMode}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
});
