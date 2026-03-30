import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '@/components/layout/Navbar';
import { useNavbar } from '@/app/hooks/usenavbar';

vi.mock('@/app/hooks/usenavbar', () => ({ useNavbar: vi.fn() }));
vi.mock('@/lib/utils', () => ({ cn: (...args: string[]) => args.filter(Boolean).join(' ') }));


vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => <a href={href} {...props}>{children}</a>
}));
vi.mock('@/components/ui/Button', () => ({
  Button: ({ children, onClick, ...props }: any) => <button onClick={onClick} {...props}>{children}</button>
}));
vi.mock('lucide-react', () => ({
  Store: () => <span data-testid="icon-store" />,
  Sun: () => <span data-testid="icon-sun" />,
  Moon: () => <span data-testid="icon-moon" />,
}));

const mockData = {
  pathname: '/',
  theme: 'light',
  setTheme: vi.fn(),
  status: 'unauthenticated',
  mounted: true,
  navLinks: [{ href: '/blog', name: 'Blog' }],
  logoText: 'RetailPro',
  handleLogout: vi.fn(),
};

describe('Navbar', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows a loading skeleton if not mounted', () => {
    vi.mocked(useNavbar).mockReturnValue({ ...mockData as any, mounted: false });
    const { container } = render(<Navbar />);
    expect(container.firstChild).toHaveClass('h-16');
    expect(screen.queryByText('RetailPro')).toBeNull();
  });

  it('renders brand, links, and highlights active page', () => {
    vi.mocked(useNavbar).mockReturnValue({ ...mockData as any, pathname: '/blog' });
    render(<Navbar />);

    expect(screen.getByText('RetailPro')).toBeDefined();
    const blogLink = screen.getByRole('link', { name: 'Blog' });
    expect(blogLink).toHaveAttribute('href', '/blog');
    expect(blogLink).toHaveAttribute('aria-current', 'page');
  });

  it('toggles theme correctly', () => {
    const setTheme = vi.fn();
    vi.mocked(useNavbar).mockReturnValue({ ...mockData as any, setTheme, theme: 'light' });
    
    render(<Navbar />);
    fireEvent.click(screen.getByRole('button', { name: /dark mode/i }));
    
    expect(setTheme).toHaveBeenCalledWith('dark');
    expect(screen.getByTestId('icon-moon')).toBeDefined();
  });

  describe('Authentication States', () => {
    it('shows login when signed out', () => {
      vi.mocked(useNavbar).mockReturnValue(mockData as any);
      render(<Navbar />);
      expect(screen.getByRole('link', { name: /login/i })).toBeDefined();
    });

    it('shows profile and handles logout when signed in', () => {
      const handleLogout = vi.fn();
      vi.mocked(useNavbar).mockReturnValue({
        ...mockData as any,
        status: 'authenticated',
        userName: 'Rushik',
        userInitial: 'R',
        handleLogout,
      });

      render(<Navbar />);
      expect(screen.getByText('Hi Rushik')).toBeDefined();
      expect(screen.getByText('R')).toBeDefined();
      
      fireEvent.click(screen.getByRole('button', { name: /logout/i }));
      expect(handleLogout).toHaveBeenCalled();
    });

    it('hides buttons while loading session', () => {
      vi.mocked(useNavbar).mockReturnValue({ ...mockData as any, status: 'loading' });
      render(<Navbar />);
      expect(screen.queryByText(/login/i)).toBeNull();
    });
  });
});