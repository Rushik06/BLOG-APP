import { fetchAPI } from '@/lib/strapi';
import { Blog, BlogDetailProps } from '@/app/types/blog';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Sparkles, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import ReadingProgress from '@/components/ui/ReadingProgress';
import { RichTextBlock } from '@/app/types/blog';

/* CONTENT RENDERER */
function renderContent(content: unknown) {
  if (!Array.isArray(content)) {
    return <p>No content available</p>;
  }

  return content.map((block: RichTextBlock, index: number) => {
    let text = '';

    block.children?.forEach((child) => {
      if (child.text) text += child.text;

      if (child.children) {
        text += child.children.map((c) => c.text).join('');
      }
    });

    const cleanText = text.trim();
    if (!cleanText) return null;

    const isList = /^\d+\./.test(cleanText);

    // LIST STYLE
    if (isList) {
      return (
        <div
          key={index}
          className="flex items-start gap-3 rounded-lg border border-green-100 bg-green-50 px-4 py-3"
        >
          <CheckCircle className="mt-1 text-green-600" size={18} />
          <p className="text-[16px] leading-7 font-medium text-gray-800">
            {cleanText.replace(/^\d+\.\s*/, '')}
          </p>
        </div>
      );
    }

    //  PARAGRAPH
    return (
      <p
        key={index}
        className="text-[17.5px] leading-8 tracking-[0.2px] text-gray-700 first:text-[18px] first:text-gray-900"
      >
        {cleanText}
      </p>
    );
  });
}

/*  PAGE */
export default async function BlogDetail({ params }: BlogDetailProps) {
  const { slug } = await params;

  const cleanSlug = slug?.toString().trim().toLowerCase();

  const res = await fetchAPI<{ data: Blog[] }>(
    `/blogs?filters[slug][$eq]=${encodeURIComponent(cleanSlug)}&publicationState=live`
  );

  const blog = res.data?.[0];

  /* NOT FOUND */
  if (!blog) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center">
        <h1 className="text-2xl font-semibold">Blog not found</h1>

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

  /*  UI  */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* READING PROGRESS BAR */}
      <ReadingProgress />

      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* BACK */}
        <Link
          href="/blog"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-black"
        >
          <ArrowLeft size={16} />
          Back to Blog
        </Link>

        {/* BLOG CARD */}
        <Card className="rounded-2xl border border-gray-100 shadow-lg transition-all duration-300 hover:shadow-xl">
          <CardContent className="p-8 md:p-10">
            {/* HEADER */}
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2">
                <Sparkles className="text-blue-600" size={18} />
              </div>

              <span className="text-sm text-gray-500">RetailPro Insights</span>
            </div>

            {/* TITLE */}
            <h1 className="text-3xl leading-tight font-bold tracking-tight md:text-4xl">
              {blog.Title}
            </h1>

            {/* DESCRIPTION */}
            {blog.description && <p className="mt-3 text-lg text-gray-500">{blog.description}</p>}

            {/* META */}
            <div className="mt-5 flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <User size={16} />
                Admin
              </div>

              <div className="flex items-center gap-2">
                <Calendar size={16} />
                {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'Recently'}
              </div>
            </div>

            {/* DIVIDER */}
            <div className="my-6 border-t" />

            {/* CONTENT */}
            <div className="mx-auto max-w-2xl space-y-6">
              <div className="space-y-5 border-l-2 border-gray-200 pl-4">
                {renderContent(blog.content)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
