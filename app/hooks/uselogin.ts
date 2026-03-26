'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function useLogin() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {

    //Validation
    if (!email || !password) {
      toast.error('Please enter email and password ');
      return;
    }

    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      identifier: email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
      toast.error('Invalid credentials ');
    } else {
      toast.success('Welcome back! ');
      router.push('/dashboard');
    }

    setLoading(false);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleLogin,
  };
}