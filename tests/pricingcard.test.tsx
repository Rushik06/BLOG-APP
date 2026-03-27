import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import PricingCard from '@/components/pricing/PricingCard';

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

vi.mock('@/components/ui/Button', () => ({
  Button: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <button className={className}>{children}</button>
  ),
}));

vi.mock('lucide-react', () => ({
  Check: () => <svg data-testid="icon-check" />,
}));

const mockPlan = {
  id: 1,
  planName: 'Basic',
  Price: 499,
  ctaTitle: null,
  ctaSubtitle: null,
  contactNumber: null,
  highlightTitle: null,
  highlightPoints: null,
  extraFeatures: [],
};

describe('PricingCard', () => {
  it('renders the plan name', () => {
    render(<PricingCard plan={mockPlan} />);
    expect(screen.getByText('Basic')).toBeInTheDocument();
  });

  it('renders the plan price with rupee symbol', () => {
    render(<PricingCard plan={mockPlan} />);
    expect(screen.getByText('₹499')).toBeInTheDocument();
  });

  it('renders the Get Started button', () => {
    render(<PricingCard plan={mockPlan} />);
    expect(screen.getByRole('button', { name: 'Get Started' })).toBeInTheDocument();
  });

  it('renders default features', () => {
    render(<PricingCard plan={mockPlan} />);
    expect(screen.getByText('Real-time tracking')).toBeInTheDocument();
    expect(screen.getByText('Smart analytics')).toBeInTheDocument();
    expect(screen.getByText('Multi-store support')).toBeInTheDocument();
  });

  it('renders check icons for default features', () => {
    render(<PricingCard plan={mockPlan} />);
    expect(screen.getAllByTestId('icon-check').length).toBeGreaterThanOrEqual(3);
  });

  it('does not render extra features section when extraFeatures is empty', () => {
    render(<PricingCard plan={mockPlan} />);
    expect(screen.queryByText('Priority support')).not.toBeInTheDocument();
  });

  it('renders extra features when provided', () => {
    const planWithExtras = { ...mockPlan, extraFeatures: ['Priority support', 'Custom reports'] };
    render(<PricingCard plan={planWithExtras} />);
    expect(screen.getByText('Priority support')).toBeInTheDocument();
    expect(screen.getByText('Custom reports')).toBeInTheDocument();
  });

  it('renders correct number of extra feature items', () => {
    const planWithExtras = { ...mockPlan, extraFeatures: ['Feature A', 'Feature B', 'Feature C'] };
    render(<PricingCard plan={planWithExtras} />);
    expect(screen.getByText('Feature A')).toBeInTheDocument();
    expect(screen.getByText('Feature B')).toBeInTheDocument();
    expect(screen.getByText('Feature C')).toBeInTheDocument();
  });

  it('renders Card and CardContent wrappers', () => {
    render(<PricingCard plan={mockPlan} />);
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('card-content')).toBeInTheDocument();
  });

  it('renders different plan data correctly', () => {
    const proPlan = { ...mockPlan, id: 2, planName: 'Pro', Price: 999 };
    render(<PricingCard plan={proPlan} />);
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('₹999')).toBeInTheDocument();
  });

  it('renders plan name as h2 heading', () => {
    render(<PricingCard plan={mockPlan} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Basic' })).toBeInTheDocument();
  });
});
