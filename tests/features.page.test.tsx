import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import FeatureCard from '@/components/features/FeatureCard';

interface MockProps {
  children: React.ReactNode;
}

vi.mock('@/components/ui/Card', () => ({
  Card: ({ children }: MockProps) => <div data-testid="card-wrapper">{children}</div>,
  CardContent: ({ children }: MockProps) => <div>{children}</div>,
}));

vi.mock('lucide-react', () => ({
  CheckCircle: () => <span data-testid="check-icon" />,
}));

describe('FeatureCard', () => {
  const mockFeature = {
    id: 1,
    title: 'Inventory Management',
    description: 'Track your stock levels in real time.',
  };

  const setup = (feature = mockFeature) => render(<FeatureCard feature={feature} />);

  it('renders all feature details correctly', () => {
    setup();

    expect(screen.getByText(mockFeature.title)).toBeInTheDocument();
    expect(screen.getByText(mockFeature.description)).toBeInTheDocument();
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
  });

  it('wraps content in the Card component', () => {
    setup();

    const card = screen.getByTestId('card-wrapper');
    expect(card).toContainElement(screen.getByText(mockFeature.title));
  });

  it('supports different feature data', () => {
    setup({
      id: 2,
      title: 'Analytics',
      description: 'Real-time insights',
    });

    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Real-time insights')).toBeInTheDocument();
  });
});
