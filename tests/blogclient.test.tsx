import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BlogClient from '@/components/blog/BlogClient';

vi.mock('@/components/blog/BlogCard', () => ({
  default: ({ blog }: { blog: { Title: string } }) => (
    <div data-testid="blog-card">{blog.Title}</div>
  ),
}));

const mockUseBlogConfig = vi.fn();

vi.mock('@/app/hooks/useblogpage', () => ({
  useBlogConfig: () => mockUseBlogConfig(),
}));

vi.mock('lucide-react', () => ({
  Search: () => <svg data-testid="icon-search" />,
  Sparkles: () => <svg data-testid="icon-sparkles" />,
  TrendingUp: () => <svg data-testid="icon-trending" />,
  BookOpen: () => <svg data-testid="icon-book" />,
}));

const mockBlogs = [
  {
    id: 1,
    Title: 'Retail Analytics',
    slug: 'retail-analytics',
    description: 'About analytics',
    content: '',
    category: '',
    createdAt: '',
  },
  {
    id: 2,
    Title: 'Growth Tips',
    slug: 'growth-tips',
    description: 'Tips for growth',
    content: '',
    category: '',
    createdAt: '',
  },
  {
    id: 3,
    Title: 'Inventory Guide',
    slug: 'inventory-guide',
    description: 'Managing inventory',
    content: '',
    category: '',
    createdAt: '',
  },
];

describe('BlogClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseBlogConfig.mockReturnValue({
      headerTitle: 'Test Blog Title',
      headerSubtitle: 'Test subtitle',
      searchPlaceholder: 'Search here...',
    });
  });

  it('renders header title from config', () => {
    render(<BlogClient blogs={mockBlogs} />);
    expect(screen.getByText('Test Blog Title')).toBeInTheDocument();
  });

  it('renders header subtitle from config', () => {
    render(<BlogClient blogs={mockBlogs} />);
    expect(screen.getByText('Test subtitle')).toBeInTheDocument();
  });

  it('renders search input with placeholder from config', () => {
    render(<BlogClient blogs={mockBlogs} />);
    expect(screen.getByPlaceholderText('Search here...')).toBeInTheDocument();
  });

  it('renders all blog cards when no search query', () => {
    render(<BlogClient blogs={mockBlogs} />);
    expect(screen.getAllByTestId('blog-card')).toHaveLength(3);
  });

  it('renders Growth Tips icon strip label', () => {
    render(<BlogClient blogs={mockBlogs} />);
    expect(screen.getByTestId('icon-trending')).toBeInTheDocument();
    const allGrowthTips = screen.getAllByText('Growth Tips');
    expect(allGrowthTips.length).toBeGreaterThanOrEqual(1);
  });

  it('renders Guides icon strip label', () => {
    render(<BlogClient blogs={mockBlogs} />);
    expect(screen.getByText('Guides')).toBeInTheDocument();
  });

  it('filters blogs by title match', () => {
    render(<BlogClient blogs={mockBlogs} />);
    fireEvent.change(screen.getByPlaceholderText('Search here...'), {
      target: { value: 'analytics' },
    });
    expect(screen.getAllByTestId('blog-card')).toHaveLength(1);
    expect(screen.getByText('Retail Analytics')).toBeInTheDocument();
  });

  it('filters blogs by description match', () => {
    render(<BlogClient blogs={mockBlogs} />);
    fireEvent.change(screen.getByPlaceholderText('Search here...'), {
      target: { value: 'managing' },
    });
    expect(screen.getAllByTestId('blog-card')).toHaveLength(1);
    expect(screen.getByText('Inventory Guide')).toBeInTheDocument();
  });

  it('is case-insensitive when filtering', () => {
    render(<BlogClient blogs={mockBlogs} />);
    fireEvent.change(screen.getByPlaceholderText('Search here...'), {
      target: { value: 'GROWTH' },
    });
    expect(screen.getAllByTestId('blog-card')).toHaveLength(1);
    expect(screen.getAllByText('Growth Tips')).toHaveLength(2);
  });

  it('shows all blogs when search is cleared', () => {
    render(<BlogClient blogs={mockBlogs} />);
    const input = screen.getByPlaceholderText('Search here...');
    fireEvent.change(input, { target: { value: 'analytics' } });
    fireEvent.change(input, { target: { value: '' } });
    expect(screen.getAllByTestId('blog-card')).toHaveLength(3);
  });

  it('shows No blog posts found when no results match', () => {
    render(<BlogClient blogs={mockBlogs} />);
    fireEvent.change(screen.getByPlaceholderText('Search here...'), {
      target: { value: 'zzznomatch' },
    });
    expect(screen.getByText('No blog posts found.')).toBeInTheDocument();
    expect(screen.queryByTestId('blog-card')).not.toBeInTheDocument();
  });

  it('renders No blog posts found when blogs array is empty', () => {
    render(<BlogClient blogs={[]} />);
    expect(screen.getByText('No blog posts found.')).toBeInTheDocument();
  });

  it('renders no blog cards when blogs array is empty', () => {
    render(<BlogClient blogs={[]} />);
    expect(screen.queryByTestId('blog-card')).not.toBeInTheDocument();
  });

  it('falls back to default title when config returns null', () => {
    mockUseBlogConfig.mockReturnValueOnce(null);
    render(<BlogClient blogs={[]} />);
    expect(screen.getByText('Blog & Resources')).toBeInTheDocument();
  });

  it('falls back to default subtitle when config returns null', () => {
    mockUseBlogConfig.mockReturnValueOnce(null);
    render(<BlogClient blogs={[]} />);
    expect(
      screen.getByText('Insights, guides, and updates to grow your retail business')
    ).toBeInTheDocument();
  });

  it('falls back to default search placeholder when config returns null', () => {
    mockUseBlogConfig.mockReturnValueOnce(null);
    render(<BlogClient blogs={[]} />);
    expect(screen.getByPlaceholderText('Search articles...')).toBeInTheDocument();
  });
});
