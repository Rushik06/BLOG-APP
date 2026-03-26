'use client';

import Link from 'next/link';
import { User, Mail, Lock, Sparkles } from 'lucide-react';
import { useSignup } from '@/app/hooks/usesignup'; 

export default function SignupPage() {
  const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    error,
    handleSignup,
  } = useSignup();

  return (
    <main className="relative flex min-h-screen items-center justify-center px-6">

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />

      {/* CARD */}
      <section className="relative w-full max-w-md">

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-xl p-8">

          {/* ICON */}
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-purple-100 dark:bg-purple-900/40 p-3">
              <Sparkles className="text-purple-600 dark:text-purple-300" />
            </div>
          </div>

          {/* TITLE */}
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
            Create Account
          </h1>

          <p className="mt-2 text-center text-gray-600 dark:text-gray-400 text-sm">
            Start managing your business smarter
          </p>

          {/* ERROR */}
          {error && (
            <div className="mt-4 text-center text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* USERNAME */}
          <div className="mt-6 flex items-center gap-2 border p-3 rounded-lg dark:border-gray-700">
            <User size={16} />
            <input
              placeholder="Username"
              className="w-full bg-transparent outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* EMAIL */}
          <div className="mt-4 flex items-center gap-2 border p-3 rounded-lg dark:border-gray-700">
            <Mail size={16} />
            <input
              placeholder="Email"
              className="w-full bg-transparent outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className="mt-4 flex items-center gap-2 border p-3 rounded-lg dark:border-gray-700">
            <Lock size={16} />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-transparent outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSignup}
            className="mt-6 w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
          >
            Create Account
          </button>

          {/* FOOTER */}
          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>

        </div>
      </section>
    </main>
  );
}