import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsScreen } from '../SettingsScreen';
import { useSettingsStore } from '../../stores/settingsStore';

describe('SettingsScreen — Theme Selector', () => {
  beforeEach(() => {
    useSettingsStore.setState({
      soundEnabled: true,
      vibrationEnabled: true,
      language: 'en',
      colorBlindMode: false,
      theme: 'led-classic',
    });
  });

  it('should render 3 theme buttons', () => {
    render(<SettingsScreen onBack={() => {}} />);
    expect(screen.getByRole('button', { name: /LED Classic/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Modern Flat/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cyberpunk/i })).toBeInTheDocument();
  });

  it('should mark LED Classic as pressed by default', () => {
    render(<SettingsScreen onBack={() => {}} />);
    expect(screen.getByRole('button', { name: /LED Classic/i })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /Modern Flat/i })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: /Cyberpunk/i })).toHaveAttribute('aria-pressed', 'false');
  });

  it('should switch theme when clicking a different theme button', async () => {
    const user = userEvent.setup();
    render(<SettingsScreen onBack={() => {}} />);

    await user.click(screen.getByRole('button', { name: /Cyberpunk/i }));
    expect(useSettingsStore.getState().theme).toBe('cyberpunk');
  });

  it('should update aria-pressed after theme change', async () => {
    const user = userEvent.setup();
    render(<SettingsScreen onBack={() => {}} />);

    await user.click(screen.getByRole('button', { name: /Modern Flat/i }));
    expect(screen.getByRole('button', { name: /Modern Flat/i })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /LED Classic/i })).toHaveAttribute('aria-pressed', 'false');
  });

  it('should call onBack when back button is clicked', async () => {
    const onBack = vi.fn();
    const user = userEvent.setup();
    render(<SettingsScreen onBack={onBack} />);

    await user.click(screen.getByText('\u2190'));
    expect(onBack).toHaveBeenCalledOnce();
  });
});
