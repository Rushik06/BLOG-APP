import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

import BlogDetail, { generateMetadata } from '@/app/blog/[slug]/page';
import { fetchAPI } from '@/lib/strapi';
import { getBlogSlugMetadata, blogSlugNotFoundMetadata } from '@/app/metadata/blogslug';
import type { Blog, BlogDetailProps } from '@/app/types/blog';

vi.mock('@/lib/strapi', () => ({ fetchAPI: vi.fn() }));

vi.mock('@/app/metadata/blogslug', () => ({
  getBlogSlugMetadata: vi.fn(),
  blogSlugNotFoundMetadata: { title: 'Not Found' },
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

vi.mock('@/components/ui/ReadingProgress', () => ({
  default: () => <div data-testid="reading-progress" />,
}));

vi.mock('@/components/blog/RenderContent', () => ({
  default: ({ content }: { content: unknown }) => (
    <div data-testid="render-content">{JSON.stringify(content)}</div>
  ),
}));

vi.mock('@/components/ui/Card', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  CardContent: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card-content" className={className}>
      {children}
    </div>
  ),
}));

vi.mock('lucide-react', () => ({
  ArrowLeft: () => <svg data-testid="icon-arrow-left" />,
  Calendar: () => <svg data-testid="icon-calendar" />,
  User: () => <svg data-testid="icon-user" />,
  Sparkles: () => <svg data-testid="icon-sparkles" />,
}));

const mockBlog: Blog = {
  id: 1,
  Title: 'How Retail Works',
  description: 'A deep dive into modern retail systems.',
  slug: 'how-retail-works',
  createdAt: '2024-01-15T10:00:00.000Z',
  category: 'General',
  content: [{ type: 'paragraph', children: [{ text: 'Hello world' }] }],
};

const makeParams = (slug: string): BlogDetailProps => ({
  params: Promise.resolve({ slug }),
});

async function renderBlogDetail(slug = 'how-retail-works') {
  const ui = await BlogDetail(makeParams(slug));
  return render(ui);
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(fetchAPI).mockResolvedValue({ data: [mockBlog] });
  vi.mocked(getBlogSlugMetadata).mockReturnValue({ title: 'How Retail Works' });
});

describe('BlogDetail - getBlog (fetchAPI)', () => {
  it('calls fetchAPI with encoded slug', async () => {
    await renderBlogDetail('how-retail-works');
    expect(fetchAPI).toHaveBeenCalledWith(
      expect.stringContaining('how-retail-works'),
      expect.any(Object)
    );
  });

  it('calls fetchAPI with publicationState=live', async () => {
    await renderBlogDetail('how-retail-works');
    expect(fetchAPI).toHaveBeenCalledWith(
      expect.stringContaining('publicationState=live'),
      expect.any(Object)
    );
  });

  it('calls fetchAPI with revalidate option', async () => {
    await renderBlogDetail('how-retail-works');
    expect(fetchAPI).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ next: { revalidate: 60 } })
    );
  });

  it('trims and lowercases the slug before fetching', async () => {
    await renderBlogDetail('  How-Retail-Works  ');
    expect(fetchAPI).toHaveBeenCalledWith(
      expect.stringContaining('how-retail-works'),
      expect.any(Object)
    );
  });

  it('calls fetchAPI exactly once per render', async () => {
    await renderBlogDetail();
    expect(fetchAPI).toHaveBeenCalledTimes(1);
  });
});

describe('BlogDetail - not found state', () => {
  beforeEach(() => {
    vi.mocked(fetchAPI).mockResolvedValue({ data: [] });
  });

  it('renders "Blog not found" heading when blog is missing', async () => {
    await renderBlogDetail('non-existent-slug');
    expect(screen.getByRole('heading', { name: /blog not found/i })).toBeDefined();
  });

  it('renders a back link to /blog in not found state', async () => {
    await renderBlogDetail('non-existent-slug');
    const links = screen.getAllByRole('link', { name: /back to blog/i });
    expect(links[0].getAttribute('href')).toBe('/blog');
  });

  it('does not render ReadingProgress when blog is not found', async () => {
    await renderBlogDetail('non-existent-slug');
    expect(screen.queryByTestId('reading-progress')).toBeNull();
  });

  it('does not render the Card when blog is not found', async () => {
    await renderBlogDetail('non-existent-slug');
    expect(screen.queryByTestId('card')).toBeNull();
  });

  it('renders ArrowLeft icon in not found state', async () => {
    await renderBlogDetail('non-existent-slug');
    expect(screen.getByTestId('icon-arrow-left')).toBeDefined();
  });
});

describe('BlogDetail - found state layout', () => {
  it('renders ReadingProgress component', async () => {
    await renderBlogDetail();
    expect(screen.getByTestId('reading-progress')).toBeDefined();
  });

  it('renders the Card component', async () => {
    await renderBlogDetail();
    expect(screen.getByTestId('card')).toBeDefined();
  });

  it('renders a back link to /blog', async () => {
    await renderBlogDetail();
    const links = screen.getAllByRole('link', { name: /back to blog/i });
    expect(links.some((l) => l.getAttribute('href') === '/blog')).toBe(true);
  });

  it('renders the Sparkles icon', async () => {
    await renderBlogDetail();
    expect(screen.getByTestId('icon-sparkles')).toBeDefined();
  });

  it('renders the RetailPro Insights label', async () => {
    await renderBlogDetail();
    expect(screen.getByText(/retailpro insights/i)).toBeDefined();
  });
});

describe('BlogDetail - blog content', () => {
  it('renders the blog title', async () => {
    await renderBlogDetail();
    expect(screen.getByRole('heading', { name: /how retail works/i })).toBeDefined();
  });

  it('renders the blog description', async () => {
    await renderBlogDetail();
    expect(screen.getByText('A deep dive into modern retail systems.')).toBeDefined();
  });

  it('does not render description paragraph when description is absent', async () => {
    vi.mocked(fetchAPI).mockResolvedValueOnce({
      data: [{ ...mockBlog, description: undefined }],
    });
    await renderBlogDetail();
    expect(screen.queryByText('A deep dive into modern retail systems.')).toBeNull();
  });

  it('renders the User icon', async () => {
    await renderBlogDetail();
    expect(screen.getByTestId('icon-user')).toBeDefined();
  });

  it('renders "Admin" as the author', async () => {
    await renderBlogDetail();
    expect(screen.getByText(/admin/i)).toBeDefined();
  });

  it('renders the Calendar icon', async () => {
    await renderBlogDetail();
    expect(screen.getByTestId('icon-calendar')).toBeDefined();
  });

  it('renders a formatted date from createdAt', async () => {
    await renderBlogDetail();
    const expected = new Date('2024-01-15T10:00:00.000Z').toLocaleDateString();
    expect(screen.getByText(expected)).toBeDefined();
  });

  it('renders "Recently" when createdAt is missing', async () => {
    vi.mocked(fetchAPI).mockResolvedValueOnce({
      data: [{ ...mockBlog, createdAt: undefined }],
    });
    await renderBlogDetail();
    expect(screen.getByText('Recently')).toBeDefined();
  });

  it('renders the RenderContent component', async () => {
    await renderBlogDetail();
    expect(screen.getByTestId('render-content')).toBeDefined();
  });

  it('passes blog content to RenderContent', async () => {
    await renderBlogDetail();
    expect(screen.getByTestId('render-content').textContent).toContain('Hello world');
  });
});

describe('generateMetadata', () => {
  it('returns blogSlugNotFoundMetadata when blog is not found', async () => {
    vi.mocked(fetchAPI).mockResolvedValueOnce({ data: [] });
    const result = await generateMetadata(makeParams('missing-slug'));
    expect(result).toEqual({ title: 'Not Found' });
  });

  it('calls getBlogSlugMetadata with the blog when found', async () => {
    await generateMetadata(makeParams('how-retail-works'));
    expect(getBlogSlugMetadata).toHaveBeenCalledWith(mockBlog);
  });

  it('returns metadata from getBlogSlugMetadata when blog is found', async () => {
    const result = await generateMetadata(makeParams('how-retail-works'));
    expect(result).toEqual({ title: 'How Retail Works' });
  });

  it('calls fetchAPI once inside generateMetadata', async () => {
    await generateMetadata(makeParams('how-retail-works'));
    expect(fetchAPI).toHaveBeenCalledTimes(1);
  });

  it('trims and lowercases slug in generateMetadata', async () => {
    await generateMetadata(makeParams('  How-Retail-Works  '));
    expect(fetchAPI).toHaveBeenCalledWith(
      expect.stringContaining('how-retail-works'),
      expect.any(Object)
    );
  });
});
