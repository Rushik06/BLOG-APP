import { fetchAPI } from "@/lib/strapi";
import BlogCard from "@/components/blog/BlogCard";
import { Blog } from "@/app/types/blog";

export default async function BlogPage() {
  const res = await fetchAPI("/blogs");
  const blogs: Blog[] = res.data;

  return (
    <div>
      <h1>Blog</h1>

      <div style={{ display: "grid", gap: "12px" }}>
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
}