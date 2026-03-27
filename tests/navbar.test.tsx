// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '@/components/layout/Navbar';

const mockUseNavbar = vi.fn();

vi.mock('@/app/hooks/usenavbar', () => ({
  useNavbar: () => mockUseNavbar(),
}));

vi.mock('next/link', () => ({
  default: ({ href, children, className, 'aria-label': ariaLabel, 'aria-current': ariaCurrent }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    'aria-label'?: string;
    'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false' | boolean;
  }) => (
    <a href={href} className={className} aria-label={ariaLabel} aria-current={ariaCurrent}>{children}</a>
  ),
}));

vi.mock('@/components/ui/Button', () => ({
  Button: ({ children, onClick, className, 'aria-label': ariaLabel }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    'aria-label'?: string;
  }) => (
    <button onClick={onClick} className={className} aria-label={ariaLabel}>{children}</button>
  ),
}));

vi.mock('@/lib/utils', () => ({
  cn: (...args: string[]) => args.filter(Boolean).join(' '),
}));

vi.mock('lucide-react', () => ({
  Store: () => <svg data-testid="icon-store" />,
  Sun: () => <svg data-testid="icon-sun" />,
  Moon: () => <svg data-testid="icon-moon" />,
}));

const mockSetTheme = vi.fn();
const mockHandleLogout = vi.fn();

const baseNavbar = {
  pathname: '/',
  theme: 'light',
  setTheme: mockSetTheme,
  status: 'unauthenticated',
  mounted: true,
  userName: '',
  userInitial: '',
  navLinks: [
    { href: '/', name: 'Home' },
    { href: '/blog', name: 'Blog' },
    { href: '/features', name: 'Features' },
  ],
  handleLogout: mockHandleLogout,
  logoText: 'RetailPro',
  loginText: 'Login',
  logoutText: 'Logout',
};

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseNavbar.mockReturnValue(baseNavbar);
  });

  describe('when not mounted', () => {
    it('renders placeholder div instead of navbar', () => {
      mockUseNavbar.mockReturnValue({ ...baseNavbar, mounted: false });
      const { container } = render(<Navbar />);
      expect(container.querySelector('nav')).not.toBeInTheDocument();
      expect(container.querySelector('div.h-16')).toBeInTheDocument();
    });

    it('does not render logo when not mounted', () => {
      mockUseNavbar.mockReturnValue({ ...baseNavbar, mounted: false });
      render(<Navbar />);
      expect(screen.queryByText('RetailPro')).not.toBeInTheDocument();
    });
  });

  describe('logo', () => {
    it('renders logo text', () => {
      render(<Navbar />);
      expect(screen.getByText('RetailPro')).toBeInTheDocument();
    });

    it('renders logo link pointing to /', () => {
      render(<Navbar />);
      const link = screen.getByRole('link', { name: /go to homepage/i });
      expect(link).toHaveAttribute('href', '/');
    });

    it('renders store icon', () => {
      render(<Navbar />);
      expect(screen.getByTestId('icon-store')).toBeInTheDocument();
    });
  });

  describe('nav links', () => {
    it('renders all nav links', () => {
      render(<Navbar />);
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Blog')).toBeInTheDocument();
      expect(screen.getByText('Features')).toBeInTheDocument();
    });

    it('renders correct href for each nav link', () => {
      render(<Navbar />);
      expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
      expect(screen.getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/blog');
      expect(screen.getByRole('link', { name: 'Features' })).toHaveAttribute('href', '/features');
    });

    it('marks active link with aria-current="page"', () => {
      mockUseNavbar.mockReturnValue({ ...baseNavbar, pathname: '/blog' });
      render(<Navbar />);
      expect(screen.getByRole('link', { name: 'Blog' })).toHaveAttribute('aria-current', 'page');
    });

    it('does not mark inactive links with aria-current', () => {
      mockUseNavbar.mockReturnValue({ ...baseNavbar, pathname: '/blog' });
      render(<Navbar />);
      expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
      expect(screen.getByRole('link', { name: 'Features' })).not.toHaveAttribute('aria-current');
    });

    it('renders empty nav links when navLinks is empty', () => {
      mockUseNavbar.mockReturnValue({ ...baseNavbar, navLinks: [] });
      render(<Navbar />);
      expect(screen.queryByText('Home')).not.toBeInTheDocument();
    });
  });

  describe('theme toggle', () => {
    it('renders Moon icon when theme is light', () => {
      render(<Navbar />);
      expect(screen.getByTestId('icon-moon')).toBeInTheDocument();
    });

    it('renders Sun icon when theme is dark', () => {
      mockUseNavbar.mockReturnValue({ ...baseNavbar, theme: 'dark' });
      render(<Navbar />);
      expect(screen.getByTestId('icon-sun')).toBeInTheDocument();
    });

    it('has correct aria-label when theme is light', () => {
      render(<Navbar />);
      expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument();
    });

    it('has correct aria-label when theme is dark', () => {
      mockUseNavbar.mockReturnValue({ ...baseNavbar, theme: 'dark' });
      render(<Navbar />);
      expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument();
    });

    it('calls setTheme with dark when clicked in light mode', () => {
      render(<Navbar />);
      fireEvent.click(screen.getByRole('button', { name: /switch to dark mode/i }));
      expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });

    it('calls setTheme with light when clicked in dark mode', () => {
      mockUseNavbar.mockReturnValue({ ...baseNavbar, theme: 'dark' });
      render(<Navbar />);
      fireEvent.click(screen.getByRole('button', { name: /switch to light mode/i }));
      expect(mockSetTheme).toHaveBeenCalledWith('light');
    });
  });

  describe('when unauthenticated', () => {
    it('renders login button', () => {
      render(<Navbar />);
      expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it('renders login link pointing to /login', () => {
      render(<Navbar />);
      expect(screen.getByRole('link', { name: /go to login page/i })).toHaveAttribute('href', '/login');
    });

    it('does not render logout button', () => {
      render(<Navbar />);
      expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    });

    it('does not render user greeting', () => {
      render(<Navbar />);
      expect(screen.queryByText(/Hi /)).not.toBeInTheDocument();
    });
  });

  describe('when authenticated', () => {
    beforeEach(() => {
      mockUseNavbar.mockReturnValue({
        ...baseNavbar,
        status: 'authenticated',
        userName: 'Rushik',
        userInitial: 'R',
      });
    });

    it('renders user greeting', () => {
      render(<Navbar />);
      expect(screen.getByText('Hi Rushik')).toBeInTheDocument();
    });

    it('renders user initial in avatar', () => {
      render(<Navbar />);
      expect(screen.getByText('R')).toBeInTheDocument();
    });

    it('renders logout button', () => {
      render(<Navbar />);
      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });

    it('calls handleLogout when logout button is clicked', () => {
      render(<Navbar />);
      fireEvent.click(screen.getByRole('button', { name: /logout/i }));
      expect(mockHandleLogout).toHaveBeenCalledTimes(1);
    });

    it('does not render login button', () => {
      render(<Navbar />);
      expect(screen.queryByText('Login')).not.toBeInTheDocument();
    });

    it('does not render login link', () => {
      render(<Navbar />);
      expect(screen.queryByRole('link', { name: /go to login page/i })).not.toBeInTheDocument();
    });

    it('renders logout text from hook', () => {
      mockUseNavbar.mockReturnValue({
        ...baseNavbar,
        status: 'authenticated',
        userName: 'Rushik',
        userInitial: 'R',
        logoutText: 'Sign Out',
      });
      render(<Navbar />);
      expect(screen.getByText('Sign Out')).toBeInTheDocument();
    });
  });

  describe('when auth status is loading', () => {
    it('renders neither login nor logout when loading', () => {
      mockUseNavbar.mockReturnValue({ ...baseNavbar, status: 'loading' });
      render(<Navbar />);
      expect(screen.queryByText('Login')).not.toBeInTheDocument();
      expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    });

    it('still renders nav links when loading', () => {
      mockUseNavbar.mockReturnValue({ ...baseNavbar, status: 'loading' });
      render(<Navbar />);
      expect(screen.getByText('Home')).toBeInTheDocument();
    });
  });

  describe('nav element', () => {
    it('renders a nav element', () => {
      render(<Navbar />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });
});