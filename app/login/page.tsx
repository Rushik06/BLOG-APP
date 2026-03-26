'use client';

import Link from 'next/link';
import { Mail, Lock, Sparkles } from 'lucide-react';
import { useLogin } from '@/app/hooks/uselogin';

export default function LoginPage() {
  const { email, setEmail, password, setPassword, loading, error, handleLogin } = useLogin();

  return (
    <main className="relative flex min-h-screen items-center justify-center px-6">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />

      {/* CARD */}
      <section className="relative w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white/80 p-8 shadow-xl backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
          {/* ICON */}
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/40">
              <Sparkles className="text-blue-600 dark:text-blue-300" />
            </div>
          </div>

          {/* TITLE */}
          <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h1>

          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Login to your RetailPro account
          </p>

          {/* ERROR UI */}
          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-center text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          {/* EMAIL */}
          <div className="mt-6">
            <label className="text-sm text-gray-600 dark:text-gray-400">Email address</label>

            <div className="mt-1 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 dark:border-gray-700 dark:bg-gray-900">
              <Mail size={16} className="text-gray-400" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-transparent text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="mt-4">
            <label className="text-sm text-gray-600 dark:text-gray-400">Password</label>

            <div className="mt-1 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 dark:border-gray-700 dark:bg-gray-900">
              <Lock size={16} className="text-gray-400" />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full bg-transparent text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-medium text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-blue-700 active:scale-95 disabled:opacity-70"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {/* FOOTER */}
          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Don’t have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
