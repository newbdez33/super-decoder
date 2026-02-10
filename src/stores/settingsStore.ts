import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings } from '../types/game';
import type { ThemeId } from '../types/theme';

interface SettingsStore extends Settings {
  setSoundEnabled: (enabled: boolean) => void;
  setVibrationEnabled: (enabled: boolean) => void;
  setLanguage: (lang: 'en' | 'ja' | 'zh') => void;
  setColorBlindMode: (enabled: boolean) => void;
  setTheme: (theme: ThemeId) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      soundEnabled: true,
      vibrationEnabled: true,
      language: 'en',
      colorBlindMode: false,
      theme: 'led-classic',

      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setVibrationEnabled: (enabled) => set({ vibrationEnabled: enabled }),
      setLanguage: (lang) => set({ language: lang }),
      setColorBlindMode: (enabled) => set({ colorBlindMode: enabled }),
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'super-decoder-settings' }
  )
);
