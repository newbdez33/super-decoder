import { useState, useCallback, useEffect } from 'react';
import { useProgressStore } from './stores/progressStore';
import { useSettingsStore } from './stores/settingsStore';
import { useGameStore, COLOR_NAMES, SeededRandom } from '@super-decoder/shared';
import type { Color } from '@super-decoder/shared';
import { applyTheme } from './themes/applyTheme';
import { HomeScreen } from './screens/HomeScreen';
import { GameScreen } from './screens/GameScreen';
import { DuoSetterScreen } from './screens/DuoSetterScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { StatsScreen } from './screens/StatsScreen';

type Screen = 'home' | 'game' | 'duo-setup' | 'duo-game' | 'free-play' | 'free-game' | 'settings' | 'stats';

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const currentLevel = useProgressStore(s => s.currentLevel);
  const advanceLevel = useProgressStore(s => s.advanceLevel);
  const theme = useSettingsStore(s => s.theme);
  const [freePlayConfig] = useState({ numColors: 6, hintType: 'indirect' as 'direct' | 'indirect' });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const handleNavigate = useCallback((target: Screen) => {
    setScreen(target);
  }, []);

  const handleNextLevel = useCallback(() => {
    advanceLevel();
    // Re-init the game with next level
    const nextLevel = useProgressStore.getState().currentLevel;
    useGameStore.getState().initLevel(nextLevel);
  }, [advanceLevel]);

  const handleRetry = useCallback(() => {
    useGameStore.getState().initLevel(currentLevel);
  }, [currentLevel]);

  const handleSkip = useCallback(() => {
    advanceLevel();
    const nextLevel = useProgressStore.getState().currentLevel;
    useGameStore.getState().initLevel(nextLevel);
  }, [advanceLevel]);

  const handleDuoConfirm = useCallback((
    secretCode: Color[],
    hintType: 'direct' | 'indirect',
    numColors: number,
    _timerMinutes: number | null
  ) => {
    const mode = hintType === 'direct' ? 'easy' as const : 'advanced' as const;
    useGameStore.getState().initCustomGame({
      secretCode,
      mode,
      availableColors: COLOR_NAMES.slice(0, numColors),
    });
    setScreen('duo-game');
  }, []);

  const handleStartFreePlay = useCallback(() => {
    // Generate a random game based on free play config
    const rngSeed = Date.now();
    const rng = new SeededRandom(rngSeed);
    const availableColors = COLOR_NAMES.slice(0, freePlayConfig.numColors);
    const shuffled = rng.shuffle(availableColors);
    const secretCode = shuffled.slice(0, 4) as Color[];
    const mode = freePlayConfig.hintType === 'direct' ? 'easy' as const : 'advanced' as const;
    useGameStore.getState().initCustomGame({
      secretCode,
      mode,
      availableColors,
    });
    setScreen('free-game');
  }, [freePlayConfig]);

  switch (screen) {
    case 'home':
      return (
        <HomeScreen
          onNavigate={(target) => {
            if (target === 'game') {
              useGameStore.getState().initLevel(currentLevel);
            }
            if (target === 'free-play') {
              handleStartFreePlay();
              return;
            }
            handleNavigate(target as Screen);
          }}
        />
      );

    case 'game':
      return (
        <GameScreen
          levelId={currentLevel}
          onHome={() => setScreen('home')}
          onNextLevel={() => {
            handleNextLevel();
          }}
          onRetry={handleRetry}
          onSkip={handleSkip}
        />
      );

    case 'duo-setup':
      return (
        <DuoSetterScreen
          onConfirm={handleDuoConfirm}
          onBack={() => setScreen('home')}
        />
      );

    case 'duo-game':
      return (
        <GameScreen
          levelId={0}
          onHome={() => setScreen('home')}
          onNextLevel={() => setScreen('home')}
          onRetry={() => setScreen('duo-setup')}
        />
      );

    case 'free-game':
      return (
        <GameScreen
          levelId={0}
          onHome={() => setScreen('home')}
          onNextLevel={handleStartFreePlay}
          onRetry={handleStartFreePlay}
        />
      );

    case 'settings':
      return <SettingsScreen onBack={() => setScreen('home')} />;

    case 'stats':
      return <StatsScreen onBack={() => setScreen('home')} />;

    default:
      return <HomeScreen onNavigate={handleNavigate} />;
  }
}

export default App;
