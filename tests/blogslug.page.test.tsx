import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import BlogDetail from '@/app/blog/[slug]/page';
import { fetchAPI } from '@/lib/strapi';

//Mocks 

vi.mock('@/lib/strapi', () => ({
  fetchAPI: vi.fn(),
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
    <div data-testid="card" className={className}>{children}</div>
  ),
  CardContent: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card-content" className={className}>{children}</div>
  ),
}));

vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

vi.mock('lucide-react', () => ({
  ArrowLeft: () => <svg data-testid="icon-arrow-left" />,
  Calendar: () => <svg data-testid="icon-calendar" />,
  User: () => <svg data-testid="icon-user" />,
  Sparkles: () => <svg data-testid="icon-sparkles" />,
}));

// Fixtures

const mockBlog = {
  id: 1,
  Title: 'Understanding Retail Analytics',
  description: 'A deep dive into retail data patterns.',
  slug: 'understanding-retail-analytics',
  createdAt: '2024-06-01T10:00:00.000Z',
  content: 'Hello world',
  category: 'analytics',
};

// Helpers

const mockedFetchAPI = vi.mocked(fetchAPI);

async function renderBlogDetail(slug: string) {
  const jsx = await BlogDetail({ params: { slug } });
  return render(jsx as React.ReactElement);
}

// Tests 

describe('BlogDetail page', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Not-found state 

  describe('when blog is not found', () => {
    beforeEach(() => {
      mockedFetchAPI.mockResolvedValue({ data: [] });
    });

    it('renders "Blog not found" heading', async () => {
      await renderBlogDetail('non-existent-slug');
      expect(screen.getByRole('heading', { name: /blog not found/i })).toBeInTheDocument();
    });

    it('renders a back link to /blog', async () => {
      await renderBlogDetail('non-existent-slug');
      const link = screen.getByRole('link', { name: /back to blog/i });
      expect(link).toHaveAttribute('href', '/blog');
    });

    it('does NOT render the reading progress bar', async () => {
      await renderBlogDetail('non-existent-slug');
      expect(screen.queryByTestId('reading-progress')).not.toBeInTheDocument();
    });

    it('does NOT render blog content', async () => {
      await renderBlogDetail('non-existent-slug');
      expect(screen.queryByTestId('render-content')).not.toBeInTheDocument();
    });
  });

  // Happy path 

  describe('when blog is found', () => {
    beforeEach(() => {
      mockedFetchAPI.mockResolvedValue({ data: [mockBlog] });
    });

    it('renders the blog title', async () => {
      await renderBlogDetail('understanding-retail-analytics');
      expect(screen.getByRole('heading', { name: mockBlog.Title })).toBeInTheDocument();
    });

    it('renders the blog description', async () => {
      await renderBlogDetail('understanding-retail-analytics');
      expect(screen.getByText(mockBlog.description)).toBeInTheDocument();
    });

    it('renders the formatted createdAt date', async () => {
      await renderBlogDetail('understanding-retail-analytics');
      const expected = new Date(mockBlog.createdAt).toLocaleDateString();
      expect(screen.getByText(expected)).toBeInTheDocument();
    });

    it('renders "Admin" as the author', async () => {
      await renderBlogDetail('understanding-retail-analytics');
      expect(screen.getByText('Admin')).toBeInTheDocument();
    });

    it('renders the ReadingProgress component', async () => {
      await renderBlogDetail('understanding-retail-analytics');
      expect(screen.getByTestId('reading-progress')).toBeInTheDocument();
    });

    it('renders the RenderContent component', async () => {
      await renderBlogDetail('understanding-retail-analytics');
      expect(screen.getByTestId('render-content')).toBeInTheDocument();
    });

    it('renders the back-to-blog link', async () => {
      await renderBlogDetail('understanding-retail-analytics');
      const links = screen.getAllByRole('link', { name: /back to blog/i });
      expect(links[0]).toHaveAttribute('href', '/blog');
    });

    it('renders the "RetailPro Insights" brand label', async () => {
      await renderBlogDetail('understanding-retail-analytics');
      expect(screen.getByText('RetailPro Insights')).toBeInTheDocument();
    });
  });

  //  Optional description 

  describe('when blog has no description', () => {
    it('does not render a description paragraph', async () => {
      mockedFetchAPI.mockResolvedValue({
        data: [{ ...mockBlog, description: '' }],
      });
      await renderBlogDetail('understanding-retail-analytics');
      expect(screen.queryByText(mockBlog.description)).not.toBeInTheDocument();
    });
  });

  // Missing createdAt

  describe('when blog has no createdAt', () => {
    it('renders "Recently" as the fallback date', async () => {
      mockedFetchAPI.mockResolvedValue({
        data: [{ ...mockBlog, createdAt: '' }],
      });
      await renderBlogDetail('understanding-retail-analytics');
      expect(screen.getByText('Recently')).toBeInTheDocument();
    });
  });

  // fetchAPI call shape

  describe('fetchAPI call', () => {
    beforeEach(() => {
      mockedFetchAPI.mockResolvedValue({ data: [mockBlog] });
    });

    it('calls fetchAPI with the correct slug filter', async () => {
      await renderBlogDetail('understanding-retail-analytics');
      expect(mockedFetchAPI).toHaveBeenCalledWith(
        expect.stringContaining('filters[slug][$eq]=understanding-retail-analytics')
      );
    });

    it('calls fetchAPI with publicationState=live', async () => {
      await renderBlogDetail('understanding-retail-analytics');
      expect(mockedFetchAPI).toHaveBeenCalledWith(
        expect.stringContaining('publicationState=live')
      );
    });

    it('trims and lowercases the slug before fetching', async () => {
      await renderBlogDetail('  Understanding-Retail-Analytics  ');
      expect(mockedFetchAPI).toHaveBeenCalledWith(
        expect.stringContaining('filters[slug][$eq]=understanding-retail-analytics')
      );
    });

    it('URL-encodes special characters in the slug', async () => {
      mockedFetchAPI.mockResolvedValue({ data: [] });
      await renderBlogDetail('hello world');
      expect(mockedFetchAPI).toHaveBeenCalledWith(
        expect.stringContaining('hello%20world')
      );
    });

    it('is called exactly once per render', async () => {
      await renderBlogDetail('understanding-retail-analytics');
      expect(mockedFetchAPI).toHaveBeenCalledTimes(1);
    });
  });

  //  fetchAPI error

  describe('when fetchAPI returns null data', () => {
    it('renders "Blog not found" when data is null', async () => {
      mockedFetchAPI.mockResolvedValue({ data: null });
      await renderBlogDetail('any-slug');
      expect(screen.getByRole('heading', { name: /blog not found/i })).toBeInTheDocument();
    });
  });
});