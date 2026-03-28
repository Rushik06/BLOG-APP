import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Features from '@/app/features/page';
import { fetchAPI } from '@/lib/strapi';
import type { Feature } from '@/app/types/feature';
import type { FeaturesPageConfig } from '@/app/types/feature-page';

vi.mock('@/lib/strapi', () => ({ fetchAPI: vi.fn() }));

vi.mock('@/components/features/FeatureCard', () => ({
  default: ({ feature }: { feature: Feature }) => (
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
  Sparkles:  () => <svg data-testid="icon-sparkles" />,
  ArrowRight:() => <svg data-testid="icon-arrow-right" />,
  Zap:       () => <svg data-testid="icon-zap" />,
  BarChart3: () => <svg data-testid="icon-barchart" />,
  Store:     () => <svg data-testid="icon-store" />,
  TrendingUp:() => <svg data-testid="icon-trending" />,
}));

vi.mock('@/app/metadata/features', () => ({
  featuresMetadata: { title: 'Features' },
}));

const mockFeatures: Feature[] = [
  { id: 1, title: 'Inventory Management', description: 'Track stock levels' },
  { id: 2, title: 'Sales Analytics',      description: 'Understand your sales' },
];

const mockConfig: FeaturesPageConfig = {
  headerTitle:     'Amazing Features',
  headerSubtitle:  'All you need',
  ctaTitle:        'Try it now',
  ctaSubtitle:     'See it in action',
  ctaPrimaryText:  'Live Demo',
  ctaSecondaryText:'Get Started',
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
      expect(screen.getByText('Inventory Management')).toBeDefined();
      expect(screen.getByText('Sales Analytics')).toBeDefined();
    });

    it('renders header title from config', async () => {
      await renderFeatures();
      expect(screen.getByText('Amazing Features')).toBeDefined();
    });

    it('renders header subtitle from config', async () => {
      await renderFeatures();
      expect(screen.getByText('All you need')).toBeDefined();
    });

    it('renders CTA title from config', async () => {
      await renderFeatures();
      expect(screen.getByText('Try it now')).toBeDefined();
    });

    it('renders CTA subtitle from config', async () => {
      await renderFeatures();
      expect(screen.getByText('See it in action')).toBeDefined();
    });

    it('renders CTA primary button text from config', async () => {
      await renderFeatures();
      expect(screen.getByText(/Live Demo/)).toBeDefined();
    });

    it('renders CTA secondary button text from config', async () => {
      await renderFeatures();
      expect(screen.getByText('Get Started')).toBeDefined();
    });

    it('renders demo link pointing to /#demo', async () => {
      await renderFeatures();
      const links = screen.getAllByRole('link');
      const demoLink = links.find((l) => l.getAttribute('href') === '/#demo');
      expect(demoLink).toBeDefined();
    });

    it('renders login link pointing to /login', async () => {
      await renderFeatures();
      const links = screen.getAllByRole('link');
      const loginLink = links.find((l) => l.getAttribute('href') === '/login');
      expect(loginLink).toBeDefined();
    });

    it('renders sparkles icon in header', async () => {
      await renderFeatures();
      expect(screen.getByTestId('icon-sparkles')).toBeDefined();
    });

    it('renders card and card content wrappers for CTA', async () => {
      await renderFeatures();
      expect(screen.getByTestId('card')).toBeDefined();
      expect(screen.getByTestId('card-content')).toBeDefined();
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
      expect(h1.textContent?.trim()).toBe('');
    });

    it('renders empty CTA h2 when ctaTitle is missing', async () => {
      await renderFeatures();
      const headings = screen.getAllByRole('heading', { level: 2 });
      const ctaHeading = headings.find((h) => !h.textContent?.trim());
      expect(ctaHeading).toBeDefined();
    });

    it('still renders badges regardless of config', async () => {
      await renderFeatures();
      expect(screen.getByText('Real-time updates')).toBeDefined();
      expect(screen.getByText('Smart analytics')).toBeDefined();
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
      expect(screen.queryByTestId('feature-card')).toBeNull();
    });

    it('renders empty state message', async () => {
      await renderFeatures();
      expect(screen.getByText('No features available.')).toBeDefined();
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
      expect(screen.getByText('Real-time updates')).toBeDefined();
    });

    it('renders Smart analytics badge', async () => {
      await renderFeatures();
      expect(screen.getByText('Smart analytics')).toBeDefined();
    });

    it('renders Multi-store support badge', async () => {
      await renderFeatures();
      expect(screen.getByText('Multi-store support')).toBeDefined();
    });

    it('renders Business growth badge', async () => {
      await renderFeatures();
      expect(screen.getByText('Business growth')).toBeDefined();
    });

    it('renders Zap icon', async () => {
      await renderFeatures();
      expect(screen.getByTestId('icon-zap')).toBeDefined();
    });

    it('renders BarChart3 icon', async () => {
      await renderFeatures();
      expect(screen.getByTestId('icon-barchart')).toBeDefined();
    });

    it('renders Store icon', async () => {
      await renderFeatures();
      expect(screen.getByTestId('icon-store')).toBeDefined();
    });

    it('renders TrendingUp icon', async () => {
      await renderFeatures();
      expect(screen.getByTestId('icon-trending')).toBeDefined();
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

    it('calls fetchAPI with /features endpoint and revalidate option', async () => {
      await renderFeatures();
      expect(mockedFetchAPI).toHaveBeenCalledWith(
        '/features',
        expect.objectContaining({ next: { revalidate: 60 } })
      );
    });

    it('calls fetchAPI with /features-pages endpoint and revalidate option', async () => {
      await renderFeatures();
      expect(mockedFetchAPI).toHaveBeenCalledWith(
        '/features-pages',
        expect.objectContaining({ next: { revalidate: 60 } })
      );
    });
  });
});