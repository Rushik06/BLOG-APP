'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { X } from 'lucide-react';

interface DemoModalProps {
  children: React.ReactNode;
}

export default function DemoModal({ children }: DemoModalProps) {
  const router = useRouter();

  const close = () => {
    router.push('/');
  };

  // ESC close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="relative w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button onClick={close} className="absolute top-4 right-4 text-gray-500 hover:text-black">
          <X size={20} />
        </button>

        {children}
      </div>
    </div>
  );
}
