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

  /*  FILTER */
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
      {/* HEADER  */}
      <div className="mx-auto mb-14 max-w-2xl text-center">
        {/* ICON */}
        <div className="mb-4 flex justify-center">
          <div className="animate-pulse rounded-full bg-blue-100 p-3">
            <Sparkles className="text-blue-600" size={20} aria-label="Retail features highlight" />
          </div>
        </div>

        {/* TITLE */}
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Blog & Resources</h1>

        {/* SUBTEXT */}
        <p className="mt-4 text-lg leading-relaxed text-gray-600">
          Insights, guides, and updates to grow your retail business
        </p>

        {/* ICON STRIP */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 transition hover:scale-105">
            <TrendingUp size={14} className="text-blue-600" />
            Growth Tips
          </div>

          <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 transition hover:scale-105">
            <BookOpen size={14} className="text-green-600" />
            Guides
          </div>
        </div>

        {/* SEARCH */}
        <div className="mt-8 flex justify-center">
          <div className="relative w-full max-w-md">
            {/* ICON */}
            <Search size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500" />

            {/* INPUT */}
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full rounded-full border border-gray-200 bg-white/90 py-3 pr-4 pl-11 text-sm shadow-sm backdrop-blur-md transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/*  BLOG GRID  */}
      {filteredBlogs.length === 0 ? (
        <div className="py-20 text-center text-gray-500">No blog posts found.</div>
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
