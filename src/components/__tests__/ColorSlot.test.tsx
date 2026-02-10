import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ColorSlot } from '../ColorSlot';
import { COLORS } from '../../logic/constants';

describe('ColorSlot', () => {
  describe('empty slot', () => {
    it('should show "Empty slot" as accessible label', () => {
      render(
        <ColorSlot
          color={null}
          isSelected={false}
          isDisabled={false}
          colorBlindMode={false}
          onClick={() => {}}
        />
      );
      expect(screen.getByLabelText('Empty slot')).toBeInTheDocument();
    });

    it('should not display any color symbol text', () => {
      render(
        <ColorSlot
          color={null}
          isSelected={false}
          isDisabled={false}
          colorBlindMode={true}
          onClick={() => {}}
        />
      );
      for (const colorDef of COLORS) {
        expect(screen.queryByText(colorDef.symbol)).not.toBeInTheDocument();
      }
    });
  });

  describe('filled slot', () => {
    it('should show the color name in the accessible label', () => {
      render(
        <ColorSlot
          color="red"
          isSelected={false}
          isDisabled={false}
          colorBlindMode={false}
          onClick={() => {}}
        />
      );
      expect(screen.getByLabelText('red slot')).toBeInTheDocument();
    });

    it('should reflect the correct color in the label for different colors', () => {
      const { rerender } = render(
        <ColorSlot
          color="blue"
          isSelected={false}
          isDisabled={false}
          colorBlindMode={false}
          onClick={() => {}}
        />
      );
      expect(screen.getByLabelText('blue slot')).toBeInTheDocument();

      rerender(
        <ColorSlot
          color="green"
          isSelected={false}
          isDisabled={false}
          colorBlindMode={false}
          onClick={() => {}}
        />
      );
      expect(screen.getByLabelText('green slot')).toBeInTheDocument();
    });
  });

  describe('selected state', () => {
    it('should have aria-selected="true" when selected', () => {
      render(
        <ColorSlot
          color="red"
          isSelected={true}
          isDisabled={false}
          colorBlindMode={false}
          onClick={() => {}}
        />
      );
      expect(screen.getByLabelText('red slot')).toHaveAttribute(
        'aria-selected',
        'true'
      );
    });

    it('should not have aria-selected="true" when not selected', () => {
      render(
        <ColorSlot
          color="red"
          isSelected={false}
          isDisabled={false}
          colorBlindMode={false}
          onClick={() => {}}
        />
      );
      const slot = screen.getByLabelText('red slot');
      expect(slot).not.toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('disabled state', () => {
    it('should have aria-disabled="true" when disabled', () => {
      render(
        <ColorSlot
          color="red"
          isSelected={false}
          isDisabled={true}
          colorBlindMode={false}
          onClick={() => {}}
        />
      );
      expect(screen.getByLabelText('red slot')).toHaveAttribute(
        'aria-disabled',
        'true'
      );
    });

    it('should not fire onClick when disabled', () => {
      const handleClick = vi.fn();
      render(
        <ColorSlot
          color="red"
          isSelected={false}
          isDisabled={true}
          colorBlindMode={false}
          onClick={handleClick}
        />
      );
      fireEvent.click(screen.getByLabelText('red slot'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('color blind mode', () => {
    it('should show the symbol character when color blind mode is on and slot is filled', () => {
      const redDef = COLORS.find((c) => c.name === 'red')!;
      render(
        <ColorSlot
          color="red"
          isSelected={false}
          isDisabled={false}
          colorBlindMode={true}
          onClick={() => {}}
        />
      );
      expect(screen.getByText(redDef.symbol)).toBeInTheDocument();
    });

    it('should show the correct symbol for each color', () => {
      for (const colorDef of COLORS) {
        const { unmount } = render(
          <ColorSlot
            color={colorDef.name}
            isSelected={false}
            isDisabled={false}
            colorBlindMode={true}
            onClick={() => {}}
          />
        );
        expect(screen.getByText(colorDef.symbol)).toBeInTheDocument();
        unmount();
      }
    });

    it('should not show symbol when color blind mode is off', () => {
      const redDef = COLORS.find((c) => c.name === 'red')!;
      render(
        <ColorSlot
          color="red"
          isSelected={false}
          isDisabled={false}
          colorBlindMode={false}
          onClick={() => {}}
        />
      );
      expect(screen.queryByText(redDef.symbol)).not.toBeInTheDocument();
    });
  });

  describe('click interaction', () => {
    it('should fire onClick when clicked and not disabled', () => {
      const handleClick = vi.fn();
      render(
        <ColorSlot
          color="red"
          isSelected={false}
          isDisabled={false}
          colorBlindMode={false}
          onClick={handleClick}
        />
      );
      fireEvent.click(screen.getByLabelText('red slot'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should fire onClick on an empty slot', () => {
      const handleClick = vi.fn();
      render(
        <ColorSlot
          color={null}
          isSelected={false}
          isDisabled={false}
          colorBlindMode={false}
          onClick={handleClick}
        />
      );
      fireEvent.click(screen.getByLabelText('Empty slot'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});
