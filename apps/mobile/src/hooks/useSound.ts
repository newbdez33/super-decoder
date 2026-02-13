import { useCallback, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';
import type { SoundName } from '@super-decoder/shared';
import { useSettingsStore } from '../stores/settingsStore';

const soundFiles: Record<SoundName, number> = {
  tap: require('../../assets/sounds/tap.wav'),
  place: require('../../assets/sounds/place.wav'),
  submit: require('../../assets/sounds/submit.wav'),
  win: require('../../assets/sounds/win.wav'),
  lose: require('../../assets/sounds/lose.wav'),
  star: require('../../assets/sounds/star.wav'),
  clear: require('../../assets/sounds/clear.wav'),
};

const soundCache = new Map<SoundName, Audio.Sound>();

async function loadSound(name: SoundName): Promise<Audio.Sound> {
  const cached = soundCache.get(name);
  if (cached) return cached;

  const { sound } = await Audio.Sound.createAsync(soundFiles[name]);
  soundCache.set(name, sound);
  return sound;
}

// Configure audio mode once at module level
Audio.setAudioModeAsync({ playsInSilentModeOnIOS: false });

export function useSound() {
  const soundEnabled = useSettingsStore(s => s.soundEnabled);
  const enabledRef = useRef(soundEnabled);

  useEffect(() => {
    enabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const play = useCallback(async (name: SoundName) => {
    if (!enabledRef.current) return;
    try {
      const sound = await loadSound(name);
      await sound.setPositionAsync(0);
      await sound.playAsync();
    } catch {
      // Silently ignore audio errors
    }
  }, []);

  return { play };
}
