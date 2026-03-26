'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_BASE || 'http://localhost:1337';

export function useSignup() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    setError('');

    // validation
    if (!username || !email || !password) {
      toast.error('All fields are required');
      return;
    }

    try {
      const res = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const message = data?.error?.message || 'Signup failed';
        setError(message);
        toast.error(message);
        return;
      }

      // success
      toast.success('Account created successfully 🎉');

      setTimeout(() => {
        router.push('/login');
      }, 1000);
    } catch (err) {
      setError('Something went wrong');
      toast.error('Server error');
    }
  };

  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    error,
    handleSignup,
  };
}
