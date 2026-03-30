import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '@/components/layout/Footer';

const mockFetch = vi.fn();
const API_URL = 'http://localhost:1337';
const DEFAULT_TEXT = '© 2026 RetailPro. Built for modern inventory management.';
const CUSTOM_TEXT = '© 2026 RetailPro. Custom footer text.';

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch);
  vi.stubEnv('NEXT_PUBLIC_STRAPI_URL', API_URL);
  vi.clearAllMocks();
});

const mockApi = (data: object | null) => 
  mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ data }) });

describe('Footer', () => {
  it('renders custom text from the API correctly', async () => {
    mockApi({ footerText: CUSTOM_TEXT });
    render(<Footer />);

    expect(await screen.findByText(CUSTOM_TEXT)).toBeDefined();
    expect(mockFetch).toHaveBeenCalledWith(`${API_URL}/ui-config`);
  });

  it('falls back to default text when API data is missing or null', async () => {
    mockApi(null);
    render(<Footer />);
    
    expect(await screen.findByText(DEFAULT_TEXT)).toBeDefined();
  });

  it('handles fetch rejections and logging', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Network Fail');
    mockFetch.mockRejectedValueOnce(error);

    render(<Footer />);

  
    const footer = await screen.findByRole('contentinfo');
    expect(footer).toBeDefined();
    expect(consoleSpy).toHaveBeenCalledWith(error);
    
    consoleSpy.mockRestore();
  });

  it('stays empty during the loading state', () => {
    mockFetch.mockReturnValue(new Promise(() => {})); // Never resolves
    render(<Footer />);
    
    const footer = screen.getByRole('contentinfo');
    expect(footer.textContent).toBe('');
  });
});