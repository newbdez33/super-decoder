import { THEMES, DEFAULT_THEME } from '@super-decoder/shared';
import type { ThemeVariables, ThemeId } from '@super-decoder/shared';
import { useSettingsStore } from '../stores/settingsStore';

export function useTheme(): ThemeVariables {
  const themeId = useSettingsStore(s => s.theme);
  const theme = THEMES.find(t => t.id === themeId) ?? THEMES.find(t => t.id === DEFAULT_THEME)!;
  return theme.variables;
}

export function useThemeById(themeId: ThemeId): ThemeVariables {
  const theme = THEMES.find(t => t.id === themeId) ?? THEMES.find(t => t.id === DEFAULT_THEME)!;
  return theme.variables;
}
