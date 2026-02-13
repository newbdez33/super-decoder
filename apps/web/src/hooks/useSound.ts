import { useCallback, useRef, useEffect } from 'react';
import { Howl } from 'howler';
import type { SoundName } from '@super-decoder/shared';
import { useSettingsStore } from '../stores/settingsStore';

const SOUND_FILES: Record<SoundName, string> = {
  tap: '/sounds/tap.wav',
  place: '/sounds/place.wav',
  submit: '/sounds/submit.wav',
  win: '/sounds/win.wav',
  lose: '/sounds/lose.wav',
  star: '/sounds/star.wav',
  clear: '/sounds/clear.wav',
};

let howls: Record<SoundName, Howl> | null = null;

function getHowls(): Record<SoundName, Howl> {
  if (!howls) {
    howls = {} as Record<SoundName, Howl>;
    for (const [name, src] of Object.entries(SOUND_FILES)) {
      howls[name as SoundName] = new Howl({ src: [src], preload: true });
    }
  }
  return howls;
}

export function useSound() {
  const soundEnabled = useSettingsStore(s => s.soundEnabled);
  const enabledRef = useRef(soundEnabled);

  useEffect(() => {
    enabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const play = useCallback((name: SoundName) => {
    if (!enabledRef.current) return;
    getHowls()[name].play();
  }, []);

  return { play };
}
