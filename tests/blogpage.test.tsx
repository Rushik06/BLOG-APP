import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import BlogPage from '@/app/blog/page';
import { fetchAPI } from '@/lib/strapi';

vi.mock('@/lib/strapi', () => ({
  fetchAPI: vi.fn(),
}));

vi.mock('@/components/blog/BlogClient', () => ({
  default: ({ blogs }: { blogs: unknown[] }) => (
    <div data-testid="blog-client">blogs-count:{blogs.length}</div>
  ),
}));

vi.mock('@/app/metadata/blog', () => ({
  blogMetadata: { title: 'Blog' },
}));

const mockBlogs = [
  {
    id: 1,
    Title: 'Post One',
    slug: 'post-one',
    description: 'Desc one',
    content: '',
    category: '',
    createdAt: '',
  },
  {
    id: 2,
    Title: 'Post Two',
    slug: 'post-two',
    description: 'Desc two',
    content: '',
    category: '',
    createdAt: '',
  },
];

const mockedFetchAPI = vi.mocked(fetchAPI);

describe('BlogPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders BlogClient with blogs from API', async () => {
    mockedFetchAPI.mockResolvedValue({ data: mockBlogs });
    const jsx = await BlogPage();
    render(jsx as React.ReactElement);
    expect(screen.getByTestId('blog-client')).toBeInTheDocument();
    expect(screen.getByText('blogs-count:2')).toBeInTheDocument();
  });

  it('passes empty array to BlogClient when API returns null data', async () => {
    mockedFetchAPI.mockResolvedValue({ data: null });
    const jsx = await BlogPage();
    render(jsx as React.ReactElement);
    expect(screen.getByText('blogs-count:0')).toBeInTheDocument();
  });

  it('passes empty array to BlogClient when data is undefined', async () => {
    mockedFetchAPI.mockResolvedValue({});
    const jsx = await BlogPage();
    render(jsx as React.ReactElement);
    expect(screen.getByText('blogs-count:0')).toBeInTheDocument();
  });

  it('calls fetchAPI with /blogs endpoint', async () => {
    mockedFetchAPI.mockResolvedValue({ data: [] });
    await BlogPage();
    expect(mockedFetchAPI).toHaveBeenCalledWith('/blogs');
  });

  it('calls fetchAPI exactly once', async () => {
    mockedFetchAPI.mockResolvedValue({ data: [] });
    await BlogPage();
    expect(mockedFetchAPI).toHaveBeenCalledTimes(1);
  });
});
