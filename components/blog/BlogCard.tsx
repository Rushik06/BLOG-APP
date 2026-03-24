import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { ArrowRight } from "lucide-react";
import type { BlogCardProps } from "@/app/types/blog";

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <Card className="group w-full h-full flex flex-col justify-between border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

      <CardContent className="p-6 flex flex-col h-full">

        {/* TITLE (fixed space) */}
        <h2 className="text-lg font-semibold leading-snug min-h-[48px] group-hover:text-blue-600 transition">
          {blog.Title}
        </h2>

        {/* DESCRIPTION (fixed height) */}
        <p className="text-gray-500 text-sm mt-3 line-clamp-3 min-h-[60px]">
          {blog.description}
        </p>

        {/* SPACER */}
        <div className="flex-grow" />

        {/* CTA */}
        <Link
          href={`/blog/${blog.slug}`}
          className="flex items-center gap-2 text-blue-600 text-sm mt-4 font-medium group-hover:gap-3 transition-all"
        >
          Read Article
          <ArrowRight size={16} />
        </Link>

      </CardContent>
    </Card>
  );
}