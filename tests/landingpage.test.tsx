import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import type { Testimonial } from '@/app/types/testimonals';
import type { LandingPage } from '@/app/types/landing-page';
import { getLandingData } from '@/app/hooks/uselanding-data';

interface MockProps {
  children: React.ReactNode;
  className?: string;
}
interface ButtonProps extends MockProps {
  variant?: string;
}

vi.mock('@/app/hooks/uselanding-data', () => ({ getLandingData: vi.fn() }));
vi.mock('@/app/metadata/home', () => ({ homeMetadata: {} }));
vi.mock('@/components/ui/ScrollToHeroBadge', () => ({
  default: () => <div data-testid="scroll" />,
}));

vi.mock('@/lib/strapi-helpers', () => ({
  getText: vi.fn((val: unknown) => {
    if (!Array.isArray(val)) return val;
    return val.map((b) => b.children?.map((c: { text: string }) => c.text).join('') ?? '').join('');
  }),
}));

vi.mock('@/app/constants/landing-constants', () => ({
  iconMap: {
    store: ({ size }: { size: number }) => <svg data-testid="icon-store" width={size} />,
    chart: ({ size }: { size: number }) => <svg data-testid="icon-chart" width={size} />,
    users: ({ size }: { size: number }) => <svg data-testid="icon-users" width={size} />,
  },
  howItWorksColors: ['bg-blue-100', 'bg-green-100'],
}));

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('@/components/ui/Button', () => ({
  Button: ({ children, variant, className }: ButtonProps) => (
    <button data-testid="btn" data-variant={variant} className={className}>
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/Card', () => ({
  Card: ({ children }: MockProps) => <div data-testid="card">{children}</div>,
  CardContent: ({ children, className }: MockProps) => <div className={className}>{children}</div>,
}));

const mockData: LandingPage = {
  HeroTitle: 'Manage Your Retail Business',
  HeroSubtitle: 'The all-in-one platform.',
  CTAText: 'Get Started',
  secondaryCTALink: '/demo',
  secondaryCTAText: 'Live Demo',
  featuresTitle: 'Everything You Need',
  featuresSubtitle: 'Sub',
  howItWorksTitle: 'How It Works',
  howItWorksSubTitle: 'Steps',
  howItWorksStep: [{ icon: 'store', title: 'Connect', description: 'Link.' }],
};

const mockFeatures = [
  { id: 1, icon: 'store', color: 'bg-blue-100', title: 'Inventory', description: 'Stock.' },
];

const mockTestimonials: Testimonial[] = [
  {
    id: 1,
    rating: 5,
    name: 'Alice',
    role: 'Owner',
    content: [
      { type: 'paragraph', children: [{ text: 'Love it!' }] },
    ] as unknown as Testimonial['content'],
  },
];

const renderPage = async () => {
  const { default: Home } = await import('../app/page');
  const Component = await Home();
  return render(Component as React.ReactElement);
};

describe('Landing Page', () => {
  beforeEach(() => {
    vi.mocked(getLandingData).mockResolvedValue({
      data: mockData,
      features: mockFeatures,
      testimonials: mockTestimonials,
    });
  });

  afterEach(() => vi.clearAllMocks());

  it('performs initial data fetch', async () => {
    await renderPage();
    expect(getLandingData).toHaveBeenCalledTimes(1);
  });

  describe('Hero & CTA', () => {
    it('renders core hero content', async () => {
      await renderPage();
      expect(screen.getByText(mockData.HeroTitle)).toBeInTheDocument();
      expect(screen.getByText('Get Started')).toBeInTheDocument();
    });

    it('handles secondary CTA fallbacks', async () => {
      vi.mocked(getLandingData).mockResolvedValueOnce({
        data: { ...mockData, secondaryCTALink: undefined, secondaryCTAText: undefined },
        features: [],
        testimonials: [],
      });
      await renderPage();
      const link = screen.getByRole('link', { name: /live demo/i });
      expect(link).toHaveAttribute('href', '/demo');
    });
  });

  describe('Sections Rendering', () => {
    it('renders feature and testimonial cards', async () => {
      await renderPage();
      expect(screen.getByText('Inventory')).toBeInTheDocument();
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getAllByTestId('card')).toHaveLength(2);
    });

    it('renders how-it-works steps', async () => {
      await renderPage();
      expect(screen.getByText('Connect')).toBeInTheDocument();
    });

    it('shows stars based on rating', async () => {
      const { container } = await renderPage();
      const starGroup = container.querySelector('.text-yellow-500');
      expect(starGroup?.children.length).toBe(5);
    });
  });

  describe('Logic & Edge Cases', () => {
    it('defaults to store icon for unknown icons', async () => {
      vi.mocked(getLandingData).mockResolvedValueOnce({
        data: mockData,
        features: [{ ...mockFeatures[0], icon: 'unknown' }],
        testimonials: [],
      });
      await renderPage();
      expect(screen.getAllByTestId('icon-store').length).toBeGreaterThan(0);
    });

    it('identifies outline variant for secondary button', async () => {
      await renderPage();
      const buttons = screen.getAllByTestId('btn');
      const hasOutline = buttons.some((b) => b.getAttribute('data-variant') === 'outline');
      expect(hasOutline).toBe(true);
    });
  });
});
