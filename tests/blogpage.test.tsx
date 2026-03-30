import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

import BlogPage from '@/app/blog/page';
import { fetchAPI } from '@/lib/strapi';
import type { Blog } from '@/app/types/blog';

vi.mock('@/lib/strapi', () => ({ fetchAPI: vi.fn() }));
vi.mock('@/app/metadata/blog', () => ({ blogMetadata: { title: 'Blog' } }));
vi.mock('@/components/blog/BlogClient', () => ({
  default: ({ blogs }: { blogs: Blog[] }) => (
    <div data-testid="blog-client">
      {blogs.map((b) => (
        <div key={b.id} data-testid="blog-item">{b.Title}</div>
      ))}
    </div>
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

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(fetchAPI).mockResolvedValue({ data: mockBlogs });
});

const renderPage = async () => render(await BlogPage());

describe('BlogPage', () => {
  it('fetches blogs with correct params', async () => {
    await renderPage();
    expect(fetchAPI).toHaveBeenCalledOnce();
    expect(fetchAPI).toHaveBeenCalledWith('/blogs', { next: { revalidate: 60 } });
  });

  it('renders blogs returned from the API', async () => {
    await renderPage();
    expect(screen.getAllByTestId('blog-item')).toHaveLength(2);
    expect(screen.getByText('First Blog')).toBeDefined();
    expect(screen.getByText('Second Blog')).toBeDefined();
  });

  it('renders BlogClient with empty list when API returns nothing', async () => {
    vi.mocked(fetchAPI).mockResolvedValueOnce({ data: null });
    await renderPage();
    expect(screen.getByTestId('blog-client')).toBeDefined();
    expect(screen.queryAllByTestId('blog-item')).toHaveLength(0);
  });
});