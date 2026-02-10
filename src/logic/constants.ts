import type { Color, ColorDefinition } from '../types/game';

export const COLORS: ColorDefinition[] = [
  { name: 'red', hex: '#FF2D55', symbol: '●' },
  { name: 'blue', hex: '#007AFF', symbol: '■' },
  { name: 'green', hex: '#30D158', symbol: '▲' },
  { name: 'yellow', hex: '#FFD60A', symbol: '◆' },
  { name: 'orange', hex: '#FF9F0A', symbol: '★' },
  { name: 'purple', hex: '#BF5AF2', symbol: '✚' },
  { name: 'white', hex: '#E8E8F0', symbol: '○' },
  { name: 'pink', hex: '#FF6EB4', symbol: '♥' },
];

export const COLOR_NAMES: Color[] = COLORS.map(c => c.name);

export const MAX_GUESSES = 7;
export const CODE_LENGTH = 4;
export const TOTAL_LEVELS = 600;
