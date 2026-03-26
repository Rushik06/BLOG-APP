'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {/*THEME PROVIDER*/}
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {/* TOASTER */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '10px',
              padding: '12px 16px',
              fontSize: '14px',
            },
          }}
        />

        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
