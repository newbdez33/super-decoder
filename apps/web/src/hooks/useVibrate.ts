import { useCallback, useRef, useEffect } from 'react';
import type { VibrationName } from '@super-decoder/shared';
import { useSettingsStore } from '../stores/settingsStore';

const VIBRATION_PATTERNS: Record<VibrationName, number[]> = {
  tap: [10],
  place: [15],
  submit: [30],
  win: [30, 50, 30, 50, 30],
  lose: [50, 30, 80],
  star: [15],
  clear: [10],
};

export function useVibrate() {
  const vibrationEnabled = useSettingsStore(s => s.vibrationEnabled);
  const enabledRef = useRef(vibrationEnabled);

  useEffect(() => {
    enabledRef.current = vibrationEnabled;
  }, [vibrationEnabled]);

  const vibrate = useCallback((name: VibrationName) => {
    if (!enabledRef.current) return;
    if (!('vibrate' in navigator)) return;
    navigator.vibrate(VIBRATION_PATTERNS[name]);
  }, []);

  return { vibrate };
}
