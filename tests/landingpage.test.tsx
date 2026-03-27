import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import type { Testimonial } from '@/app/types/testimonals';
import type { LandingPage } from '@/app/types/landing-page';

vi.mock('@/app/hooks/uselanding-data', () => ({
  getLandingData: vi.fn(),
}));

vi.mock('@/lib/strapi-helpers', () => ({
  getText: vi.fn((val: unknown) => {
    if (Array.isArray(val)) {
      return val.map((b: { children?: { text: string }[] }) =>
        b.children?.map((c) => c.text).join('') ?? ''
      ).join('');
    }
    return val;
  }),
}));

vi.mock('@/app/constants/landing-constants', () => ({
  iconMap: {
    store: ({ size }: { size: number }) => <svg data-testid="icon-store" width={size} />,
    chart: ({ size }: { size: number }) => <svg data-testid="icon-chart" width={size} />,
    users: ({ size }: { size: number }) => <svg data-testid="icon-users" width={size} />,
  },
  howItWorksColors: ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-orange-100'],
}));

vi.mock('@/app/metadata/home', () => ({
  homeMetadata: {},
}));

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('@/components/ui/Button', () => ({
  Button: ({
    children,
    className,
    variant,
  }: {
    children: React.ReactNode;
    className?: string;
    variant?: string;
  }) => (
    <button data-testid="button" data-variant={variant} className={className}>
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/Card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card">{children}</div>
  ),
  CardContent: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="card-content" className={className}>
      {children}
    </div>
  ),
}));

vi.mock('@/components/ui/ScrollToHeroBadge', () => ({
  default: () => <div data-testid="scroll-to-hero-badge" />,
}));

import { getLandingData } from '@/app/hooks/uselanding-data';

const makeContent = (text: string) => [
  { children: [{ text }] },
] as unknown as Testimonial['content'];

const mockData: LandingPage = {
  HeroTitle: 'Manage Your Retail Business',
  HeroSubtitle: 'The all-in-one platform for modern retailers.',
  CTAText: 'Get Started',
  secondaryCTALink: '/demo',
  secondaryCTAText: 'Live Demo',
  featuresTitle: 'Everything You Need',
  featuresSubtitle: 'Powerful tools built for retail.',
  howItWorksTitle: 'How It Works',
  howItWorksSubTitle: 'Get up and running in three easy steps.',
  howItWorksStep: [
    { icon: 'store', title: 'Connect', description: 'Link your store.' },
    { icon: 'chart', title: 'Analyse', description: 'View insights.' },
    { icon: 'users', title: 'Grow', description: 'Scale your business.' },
  ],
};

const mockFeatures = [
  { id: 1, icon: 'store', color: 'bg-blue-100', title: 'Inventory', description: 'Track stock in real time.' },
  { id: 2, icon: 'chart', color: 'bg-green-100', title: 'Analytics', description: 'Understand your sales.' },
  { id: 3, icon: 'users', color: 'bg-purple-100', title: 'Customers', description: 'Manage your customer base.' },
];

const mockTestimonials: Testimonial[] = [
  { id: 1, rating: 5, content: makeContent('Absolutely love it!'), name: 'Alice Johnson', role: 'Store Owner' },
  { id: 2, rating: 4, content: makeContent('Very useful tool.'), name: 'Bob Smith', role: 'Manager' },
  { id: 3, rating: 5, content: makeContent('Transformed our workflow.'), name: 'Carol White', role: 'CEO' },
];

describe('Home (Landing Page)', () => {
  beforeEach(() => {
    vi.mocked(getLandingData).mockResolvedValue({
      data: mockData,
      features: mockFeatures,
      testimonials: mockTestimonials,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  async function renderPage() {
    const { default: Home } = await import('../app/page');
    const jsx = await Home();
    return render(jsx as React.ReactElement);
  }

  describe('Data fetching', () => {
    it('calls getLandingData once on render', async () => {
      await renderPage();
      expect(getLandingData).toHaveBeenCalledTimes(1);
    });
  });

  describe('Hero section', () => {
    it('renders the hero title', async () => {
      await renderPage();
      expect(screen.getByText('Manage Your Retail Business')).toBeInTheDocument();
    });

    it('renders the hero subtitle', async () => {
      await renderPage();
      expect(screen.getByText('The all-in-one platform for modern retailers.')).toBeInTheDocument();
    });

    it('renders the primary CTA button with correct text', async () => {
      await renderPage();
      expect(screen.getByText('Get Started')).toBeInTheDocument();
    });

    it('renders the secondary CTA button with correct text', async () => {
      await renderPage();
      expect(screen.getByText('Live Demo')).toBeInTheDocument();
    });

    it('secondary CTA link points to secondaryCTALink', async () => {
      await renderPage();
      const link = screen.getByRole('link', { name: /live demo/i });
      expect(link).toHaveAttribute('href', '/demo');
    });

    it('secondary CTA falls back to "/demo" when secondaryCTALink is absent', async () => {
      vi.mocked(getLandingData).mockResolvedValueOnce({
        data: { ...mockData, secondaryCTALink: undefined },
        features: mockFeatures,
        testimonials: mockTestimonials,
      });
      await renderPage();
      const link = screen.getByRole('link', { name: /live demo/i });
      expect(link).toHaveAttribute('href', '/demo');
    });

    it('secondary CTA text falls back to "Live Demo" when secondaryCTAText is absent', async () => {
      vi.mocked(getLandingData).mockResolvedValueOnce({
        data: { ...mockData, secondaryCTAText: undefined },
        features: mockFeatures,
        testimonials: mockTestimonials,
      });
      await renderPage();
      expect(screen.getByText('Live Demo')).toBeInTheDocument();
    });

    it('renders the Sparkles icon wrapper with animate-pulse', async () => {
      const { container } = await renderPage();
      expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    });
  });

  describe('Features section', () => {
    it('renders the features section title', async () => {
      await renderPage();
      expect(screen.getByText('Everything You Need')).toBeInTheDocument();
    });

    it('renders the features section subtitle', async () => {
      await renderPage();
      expect(screen.getByText('Powerful tools built for retail.')).toBeInTheDocument();
    });

    it('renders a card for each feature', async () => {
      await renderPage();
      expect(screen.getByText('Inventory')).toBeInTheDocument();
      expect(screen.getByText('Analytics')).toBeInTheDocument();
      expect(screen.getByText('Customers')).toBeInTheDocument();
    });

    it('renders each feature description', async () => {
      await renderPage();
      expect(screen.getByText('Track stock in real time.')).toBeInTheDocument();
      expect(screen.getByText('Understand your sales.')).toBeInTheDocument();
      expect(screen.getByText('Manage your customer base.')).toBeInTheDocument();
    });

    it('applies the feature colour class to the icon wrapper', async () => {
      const { container } = await renderPage();
      expect(container.querySelector('.bg-blue-100')).toBeInTheDocument();
      expect(container.querySelector('.bg-green-100')).toBeInTheDocument();
      expect(container.querySelector('.bg-purple-100')).toBeInTheDocument();
    });

    it('falls back to iconMap.store when feature icon is unrecognised', async () => {
      vi.mocked(getLandingData).mockResolvedValueOnce({
        data: { ...mockData, howItWorksStep: [] },
        features: [{ id: 99, icon: 'unknown-icon', color: 'bg-red-100', title: 'Mystery', description: 'No icon.' }],
        testimonials: mockTestimonials,
      });
      await renderPage();
      const storeIcons = screen.getAllByTestId('icon-store');
      expect(storeIcons.length).toBe(1);
    });

    it('renders zero feature cards when features array is empty', async () => {
      vi.mocked(getLandingData).mockResolvedValueOnce({
        data: mockData,
        features: [],
        testimonials: mockTestimonials,
      });
      await renderPage();
      expect(screen.queryByText('Inventory')).not.toBeInTheDocument();
    });
  });

  describe('How It Works section', () => {
    it('renders the how-it-works title', async () => {
      await renderPage();
      expect(screen.getByText('How It Works')).toBeInTheDocument();
    });

    it('renders the how-it-works subtitle', async () => {
      await renderPage();
      expect(screen.getByText('Get up and running in three easy steps.')).toBeInTheDocument();
    });

    it('renders each step title', async () => {
      await renderPage();
      expect(screen.getByText('Connect')).toBeInTheDocument();
      expect(screen.getByText('Analyse')).toBeInTheDocument();
      expect(screen.getByText('Grow')).toBeInTheDocument();
    });

    it('renders each step description', async () => {
      await renderPage();
      expect(screen.getByText('Link your store.')).toBeInTheDocument();
      expect(screen.getByText('View insights.')).toBeInTheDocument();
      expect(screen.getByText('Scale your business.')).toBeInTheDocument();
    });

    it('does not render an arrow after the last step', async () => {
      const { container } = await renderPage();
      const arrows = container.querySelectorAll('.mx-6');
      expect(arrows.length).toBe(mockData.howItWorksStep.length - 1);
    });

    it('applies howItWorksColors cyclically to step icon wrappers', async () => {
      const { container } = await renderPage();
      expect(container.querySelector('.bg-blue-100')).toBeInTheDocument();
      expect(container.querySelector('.bg-green-100')).toBeInTheDocument();
      expect(container.querySelector('.bg-purple-100')).toBeInTheDocument();
    });
  });

  describe('ScrollToHeroBadge', () => {
    it('renders the scroll badge', async () => {
      await renderPage();
      expect(screen.getByTestId('scroll-to-hero-badge')).toBeInTheDocument();
    });
  });

  describe('Testimonials section', () => {
    it('renders the testimonials heading', async () => {
      await renderPage();
      expect(screen.getByText('What our users say')).toBeInTheDocument();
    });

    it('renders each testimonial name', async () => {
      await renderPage();
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('Bob Smith')).toBeInTheDocument();
      expect(screen.getByText('Carol White')).toBeInTheDocument();
    });

    it('renders each testimonial role', async () => {
      await renderPage();
      expect(screen.getByText('Store Owner')).toBeInTheDocument();
      expect(screen.getByText('Manager')).toBeInTheDocument();
      expect(screen.getByText('CEO')).toBeInTheDocument();
    });

    it('renders each testimonial content wrapped in quotes', async () => {
      await renderPage();
      expect(screen.getByText('\u201CAbsolutely love it!\u201D')).toBeInTheDocument();
      expect(screen.getByText('\u201CVery useful tool.\u201D')).toBeInTheDocument();
      expect(screen.getByText('\u201CTransformed our workflow.\u201D')).toBeInTheDocument();
    });

    it('renders the correct number of stars per testimonial', async () => {
      const { container } = await renderPage();
      const starGroups = container.querySelectorAll('.text-yellow-500');
      const starCounts = Array.from(starGroups).map((g) => g.children.length);
      expect(starCounts).toEqual(mockTestimonials.map((t) => t.rating));
    });

    it('defaults to 5 stars when rating is absent', async () => {
      vi.mocked(getLandingData).mockResolvedValueOnce({
        data: mockData,
        features: [],
        testimonials: [
          { id: 9, rating: undefined, content: makeContent('Great!'), name: 'Dave', role: 'Dev' } as unknown as Testimonial,
        ],
      });
      const { container } = await renderPage();
      const starGroup = container.querySelector('.text-yellow-500');
      expect(starGroup?.children.length).toBe(5);
    });

    it('renders zero testimonial cards when array is empty', async () => {
      vi.mocked(getLandingData).mockResolvedValueOnce({
        data: mockData,
        features: mockFeatures,
        testimonials: [],
      });
      await renderPage();
      expect(screen.queryByText('What our users say')).toBeInTheDocument();
      expect(screen.queryByText('Alice Johnson')).not.toBeInTheDocument();
    });
  });

  describe('Overall layout', () => {
    it('renders the correct total number of cards (features + testimonials)', async () => {
      await renderPage();
      const cards = screen.getAllByTestId('card');
      expect(cards.length).toBe(mockFeatures.length + mockTestimonials.length);
    });

    it('renders two buttons (primary and secondary CTA)', async () => {
      await renderPage();
      const buttons = screen.getAllByTestId('button');
      expect(buttons.length).toBe(2);
    });

    it('secondary CTA button has outline variant', async () => {
      await renderPage();
      const buttons = screen.getAllByTestId('button');
      const outlineBtn = buttons.find((b) => b.getAttribute('data-variant') === 'outline');
      expect(outlineBtn).toBeInTheDocument();
    });
  });
});