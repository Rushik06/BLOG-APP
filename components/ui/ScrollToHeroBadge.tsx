"use client";

import { ArrowRight } from "lucide-react";

export default function ScrollToHeroBadge() {
  const handleClick = () => {
    document.getElementById("hero")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="mt-12 flex flex-col items-center">

      {/* BLACK & WHITE BADGE */}
      <button
        onClick={handleClick}
        className="flex items-center gap-2 text-sm px-5 py-2 rounded-full border border-black bg-black text-white shadow-sm hover:bg-white hover:text-black hover:border-black hover:shadow-lg hover:-translate-y-0.5 transition-all"
      >
        Live demo available above
        <ArrowRight size={14} />
      </button>

      {/* SUBTEXT */}
      <p className="text-xs text-gray-400 mt-2 text-center">
        Explore how everything works in real-time
      </p>

    </div>
  );
}