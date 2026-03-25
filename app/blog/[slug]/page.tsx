import { fetchAPI } from '@/lib/strapi';
import { Blog, BlogDetailProps } from '@/app/types/blog';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import ReadingProgress from '@/components/ui/ReadingProgress';
import RenderContent from '@/components/blog/RenderContent';

export default async function BlogDetail({ params }: BlogDetailProps) {
  const { slug } = await params;

  const cleanSlug = slug?.toString().trim().toLowerCase();

  const res = await fetchAPI<{ data: Blog[] }>(
    `/blogs?filters[slug][$eq]=${encodeURIComponent(cleanSlug)}&publicationState=live`
  );

  const blog = res.data?.[0];

  // NOT FOUND
  if (!blog) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Blog not found
        </h1>

        <Link
          href="/blog"
          className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* PROGRESS */}
      <ReadingProgress />

      <div className="mx-auto max-w-4xl px-6 py-12">

        {/* BACK */}
        <Link
          href="/blog"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
        >
          <ArrowLeft size={16} />
          Back to Blog
        </Link>

        {/* CARD */}
        <Card className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-8 md:p-10">

            {/* HEADER */}
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/40 p-2">
                <Sparkles
                  className="text-blue-600 dark:text-blue-300"
                  size={18}
                />
              </div>

              <span className="text-sm text-gray-600 dark:text-gray-400">
                RetailPro Insights
              </span>
            </div>

            {/* TITLE */}
            <h1 className="text-3xl leading-tight font-bold tracking-tight md:text-4xl text-gray-900 dark:text-white">
              {blog.Title}
            </h1>

            {/* DESCRIPTION */}
            {blog.description && (
              <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
                {blog.description}
              </p>
            )}

            {/* META */}
            <div className="mt-5 flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <User size={16} />
                Admin
              </div>

              <div className="flex items-center gap-2">
                <Calendar size={16} />
                {blog.createdAt
                  ? new Date(blog.createdAt).toLocaleDateString()
                  : 'Recently'}
              </div>
            </div>

            {/* DIVIDER */}
            <div className="my-6 border-t border-gray-200 dark:border-gray-800" />

            {/* CONTENT */}
            <div className="mx-auto max-w-2xl space-y-6">
              <div className="space-y-5 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                <RenderContent content={blog.content} />
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}