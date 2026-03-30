import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

import BlogDetail, { generateMetadata } from '@/app/blog/[slug]/page';
import { fetchAPI } from '@/lib/strapi';
import { getBlogSlugMetadata } from '@/app/metadata/blogslug';
import type { Blog, BlogDetailProps } from '@/app/types/blog';

vi.mock('@/lib/strapi', () => ({ fetchAPI: vi.fn() }));
vi.mock('@/app/metadata/blogslug', () => ({
  getBlogSlugMetadata: vi.fn(),
  blogSlugNotFoundMetadata: { title: 'Not Found' },
}));

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock('@/components/ui/ReadingProgress', () => ({
  default: () => <div data-testid="progress" />,
}));
vi.mock('@/components/blog/RenderContent', () => ({
  default: ({ content }: { content: unknown }) => (
    <div data-testid="content">{JSON.stringify(content)}</div>
  ),
}));
vi.mock('@/components/ui/Card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('lucide-react', () => ({
  ArrowLeft: () => <div />,
  Calendar: () => <div />,
  User: () => <div />,
  Sparkles: () => <div />,
}));

const mockBlog: Blog = {
  id: 1,
  Title: 'Retail Guide',
  description: 'Deep dive.',
  slug: 'retail-guide',
  createdAt: '2024-01-15T10:00:00.000Z',
  category: 'General',
  content: [{ type: 'paragraph', children: [{ text: 'Hello' }] }],
};

const getProps = (slug: string): BlogDetailProps => ({
  params: Promise.resolve({ slug }),
});

describe('Blog Detail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetchAPI).mockResolvedValue({ data: [mockBlog] });
    vi.mocked(getBlogSlugMetadata).mockReturnValue({ title: 'Retail Guide' });
  });

  it('renders blog content and handles slug normalization', async () => {
    const Page = await BlogDetail(getProps('  Retail-Guide  '));
    render(<>{Page}</>);

    expect(fetchAPI).toHaveBeenCalledWith(
      expect.stringContaining('retail-guide'),
      expect.any(Object)
    );

    expect(screen.getByText('Retail Guide')).toBeDefined();
    expect(screen.getByTestId('content')).toBeDefined();
    expect(screen.getByTestId('progress')).toBeDefined();
  });

  it('shows 404 state when blog is missing', async () => {
    vi.mocked(fetchAPI).mockResolvedValueOnce({ data: [] });
    const Page = await BlogDetail(getProps('gone'));
    render(<>{Page}</>);

    expect(screen.getByText(/blog not found/i)).toBeDefined();
    expect(screen.queryByTestId('progress')).toBeNull();
  });

  it('falls back to "Recently" when date is missing', async () => {
    vi.mocked(fetchAPI).mockResolvedValueOnce({
      data: [{ ...mockBlog, createdAt: '' }],
    });

    const Page = await BlogDetail(getProps('retail-guide'));
    render(<>{Page}</>);

    expect(screen.getByText('Recently')).toBeDefined();
  });
});

describe('SEO Metadata', () => {
  it('generates correct metadata for valid and invalid slugs', async () => {
    const meta = await generateMetadata(getProps('retail-guide'));
    expect(meta).toEqual({ title: 'Retail Guide' });

    vi.mocked(fetchAPI).mockResolvedValueOnce({ data: [] });
    const failMeta = await generateMetadata(getProps('none'));
    expect(failMeta).toEqual({ title: 'Not Found' });
  });
});
