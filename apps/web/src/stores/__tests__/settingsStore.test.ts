import { describe, it, expect, beforeEach } from 'vitest';
import { useSettingsStore } from '../settingsStore';

describe('Settings Store', () => {
  beforeEach(() => {
    // Reset to defaults
    useSettingsStore.setState({
      soundEnabled: true,
      vibrationEnabled: true,
      language: 'en',
      colorBlindMode: false,
      theme: 'led-classic',
    });
  });

  describe('Sound toggle', () => {
    it('should toggle sound off', () => {
      useSettingsStore.getState().setSoundEnabled(false);
      expect(useSettingsStore.getState().soundEnabled).toBe(false);
    });

    it('should toggle sound on', () => {
      useSettingsStore.getState().setSoundEnabled(false);
      useSettingsStore.getState().setSoundEnabled(true);
      expect(useSettingsStore.getState().soundEnabled).toBe(true);
    });
  });

  describe('Vibration toggle', () => {
    it('should toggle vibration off', () => {
      useSettingsStore.getState().setVibrationEnabled(false);
      expect(useSettingsStore.getState().vibrationEnabled).toBe(false);
    });
  });

  describe('Language switch', () => {
    it('should switch to Japanese', () => {
      useSettingsStore.getState().setLanguage('ja');
      expect(useSettingsStore.getState().language).toBe('ja');
    });

    it('should switch to Chinese', () => {
      useSettingsStore.getState().setLanguage('zh');
      expect(useSettingsStore.getState().language).toBe('zh');
    });

    it('should switch back to English', () => {
      useSettingsStore.getState().setLanguage('ja');
      useSettingsStore.getState().setLanguage('en');
      expect(useSettingsStore.getState().language).toBe('en');
    });
  });

  describe('Theme', () => {
    it('should default to led-classic', () => {
      expect(useSettingsStore.getState().theme).toBe('led-classic');
    });

    it('should set theme to cyberpunk', () => {
      useSettingsStore.getState().setTheme('cyberpunk');
      expect(useSettingsStore.getState().theme).toBe('cyberpunk');
    });

    it('should set theme to modern-flat', () => {
      useSettingsStore.getState().setTheme('modern-flat');
      expect(useSettingsStore.getState().theme).toBe('modern-flat');
    });

    it('should switch between themes', () => {
      useSettingsStore.getState().setTheme('cyberpunk');
      useSettingsStore.getState().setTheme('led-classic');
      expect(useSettingsStore.getState().theme).toBe('led-classic');
    });
  });

  describe('Color blind mode', () => {
    it('should enable color blind mode', () => {
      useSettingsStore.getState().setColorBlindMode(true);
      expect(useSettingsStore.getState().colorBlindMode).toBe(true);
    });

    it('should disable color blind mode', () => {
      useSettingsStore.getState().setColorBlindMode(true);
      useSettingsStore.getState().setColorBlindMode(false);
      expect(useSettingsStore.getState().colorBlindMode).toBe(false);
    });
  });
});
