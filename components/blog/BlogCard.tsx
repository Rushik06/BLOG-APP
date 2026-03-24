import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { ArrowRight } from 'lucide-react';
import { Blog } from '@/app/types/blog';

interface BlogCardProps {
  blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <Card className="group transition duration-300 hover:shadow-xl">
      <CardContent className="p-6">
        <h2 className="text-lg leading-snug font-semibold transition group-hover:text-blue-600">
          {blog.title}
        </h2>

        <p className="mt-2 line-clamp-3 text-sm text-gray-500">{blog.description}</p>

        <Link
          href={`/blog/${blog.slug}`}
          className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600"
        >
          Read Article
          <ArrowRight size={16} />
        </Link>
      </CardContent>
    </Card>
  );
}
