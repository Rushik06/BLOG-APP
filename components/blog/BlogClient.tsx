'use client';

import { useMemo, useState } from 'react';
import { Blog } from '@/app/types/blog';
import BlogCard from '@/components/blog/BlogCard';

import { Search, Sparkles, TrendingUp, BookOpen } from 'lucide-react';

type Props = {
  blogs: Blog[];
};

export default function BlogClient({ blogs }: Props) {
  const [query, setQuery] = useState('');

  /* ✅ FIXED: NO useEffect, NO setState */
  const filteredBlogs = useMemo(() => {
    const q = query.toLowerCase();

    return blogs.filter((blog) => {
      const title = blog.Title?.toLowerCase() || '';
      const desc = blog.description?.toLowerCase() || '';

      return title.includes(q) || desc.includes(q);
    });
  }, [query, blogs]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* ================= HEADER ================= */}
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <div className="mb-4 flex justify-center">
          <div className="animate-pulse rounded-full bg-blue-100 p-3">
            <Sparkles className="text-blue-600" size={20} />
          </div>
        </div>

        <h1 className="text-4xl font-bold md:text-5xl">Blog & Resources</h1>

        <p className="mt-4 text-lg text-gray-500">
          Insights, guides, and updates to grow your retail business
        </p>

        {/* SEARCH */}
        <div className="mt-6 flex justify-center">
          <div className="relative w-full max-w-sm">
            <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full rounded-full border py-2 pr-3 pl-9 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* ================= GRID ================= */}
      <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBlogs.map((blog, index) => (
          <div key={blog.id} className="flex h-full">
            <BlogCard blog={blog} />
          </div>
        ))}
      </div>
    </div>
  );
}
