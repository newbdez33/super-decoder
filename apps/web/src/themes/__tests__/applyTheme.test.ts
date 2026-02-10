import { describe, it, expect, beforeEach } from 'vitest';
import { applyTheme } from '../applyTheme';
import { THEMES } from '@super-decoder/shared';
import type { ThemeVariables } from '@super-decoder/shared';

describe('applyTheme', () => {
  beforeEach(() => {
    // Clear any previously set CSS variables
    const style = document.documentElement.style;
    for (const theme of THEMES) {
      for (const key of Object.keys(theme.variables)) {
        style.removeProperty(key);
      }
    }
  });

  it('should set all CSS variables on document.documentElement for led-classic', () => {
    applyTheme('led-classic');
    const style = document.documentElement.style;
    const ledClassic = THEMES.find(t => t.id === 'led-classic')!;
    for (const [key, value] of Object.entries(ledClassic.variables)) {
      expect(style.getPropertyValue(key)).toBe(value);
    }
  });

  it('should set all CSS variables for cyberpunk', () => {
    applyTheme('cyberpunk');
    const style = document.documentElement.style;
    const cyber = THEMES.find(t => t.id === 'cyberpunk')!;
    expect(style.getPropertyValue('--text-accent')).toBe(cyber.variables['--text-accent']);
    expect(style.getPropertyValue('--bg-deepest')).toBe(cyber.variables['--bg-deepest']);
  });

  it('should fall back to led-classic for unknown theme ID', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    applyTheme('nonexistent' as any);
    const style = document.documentElement.style;
    const ledClassic = THEMES.find(t => t.id === 'led-classic')!;
    expect(style.getPropertyValue('--text-accent')).toBe(ledClassic.variables['--text-accent']);
  });

  it('should overwrite previous theme when switching', () => {
    applyTheme('led-classic');
    expect(document.documentElement.style.getPropertyValue('--text-accent')).toBe('#00FFAA');

    applyTheme('cyberpunk');
    expect(document.documentElement.style.getPropertyValue('--text-accent')).toBe('#00F0FF');
  });

  it('should set every required variable key', () => {
    applyTheme('modern-flat');
    const style = document.documentElement.style;
    const flat = THEMES.find(t => t.id === 'modern-flat')!;
    const keys = Object.keys(flat.variables) as (keyof ThemeVariables)[];
    for (const key of keys) {
      expect(style.getPropertyValue(key)).toBeTruthy();
    }
  });
});
