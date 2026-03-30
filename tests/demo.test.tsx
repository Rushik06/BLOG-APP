import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import DemoModal from '../app/demo/DemoModal';
import DemoPage from '../app/demo/page';
import { fetchAPI } from '@/lib/strapi';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush }) }));
vi.mock('@/lib/strapi', () => ({ fetchAPI: vi.fn() }));
vi.mock('@/components/ui/Card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const mockData = {
  stats: [{ id: 1, title: 'Products', value: '1,240' }],
  inventory: [{ id: 1, name: 'Widget A', stock: 120, stockStatus: 'ok' }],
};

describe('DemoModal', () => {
  it('handles all closing triggers', async () => {
    const { container } = render(<DemoModal><div>Content</div></DemoModal>);
    
    await userEvent.click(screen.getByRole('button'));
    fireEvent.keyDown(window, { key: 'Escape' });
    
    const backdrop = container.querySelector('.fixed');
    if (backdrop) await userEvent.click(backdrop);

    expect(mockPush).toHaveBeenCalledTimes(3);
  });
});

describe('DemoPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup(); 
  });

  it('renders dashboard with stats and colors', async () => {
    vi.mocked(fetchAPI).mockImplementation(async (path) => {
      if (path === '/stats') return { data: mockData.stats };
      if (path === '/inventories') return { data: mockData.inventory };
      return { data: [] };
    });

    render(await DemoPage());
    
    expect(screen.getByText('Products')).toBeDefined();
    expect(screen.getByText('120').className).toContain('text-green-600');
  });

  it('renders nothing when API returns null', async () => {
    vi.mocked(fetchAPI).mockResolvedValue(null);
    
    render(await DemoPage());
    
    expect(screen.queryByText('Products')).toBeNull();
    expect(screen.queryByText('Widget A')).toBeNull();
  });
});