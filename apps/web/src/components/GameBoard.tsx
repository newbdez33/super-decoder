import { useGameStore, MAX_GUESSES } from '@super-decoder/shared';
import { GuessRow } from './GuessRow';

interface GameBoardProps {
  colorBlindMode: boolean;
}

export function GameBoard({ colorBlindMode }: GameBoardProps) {
  const {
    guesses,
    currentGuess,
    selectedSlot,
    hintType,
    isComplete,
  } = useGameStore();

  const setSelectedSlot = useGameStore(s => s.setSelectedSlot);

  const rows = Array.from({ length: MAX_GUESSES }, (_, i) => {
    const isCompleted = i < guesses.length;
    const isCurrent = i === guesses.length && !isComplete;
    const isActive = isCurrent;

    return (
      <GuessRow
        key={i}
        guess={isCompleted ? guesses[i] : null}
        isActive={isActive}
        isCurrent={isCurrent}
        hintType={hintType}
        currentGuess={currentGuess}
        selectedSlot={selectedSlot}
        onSlotClick={(slotIndex) => setSelectedSlot(slotIndex)}
        colorBlindMode={colorBlindMode}
      />
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {rows}
    </div>
  );
}
