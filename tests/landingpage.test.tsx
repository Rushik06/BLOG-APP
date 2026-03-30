import { it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import  { ReactNode } from 'react';
import Home from '@/app/page';
import { getLandingData } from '@/app/hooks/uselanding-data';
import type { LandingPage } from '@/app/types/landing-page';

vi.mock('@/app/hooks/uselanding-data', () => ({ getLandingData: vi.fn() }));
vi.mock('@/app/metadata/home', () => ({ homeMetadata: {} }));
vi.mock('@/components/ui/ScrollToHeroBadge', () => ({ default: () => <div /> }));
vi.mock('@/lib/strapi-helpers', () => ({ getText: () => 'Love it!' }));
vi.mock('@/app/constants/landing-constants', () => ({ 
  iconMap: { store: () => <i data-testid="icon" /> }, 
  howItWorksColors: [] 
}));

vi.mock('next/link', () => ({ 
  default: ({ href, children }: { href: string, children: ReactNode }) => <a href={href}>{children}</a> 
}));
vi.mock('@/components/ui/Button', () => ({ 
  Button: ({ children, variant }: { children: ReactNode, variant?: string }) => 
    <button data-testid="btn" data-variant={variant}>{children}</button> 
}));
vi.mock('@/components/ui/Card', () => ({ 
  Card: ({ children }: { children: ReactNode }) => <div data-testid="card">{children}</div>, 
  CardContent: ({ children }: { children: ReactNode }) => <div>{children}</div> 
}));

const mockData = {
  data: { 
    HeroTitle: 'Manage Business', 
    HeroSubtitle: 'Sub', 
    CTAText: 'Get Started', 
    secondaryCTALink: '/demo', 
    secondaryCTAText: 'Demo', 
    featuresTitle: 'Features',
    featuresSubtitle: 'Sub',
    howItWorksTitle: 'Title',
    howItWorksSubTitle: 'Sub',
    howItWorksStep: [] 
  } as LandingPage,
  features: [{ id: 1, icon: 'store', title: 'Inventory', description: 'Desc', color: 'blue' }],
  testimonials: [{ id: 1, name: 'Alice', role: 'Owner', rating: 5, content: [] }]
};

const setup = async (overrides = {}) => {
  const result = { ...mockData, ...overrides };
  vi.mocked(getLandingData).mockResolvedValue(result);
  return render(await Home());
};

beforeEach(() => vi.clearAllMocks());

it('renders main landing content correctly', async () => {
  await setup();
  expect(screen.getByText('Manage Business')).toBeDefined();
  expect(screen.getByText('Inventory')).toBeDefined();
  expect(screen.getByText('Alice')).toBeDefined();
});

it('handles missing CTA links and button variants', async () => {
  await setup({ 
    data: { ...mockData.data, secondaryCTALink: undefined } 
  });
  expect(screen.getByRole('link', { name: /demo/i })).toHaveAttribute('href', '/demo');
  expect(screen.getAllByTestId('btn').some(b => b.dataset.variant === 'outline')).toBe(true);
});

it('falls back to default icons for unknown types', async () => {
  await setup({ 
    features: [{ ...mockData.features[0], icon: 'unknown' }] 
  });
  expect(screen.getByTestId('icon')).toBeDefined();
});