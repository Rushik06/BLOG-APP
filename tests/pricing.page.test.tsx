import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import PricingPage from '@/app/pricing/page';
import { fetchAPI } from '@/lib/strapi';

vi.mock('@/lib/strapi', () => ({ fetchAPI: vi.fn() }));
vi.mock('@/app/metadata/pricing', () => ({ pricingMetadata: { title: 'Pricing' } }));

vi.mock('@/components/pricing/PricingCard', () => ({
  default: ({ plan }: { plan: { planName: string } }) => <div>{plan.planName}</div>,
}));

vi.mock('@/components/ui/Card', () => ({
  Card: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock('lucide-react', () => ({
  BadgeCheck: () => <div />,
  Sparkles: () => <div />,
  Check: () => <div />,
  Phone: () => <div />,
}));

describe('PricingPage', () => {
  const setupMocks = (plans: object[], config: object[] = [{}]) => {
    vi.mocked(fetchAPI)
      .mockResolvedValueOnce({ data: plans })
      .mockResolvedValueOnce({ data: config });
  };

  beforeEach(() => vi.clearAllMocks());

  it('renders plans and header content correctly', async () => {
    setupMocks(
      [{ id: 1, planName: 'Pro', Price: '99', ctaTitle: 'Get Pro' }],
      [{ headerTitle: 'Our Plans' }]
    );

    render(await PricingPage());

    expect(screen.getByText('Our Plans')).toBeDefined();
    expect(screen.getByText('Get Pro')).toBeDefined();
    expect(fetchAPI).toHaveBeenCalledWith('/pricings', expect.anything());
  });

  it('displays empty state and fallback headers', async () => {
    setupMocks([]);
    const { rerender } = render(await PricingPage());
    expect(screen.getByText(/No pricing plans available/i)).toBeDefined();

    setupMocks([{ id: 1, planName: 'Free' }], []);
    const Page = await PricingPage();
    rerender(<>{Page}</>);
    expect(screen.getByText(/fits your business needs/i)).toBeDefined();
  });

  it('renders internal fallbacks for incomplete plan data', async () => {
    setupMocks([{ id: 1, planName: 'Pro', ctaTitle: null, highlightPoints: null }]);

    render(await PricingPage());
    expect(screen.getByText('All plans include')).toBeDefined();
    expect(screen.getByText(/Contact our team/i)).toBeDefined();
  });
});
