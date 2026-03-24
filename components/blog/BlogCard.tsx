import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { ArrowRight } from 'lucide-react';
import type { BlogCardProps } from '@/app/types/blog';

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <Card className="group flex h-full w-full flex-col justify-between border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <CardContent className="flex h-full flex-col p-6">
        {/* TITLE (fixed space) */}
        <h2 className="min-h-[48px] text-lg leading-snug font-semibold transition group-hover:text-blue-600">
          {blog.Title}
        </h2>

        {/* DESCRIPTION (fixed height) */}
        <p className="mt-3 line-clamp-3 min-h-[60px] text-sm text-gray-500">{blog.description}</p>

        {/* SPACER */}
        <div className="flex-grow" />

        {/* CTA */}
        <Link
          href={`/blog/${blog.slug}`}
          className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 transition-all group-hover:gap-3"
        >
          Read Article
          <ArrowRight size={16} />
        </Link>
      </CardContent>
    </Card>
  );
}
