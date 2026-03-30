import { fetchAPI } from '@/lib/strapi';
import { Blog } from '@/app/types/blog';
import BlogClient from '@/components/blog/BlogClient';
import { blogMetadata } from '@/app/metadata/blog';

export const metadata = blogMetadata;
export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const res = await fetchAPI<{ data: Blog[] }>('/blogs', { next: { revalidate: 60 } });
  const blogs = res.data || [];

  return <BlogClient blogs={blogs} />;
}
