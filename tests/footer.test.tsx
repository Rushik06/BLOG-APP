import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Footer from '@/components/layout/Footer';

const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch);
  vi.stubEnv('NEXT_PUBLIC_STRAPI_URL', 'http://localhost:1337');
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe('Footer', () => {

  describe('when API returns footer text', () => {
    it('renders footer text from API', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ data: { footerText: '© 2026 RetailPro. Custom footer text.' } }),
      });

      render(<Footer />);

      await waitFor(() => {
        expect(screen.getByText('© 2026 RetailPro. Custom footer text.')).toBeInTheDocument();
      });
    });

    it('renders footer element', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ data: { footerText: 'My Footer' } }),
      });

      render(<Footer />);

      await waitFor(() => {
        expect(screen.getByRole('contentinfo')).toBeInTheDocument();
      });
    });

    it('calls fetch with correct URL', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ data: { footerText: 'Some text' } }),
      });

      render(<Footer />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('http://localhost:1337/ui-config');
      });
    });

    it('calls fetch exactly once', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ data: { footerText: 'Some text' } }),
      });

      render(<Footer />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('when API returns no footerText', () => {
    it('renders default text when footerText is null', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ data: { footerText: null } }),
      });

      render(<Footer />);

      await waitFor(() => {
        expect(
          screen.getByText('© 2026 RetailPro. Built for modern inventory management.')
        ).toBeInTheDocument();
      });
    });

    it('renders default text when data is null', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ data: null }),
      });

      render(<Footer />);

      await waitFor(() => {
        expect(
          screen.getByText('© 2026 RetailPro. Built for modern inventory management.')
        ).toBeInTheDocument();
      });
    });

    it('renders default text when data is undefined', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({}),
      });

      render(<Footer />);

      await waitFor(() => {
        expect(
          screen.getByText('© 2026 RetailPro. Built for modern inventory management.')
        ).toBeInTheDocument();
      });
    });
  });

  describe('when API call fails', () => {
    it('does not render any footer text on fetch error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      render(<Footer />);

      await waitFor(() => {
        expect(screen.getByRole('contentinfo')).toBeInTheDocument();
      });

      expect(
        screen.queryByText('© 2026 RetailPro. Built for modern inventory management.')
      ).not.toBeInTheDocument();
    });

    it('logs error to console on fetch failure', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Network error');
      mockFetch.mockRejectedValueOnce(error);

      render(<Footer />);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(error);
      });

      consoleSpy.mockRestore();
    });

    it('renders footer element even on error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      render(<Footer />);

      await waitFor(() => {
        expect(screen.getByRole('contentinfo')).toBeInTheDocument();
      });
    });
  });

  describe('initial render', () => {
    it('renders footer with empty text before fetch completes', () => {
      mockFetch.mockImplementationOnce(() => new Promise(() => {}));

      render(<Footer />);

      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
      expect(footer.textContent?.trim()).toBe('');
    });

    it('renders footer element immediately on mount', () => {
      mockFetch.mockImplementationOnce(() => new Promise(() => {}));

      render(<Footer />);

      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });
  });
});