import { describe, it, expect } from 'vitest';
import { THEMES, THEME_IDS, DEFAULT_THEME } from '../themes';
import type { ThemeVariables } from '../../types/theme';

const REQUIRED_KEYS: (keyof ThemeVariables)[] = [
  '--bg-deepest', '--bg-panel', '--bg-card', '--bg-slot',
  '--text-primary', '--text-secondary', '--text-accent',
  '--hint-correct', '--hint-misplaced', '--hint-absent',
  '--glow-intensity', '--glow-radius',
  '--success', '--failure', '--border-subtle',
  '--selection-border', '--overlay-bg',
  '--star-color', '--star-glow',
  '--toggle-knob', '--toggle-shadow',
  '--symbol-color', '--symbol-shadow',
  '--title-glow', '--accent-subtle', '--hint-glow',
];

describe('Theme definitions', () => {
  it('should export exactly 3 themes', () => {
    expect(THEMES).toHaveLength(3);
  });

  it('should have IDs: led-classic, modern-flat, cyberpunk', () => {
    expect(THEME_IDS).toEqual(['led-classic', 'modern-flat', 'cyberpunk']);
  });

  it('should default to led-classic', () => {
    expect(DEFAULT_THEME).toBe('led-classic');
  });

  it.each(THEME_IDS)('theme "%s" should contain all required CSS variable keys', (id) => {
    const theme = THEMES.find(t => t.id === id)!;
    for (const key of REQUIRED_KEYS) {
      expect(theme.variables).toHaveProperty(key);
    }
  });

  it('LED Classic should match current index.css accent color', () => {
    const ledClassic = THEMES.find(t => t.id === 'led-classic')!;
    expect(ledClassic.variables['--text-accent']).toBe('#00FFAA');
    expect(ledClassic.variables['--bg-deepest']).toBe('#0A0A12');
  });

  it('Modern Flat should have glow-intensity of 0', () => {
    const flat = THEMES.find(t => t.id === 'modern-flat')!;
    expect(flat.variables['--glow-intensity']).toBe('0');
  });

  it('Cyberpunk should have cyan accent', () => {
    const cyber = THEMES.find(t => t.id === 'cyberpunk')!;
    expect(cyber.variables['--text-accent']).toBe('#00F0FF');
  });
});
