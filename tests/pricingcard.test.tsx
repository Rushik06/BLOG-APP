import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import PricingCard from '@/components/pricing/PricingCard';

vi.mock('@/components/ui/Card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/ui/Button', () => ({
  Button: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
}));

vi.mock('lucide-react', () => ({
  Check: () => <span data-testid="icon-check" />,
}));

const basePlan = {
  id: 1,
  planName: 'Basic',
  Price: 499,
  ctaTitle: null,
  ctaSubtitle: null,
  contactNumber: null,
  highlightTitle: null,
  highlightPoints: null,
  extraFeatures: [] as string[], 
};

describe('PricingCard', () => {
  it('renders plan details and default features correctly', () => {
    render(<PricingCard plan={basePlan} />);

    expect(screen.getByText('Basic')).toBeDefined();
    expect(screen.getByText(/499/)).toBeDefined();
    expect(screen.getByRole('button', { name: /get started/i })).toBeDefined();

    expect(screen.getByText('Real-time tracking')).toBeDefined();
    expect(screen.getAllByTestId('icon-check').length).toBeGreaterThanOrEqual(3);
  });

  it('handles extra features dynamically', () => {
    const extras = ['Priority support', 'API Access'];
    const { rerender } = render(<PricingCard plan={basePlan} />);
    
    expect(screen.queryByText(extras[0])).toBeNull();

    rerender(<PricingCard plan={{ ...basePlan, extraFeatures: extras }} />);
    
    extras.forEach(feature => {
      expect(screen.getByText(feature)).toBeDefined();
    });
  });

  it('updates display for different pricing tiers', () => {
    render(<PricingCard plan={{ ...basePlan, planName: 'Pro', Price: 999 }} />);
    
    expect(screen.getByText('Pro')).toBeDefined();
    expect(screen.getByText(/999/)).toBeDefined();
  });
});