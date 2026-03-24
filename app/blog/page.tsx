import { fetchAPI } from "@/lib/strapi";
import { Blog } from "@/app/types/blog";
import BlogClient from "@/components/blog/BlogClient";

export default async function BlogPage() {
  const res = await fetchAPI<{ data: Blog[] }>("/blogs");
  const blogs = res.data || [];

  return <BlogClient blogs={blogs} />;
}