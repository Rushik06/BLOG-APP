import { it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReactNode } from 'react';
import Navbar from '@/components/layout/Navbar';
import { useNavbar } from '@/app/hooks/usenavbar';

vi.mock('@/app/hooks/usenavbar', () => ({ useNavbar: vi.fn() }));
vi.mock('@/lib/utils', () => ({ cn: (...args: string[]) => args.filter(Boolean).join(' ') }));

vi.mock('next/link', () => ({ 
  default: ({ href, children }: { href: string; children: ReactNode }) => <a href={href}>{children}</a> 
}));

vi.mock('@/components/ui/Button', () => ({ 
  Button: ({ children, onClick }: { children: ReactNode; onClick?: () => void }) => 
    <button onClick={onClick}>{children}</button> 
}));

vi.mock('lucide-react', () => ({ 
  Store: () => <i data-testid="icon-store" />, 
  Sun: () => <i data-testid="icon-sun" />, 
  Moon: () => <i data-testid="icon-moon" /> 
}));

const mock = (overrides = {}) => {
  const state: ReturnType<typeof useNavbar> = {
    pathname: '/', 
    theme: 'light', 
    setTheme: vi.fn(), 
    status: 'unauthenticated',
    session: null, 
    mounted: true, 
    navLinks: [{ href: '/blog', name: 'Blog' }],
    logoText: 'RetailPro', 
    loginText: 'Login', 
    logoutText: 'Logout',
    userName: '', 
    userInitial: '', 
    handleLogout: vi.fn(), 
    ...overrides
  };
  vi.mocked(useNavbar).mockReturnValue(state);
  return state;
};

beforeEach(() => vi.clearAllMocks());

it('renders brand and navigation correctly', async () => {
  mock({ mounted: false });
  const { container, rerender } = render(<Navbar />);
  expect(container.firstChild).toHaveClass('h-16');

  mock({ pathname: '/blog' });
  rerender(<Navbar />);
  expect(screen.getByText('RetailPro')).toBeDefined();
  
  const link = screen.getByText('Blog').closest('a');
  expect(link).toHaveAttribute('href', '/blog');
});

it('toggles theme and manages auth states', () => {
  const { setTheme } = mock({ theme: 'light' });
  const { rerender } = render(<Navbar />);
  
  const themeBtn = screen.getByTestId('icon-moon').closest('button');
  if (themeBtn) fireEvent.click(themeBtn);
  expect(setTheme).toHaveBeenCalledWith('dark');

  mock({ status: 'authenticated', userName: 'Rushik' });
  rerender(<Navbar />);
  expect(screen.getByText(/Rushik/)).toBeDefined();

  mock({ status: 'loading' });
  rerender(<Navbar />);
  expect(screen.queryByText('Login')).toBeNull();
});