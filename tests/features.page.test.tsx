import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Features from '@/app/features/page';
import { fetchAPI } from '@/lib/strapi';

vi.mock('@/lib/strapi', () => ({
  fetchAPI: vi.fn(),
}));

vi.mock('@/components/features/FeatureCard', () => ({
  default: ({ feature }: { feature: { title: string } }) => (
    <div data-testid="feature-card">{feature.title}</div>
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

vi.mock('@/components/ui/Button', () => ({
  Button: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <button className={className}>{children}</button>
  ),
}));

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('lucide-react', () => ({
  Sparkles: () => <svg data-testid="icon-sparkles" />,
  ArrowRight: () => <svg data-testid="icon-arrow-right" />,
  Zap: () => <svg data-testid="icon-zap" />,
  BarChart3: () => <svg data-testid="icon-barchart" />,
  Store: () => <svg data-testid="icon-store" />,
  TrendingUp: () => <svg data-testid="icon-trending" />,
}));

vi.mock('@/app/metadata/features', () => ({
  featuresMetadata: { title: 'Features' },
}));

const mockFeatures = [
  { id: 1, title: 'Inventory Management', description: 'Track stock levels' },
  { id: 2, title: 'Sales Analytics', description: 'Understand your sales' },
];

const mockConfig = {
  headerTitle: 'Amazing Features',
  headerSubtitle: 'All you need',
  ctaTitle: 'Try it now',
  ctaSubtitle: 'See it in action',
  ctaPrimaryText: 'Live Demo',
  ctaSecondaryText: 'Get Started',
};

const mockedFetchAPI = vi.mocked(fetchAPI);

async function renderFeatures() {
  const jsx = await Features();
  return render(jsx as React.ReactElement);
}

describe('Features page', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('when data loads successfully', () => {
    beforeEach(() => {
      mockedFetchAPI
        .mockResolvedValueOnce({ data: mockFeatures })
        .mockResolvedValueOnce({ data: [mockConfig] });
    });

    it('renders all feature cards', async () => {
      await renderFeatures();
      expect(screen.getAllByTestId('feature-card')).toHaveLength(2);
    });

    it('renders feature card titles', async () => {
      await renderFeatures();
      expect(screen.getByText('Inventory Management')).toBeInTheDocument();
      expect(screen.getByText('Sales Analytics')).toBeInTheDocument();
    });

    it('renders header title from config', async () => {
      await renderFeatures();
      expect(screen.getByText('Amazing Features')).toBeInTheDocument();
    });

    it('renders header subtitle from config', async () => {
      await renderFeatures();
      expect(screen.getByText('All you need')).toBeInTheDocument();
    });

    it('renders CTA title from config', async () => {
      await renderFeatures();
      expect(screen.getByText('Try it now')).toBeInTheDocument();
    });

    it('renders CTA subtitle from config', async () => {
      await renderFeatures();
      expect(screen.getByText('See it in action')).toBeInTheDocument();
    });

    it('renders CTA primary button text from config', async () => {
      await renderFeatures();
      expect(screen.getByText(/Live Demo/)).toBeInTheDocument();
    });

    it('renders CTA secondary button text from config', async () => {
      await renderFeatures();
      expect(screen.getByText('Get Started')).toBeInTheDocument();
    });

    it('renders demo link pointing to /#demo', async () => {
      await renderFeatures();
      const links = screen.getAllByRole('link');
      const demoLink = links.find((l) => l.getAttribute('href') === '/#demo');
      expect(demoLink).toBeInTheDocument();
    });

    it('renders login link pointing to /login', async () => {
      await renderFeatures();
      const links = screen.getAllByRole('link');
      const loginLink = links.find((l) => l.getAttribute('href') === '/login');
      expect(loginLink).toBeInTheDocument();
    });

    it('renders sparkles icon in header', async () => {
      await renderFeatures();
      expect(screen.getByTestId('icon-sparkles')).toBeInTheDocument();
    });

    it('renders card and card content wrappers for CTA', async () => {
      await renderFeatures();
      expect(screen.getByTestId('card')).toBeInTheDocument();
      expect(screen.getByTestId('card-content')).toBeInTheDocument();
    });
  });

  describe('when config fields are empty', () => {
    beforeEach(() => {
      mockedFetchAPI
        .mockResolvedValueOnce({ data: mockFeatures })
        .mockResolvedValueOnce({ data: [{}] });
    });

    it('renders empty h1 when headerTitle is missing', async () => {
      await renderFeatures();
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeEmptyDOMElement();
    });

    it('renders empty CTA h2 when ctaTitle is missing', async () => {
      await renderFeatures();
      const headings = screen.getAllByRole('heading', { level: 2 });
      const ctaHeading = headings.find((h) => !h.textContent?.trim());
      expect(ctaHeading).toBeInTheDocument();
    });

    it('still renders badges regardless of config', async () => {
      await renderFeatures();
      expect(screen.getByText('Real-time updates')).toBeInTheDocument();
      expect(screen.getByText('Smart analytics')).toBeInTheDocument();
    });

    it('still renders feature cards regardless of config', async () => {
      await renderFeatures();
      expect(screen.getAllByTestId('feature-card')).toHaveLength(2);
    });
  });

  describe('when features list is empty', () => {
    beforeEach(() => {
      mockedFetchAPI
        .mockResolvedValueOnce({ data: [] })
        .mockResolvedValueOnce({ data: [mockConfig] });
    });

    it('renders no feature cards', async () => {
      await renderFeatures();
      expect(screen.queryByTestId('feature-card')).not.toBeInTheDocument();
    });

    it('renders empty state message', async () => {
      await renderFeatures();
      expect(screen.getByText('No features available.')).toBeInTheDocument();
    });
  });

  describe('badges', () => {
    beforeEach(() => {
      mockedFetchAPI
        .mockResolvedValueOnce({ data: mockFeatures })
        .mockResolvedValueOnce({ data: [mockConfig] });
    });

    it('renders Real-time updates badge', async () => {
      await renderFeatures();
      expect(screen.getByText('Real-time updates')).toBeInTheDocument();
    });

    it('renders Smart analytics badge', async () => {
      await renderFeatures();
      expect(screen.getByText('Smart analytics')).toBeInTheDocument();
    });

    it('renders Multi-store support badge', async () => {
      await renderFeatures();
      expect(screen.getByText('Multi-store support')).toBeInTheDocument();
    });

    it('renders Business growth badge', async () => {
      await renderFeatures();
      expect(screen.getByText('Business growth')).toBeInTheDocument();
    });
  });

  describe('fetchAPI calls', () => {
    beforeEach(() => {
      mockedFetchAPI
        .mockResolvedValueOnce({ data: mockFeatures })
        .mockResolvedValueOnce({ data: [mockConfig] });
    });

    it('calls fetchAPI exactly twice', async () => {
      await renderFeatures();
      expect(mockedFetchAPI).toHaveBeenCalledTimes(2);
    });

    it('calls fetchAPI with /features endpoint', async () => {
      await renderFeatures();
      expect(mockedFetchAPI).toHaveBeenCalledWith('/features');
    });

    it('calls fetchAPI with /features-pages endpoint', async () => {
      await renderFeatures();
      expect(mockedFetchAPI).toHaveBeenCalledWith('/features-pages');
    });
  });
});