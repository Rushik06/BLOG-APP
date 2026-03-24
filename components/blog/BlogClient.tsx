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

  /* ✅ FIXED: NO useEffect, NO setState */
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

      {/* ================= HEADER ================= */}
      <div className="text-center max-w-2xl mx-auto mb-12">

        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full animate-pulse">
            <Sparkles className="text-blue-600" size={20} />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold">
          Blog & Resources
        </h1>

        <p className="mt-4 text-gray-500 text-lg">
          Insights, guides, and updates to grow your retail business
        </p>

        {/* SEARCH */}
        <div className="mt-6 flex justify-center">
          <div className="relative w-full max-w-sm">

            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-9 pr-3 py-2 text-sm border rounded-full 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>
        </div>

      </div>

      {/* ================= GRID ================= */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
        {filteredBlogs.map((blog, index) => (
          <div key={blog.id} className="h-full flex">
            <BlogCard blog={blog} />
          </div>
        ))}
      </div>

    </div>
  );
}