'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function DemoModal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const close = () => {
    router.push('/');
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={close}
    >
      <div
        className="relative w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE */}
        <button
          onClick={close}
          className="absolute top-4 right-4 text-gray-500 hover:text-black dark:hover:text-white"
        >
          <X size={20} />
        </button>

        {children}
      </div>
    </div>
  );
}
