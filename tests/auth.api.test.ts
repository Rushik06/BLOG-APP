import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import type { StrapiAuthResponse } from '@/app/types/auth';

const mockFetch = vi.fn();

vi.mock('next-auth', () => ({
  default: vi.fn(() => ({ GET: vi.fn(), POST: vi.fn() })),
}));

vi.mock('next-auth/providers/credentials', () => ({
  default: vi.fn((config) => config),
}));

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch);
  vi.stubEnv('NEXT_PUBLIC_STRAPI_BASE', 'http://localhost:1337');
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe('authOptions', () => {
  const [authProvider] = authOptions.providers;

  it('verifies general auth configuration', () => {
    expect(authOptions.session?.strategy).toBe('jwt');
    expect(authOptions.pages?.signIn).toBe('/login');
  });

  it('normalizes credentials into a user object', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async (): Promise<StrapiAuthResponse> => ({
        jwt: 'mock-jwt',
        user: { id: 1, username: 'rushik', email: 'rushik@gmail.com' },
      }),
    });

    if ('authorize' in authProvider) {
      const result = await authProvider.authorize(
        { identifier: 'rushik@gmail.com', password: 'password' },
        {}
      );
      expect(result).toMatchObject({ id: '1', name: 'rushik', jwt: 'mock-jwt' });
    }
  });

  describe('Callbacks', () => {
    it('jwt and session callbacks flow correctly', async () => {
      const jwtCb = authOptions.callbacks?.jwt;
      const sessionCb = authOptions.callbacks?.session;

      if (jwtCb && sessionCb) {
        const user = { id: '1', name: 'rushik', email: 'rushik@gmail.com', jwt: 'secret' };
        const token = await jwtCb({
          token: {},
          user,
          account: null,
          profile: undefined,
          trigger: 'signIn',
        });
        expect(token.jwt).toBe('secret');

        const mockSession = {
          user: { name: 'rushik', email: 'rushik@gmail.com' },
          expires: '2026',
        };

        const mockAdapterUser = { id: '1', email: 'rushik@gmail.com', emailVerified: null };

        const sessionResult = await sessionCb({
          session: mockSession,
          token,
          user: mockAdapterUser,
          newSession: undefined,
          trigger: 'update',
        });

        expect(sessionResult.user).toHaveProperty('jwt', 'secret');
      }
    });
  });
});
