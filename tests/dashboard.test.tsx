import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import Dashboard from '@/app/dashboard/page';
import { getStats, getActivities, getDashboardTitle } from '@/app/hooks/usedashboard';
import type { StatsResponse, Activity } from '@/app/types/dashboard';

vi.mock('next-auth', () => ({ getServerSession: vi.fn() }));
vi.mock('next/navigation', () => ({ redirect: vi.fn() }));
vi.mock('@/app/api/auth/[...nextauth]/route', () => ({ authOptions: {} }));
vi.mock('@/app/metadata/dashboard', () => ({ dashboardMetadata: {} }));
vi.mock('@/app/hooks/usedashboard', () => ({
  getStats: vi.fn(),
  getActivities: vi.fn(),
  getDashboardTitle: vi.fn(),
}));

vi.mock('@/components/dashboard/Charts', () => ({ default: () => <div data-testid="chart" /> }));
vi.mock('@/components/ui/Card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('lucide-react', () => ({
  Users: () => <div />,
  TrendingUp: () => <div />,
  Rocket: () => <div />,
  CheckCircle: () => <div data-testid="icon-check" />,
  BarChart3: () => <div data-testid="icon-chart" />,
  Lightbulb: () => <div data-testid="icon-light" />,
}));

const mockStats: StatsResponse = { totalSubscribers: 4200 };
const mockActivities: Activity[] = [
  { id: 1, icon: 'check', text: 'New user signed up' },
  { id: 2, icon: 'chart', text: 'Revenue increased' },
  { id: 3, icon: 'light', text: 'New feature suggested' },
];

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getServerSession).mockResolvedValue({ user: { name: 'Rushik' } });
  vi.mocked(getStats).mockResolvedValue(mockStats);
  vi.mocked(getActivities).mockResolvedValue(mockActivities);
  vi.mocked(getDashboardTitle).mockResolvedValue('Recent Activity');
});

describe('Dashboard Page', () => {
  it('protects the route by redirecting unauthenticated users', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null);
    await Dashboard();
    expect(redirect).toHaveBeenCalledWith('/login');
  });

  it('renders the full dashboard layout for authenticated users', async () => {
    render(await Dashboard());

    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeDefined();
    expect(screen.getByText(/welcome back/i)).toBeDefined();
    expect(screen.getByTestId('chart')).toBeDefined();

    expect(screen.getByText('4200')).toBeDefined();
    expect(screen.getByText('Recent Activity')).toBeDefined();
  });

  it('correctly lists all activity items', async () => {
    render(await Dashboard());

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(screen.getByText('New user signed up')).toBeDefined();
  });

  it('displays empty state when no activities exist', async () => {
    vi.mocked(getActivities).mockResolvedValueOnce([]);
    render(await Dashboard());

    expect(screen.getByText(/no activity found/i)).toBeDefined();
    expect(screen.queryByTestId('icon-check')).toBeNull();
  });
});
