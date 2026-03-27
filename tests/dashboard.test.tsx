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

vi.mock('@/components/dashboard/Charts', () => ({
  default: () => <div data-testid="chart">Chart</div>,
}));

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
  Users: () => <svg data-testid="icon-users" />,
  TrendingUp: () => <svg data-testid="icon-trending-up" />,
  Rocket: () => <svg data-testid="icon-rocket" />,
  CheckCircle: () => <svg data-testid="icon-check-circle" />,
  BarChart3: () => <svg data-testid="icon-bar-chart" />,
  Lightbulb: () => <svg data-testid="icon-lightbulb" />,
}));

const mockSession = { user: { name: 'Rushik', email: 'rushik@example.com' } };

const mockStats: StatsResponse = { totalSubscribers: 4200 };

const mockActivities: Activity[] = [
  { id: 1, icon: 'check', text: 'New user signed up' },
  { id: 2, icon: 'chart', text: 'Revenue increased' },
  { id: 3, icon: 'light', text: 'New feature suggested' },
];

async function renderDashboard() {
  const ui = await Dashboard();
  return render(ui);
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getServerSession).mockResolvedValue(mockSession);
  vi.mocked(getStats).mockResolvedValue(mockStats);
  vi.mocked(getActivities).mockResolvedValue(mockActivities);
  vi.mocked(getDashboardTitle).mockResolvedValue('Recent Activity');
});

describe('Dashboard - auth', () => {
  it('redirects to /login when there is no session', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null);
    await Dashboard();
    expect(redirect).toHaveBeenCalledWith('/login');
  });

  it('redirects exactly once when session is missing', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null);
    await Dashboard();
    expect(redirect).toHaveBeenCalledTimes(1);
  });

  it('does not redirect when a valid session exists', async () => {
    await renderDashboard();
    expect(redirect).not.toHaveBeenCalled();
  });

  it('calls getServerSession with authOptions', async () => {
    await renderDashboard();
    expect(getServerSession).toHaveBeenCalledWith({});
  });
});

describe('Dashboard - data fetching', () => {
  it('calls getStats once', async () => {
    await renderDashboard();
    expect(getStats).toHaveBeenCalledTimes(1);
  });

  it('calls getActivities once', async () => {
    await renderDashboard();
    expect(getActivities).toHaveBeenCalledTimes(1);
  });

  it('calls getDashboardTitle once', async () => {
    await renderDashboard();
    expect(getDashboardTitle).toHaveBeenCalledTimes(1);
  });
});

describe('Dashboard - header', () => {
  it('renders the Dashboard heading', async () => {
    await renderDashboard();
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeDefined();
  });

  it('renders the welcome message', async () => {
    await renderDashboard();
    expect(screen.getByText(/welcome back/i)).toBeDefined();
  });

  it('renders the Rocket icon', async () => {
    await renderDashboard();
    expect(screen.getByTestId('icon-rocket')).toBeDefined();
  });
});

describe('Dashboard - stats', () => {
  it('renders the Total Subscribers label', async () => {
    await renderDashboard();
    expect(screen.getByText(/total subscribers/i)).toBeDefined();
  });

  it('renders the subscriber count from getStats', async () => {
    await renderDashboard();
    expect(screen.getByText('4200')).toBeDefined();
  });

  it('renders a different subscriber count correctly', async () => {
    vi.mocked(getStats).mockResolvedValueOnce({ totalSubscribers: 9999 });
    await renderDashboard();
    expect(screen.getByText('9999')).toBeDefined();
  });

  it('renders the +12% growth label', async () => {
    await renderDashboard();
    expect(screen.getByText(/\+12%/i)).toBeDefined();
  });

  it('renders the TrendingUp icon', async () => {
    await renderDashboard();
    expect(screen.getByTestId('icon-trending-up')).toBeDefined();
  });

  it('renders the Users icon', async () => {
    await renderDashboard();
    expect(screen.getByTestId('icon-users')).toBeDefined();
  });
});

describe('Dashboard - chart', () => {
  it('renders the Chart component', async () => {
    await renderDashboard();
    expect(screen.getByTestId('chart')).toBeDefined();
  });
});

describe('Dashboard - activity section', () => {
  it('renders the title returned by getDashboardTitle', async () => {
    await renderDashboard();
    expect(screen.getByText('Recent Activity')).toBeDefined();
  });

  it('renders a different title correctly', async () => {
    vi.mocked(getDashboardTitle).mockResolvedValueOnce('Latest Updates');
    await renderDashboard();
    expect(screen.getByText('Latest Updates')).toBeDefined();
  });

  it('renders all activity items', async () => {
    await renderDashboard();
    expect(screen.getByText('New user signed up')).toBeDefined();
    expect(screen.getByText('Revenue increased')).toBeDefined();
    expect(screen.getByText('New feature suggested')).toBeDefined();
  });

  it('renders CheckCircle icon for icon="check" activity', async () => {
    await renderDashboard();
    expect(screen.getByTestId('icon-check-circle')).toBeDefined();
  });

  it('renders BarChart3 icon for icon="chart" activity', async () => {
    await renderDashboard();
    expect(screen.getByTestId('icon-bar-chart')).toBeDefined();
  });

  it('renders Lightbulb icon for icon="light" activity', async () => {
    await renderDashboard();
    expect(screen.getByTestId('icon-lightbulb')).toBeDefined();
  });

  it('renders correct number of activity list items', async () => {
    await renderDashboard();
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(mockActivities.length);
  });
});

describe('Dashboard - empty activity state', () => {
  it('renders "No activity found" when activities list is empty', async () => {
    vi.mocked(getActivities).mockResolvedValueOnce([]);
    await renderDashboard();
    expect(screen.getByText(/no activity found/i)).toBeDefined();
  });

  it('renders only one list item when activities is empty', async () => {
    vi.mocked(getActivities).mockResolvedValueOnce([]);
    await renderDashboard();
    const items = screen.queryAllByRole('listitem');
    expect(items).toHaveLength(1);
  });

  it('does not render any icons when activities is empty', async () => {
    vi.mocked(getActivities).mockResolvedValueOnce([]);
    await renderDashboard();
    expect(screen.queryByTestId('icon-check-circle')).toBeNull();
    expect(screen.queryByTestId('icon-bar-chart')).toBeNull();
    expect(screen.queryByTestId('icon-lightbulb')).toBeNull();
  });
});
