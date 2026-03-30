import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ScrollToHeroBadge from '@/components/ui/ScrollToHeroBadge';
import { useUiBadge } from '@/app/hooks/useui-badge';

vi.mock('@/app/hooks/useui-badge', () => ({ useUiBadge: vi.fn() }));
vi.mock('lucide-react', () => ({ ArrowUpRight: () => <span data-testid="icon" /> }));

describe('ScrollToHeroBadge', () => {
  const mockConfig = { buttonText: 'Top', subText: 'Hero' };

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('renders text and icons correctly from the hook', () => {
    vi.mocked(useUiBadge).mockReturnValue(mockConfig);
    render(<ScrollToHeroBadge />);

    expect(screen.getByText('Top')).toBeDefined();
    expect(screen.getByText('Hero')).toBeDefined();
    expect(screen.getByTestId('icon')).toBeDefined();
  });

  it('scrolls to hero smoothly when clicked', () => {
    vi.mocked(useUiBadge).mockReturnValue(mockConfig);

    const hero = document.createElement('div');
    hero.id = 'hero';
    hero.scrollIntoView = vi.fn();
    document.body.appendChild(hero);

    render(<ScrollToHeroBadge />);
    fireEvent.click(screen.getByRole('button'));

    expect(hero.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('handles missing hero element without crashing', () => {
    vi.mocked(useUiBadge).mockReturnValue(mockConfig);
    render(<ScrollToHeroBadge />);

    expect(() => fireEvent.click(screen.getByRole('button'))).not.toThrow();
  });

  it('handles empty or partial config gracefully', () => {
    vi.mocked(useUiBadge).mockReturnValue(null);
    const { rerender } = render(<ScrollToHeroBadge />);
    expect(screen.getByRole('button').textContent?.trim()).toBe('');

    vi.mocked(useUiBadge).mockReturnValue({ subText: 'Just Sub' });
    rerender(<ScrollToHeroBadge />);
    expect(screen.getByText('Just Sub')).toBeDefined();
  });
});
