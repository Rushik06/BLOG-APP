import { fetchAPI } from '@/lib/strapi';
import BlogCard from '@/components/blog/BlogCard';
import { Blog } from '@/app/types/blog';
import { Card, CardContent } from '@/components/ui/Card';
import { Search } from 'lucide-react';

export default async function BlogPage() {
  const res = await fetchAPI<{ data: Blog[] }>('/blogs');
  const blogs = res.data;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header Section */}
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold">Blog</h1>
          <p className="mt-2 text-gray-500">Insights, guides, and updates from RetailPro</p>
        </div>

        {/* Search (UI only for now) */}
        <Card className="w-full md:w-80">
          <CardContent className="flex items-center gap-2 p-3">
            <Search size={18} className="text-gray-400" />
            <input placeholder="Search articles..." className="w-full text-sm outline-none" />
          </CardContent>
        </Card>
      </div>

      {/* Blog Grid */}
      {blogs.length === 0 ? (
        <div className="py-20 text-center text-gray-500">No blog posts found.</div>
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
