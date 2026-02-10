export type ThemeId = 'led-classic' | 'modern-flat' | 'cyberpunk';

export interface ThemeVariables {
  '--bg-deepest': string;
  '--bg-panel': string;
  '--bg-card': string;
  '--bg-slot': string;
  '--text-primary': string;
  '--text-secondary': string;
  '--text-accent': string;
  '--hint-correct': string;
  '--hint-misplaced': string;
  '--hint-absent': string;
  '--glow-intensity': string;
  '--glow-radius': string;
  '--success': string;
  '--failure': string;
  '--border-subtle': string;
  '--selection-border': string;
  '--overlay-bg': string;
  '--star-color': string;
  '--star-glow': string;
  '--toggle-knob': string;
  '--toggle-shadow': string;
  '--symbol-color': string;
  '--symbol-shadow': string;
  '--title-glow': string;
  '--accent-subtle': string;
  '--hint-glow': string;
}

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  variables: ThemeVariables;
}
