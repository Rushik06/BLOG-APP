import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GET } from '@/app/api/stats/routes';

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

describe('GET /api/stats', () => {
  const setupFetch = (total: number) => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({
        data: [],
        meta: { pagination: { total } },
      }),
    });
  };

  it('returns total subscribers from strapi correctly', async () => {
    setupFetch(42);

    const response = await GET();
    const body = await response.json();

    expect(body).toEqual({ totalSubscribers: 42 });
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:1337/subscribers?pagination[pageSize]=1'
    );
  });

  it('handles various counts including zero', async () => {
    for (const total of [0, 999]) {
      setupFetch(total);
      const res = await GET();
      const body = await res.json();
      expect(body.totalSubscribers).toBe(total);
    }
  });

  it('uses the correct base URL from environment', async () => {
    const custom = 'https://api.test.com';
    vi.stubEnv('NEXT_PUBLIC_STRAPI_URL', custom);
    setupFetch(5);

    await GET();
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`^${custom}`))
    );
  });
});