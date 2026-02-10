import { COLORS } from '@super-decoder/shared';
import type { Color } from '@super-decoder/shared';

interface ColorSlotProps {
  color: Color | null;
  isSelected: boolean;
  isDisabled: boolean;
  colorBlindMode: boolean;
  onClick: () => void;
}

const colorHexMap: Record<Color, string> = Object.fromEntries(
  COLORS.map(c => [c.name, c.hex])
) as Record<Color, string>;

const colorSymbolMap: Record<Color, string> = Object.fromEntries(
  COLORS.map(c => [c.name, c.symbol])
) as Record<Color, string>;

export function ColorSlot({ color, isSelected, isDisabled, colorBlindMode, onClick }: ColorSlotProps) {
  const label = color ? `${color} slot` : 'Empty slot';

  const handleClick = () => {
    if (!isDisabled) {
      onClick();
    }
  };

  const baseStyle: React.CSSProperties = {
    width: 44,
    height: 44,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: isDisabled ? 'default' : 'pointer',
    transition: 'all 0.15s ease',
    fontSize: 18,
    fontWeight: 'bold',
  };

  const slotStyle: React.CSSProperties = color
    ? {
        ...baseStyle,
        backgroundColor: colorHexMap[color],
        border: isSelected ? '2px solid var(--selection-border)' : '2px solid transparent',
        boxShadow: `0 0 8px ${colorHexMap[color]}, 0 0 16px ${colorHexMap[color]}40`,
      }
    : {
        ...baseStyle,
        backgroundColor: 'var(--bg-slot)',
        border: isSelected ? '2px solid var(--selection-border)' : '2px dashed var(--border-subtle)',
      };

  return (
    <div
      role="button"
      aria-label={label}
      aria-selected={isSelected || undefined}
      aria-disabled={isDisabled || undefined}
      onClick={handleClick}
      style={slotStyle}
    >
      {color && colorBlindMode && (
        <span style={{ color: 'var(--symbol-color)', textShadow: 'var(--symbol-shadow)' }}>
          {colorSymbolMap[color]}
        </span>
      )}
    </div>
  );
}
