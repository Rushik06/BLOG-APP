'use client';

import { ArrowRight } from 'lucide-react';

export default function ScrollToHeroBadge() {
  const handleClick = () => {
    document.getElementById('hero')?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  return (
    <div className="mt-12 flex flex-col items-center">
      {/* BLACK & WHITE BADGE */}
      <button
        onClick={handleClick}
        className="flex items-center gap-2 rounded-full border border-black bg-black px-5 py-2 text-sm text-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-black hover:bg-white hover:text-black hover:shadow-lg"
      >
        Live demo available above
        <ArrowRight size={14} />
      </button>

      {/* SUBTEXT */}
      <p className="mt-2 text-center text-xs text-gray-400">
        Explore how everything works in real-time
      </p>
    </div>
  );
}
