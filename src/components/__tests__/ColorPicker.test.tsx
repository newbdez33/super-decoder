import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ColorPicker } from '../ColorPicker';
import { COLORS } from '../../logic/constants';
import type { Color } from '../../types/game';

describe('ColorPicker', () => {
  const allColors: Color[] = COLORS.map((c) => c.name);

  describe('rendering color buttons', () => {
    it('should render the correct number of color buttons', () => {
      render(
        <ColorPicker
          availableColors={['red', 'blue', 'green', 'yellow']}
          usedColors={[]}
          onColorSelect={() => {}}
          colorBlindMode={false}
        />
      );
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(4);
    });

    it('should render all 8 color buttons when all colors are available', () => {
      render(
        <ColorPicker
          availableColors={allColors}
          usedColors={[]}
          onColorSelect={() => {}}
          colorBlindMode={false}
        />
      );
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(8);
    });

    it('should render 6 buttons when 6 colors are available', () => {
      render(
        <ColorPicker
          availableColors={['red', 'blue', 'green', 'yellow', 'orange', 'purple']}
          usedColors={[]}
          onColorSelect={() => {}}
          colorBlindMode={false}
        />
      );
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(6);
    });
  });

  describe('used colors', () => {
    it('should mark used colors with aria-disabled="true"', () => {
      render(
        <ColorPicker
          availableColors={['red', 'blue', 'green', 'yellow']}
          usedColors={['red', 'blue']}
          onColorSelect={() => {}}
          colorBlindMode={false}
        />
      );
      expect(screen.getByLabelText('red')).toHaveAttribute(
        'aria-disabled',
        'true'
      );
      expect(screen.getByLabelText('blue')).toHaveAttribute(
        'aria-disabled',
        'true'
      );
    });

    it('should not mark unused colors with aria-disabled', () => {
      render(
        <ColorPicker
          availableColors={['red', 'blue', 'green', 'yellow']}
          usedColors={['red']}
          onColorSelect={() => {}}
          colorBlindMode={false}
        />
      );
      expect(screen.getByLabelText('green')).not.toHaveAttribute(
        'aria-disabled',
        'true'
      );
      expect(screen.getByLabelText('yellow')).not.toHaveAttribute(
        'aria-disabled',
        'true'
      );
    });
  });

  describe('click interaction', () => {
    it('should trigger onColorSelect with the clicked color', () => {
      const handleSelect = vi.fn();
      render(
        <ColorPicker
          availableColors={['red', 'blue', 'green', 'yellow']}
          usedColors={[]}
          onColorSelect={handleSelect}
          colorBlindMode={false}
        />
      );
      fireEvent.click(screen.getByLabelText('green'));
      expect(handleSelect).toHaveBeenCalledWith('green');
    });

    it('should trigger onColorSelect with each specific color', () => {
      const handleSelect = vi.fn();
      render(
        <ColorPicker
          availableColors={['red', 'blue', 'green', 'yellow']}
          usedColors={[]}
          onColorSelect={handleSelect}
          colorBlindMode={false}
        />
      );
      fireEvent.click(screen.getByLabelText('red'));
      expect(handleSelect).toHaveBeenCalledWith('red');

      fireEvent.click(screen.getByLabelText('yellow'));
      expect(handleSelect).toHaveBeenCalledWith('yellow');
    });
  });

  describe('color blind mode', () => {
    it('should show symbols when color blind mode is enabled', () => {
      render(
        <ColorPicker
          availableColors={allColors}
          usedColors={[]}
          onColorSelect={() => {}}
          colorBlindMode={true}
        />
      );
      for (const colorDef of COLORS) {
        expect(screen.getByText(colorDef.symbol)).toBeInTheDocument();
      }
    });

    it('should not show symbols when color blind mode is disabled', () => {
      render(
        <ColorPicker
          availableColors={allColors}
          usedColors={[]}
          onColorSelect={() => {}}
          colorBlindMode={false}
        />
      );
      for (const colorDef of COLORS) {
        expect(screen.queryByText(colorDef.symbol)).not.toBeInTheDocument();
      }
    });
  });
});
