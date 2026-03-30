import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import FeatureCard from '@/components/features/FeatureCard';


vi.mock('@/components/ui/Card', () => ({
  Card: ({ children }: any) => <div data-testid="card-wrapper">{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
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

  const setup = (props = mockFeature) => render(<FeatureCard feature={props} />);

  it('should display all feature details correctly', () => {
    setup();

    expect(screen.getByText(mockFeature.title)).toBeInTheDocument();
    expect(screen.getByText(mockFeature.description)).toBeInTheDocument();
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
  });

  it('should render within the Card UI wrapper', () => {
    setup();
    
    const container = screen.getByTestId('card-wrapper');
    expect(container).toContainElement(screen.getByText(mockFeature.title));
  });

  it('should handle different data sets dynamically', () => {
    const altFeature = { 
      id: 99, 
      title: 'Analytics', 
      description: 'View trends' 
    };
    
    setup(altFeature);

    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('View trends')).toBeInTheDocument();
  });
});