import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import PricingPage from '@/app/pricing/page';
import { fetchAPI } from '@/lib/strapi';

vi.mock('@/lib/strapi', () => ({
  fetchAPI: vi.fn(),
}));

vi.mock('@/components/pricing/PricingCard', () => ({
  default: ({ plan }: { plan: { planName: string; Price: number } }) => (
    <div data-testid="pricing-card">
      {plan.planName} - {plan.Price}
    </div>
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
  BadgeCheck: () => <svg data-testid="icon-badgecheck" />,
  Sparkles: () => <svg data-testid="icon-sparkles" />,
  Check: () => <svg data-testid="icon-check" />,
  Phone: () => <svg data-testid="icon-phone" />,
}));

vi.mock('@/app/metadata/pricing', () => ({
  pricingMetadata: { title: 'Pricing' },
}));

vi.mock('@/app/constants/pricing-constants', () => ({
  PRICING_DEFAULTS: {
    ctaTitle: 'Default CTA Title',
    ctaSubtitle: 'Default CTA Subtitle',
    contactNumber: '+91 9999999999',
    highlightTitle: 'Default Highlight Title',
    highlightPoints: ['Point A', 'Point B'],
  },
}));

const mockPricingData = [
  {
    id: 1,
    planName: 'Basic',
    Price: '499',
    ctaTitle: null,
    ctaSubtitle: null,
    contactNumber: null,
    highlightTitle: null,
    highlightPoints: null,
    extraFeatures: null,
  },
  {
    id: 2,
    planName: 'Pro',
    Price: '999',
    ctaTitle: 'Talk to us',
    ctaSubtitle: 'We are available 24/7',
    contactNumber: '+91 8888888888',
    highlightTitle: 'Why choose Pro?',
    highlightPoints: ['Fast support', 'Unlimited stores'],
    extraFeatures: { extraFeatures: ['Priority support', 'Custom reports'] },
  },
  {
    id: 3,
    planName: 'Enterprise',
    Price: '1999',
    ctaTitle: null,
    ctaSubtitle: null,
    contactNumber: null,
    highlightTitle: null,
    highlightPoints: null,
    extraFeatures: { extraFeatures: ['Dedicated account manager'] },
  },
];

const mockConfig = {
  headerTitle: 'Simple Pricing',
  headerSubtitle: 'Pick the plan that works for you',
};

const mockedFetchAPI = vi.mocked(fetchAPI);

async function renderPricingPage() {
  const jsx = await PricingPage();
  return render(jsx as React.ReactElement);
}

describe('PricingPage', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('when data loads successfully', () => {
    beforeEach(() => {
      mockedFetchAPI
        .mockResolvedValueOnce({ data: mockPricingData })
        .mockResolvedValueOnce({ data: [mockConfig] });
    });

    it('renders all pricing cards', async () => {
      await renderPricingPage();
      expect(screen.getAllByTestId('pricing-card')).toHaveLength(3);
    });

    it('renders header title from config', async () => {
      await renderPricingPage();
      expect(screen.getByText('Simple Pricing')).toBeInTheDocument();
    });

    it('renders header subtitle from config', async () => {
      await renderPricingPage();
      expect(screen.getByText('Pick the plan that works for you')).toBeInTheDocument();
    });

    it('renders CTA title from pro plan', async () => {
      await renderPricingPage();
      expect(screen.getByText('Talk to us')).toBeInTheDocument();
    });

    it('renders CTA subtitle from pro plan', async () => {
      await renderPricingPage();
      expect(screen.getByText('We are available 24/7')).toBeInTheDocument();
    });

    it('renders contact number from pro plan', async () => {
      await renderPricingPage();
      expect(screen.getByText('+91 8888888888')).toBeInTheDocument();
    });

    it('renders highlight title from pro plan', async () => {
      await renderPricingPage();
      expect(screen.getByText('Why choose Pro?')).toBeInTheDocument();
    });

    it('renders highlight points from pro plan', async () => {
      await renderPricingPage();
      expect(screen.getByText('Fast support')).toBeInTheDocument();
      expect(screen.getByText('Unlimited stores')).toBeInTheDocument();
    });

    it('renders Most Popular badge for Pro plan', async () => {
      await renderPricingPage();
      expect(screen.getByText('Most Popular')).toBeInTheDocument();
    });

    it('does not render Most Popular badge for non-Pro plans', async () => {
      await renderPricingPage();
      expect(screen.getAllByText('Most Popular')).toHaveLength(1);
    });

    it('renders contact link with tel href', async () => {
      await renderPricingPage();
      const link = screen.getByRole('link', { name: /call support/i });
      expect(link).toHaveAttribute('href', 'tel:+91 8888888888');
    });
  });

  describe('fallback content when config has no values', () => {
    beforeEach(() => {
      mockedFetchAPI
        .mockResolvedValueOnce({ data: mockPricingData })
        .mockResolvedValueOnce({ data: [{}] });
    });

    it('renders default header subtitle when config is empty', async () => {
      await renderPricingPage();
      expect(screen.getByText('Choose a plan that fits your business needs')).toBeInTheDocument();
    });
  });

  describe('fallback content when pro plan has no CTA data', () => {
    beforeEach(() => {
      mockedFetchAPI
        .mockResolvedValueOnce({
          data: [
            {
              id: 1,
              planName: 'Pro',
              Price: '999',
              ctaTitle: null,
              ctaSubtitle: null,
              contactNumber: null,
              highlightTitle: null,
              highlightPoints: null,
              extraFeatures: null,
            },
          ],
        })
        .mockResolvedValueOnce({ data: [mockConfig] });
    });

    it('renders default CTA title from PRICING_DEFAULTS', async () => {
      await renderPricingPage();
      expect(screen.getByText('Default CTA Title')).toBeInTheDocument();
    });

    it('renders default CTA subtitle from PRICING_DEFAULTS', async () => {
      await renderPricingPage();
      expect(screen.getByText('Default CTA Subtitle')).toBeInTheDocument();
    });

    it('renders default contact number from PRICING_DEFAULTS', async () => {
      await renderPricingPage();
      expect(screen.getByText('+91 9999999999')).toBeInTheDocument();
    });

    it('renders default highlight title from PRICING_DEFAULTS', async () => {
      await renderPricingPage();
      expect(screen.getByText('Default Highlight Title')).toBeInTheDocument();
    });

    it('renders default highlight points from PRICING_DEFAULTS', async () => {
      await renderPricingPage();
      expect(screen.getByText('Point A')).toBeInTheDocument();
      expect(screen.getByText('Point B')).toBeInTheDocument();
    });
  });

  describe('when plans list is empty', () => {
    beforeEach(() => {
      mockedFetchAPI
        .mockResolvedValueOnce({ data: [] })
        .mockResolvedValueOnce({ data: [mockConfig] });
    });

    it('renders empty state message', async () => {
      await renderPricingPage();
      expect(screen.getByText('No pricing plans available.')).toBeInTheDocument();
    });

    it('renders no pricing cards', async () => {
      await renderPricingPage();
      expect(screen.queryByTestId('pricing-card')).not.toBeInTheDocument();
    });
  });

  describe('Pro plan reordering', () => {
    it('places Pro plan at index 1 regardless of original position', async () => {
      mockedFetchAPI
        .mockResolvedValueOnce({
          data: [
            {
              id: 1,
              planName: 'Basic',
              Price: '499',
              ctaTitle: null,
              ctaSubtitle: null,
              contactNumber: null,
              highlightTitle: null,
              highlightPoints: null,
              extraFeatures: null,
            },
            {
              id: 2,
              planName: 'Enterprise',
              Price: '1999',
              ctaTitle: null,
              ctaSubtitle: null,
              contactNumber: null,
              highlightTitle: null,
              highlightPoints: null,
              extraFeatures: null,
            },
            {
              id: 3,
              planName: 'Pro',
              Price: '999',
              ctaTitle: 'Call us',
              ctaSubtitle: 'Anytime',
              contactNumber: '+91 7777777777',
              highlightTitle: 'Pro Highlights',
              highlightPoints: ['Fast'],
              extraFeatures: null,
            },
          ],
        })
        .mockResolvedValueOnce({ data: [mockConfig] });

      await renderPricingPage();
      const cards = screen.getAllByTestId('pricing-card');
      expect(cards[1]).toHaveTextContent('Pro');
    });
  });

  describe('fetchAPI calls', () => {
    beforeEach(() => {
      mockedFetchAPI
        .mockResolvedValueOnce({ data: mockPricingData })
        .mockResolvedValueOnce({ data: [mockConfig] });
    });

    it('calls fetchAPI exactly twice', async () => {
      await renderPricingPage();
      expect(mockedFetchAPI).toHaveBeenCalledTimes(2);
    });

    it('calls fetchAPI with /pricings endpoint', async () => {
      await renderPricingPage();
      expect(mockedFetchAPI).toHaveBeenCalledWith('/pricings');
    });

    it('calls fetchAPI with /pricing-pages endpoint', async () => {
      await renderPricingPage();
      expect(mockedFetchAPI).toHaveBeenCalledWith('/pricing-pages');
    });
  });
});
