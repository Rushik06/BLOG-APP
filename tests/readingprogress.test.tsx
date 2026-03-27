// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ReadingProgress from '@/components/ui/ReadingProgress';

describe('ReadingProgress', () => {
  beforeEach(() => {
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(document.documentElement, 'clientHeight', {
      configurable: true,
      value: 500,
    });
    Object.defineProperty(document.documentElement, 'scrollTop', {
      configurable: true,
      writable: true,
      value: 0,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders the outer progress container', () => {
      const { container } = render(<ReadingProgress />);
      const outer = container.firstChild as HTMLElement;
      expect(outer).toBeInTheDocument();
    });

    it('renders the inner progress bar', () => {
      const { container } = render(<ReadingProgress />);
      const inner = container.firstChild?.firstChild as HTMLElement;
      expect(inner).toBeInTheDocument();
    });

    it('renders inner bar with 0% width initially', () => {
      const { container } = render(<ReadingProgress />);
      const inner = container.firstChild?.firstChild as HTMLElement;
      expect(inner.style.width).toBe('0%');
    });

    it('outer container has fixed positioning class', () => {
      const { container } = render(<ReadingProgress />);
      const outer = container.firstChild as HTMLElement;
      expect(outer.className).toContain('fixed');
    });

    it('outer container spans full width', () => {
      const { container } = render(<ReadingProgress />);
      const outer = container.firstChild as HTMLElement;
      expect(outer.className).toContain('w-full');
    });

    it('outer container is positioned at top', () => {
      const { container } = render(<ReadingProgress />);
      const outer = container.firstChild as HTMLElement;
      expect(outer.className).toContain('top-0');
    });

    it('inner bar has blue background class', () => {
      const { container } = render(<ReadingProgress />);
      const inner = container.firstChild?.firstChild as HTMLElement;
      expect(inner.className).toContain('bg-blue-600');
    });
  });

  describe('scroll behavior', () => {
    it('updates progress to 50% when scrolled halfway', () => {
      Object.defineProperty(document.documentElement, 'scrollTop', {
        configurable: true,
        writable: true,
        value: 0,
      });

      const { container } = render(<ReadingProgress />);

      act(() => {
        Object.defineProperty(document.documentElement, 'scrollTop', {
          configurable: true,
          writable: true,
          value: 250,
        });
        fireEvent.scroll(window);
      });

      const inner = container.firstChild?.firstChild as HTMLElement;
      expect(inner.style.width).toBe('50%');
    });

    it('updates progress to 100% when scrolled to bottom', () => {
      const { container } = render(<ReadingProgress />);

      act(() => {
        Object.defineProperty(document.documentElement, 'scrollTop', {
          configurable: true,
          writable: true,
          value: 500,
        });
        fireEvent.scroll(window);
      });

      const inner = container.firstChild?.firstChild as HTMLElement;
      expect(inner.style.width).toBe('100%');
    });

    it('updates progress to 0% when scrolled to top', () => {
      const { container } = render(<ReadingProgress />);

      act(() => {
        Object.defineProperty(document.documentElement, 'scrollTop', {
          configurable: true,
          writable: true,
          value: 0,
        });
        fireEvent.scroll(window);
      });

      const inner = container.firstChild?.firstChild as HTMLElement;
      expect(inner.style.width).toBe('0%');
    });

    it('updates progress to 25% when scrolled a quarter down', () => {
      const { container } = render(<ReadingProgress />);

      act(() => {
        Object.defineProperty(document.documentElement, 'scrollTop', {
          configurable: true,
          writable: true,
          value: 125,
        });
        fireEvent.scroll(window);
      });

      const inner = container.firstChild?.firstChild as HTMLElement;
      expect(inner.style.width).toBe('25%');
    });

    it('attaches scroll event listener on mount', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      render(<ReadingProgress />);
      expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    });

    it('removes scroll event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      const { unmount } = render(<ReadingProgress />);
      unmount();
      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    });

    it('updates progress on multiple scroll events', () => {
      const { container } = render(<ReadingProgress />);

      act(() => {
        Object.defineProperty(document.documentElement, 'scrollTop', {
          configurable: true,
          writable: true,
          value: 100,
        });
        fireEvent.scroll(window);
      });

      const inner = container.firstChild?.firstChild as HTMLElement;
      expect(inner.style.width).toBe('20%');

      act(() => {
        Object.defineProperty(document.documentElement, 'scrollTop', {
          configurable: true,
          writable: true,
          value: 400,
        });
        fireEvent.scroll(window);
      });

      expect(inner.style.width).toBe('80%');
    });
  });

  describe('after unmount', () => {
    it('does not update progress after unmount', () => {
      const { container, unmount } = render(<ReadingProgress />);
      const inner = container.firstChild?.firstChild as HTMLElement;

      unmount();

      act(() => {
        Object.defineProperty(document.documentElement, 'scrollTop', {
          configurable: true,
          writable: true,
          value: 500,
        });
        fireEvent.scroll(window);
      });

      expect(inner.style.width).toBe('0%');
    });
  });
});
