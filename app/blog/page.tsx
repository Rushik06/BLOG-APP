import { fetchAPI } from "@/lib/strapi";
import BlogCard from "@/components/blog/BlogCard";
import { Blog } from "@/app/types/blog";
import { Card, CardContent } from "@/components/ui/Card";
import { Search } from "lucide-react";

export default async function BlogPage() {
  const res = await fetchAPI<{ data: Blog[] }>("/blogs");
  const blogs = res.data;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        
        <div>
          <h1 className="text-4xl font-bold">Blog</h1>
          <p className="text-gray-500 mt-2">
            Insights, guides, and updates from RetailPro
          </p>
        </div>

        {/* Search (UI only for now) */}
        <Card className="w-full md:w-80">
          <CardContent className="flex items-center gap-2 p-3">
            <Search size={18} className="text-gray-400" />
            <input
              placeholder="Search articles..."
              className="w-full outline-none text-sm"
            />
          </CardContent>
        </Card>
      </div>

      {/* Blog Grid */}
      {blogs.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          No blog posts found.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}