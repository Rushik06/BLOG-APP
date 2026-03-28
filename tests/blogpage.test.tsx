import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

import BlogPage from '@/app/blog/page';
import { fetchAPI } from '@/lib/strapi';
import type { Blog } from '@/app/types/blog';

vi.mock('@/lib/strapi', () => ({ fetchAPI: vi.fn() }));

vi.mock('@/app/metadata/blog', () => ({ blogMetadata: { title: 'Blog' } }));

vi.mock('@/components/blog/BlogClient', () => ({
  default: ({ blogs }: { blogs: Blog[] }) => (
    <div data-testid="blog-client">{blogs.map(b => (
      <div key={b.id} data-testid="blog-item">{b.Title}</div>
    ))}</div>
  ),
}));

const mockBlogs: Blog[] = [
  {
    id: 1,
    Title: 'First Blog',
    slug: 'first-blog',
    description: 'First description',
    createdAt: '2024-01-01T00:00:00.000Z',
    category: 'General',
    content: [],
  },
  {
    id: 2,
    Title: 'Second Blog',
    slug: 'second-blog',
    description: 'Second description',
    createdAt: '2024-02-01T00:00:00.000Z',
    category: 'Tech',
    content: [],
  },
];

async function renderBlogPage() {
  const ui = await BlogPage();
  return render(ui);
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(fetchAPI).mockResolvedValue({ data: mockBlogs });
});

describe('BlogPage - fetchAPI', () => {
  it('calls fetchAPI with /blogs endpoint', async () => {
    await renderBlogPage();
    expect(fetchAPI).toHaveBeenCalledWith('/blogs', expect.any(Object));
  });

  it('calls fetchAPI with revalidate of 60', async () => {
    await renderBlogPage();
    expect(fetchAPI).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ next: { revalidate: 60 } })
    );
  });

  it('calls fetchAPI exactly once', async () => {
    await renderBlogPage();
    expect(fetchAPI).toHaveBeenCalledTimes(1);
  });
});

describe('BlogPage - rendering', () => {
  it('renders the BlogClient component', async () => {
    await renderBlogPage();
    expect(screen.getByTestId('blog-client')).toBeDefined();
  });

  it('passes blogs from API response to BlogClient', async () => {
    await renderBlogPage();
    const items = screen.getAllByTestId('blog-item');
    expect(items).toHaveLength(mockBlogs.length);
  });

  it('passes correct blog titles to BlogClient', async () => {
    await renderBlogPage();
    expect(screen.getByText('First Blog')).toBeDefined();
    expect(screen.getByText('Second Blog')).toBeDefined();
  });
});

describe('BlogPage - empty and fallback states', () => {
  it('passes an empty array to BlogClient when res.data is null', async () => {
    vi.mocked(fetchAPI).mockResolvedValueOnce({ data: null });
    await renderBlogPage();
    expect(screen.queryAllByTestId('blog-item')).toHaveLength(0);
  });

  it('passes an empty array to BlogClient when res.data is undefined', async () => {
    vi.mocked(fetchAPI).mockResolvedValueOnce({});
    await renderBlogPage();
    expect(screen.queryAllByTestId('blog-item')).toHaveLength(0);
  });

  it('still renders BlogClient when there are no blogs', async () => {
    vi.mocked(fetchAPI).mockResolvedValueOnce({ data: [] });
    await renderBlogPage();
    expect(screen.getByTestId('blog-client')).toBeDefined();
  });

  it('renders BlogClient with a single blog correctly', async () => {
    vi.mocked(fetchAPI).mockResolvedValueOnce({ data: [mockBlogs[0]] });
    await renderBlogPage();
    expect(screen.getAllByTestId('blog-item')).toHaveLength(1);
    expect(screen.getByText('First Blog')).toBeDefined();
  });
});