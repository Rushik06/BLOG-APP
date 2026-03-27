'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { logger } from '@/lib/logger';
import { LOG_MESSAGES } from '@/lib/logger-messages';

export function useLogin() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      // Validation
      if (!email || !password) {
        toast.error(LOG_MESSAGES.login.validation);
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

        logger.error({
          msg: LOG_MESSAGES.login.error,
          error: res.error,
          email,
        });

        toast.error(LOG_MESSAGES.login.invalid);
      } else {
        logger.info({
          msg: LOG_MESSAGES.login.success,
          email,
        });

        toast.success(LOG_MESSAGES.login.success);
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Unknown error';

      logger.error({
        msg: LOG_MESSAGES.login.error,
        error: message,
      });

      setError(message);
      toast.error(LOG_MESSAGES.login.error);
    } finally {
      setLoading(false);
    }
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