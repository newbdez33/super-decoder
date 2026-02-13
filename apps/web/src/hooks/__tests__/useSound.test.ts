import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const mockPlay = vi.fn();

vi.mock('howler', () => ({
  Howl: vi.fn().mockImplementation(function () {
    return { play: mockPlay };
  }),
}));

// Mock settingsStore — default soundEnabled = true
let mockSoundEnabled = true;
vi.mock('../../stores/settingsStore', () => ({
  useSettingsStore: (selector: (s: { soundEnabled: boolean }) => boolean) =>
    selector({ soundEnabled: mockSoundEnabled }),
}));

describe('useSound', () => {
  beforeEach(async () => {
    mockPlay.mockClear();
    mockSoundEnabled = true;
    // Reset the module-level howls singleton between tests
    vi.resetModules();
  });

  it('should return a play function', async () => {
    const { useSound } = await import('../useSound');
    const { result } = renderHook(() => useSound());
    expect(typeof result.current.play).toBe('function');
  });

  it('should play a sound when soundEnabled is true', async () => {
    const { useSound } = await import('../useSound');
    const { result } = renderHook(() => useSound());
    act(() => {
      result.current.play('place');
    });
    expect(mockPlay).toHaveBeenCalledTimes(1);
  });

  it('should not play a sound when soundEnabled is false', async () => {
    mockSoundEnabled = false;
    const { useSound } = await import('../useSound');
    const { result } = renderHook(() => useSound());
    act(() => {
      result.current.play('place');
    });
    expect(mockPlay).not.toHaveBeenCalled();
  });

  it('should play different sounds', async () => {
    const { useSound } = await import('../useSound');
    const { result } = renderHook(() => useSound());
    act(() => {
      result.current.play('submit');
      result.current.play('win');
      result.current.play('star');
    });
    expect(mockPlay).toHaveBeenCalledTimes(3);
  });

  it('should respect soundEnabled toggle', async () => {
    const { useSound } = await import('../useSound');
    const { result, rerender } = renderHook(() => useSound());

    act(() => {
      result.current.play('place');
    });
    expect(mockPlay).toHaveBeenCalledTimes(1);

    mockSoundEnabled = false;
    rerender();

    act(() => {
      result.current.play('place');
    });
    expect(mockPlay).toHaveBeenCalledTimes(1); // still 1, not 2
  });
});
