import { COLORS } from '@super-decoder/shared';
import type { Color } from '@super-decoder/shared';

interface ColorPickerProps {
  availableColors: Color[];
  usedColors: Color[];
  onColorSelect: (color: Color) => void;
  colorBlindMode: boolean;
}

const colorHexMap: Record<Color, string> = Object.fromEntries(
  COLORS.map(c => [c.name, c.hex])
) as Record<Color, string>;

const colorSymbolMap: Record<Color, string> = Object.fromEntries(
  COLORS.map(c => [c.name, c.symbol])
) as Record<Color, string>;

export function ColorPicker({ availableColors, usedColors, onColorSelect, colorBlindMode }: ColorPickerProps) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
      {availableColors.map(color => {
        const isUsed = usedColors.includes(color);
        return (
          <button
            key={color}
            aria-label={color}
            aria-disabled={isUsed || undefined}
            onClick={() => onColorSelect(color)}
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: colorHexMap[color],
              border: '2px solid var(--border-subtle)',
              cursor: isUsed ? 'default' : 'pointer',
              opacity: isUsed ? 0.4 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              boxShadow: isUsed ? 'none' : `0 0 8px ${colorHexMap[color]}60`,
              position: 'relative',
            }}
          >
            {colorBlindMode && (
              <span style={{ color: 'var(--symbol-color)', textShadow: 'var(--symbol-shadow)' }}>
                {colorSymbolMap[color]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
