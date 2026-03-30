import { it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React, { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Dashboard from '@/app/dashboard/page';
import { getStats, getActivities, getDashboardTitle } from '@/app/hooks/usedashboard';

vi.mock('next-auth', () => ({
  default: vi.fn(),
  getServerSession: vi.fn(),
}));

vi.mock('next/navigation', () => ({ redirect: vi.fn() }));
vi.mock('@/app/api/auth/[...nextauth]/route', () => ({ authOptions: {} }));
vi.mock('@/app/hooks/usedashboard', () => ({ 
  getStats: vi.fn(), 
  getActivities: vi.fn(), 
  getDashboardTitle: vi.fn() 
}));

vi.mock('@/components/dashboard/Charts', () => ({ default: () => <div data-testid="chart" /> }));
vi.mock('@/components/ui/Card', () => ({ 
  Card: ({ children }: { children: ReactNode }) => <div>{children}</div>, 
  CardContent: ({ children }: { children: ReactNode }) => <div>{children}</div> 
}));

vi.mock('lucide-react', () => ({ 
  Users: () => <i />, TrendingUp: () => <i />, Rocket: () => <i />, 
  CheckCircle: () => <i data-testid="check" />, BarChart3: () => <i />, Lightbulb: () => <i /> 
}));

const mockData = {
  stats: { totalSubscribers: 4200 },
  activities: [{ id: 1, icon: 'check', text: 'New user' }],
  title: 'Recent Activity'
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getServerSession).mockResolvedValue({ user: { name: 'Rushik' } });
  vi.mocked(getStats).mockResolvedValue(mockData.stats);
  vi.mocked(getActivities).mockResolvedValue(mockData.activities as ReturnType<typeof getActivities> extends Promise<infer T> ? T : never);
  vi.mocked(getDashboardTitle).mockResolvedValue(mockData.title);
});

it('redirects unauthenticated users', async () => {
  vi.mocked(getServerSession).mockResolvedValueOnce(null);
  await Dashboard();
  expect(redirect).toHaveBeenCalledWith('/login');
});

it('renders dashboard layout and stats', async () => {
  render(await Dashboard());
  expect(screen.getByText(/dashboard/i)).toBeDefined();
  expect(screen.getByText('4200')).toBeDefined();
  expect(screen.getByTestId('chart')).toBeDefined();
});

it('handles empty activity states', async () => {
  vi.mocked(getActivities).mockResolvedValueOnce([]);
  render(await Dashboard());
  expect(screen.getByText(/no activity found/i)).toBeDefined();
  expect(screen.queryByTestId('check')).toBeNull();
});