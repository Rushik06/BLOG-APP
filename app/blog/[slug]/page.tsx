import { fetchAPI } from '@/lib/strapi';
import { Blog, BlogDetailProps } from '@/app/types/blog';
import Link from 'next/link';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

export default async function BlogDetail({ params }: BlogDetailProps) {
  const res = await fetchAPI<{ data: Blog[] }>(`/blogs?filters[slug][$eq]=${params.slug}`);

  const blog = res.data?.[0];

  if (!blog) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center">
        <h1 className="text-2xl font-semibold">Blog not found</h1>
        <Link href="/blog" className="mt-4 inline-block text-blue-600">
          Go back →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Back */}
      <Link
        href="/blog"
        className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600"
      >
        <ArrowLeft size={16} />
        Back to Blog
      </Link>

      {/* Article Card */}
      <Card>
        <CardContent className="p-8">
          {/* Title */}
          <h1 className="text-4xl leading-tight font-bold">{blog.title}</h1>

          {/* Meta Info */}
          <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
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
          <div className="my-6 border-t" />

          {/* Content */}
          <div className="prose prose-gray max-w-none">
            {blog.content.split('\n').map((para, index) => (
              <p key={index}>{para}</p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
