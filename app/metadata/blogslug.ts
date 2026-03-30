import type { Metadata } from 'next';
import type { Blog } from '@/app/types/blog';

export function getBlogSlugMetadata(blog: Blog): Metadata {
  return {
    title: blog.Title,
    description: blog.description ?? undefined,
    openGraph: {
      title: blog.Title,
      description: blog.description ?? undefined,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.Title,
      description: blog.description ?? undefined,
    },
  };
}

export const blogSlugNotFoundMetadata: Metadata = {
  title: 'Blog not found',
};
