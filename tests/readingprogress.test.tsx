// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import ReadingProgress from '@/components/ui/ReadingProgress';

describe('ReadingProgress', () => {
  const setScroll = (top: number) => {
    Object.defineProperty(document.documentElement, 'scrollTop', {
      configurable: true,
      writable: true,
      value: top,
    });
  };

  beforeEach(() => {
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(document.documentElement, 'clientHeight', {
      configurable: true,
      value: 500,
    });
    setScroll(0);
  });

  it('renders with correct classes and initial 0% width', () => {
    const { container } = render(<ReadingProgress />);
    const bar = container.querySelector('.bg-blue-600');

    if (bar instanceof HTMLElement) {
      expect(bar.parentElement?.className).toContain('fixed');
      expect(bar.style.width).toBe('0%');
    } else {
      throw new Error('Progress bar element not found or not an HTMLElement');
    }
  });

  it('updates width correctly when scrolling', () => {
    const { container } = render(<ReadingProgress />);
    const bar = container.querySelector('.bg-blue-600');

    if (!(bar instanceof HTMLElement)) return;

    act(() => {
      setScroll(250);
      fireEvent.scroll(window);
    });
    expect(bar.style.width).toBe('50%');

    act(() => {
      setScroll(500);
      fireEvent.scroll(window);
    });
    expect(bar.style.width).toBe('100%');
  });

  it('manages scroll listeners on mount and unmount', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = render(<ReadingProgress />);
    expect(addSpy).toHaveBeenCalledWith('scroll', expect.any(Function));

    unmount();
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('stops updating width after component is unmounted', () => {
    const { container, unmount } = render(<ReadingProgress />);
    const bar = container.querySelector('.bg-blue-600');

    if (!(bar instanceof HTMLElement)) return;

    unmount();

    act(() => {
      setScroll(500);
      fireEvent.scroll(window);
    });

    expect(bar.style.width).toBe('0%');
  });
});
