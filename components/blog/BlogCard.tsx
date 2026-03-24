import Link from 'next/link';
import Card from '@/components/ui/Card';

export default function BlogCard({ blog }: any) {
  return (
    <Card>
      <h2>{blog.title}</h2>
      <p>{blog.description}</p>

      <Link href={`/blog/${blog.slug}`}>Read More →</Link>
    </Card>
  );
}
