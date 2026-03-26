'use client';

import { ArrowUpRight } from 'lucide-react';
import { useUiBadge } from '@/app/hooks/useui-badge';

export default function ScrollToHeroBadge() {
  const config = useUiBadge();

  const handleClick = () => {
    document.getElementById('hero')?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  return (
    <div className="mt-14 flex flex-col items-center">

      {/* BADGE */}
      <button
        onClick={handleClick}
        className="group flex items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-900 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:text-white"
      >
        {config?.buttonText || 'Explore How it works'}

        <ArrowUpRight
          size={16}
          className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
        />
      </button>

      {/* SUBTEXT */}
      <p className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">
        {config?.subText || 'Discover features in Real-time'}
      </p>
    </div>
  );
}