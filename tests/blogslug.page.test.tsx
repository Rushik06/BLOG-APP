import { it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React, { ReactNode } from 'react';
import BlogDetail, { generateMetadata } from '@/app/blog/[slug]/page';
import { fetchAPI } from '@/lib/strapi';
import { getBlogSlugMetadata } from '@/app/metadata/blogslug';
import { Metadata } from 'next';

vi.mock('@/lib/strapi', () => ({ fetchAPI: vi.fn() }));
vi.mock('@/app/metadata/blogslug', () => ({
  getBlogSlugMetadata: vi.fn(),
  blogSlugNotFoundMetadata: { title: 'Not Found' },
}));

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: ReactNode }) => (
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
  Card: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));
vi.mock('lucide-react', () => ({
  ArrowLeft: () => <i />,
  Calendar: () => <i />,
  User: () => <i />,
  Sparkles: () => <i />,
}));

const mockBlog = {
  id: 1,
  Title: 'Retail Guide',
  slug: 'retail-guide',
  createdAt: '2024-01-15T10:00:00.000Z',
  content: [{ text: 'Hello' }],
};

const getProps = (slug: string) => ({ params: Promise.resolve({ slug }) });

const renderPage = async (slug: string) => {
  const Page = await BlogDetail(getProps(slug));
  return render(<React.Fragment>{Page}</React.Fragment>);
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(fetchAPI).mockResolvedValue({ data: [mockBlog] });
  vi.mocked(getBlogSlugMetadata).mockReturnValue({ title: 'Retail Guide' } as Metadata);
});

it('renders content and normalizes slugs', async () => {
  await renderPage('  Retail-Guide  ');

  expect(fetchAPI).toHaveBeenCalledWith(expect.stringContaining('retail-guide'), expect.anything());
  expect(screen.getByText('Retail Guide')).toBeDefined();
  expect(screen.getByTestId('content')).toBeDefined();
});

it('handles 404 and missing dates', async () => {
  vi.mocked(fetchAPI).mockResolvedValueOnce({ data: [] });
  await renderPage('gone');
  expect(screen.getByText(/blog not found/i)).toBeDefined();

  vi.mocked(fetchAPI).mockResolvedValueOnce({ data: [{ ...mockBlog, createdAt: '' }] });
  await renderPage('retail-guide');
  expect(screen.getByText('Recently')).toBeDefined();
});

it('generates correct SEO metadata', async () => {
  const meta = await generateMetadata(getProps('retail-guide'));
  expect(meta).toEqual({ title: 'Retail Guide' });

  vi.mocked(fetchAPI).mockResolvedValueOnce({ data: [] });
  const failMeta = await generateMetadata(getProps('none'));
  expect(failMeta).toEqual({ title: 'Not Found' });
});
