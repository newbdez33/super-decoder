import { THEMES, DEFAULT_THEME } from '@super-decoder/shared';
import type { ThemeId } from '@super-decoder/shared';

export function applyTheme(themeId: ThemeId): void {
  const theme = THEMES.find(t => t.id === themeId) ?? THEMES.find(t => t.id === DEFAULT_THEME)!;
  const root = document.documentElement;
  for (const [key, value] of Object.entries(theme.variables)) {
    root.style.setProperty(key, value);
  }
}
