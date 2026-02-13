import { useCallback, useRef, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import type { VibrationName } from '@super-decoder/shared';
import { useSettingsStore } from '../stores/settingsStore';

type HapticAction = () => Promise<void>;

const HAPTIC_MAP: Record<VibrationName, HapticAction> = {
  tap: () => Haptics.selectionAsync(),
  place: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  submit: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  win: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  lose: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
  star: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  clear: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
};

export function useVibrate() {
  const vibrationEnabled = useSettingsStore(s => s.vibrationEnabled);
  const enabledRef = useRef(vibrationEnabled);

  useEffect(() => {
    enabledRef.current = vibrationEnabled;
  }, [vibrationEnabled]);

  const vibrate = useCallback(async (name: VibrationName) => {
    if (!enabledRef.current) return;
    try {
      await HAPTIC_MAP[name]();
    } catch (e) {
      console.warn('[useVibrate] haptic error:', name, e);
    }
  }, []);

  return { vibrate };
}
