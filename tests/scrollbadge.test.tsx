// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ScrollToHeroBadge from '@/components/ui/ScrollToHeroBadge';

const mockUseUiBadge = vi.fn();

vi.mock('@/app/hooks/useui-badge', () => ({
  useUiBadge: () => mockUseUiBadge(),
}));

vi.mock('lucide-react', () => ({
  ArrowUpRight: () => <svg data-testid="icon-arrow-up-right" />,
}));

const mockConfig = {
  buttonText: 'Scroll to top',
  subText: 'Click to go back to hero',
};

describe('ScrollToHeroBadge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUiBadge.mockReturnValue(mockConfig);
  });

  describe('rendering', () => {
    it('renders the button', () => {
      render(<ScrollToHeroBadge />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders button text from config', () => {
      render(<ScrollToHeroBadge />);
      expect(screen.getByText('Scroll to top')).toBeInTheDocument();
    });

    it('renders subtext from config', () => {
      render(<ScrollToHeroBadge />);
      expect(screen.getByText('Click to go back to hero')).toBeInTheDocument();
    });

    it('renders the ArrowUpRight icon', () => {
      render(<ScrollToHeroBadge />);
      expect(screen.getByTestId('icon-arrow-up-right')).toBeInTheDocument();
    });

    it('renders container div', () => {
      const { container } = render(<ScrollToHeroBadge />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('when config is null', () => {
    beforeEach(() => {
      mockUseUiBadge.mockReturnValue(null);
    });

    it('renders button even when config is null', () => {
      render(<ScrollToHeroBadge />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders icon even when config is null', () => {
      render(<ScrollToHeroBadge />);
      expect(screen.getByTestId('icon-arrow-up-right')).toBeInTheDocument();
    });

    it('renders no button text when config is null', () => {
      render(<ScrollToHeroBadge />);
      expect(screen.getByRole('button').textContent?.trim()).toBe('');
    });
  });

  describe('scroll behavior', () => {
    it('calls scrollIntoView on hero element when button is clicked', () => {
      const scrollIntoViewMock = vi.fn();
      const heroElement = document.createElement('div');
      heroElement.id = 'hero';
      heroElement.scrollIntoView = scrollIntoViewMock;
      document.body.appendChild(heroElement);

      render(<ScrollToHeroBadge />);
      fireEvent.click(screen.getByRole('button'));

      expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });

      document.body.removeChild(heroElement);
    });

    it('calls scrollIntoView exactly once per click', () => {
      const scrollIntoViewMock = vi.fn();
      const heroElement = document.createElement('div');
      heroElement.id = 'hero';
      heroElement.scrollIntoView = scrollIntoViewMock;
      document.body.appendChild(heroElement);

      render(<ScrollToHeroBadge />);
      fireEvent.click(screen.getByRole('button'));

      expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);

      document.body.removeChild(heroElement);
    });

    it('does not throw when hero element does not exist', () => {
      render(<ScrollToHeroBadge />);
      expect(() => fireEvent.click(screen.getByRole('button'))).not.toThrow();
    });

    it('does not call scrollIntoView when hero element does not exist', () => {
      const scrollIntoViewMock = vi.fn();
      render(<ScrollToHeroBadge />);
      fireEvent.click(screen.getByRole('button'));
      expect(scrollIntoViewMock).not.toHaveBeenCalled();
    });
  });

  describe('config variations', () => {
    it('renders updated button text when config changes', () => {
      mockUseUiBadge.mockReturnValue({ buttonText: 'Back to top', subText: 'Go up' });
      render(<ScrollToHeroBadge />);
      expect(screen.getByText('Back to top')).toBeInTheDocument();
    });

    it('renders updated subtext when config changes', () => {
      mockUseUiBadge.mockReturnValue({ buttonText: 'Back to top', subText: 'Go up' });
      render(<ScrollToHeroBadge />);
      expect(screen.getByText('Go up')).toBeInTheDocument();
    });

    it('renders empty button text when buttonText is undefined', () => {
      mockUseUiBadge.mockReturnValue({ buttonText: undefined, subText: 'Some text' });
      render(<ScrollToHeroBadge />);
      expect(screen.getByText('Some text')).toBeInTheDocument();
    });
  });
});
