import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import FeatureCard from '@/components/features/FeatureCard';

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
  CheckCircle: () => <svg data-testid="icon-check" />,
}));

const mockFeature = {
  id: 1,
  title: 'Inventory Management',
  description: 'Track your stock levels in real time.',
};

describe('FeatureCard', () => {
  it('renders the feature title', () => {
    render(<FeatureCard feature={mockFeature} />);
    expect(screen.getByText('Inventory Management')).toBeInTheDocument();
  });

  it('renders the feature description', () => {
    render(<FeatureCard feature={mockFeature} />);
    expect(screen.getByText('Track your stock levels in real time.')).toBeInTheDocument();
  });

  it('renders the CheckCircle icon', () => {
    render(<FeatureCard feature={mockFeature} />);
    expect(screen.getByTestId('icon-check')).toBeInTheDocument();
  });

  it('renders title as an h3 heading', () => {
    render(<FeatureCard feature={mockFeature} />);
    expect(
      screen.getByRole('heading', { level: 3, name: 'Inventory Management' })
    ).toBeInTheDocument();
  });

  it('renders Card and CardContent wrappers', () => {
    render(<FeatureCard feature={mockFeature} />);
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('card-content')).toBeInTheDocument();
  });

  it('renders different feature data correctly', () => {
    const anotherFeature = {
      id: 2,
      title: 'Sales Analytics',
      description: 'Understand your revenue trends.',
    };
    render(<FeatureCard feature={anotherFeature} />);
    expect(screen.getByText('Sales Analytics')).toBeInTheDocument();
    expect(screen.getByText('Understand your revenue trends.')).toBeInTheDocument();
  });

  it('renders title and description in the same card', () => {
    render(<FeatureCard feature={mockFeature} />);
    const card = screen.getByTestId('card');
    expect(card).toHaveTextContent('Inventory Management');
    expect(card).toHaveTextContent('Track your stock levels in real time.');
  });
});
