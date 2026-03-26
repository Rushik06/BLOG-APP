'use client';

import { useMemo, useState } from 'react';
import BlogCard from '@/components/blog/BlogCard';

import { Search, Sparkles, TrendingUp, BookOpen } from 'lucide-react';
import { useBlogConfig } from '@/app/hooks/useblogpage';

import type { Props } from '@/app/types/blog';

export default function BlogClient({ blogs }: Props) {
  const [query, setQuery] = useState('');
  const config = useBlogConfig();

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

      {/* HEADER */}
      <div className="mx-auto mb-14 max-w-2xl text-center">

        {/* ICON */}
        <div className="mb-4 flex justify-center">
          <div className="animate-pulse rounded-full bg-blue-100 p-3 dark:bg-blue-900/40">
            <Sparkles className="text-blue-600 dark:text-blue-300" size={20} />
          </div>
        </div>

        {/* TITLE */}
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl dark:text-white">
          {config?.headerTitle || 'Blog & Resources'}
        </h1>

        {/* SUBTEXT */}
        <p className="mt-4 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
          {config?.headerSubtitle || 'Insights, guides, and updates to grow your retail business'}
        </p>

        {/* ICON STRIP */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-blue-700 transition hover:scale-105 dark:bg-blue-900/30 dark:text-blue-300">
            <TrendingUp size={14} />
            Growth Tips
          </div>

          <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-green-700 transition hover:scale-105 dark:bg-green-900/30 dark:text-green-300">
            <BookOpen size={14} />
            Guides
          </div>
        </div>

        {/* SEARCH */}
        <div className="mt-8 flex justify-center">
          <div className="relative w-full max-w-md">
            <Search
              size={18}
              className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400"
            />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={config?.searchPlaceholder || 'Search articles...'}
              className="w-full rounded-full border border-gray-200 bg-white py-3 pr-4 pl-11 text-sm text-gray-900 shadow-sm transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      {/* BLOG GRID */}
      {filteredBlogs.length === 0 ? (
        <div className="py-20 text-center text-gray-500 dark:text-gray-400">
          No blog posts found.
        </div>
      ) : (
        <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((blog) => (
            <div key={blog.id} className="flex h-full">
              <BlogCard blog={blog} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}