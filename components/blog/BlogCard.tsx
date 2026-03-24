import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { ArrowRight } from "lucide-react";
import { Blog } from "@/app/types/blog";

interface BlogCardProps {
  blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <Card className="group hover:shadow-xl transition duration-300">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold leading-snug group-hover:text-blue-600 transition">
          {blog.title}
        </h2>

        <p className="text-gray-500 text-sm mt-2 line-clamp-3">
          {blog.description}
        </p>

        <Link
          href={`/blog/${blog.slug}`}
          className="flex items-center gap-2 text-blue-600 text-sm mt-4 font-medium"
        >
          Read Article
          <ArrowRight size={16} />
        </Link>
      </CardContent>
    </Card>
  );
}