import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

let mockVibrationEnabled = true;
vi.mock('../../stores/settingsStore', () => ({
  useSettingsStore: (selector: (s: { vibrationEnabled: boolean }) => boolean) =>
    selector({ vibrationEnabled: mockVibrationEnabled }),
}));

describe('useVibrate', () => {
  beforeEach(async () => {
    mockVibrationEnabled = true;
    vi.resetModules();
  });

  it('should return a vibrate function', async () => {
    const { useVibrate } = await import('../useVibrate');
    const { result } = renderHook(() => useVibrate());
    expect(typeof result.current.vibrate).toBe('function');
  });

  it('should call navigator.vibrate with correct pattern when enabled', async () => {
    const mockVibrate = vi.fn();
    Object.defineProperty(navigator, 'vibrate', {
      value: mockVibrate,
      writable: true,
      configurable: true,
    });

    const { useVibrate } = await import('../useVibrate');
    const { result } = renderHook(() => useVibrate());

    act(() => { result.current.vibrate('tap'); });
    expect(mockVibrate).toHaveBeenCalledWith([10]);

    act(() => { result.current.vibrate('win'); });
    expect(mockVibrate).toHaveBeenCalledWith([30, 50, 30, 50, 30]);

    act(() => { result.current.vibrate('lose'); });
    expect(mockVibrate).toHaveBeenCalledWith([50, 30, 80]);
  });

  it('should not vibrate when vibrationEnabled is false', async () => {
    mockVibrationEnabled = false;
    const mockVibrate = vi.fn();
    Object.defineProperty(navigator, 'vibrate', {
      value: mockVibrate,
      writable: true,
      configurable: true,
    });

    const { useVibrate } = await import('../useVibrate');
    const { result } = renderHook(() => useVibrate());
    act(() => { result.current.vibrate('place'); });
    expect(mockVibrate).not.toHaveBeenCalled();
  });

  it('should be a no-op when navigator.vibrate is unsupported', async () => {
    const original = navigator.vibrate;
    // @ts-expect-error — simulating missing API
    delete navigator.vibrate;

    const { useVibrate } = await import('../useVibrate');
    const { result } = renderHook(() => useVibrate());
    // Should not throw
    act(() => { result.current.vibrate('submit'); });

    // Restore
    Object.defineProperty(navigator, 'vibrate', {
      value: original,
      writable: true,
      configurable: true,
    });
  });

  it('should respect vibrationEnabled toggle', async () => {
    const mockVibrate = vi.fn();
    Object.defineProperty(navigator, 'vibrate', {
      value: mockVibrate,
      writable: true,
      configurable: true,
    });

    const { useVibrate } = await import('../useVibrate');
    const { result, rerender } = renderHook(() => useVibrate());

    act(() => { result.current.vibrate('place'); });
    expect(mockVibrate).toHaveBeenCalledTimes(1);

    mockVibrationEnabled = false;
    rerender();

    act(() => { result.current.vibrate('place'); });
    expect(mockVibrate).toHaveBeenCalledTimes(1); // still 1, not 2
  });
});
