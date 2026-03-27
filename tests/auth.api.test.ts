import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import type { StrapiAuthResponse } from '@/app/types/auth';

vi.mock('next-auth', () => ({
  default: vi.fn(() => ({ GET: vi.fn(), POST: vi.fn() })),
}));

vi.mock('next-auth/providers/credentials', () => ({
  default: vi.fn((config) => config),
}));

const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch);
  vi.stubEnv('NEXT_PUBLIC_STRAPI_BASE', 'http://localhost:1337');
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

const mockStrapiResponse: StrapiAuthResponse = {
  jwt: 'mock-jwt-token',
  user: {
    id: 1,
    username: 'rushik',
    email: 'rushik@example.com',
  },
};

const getAuthorize = () => {
  const provider = authOptions.providers[0] as unknown as {
    authorize: (credentials: { identifier: string; password: string }) => Promise<unknown>;
  };
  return provider.authorize.bind(provider);
};

describe('authOptions', () => {
  describe('configuration', () => {
    it('has one provider configured', () => {
      expect(authOptions.providers).toHaveLength(1);
    });

    it('uses jwt session strategy', () => {
      expect(authOptions.session?.strategy).toBe('jwt');
    });

    it('sets signIn page to /login', () => {
      expect(authOptions.pages?.signIn).toBe('/login');
    });

    it('has jwt callback defined', () => {
      expect(authOptions.callbacks?.jwt).toBeDefined();
    });

    it('has session callback defined', () => {
      expect(authOptions.callbacks?.session).toBeDefined();
    });
  });

  describe('authorize', () => {
    it('returns null when identifier is missing', async () => {
      const authorize = getAuthorize();
      const result = await authorize({ identifier: '', password: 'pass123' });
      expect(result).toBeNull();
    });

    it('returns null when password is missing', async () => {
      const authorize = getAuthorize();
      const result = await authorize({ identifier: 'rushik@example.com', password: '' });
      expect(result).toBeNull();
    });

    it('returns null when both credentials are missing', async () => {
      const authorize = getAuthorize();
      const result = await authorize({ identifier: '', password: '' });
      expect(result).toBeNull();
    });

    it('calls fetch with correct URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStrapiResponse,
      });

      const authorize = getAuthorize();
      await authorize({ identifier: 'rushik@example.com', password: 'pass123' });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:1337/api/auth/local',
        expect.any(Object)
      );
    });

    it('calls fetch with POST method', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStrapiResponse,
      });

      const authorize = getAuthorize();
      await authorize({ identifier: 'rushik@example.com', password: 'pass123' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('calls fetch with correct Content-Type header', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStrapiResponse,
      });

      const authorize = getAuthorize();
      await authorize({ identifier: 'rushik@example.com', password: 'pass123' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    it('calls fetch with credentials in body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStrapiResponse,
      });

      const authorize = getAuthorize();
      await authorize({ identifier: 'rushik@example.com', password: 'pass123' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({
            identifier: 'rushik@example.com',
            password: 'pass123',
          }),
        })
      );
    });

    it('returns user object when credentials are valid', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStrapiResponse,
      });

      const authorize = getAuthorize();
      const result = await authorize({ identifier: 'rushik@example.com', password: 'pass123' });

      expect(result).toEqual({
        id: '1',
        name: 'rushik',
        email: 'rushik@example.com',
        jwt: 'mock-jwt-token',
      });
    });

    it('returns id as string', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStrapiResponse,
      });

      const authorize = getAuthorize();
      const result = (await authorize({
        identifier: 'rushik@example.com',
        password: 'pass123',
      })) as { id: string };

      expect(typeof result.id).toBe('string');
    });

    it('returns null when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Invalid credentials' }),
      });

      const authorize = getAuthorize();
      const result = await authorize({ identifier: 'rushik@example.com', password: 'wrongpass' });

      expect(result).toBeNull();
    });

    it('returns null when user is missing in response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ jwt: 'some-token', user: null }),
      });

      const authorize = getAuthorize();
      const result = await authorize({ identifier: 'rushik@example.com', password: 'pass123' });

      expect(result).toBeNull();
    });

    it('returns null when response is not ok and user is missing', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });

      const authorize = getAuthorize();
      const result = await authorize({ identifier: 'rushik@example.com', password: 'pass123' });

      expect(result).toBeNull();
    });

    it('calls fetch exactly once per authorize call', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStrapiResponse,
      });

      const authorize = getAuthorize();
      await authorize({ identifier: 'rushik@example.com', password: 'pass123' });

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('jwt callback', () => {
    const jwtCallback = authOptions.callbacks!.jwt!;

    it('adds jwt to token when user has jwt', async () => {
      const token = {};
      const user = { jwt: 'user-jwt-token', id: '1', name: 'rushik', email: 'rushik@example.com' };
      const result = await jwtCallback({ token, user } as unknown as Parameters<
        typeof jwtCallback
      >[0]);
      expect(result.jwt).toBe('user-jwt-token');
    });

    it('does not modify token when user has no jwt', async () => {
      const token = { existing: 'value' };
      const user = { id: '1', name: 'rushik', email: 'rushik@example.com' };
      const result = await jwtCallback({ token, user } as unknown as Parameters<
        typeof jwtCallback
      >[0]);
      expect(result.jwt).toBeUndefined();
    });

    it('returns token unchanged when user is undefined', async () => {
      const token = { sub: 'existing-sub' };
      const result = await jwtCallback({ token } as unknown as Parameters<typeof jwtCallback>[0]);
      expect(result).toEqual(token);
    });

    it('preserves existing token properties', async () => {
      const token = { sub: 'user-sub', existingProp: 'keep-me' };
      const user = { jwt: 'new-jwt', id: '1', name: 'rushik', email: 'rushik@example.com' };
      const result = await jwtCallback({ token, user } as unknown as Parameters<
        typeof jwtCallback
      >[0]);
      expect(result.existingProp).toBe('keep-me');
      expect(result.jwt).toBe('new-jwt');
    });
  });

  describe('session callback', () => {
    const sessionCallback = authOptions.callbacks!.session!;

    it('adds jwt to session user when token has jwt', async () => {
      const session = {
        user: { name: 'rushik', email: 'rushik@example.com' },
        expires: '2099-01-01',
      };
      const token = { jwt: 'token-jwt' };
      const result = await sessionCallback({ session, token } as unknown as Parameters<
        typeof sessionCallback
      >[0]);
      expect((result.user as { jwt?: string })?.jwt).toBe('token-jwt');
    });

    it('does not add jwt to session when token has no jwt', async () => {
      const session = {
        user: { name: 'rushik', email: 'rushik@example.com' },
        expires: '2099-01-01',
      };
      const token = {};
      const result = await sessionCallback({ session, token } as unknown as Parameters<
        typeof sessionCallback
      >[0]);
      expect((result.user as { jwt?: string })?.jwt).toBeUndefined();
    });

    it('returns session unchanged when user is missing', async () => {
      const session = { expires: '2099-01-01' };
      const token = { jwt: 'token-jwt' };
      const result = await sessionCallback({ session, token } as unknown as Parameters<
        typeof sessionCallback
      >[0]);
      expect(result).toEqual(session);
    });

    it('preserves existing session user properties', async () => {
      const session = {
        user: { name: 'rushik', email: 'rushik@example.com' },
        expires: '2099-01-01',
      };
      const token = { jwt: 'token-jwt' };
      const result = await sessionCallback({ session, token } as unknown as Parameters<
        typeof sessionCallback
      >[0]);
      expect(result.user?.name).toBe('rushik');
      expect(result.user?.email).toBe('rushik@example.com');
    });
  });
});
