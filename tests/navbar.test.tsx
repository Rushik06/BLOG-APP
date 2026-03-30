import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React, { ReactNode } from 'react';
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
  Store: () => <span data-testid="icon-store" />,
  Sun: () => <span data-testid="icon-sun" />,
  Moon: () => <span data-testid="icon-moon" />,
}));

describe('Navbar', () => {
  const mockNavbar = (overrides = {}) => {
    const state = {
      pathname: '/',
      theme: 'light',
      setTheme: vi.fn(),
      status: 'unauthenticated' as const,
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
    } as ReturnType<typeof useNavbar>;
    
    vi.mocked(useNavbar).mockReturnValue(state);
    return state;
  };

  beforeEach(() => vi.clearAllMocks());

  it('handles loading state and brand rendering', () => {
    mockNavbar({ mounted: false });
    const { container, rerender } = render(<Navbar />);
    expect(container.firstChild).toHaveClass('h-16');

    mockNavbar({ pathname: '/blog' });
    rerender(<Navbar />);
    expect(screen.getByText('RetailPro')).toBeDefined();
    
    const blogLink = screen.getByText('Blog').closest('a');
    expect(blogLink).toHaveAttribute('href', '/blog');
  });

  it('toggles theme correctly', () => {
    const state = mockNavbar({ theme: 'light' });
    render(<Navbar />);
    
    const themeBtn = screen.getByTestId('icon-moon').closest('button');
    if (themeBtn) fireEvent.click(themeBtn);
    
    expect(state.setTheme).toHaveBeenCalledWith('dark');
  });

  it('manages auth states correctly', () => {
    mockNavbar({ status: 'unauthenticated' });
    const { rerender } = render(<Navbar />);
    expect(screen.getByText('Login')).toBeDefined();

    mockNavbar({ 
      status: 'authenticated', 
      userName: 'Rushik', 
      userInitial: 'R' 
    });
    rerender(<Navbar />);
    expect(screen.getByText('Hi Rushik')).toBeDefined();
    expect(screen.getByText('R')).toBeDefined();

    mockNavbar({ status: 'loading' });
    rerender(<Navbar />);
    expect(screen.queryByText('Login')).toBeNull();
  });
});