import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Footer from '@/components/layout/Footer';

interface FooterResponse {
  data?: { footerText?: string | null } | null;
}

const mockFetch = vi.fn();
const DEFAULT_TEXT = '© 2026 RetailPro. Built for modern inventory management.';
const CUSTOM_TEXT = '© 2026 RetailPro. Custom footer text.';

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch);
  vi.stubEnv('NEXT_PUBLIC_STRAPI_URL', 'http://localhost:1337');
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

const mockSuccess = (body: FooterResponse) => {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => body,
  });
};

describe('Footer', () => {
  it('displays custom text from API', async () => {
    mockSuccess({ data: { footerText: CUSTOM_TEXT } });
    render(<Footer />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:1337/ui-config');
      expect(screen.getByText(CUSTOM_TEXT)).toBeInTheDocument();
    });
  });

  it.each([
    ['null text', { data: { footerText: null } }],
    ['null data', { data: null }],
    ['empty object', {}],
  ])('shows default text on %s', async (_, body) => {
    mockSuccess(body);
    render(<Footer />);

    expect(await screen.findByText(DEFAULT_TEXT)).toBeInTheDocument();
  });

  it('handles fetch errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const err = new Error('Fail');
    mockFetch.mockRejectedValueOnce(err);

    render(<Footer />);

    await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith(err));
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.queryByText(DEFAULT_TEXT)).not.toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  it('is empty while loading', () => {
    mockFetch.mockReturnValue(new Promise(() => {}));
    render(<Footer />);
    expect(screen.getByRole('contentinfo').textContent).toBe('');
  });
});