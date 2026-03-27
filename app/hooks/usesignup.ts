'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { fetchAPI } from '@/lib/strapi';
import { logger } from '@/lib/logger';
import { LOG_MESSAGES } from '@/lib/logger-messages';

export function useSignup() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    try {
      setError('');

      // validation
      if (!username || !email || !password) {
        toast.error(LOG_MESSAGES.signup.validation);
        return;
      }

      logger.info({
        msg: LOG_MESSAGES.signup.attempt,
        email,
      });

      await fetchAPI<{
        user?: unknown;
        error?: { message?: string };
      }>('/auth/local/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      });

      logger.info({
        msg: LOG_MESSAGES.signup.success,
        email,
      });

      toast.success(LOG_MESSAGES.signup.success);

      setTimeout(() => {
        router.push('/login');
      }, 1000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : LOG_MESSAGES.signup.serverError;

      logger.error({
        msg: LOG_MESSAGES.signup.error,
        error: message,
      });

      setError(message);

      toast.error(message || LOG_MESSAGES.signup.serverError);
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
