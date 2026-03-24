"use client";

import { useMemo, useState } from "react";
import { Blog } from "@/app/types/blog";
import BlogCard from "@/components/blog/BlogCard";

import {
  Search,
  Sparkles,
  TrendingUp,
  BookOpen,
} from "lucide-react";

type Props = {
  blogs: Blog[];
};

export default function BlogClient({ blogs }: Props) {
  const [query, setQuery] = useState("");

  /*  FILTER */
  const filteredBlogs = useMemo(() => {
    const q = query.toLowerCase();

    return blogs.filter((blog) => {
      const title = blog.Title?.toLowerCase() || "";
      const desc = blog.description?.toLowerCase() || "";

      return title.includes(q) || desc.includes(q);
    });
  }, [query, blogs]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">

      {/* HEADER  */}
      <div className="mx-auto mb-14 max-w-2xl text-center">

        {/* ICON */}
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-blue-100 p-3 animate-pulse">
            <Sparkles className="text-blue-600" size={20} />
          </div>
        </div>

        {/* TITLE */}
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Blog & Resources
        </h1>

        {/* SUBTEXT */}
        <p className="mt-4 text-lg text-gray-500 leading-relaxed">
          Insights, guides, and updates to grow your retail business
        </p>

        {/* ICON STRIP */}
        <div className="mt-6 flex justify-center gap-4 text-sm flex-wrap">

          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full hover:scale-105 transition">
            <TrendingUp size={14} className="text-blue-600" />
            Growth Tips
          </div>

          <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full hover:scale-105 transition">
            <BookOpen size={14} className="text-green-600" />
            Guides
          </div>

        </div>

        {/* SEARCH */}
        <div className="mt-8 flex justify-center">
          <div className="relative w-full max-w-md">

            {/* ICON */}
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

            {/* INPUT */}
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-11 pr-4 py-3 text-sm rounded-full 
                         bg-white/90 backdrop-blur-md border border-gray-200 
                         shadow-sm hover:shadow-md 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         transition-all duration-200"
            />

          </div>
        </div>

      </div>

      {/*  BLOG GRID  */}
      {filteredBlogs.length === 0 ? (
        <div className="py-20 text-center text-gray-500">
          No blog posts found.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">

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