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

const mockStrapiResponse = {
  data: [],
  meta: {
    pagination: {
      total: 42,
    },
  },
};

describe('GET /api/stats', () => {

  describe('successful responses', () => {
    it('returns totalSubscribers from strapi', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => mockStrapiResponse,
      });

      const response = await GET();
      const body = await response.json();

      expect(body.totalSubscribers).toBe(42);
    });

    it('returns correct totalSubscribers for different counts', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({
          data: [],
          meta: { pagination: { total: 9999 } },
        }),
      });

      const response = await GET();
      const body = await response.json();

      expect(body.totalSubscribers).toBe(9999);
    });

    it('returns totalSubscribers of 0 when no subscribers', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({
          data: [],
          meta: { pagination: { total: 0 } },
        }),
      });

      const response = await GET();
      const body = await response.json();

      expect(body.totalSubscribers).toBe(0);
    });

    it('returns a Response object', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => mockStrapiResponse,
      });

      const response = await GET();

      expect(response).toBeDefined();
      expect(typeof response.json).toBe('function');
    });

    it('response body contains only totalSubscribers key', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => mockStrapiResponse,
      });

      const response = await GET();
      const body = await response.json();

      expect(Object.keys(body)).toEqual(['totalSubscribers']);
    });
  });

  describe('fetch call', () => {
    it('calls fetch with correct URL', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => mockStrapiResponse,
      });

      await GET();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:1337/subscribers?pagination[pageSize]=1'
      );
    });

    it('calls fetch exactly once', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => mockStrapiResponse,
      });

      await GET();

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('uses NEXT_PUBLIC_STRAPI_URL env variable in fetch URL', async () => {
      vi.stubEnv('NEXT_PUBLIC_STRAPI_URL', 'http://custom-strapi.com');

      mockFetch.mockResolvedValueOnce({
        json: async () => mockStrapiResponse,
      });

      await GET();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://custom-strapi.com/subscribers?pagination[pageSize]=1'
      );
    });

    it('includes pagination pageSize=1 in query string', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => mockStrapiResponse,
      });

      await GET();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('pagination[pageSize]=1')
      );
    });

    it('includes subscribers endpoint in URL', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => mockStrapiResponse,
      });

      await GET();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/subscribers')
      );
    });
  });
});