import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import ReadingProgress from '@/components/ui/ReadingProgress';

describe('ReadingProgress', () => {
  const setScroll = (top: number): void => {
    document.documentElement.scrollTop = top;
    fireEvent.scroll(window);
  };

  beforeEach(() => {
    Object.defineProperties(document.documentElement, {
      scrollHeight: { value: 1000, configurable: true },
      clientHeight: { value: 500, configurable: true },
      scrollTop: { value: 0, writable: true, configurable: true },
    });
  });

  const getBar = (container: HTMLElement): HTMLElement =>
    container.querySelector('.bg-blue-600') as HTMLElement;

  it('renders initial state and updates on scroll', () => {
    const { container } = render(<ReadingProgress />);
    const bar = getBar(container);

    expect(bar.style.width).toBe('0%');
    expect(bar.parentElement?.className).toContain('fixed');

    act(() => setScroll(250));
    expect(bar.style.width).toBe('50%');

    act(() => setScroll(500));
    expect(bar.style.width).toBe('100%');
  });

  it('manages lifecycle and listeners', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount, container } = render(<ReadingProgress />);
    const bar = getBar(container);

    // Verify 'scroll' was registered
    expect(addSpy).toHaveBeenCalledWith('scroll', expect.not.stringContaining(''));

    // Check that the second argument is indeed a function
    const lastCallArg = addSpy.mock.calls[0][1];
    expect(typeof lastCallArg).toBe('function');

    unmount();
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.not.stringContaining(''));

    act(() => setScroll(500));
    expect(bar.style.width).toBe('0%');
  });
});
