import { fetchAPI } from "@/lib/strapi";
import { Blog, BlogDetailProps } from "@/app/types/blog";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

export default async function BlogDetail({
  params,
}: BlogDetailProps) {
  const res = await fetchAPI<{ data: Blog[] }>(
    `/blogs?filters[slug][$eq]=${params.slug}`
  );

  const blog = res.data?.[0];

  if (!blog) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <h1 className="text-2xl font-semibold">Blog not found</h1>
        <Link
          href="/blog"
          className="text-blue-600 mt-4 inline-block"
        >
          Go back →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      
      {/* Back */}
      <Link
        href="/blog"
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-6"
      >
        <ArrowLeft size={16} />
        Back to Blog
      </Link>

      {/* Article Card */}
      <Card>
        <CardContent className="p-8">

          {/* Title */}
          <h1 className="text-4xl font-bold leading-tight">
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center gap-6 text-sm text-gray-500 mt-4">
            <div className="flex items-center gap-2">
              <User size={16} />
              Admin
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={16} />
              2026
            </div>
          </div>

          {/* Divider */}
          <div className="border-t my-6" />

          {/* Content */}
          <div className="prose prose-gray max-w-none">
            {blog.content.split("\n").map((para, index) => (
              <p key={index}>{para}</p>
            ))}
          </div>

        </CardContent>
      </Card>
    </div>
  );
}