import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Dashboard from '@/app/dashboard/page';
import { getStats, getActivities, getDashboardTitle } from '@/app/hooks/usedashboard';
import { Activity } from '@/app/types/dashboard';

vi.mock('@/app/hooks/usedashboard', () => ({
  getStats: vi.fn(),
  getActivities: vi.fn(),
  getDashboardTitle: vi.fn(),
}));

vi.mock('@/components/dashboard/Charts', () => ({
  default: () => <div data-testid="chart" />,
}));

vi.mock('@/components/ui/Card', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card" className={className}>{children}</div>
  ),
  CardContent: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card-content" className={className}>{children}</div>
  ),
}));

vi.mock('lucide-react', () => ({
  Users: () => <svg data-testid="icon-users" />,
  TrendingUp: () => <svg data-testid="icon-trending" />,
  Rocket: () => <svg data-testid="icon-rocket" />,
  CheckCircle: () => <svg data-testid="icon-check" />,
  BarChart3: () => <svg data-testid="icon-barchart" />,
  Lightbulb: () => <svg data-testid="icon-lightbulb" />,
}));

vi.mock('@/app/metadata/dashboard', () => ({
  dashboardMetadata: { title: 'Dashboard' },
}));

const mockedGetStats = vi.mocked(getStats);
const mockedGetActivities = vi.mocked(getActivities);
const mockedGetDashboardTitle = vi.mocked(getDashboardTitle);

const mockStats = { totalSubscribers: 1200 };
const mockTitle = 'Recent Activity';

const mockActivities: Activity[] = [
  { id: 1, icon: 'check', text: 'New order received' },
  { id: 2, icon: 'chart', text: 'Revenue increased by 5%' },
  { id: 3, icon: 'light', text: 'New feature suggestion added' },
];

async function renderDashboard() {
  const jsx = await Dashboard();
  return render(jsx as React.ReactElement);
}

describe('Dashboard page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetStats.mockResolvedValue(mockStats);
    mockedGetActivities.mockResolvedValue(mockActivities);
    mockedGetDashboardTitle.mockResolvedValue(mockTitle);
  });

  describe('header', () => {
    it('renders the Dashboard heading', async () => {
      await renderDashboard();
      expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
    });

    it('renders the welcome message', async () => {
      await renderDashboard();
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    });

    it('renders the rocket icon', async () => {
      await renderDashboard();
      expect(screen.getByTestId('icon-rocket')).toBeInTheDocument();
    });
  });

  describe('stats card', () => {
    it('renders Total Subscribers label', async () => {
      await renderDashboard();
      expect(screen.getByText('Total Subscribers')).toBeInTheDocument();
    });

    it('renders total subscribers value from data', async () => {
      await renderDashboard();
      expect(screen.getByText('1200')).toBeInTheDocument();
    });

    it('renders weekly growth indicator', async () => {
      await renderDashboard();
      expect(screen.getByText('+12% this week')).toBeInTheDocument();
    });

    it('renders users icon', async () => {
      await renderDashboard();
      expect(screen.getByTestId('icon-users')).toBeInTheDocument();
    });

    it('renders trending up icon', async () => {
      await renderDashboard();
      expect(screen.getByTestId('icon-trending')).toBeInTheDocument();
    });

    it('renders different subscriber count correctly', async () => {
      mockedGetStats.mockResolvedValue({ totalSubscribers: 9999 });
      await renderDashboard();
      expect(screen.getByText('9999')).toBeInTheDocument();
    });
  });

  describe('chart', () => {
    it('renders the Chart component', async () => {
      await renderDashboard();
      expect(screen.getByTestId('chart')).toBeInTheDocument();
    });
  });

  describe('activity section', () => {
    it('renders activity section title from getDashboardTitle', async () => {
      await renderDashboard();
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    });

    it('renders all activity items', async () => {
      await renderDashboard();
      expect(screen.getByText('New order received')).toBeInTheDocument();
      expect(screen.getByText('Revenue increased by 5%')).toBeInTheDocument();
      expect(screen.getByText('New feature suggestion added')).toBeInTheDocument();
    });

    it('renders check icon for check activity', async () => {
      await renderDashboard();
      expect(screen.getByTestId('icon-check')).toBeInTheDocument();
    });

    it('renders barchart icon for chart activity', async () => {
      await renderDashboard();
      expect(screen.getByTestId('icon-barchart')).toBeInTheDocument();
    });

    it('renders lightbulb icon for light activity', async () => {
      await renderDashboard();
      expect(screen.getByTestId('icon-lightbulb')).toBeInTheDocument();
    });

    it('renders correct number of activity list items', async () => {
      await renderDashboard();
      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(3);
    });

    it('renders No activity found when activities is empty', async () => {
      mockedGetActivities.mockResolvedValue([]);
      await renderDashboard();
      expect(screen.getByText('No activity found')).toBeInTheDocument();
    });

    it('renders no activity items when activities is empty', async () => {
      mockedGetActivities.mockResolvedValue([]);
      await renderDashboard();
      expect(screen.queryByTestId('icon-check')).not.toBeInTheDocument();
      expect(screen.queryByTestId('icon-barchart')).not.toBeInTheDocument();
      expect(screen.queryByTestId('icon-lightbulb')).not.toBeInTheDocument();
    });

    it('renders activity with only check icon when icon is check', async () => {
      const checkOnly: Activity[] = [
        { id: 1, icon: 'check', text: 'Only check item' },
      ];
      mockedGetActivities.mockResolvedValue(checkOnly);
      await renderDashboard();
      expect(screen.getByTestId('icon-check')).toBeInTheDocument();
      expect(screen.queryByTestId('icon-barchart')).not.toBeInTheDocument();
      expect(screen.queryByTestId('icon-lightbulb')).not.toBeInTheDocument();
    });

    it('renders different title from getDashboardTitle', async () => {
      mockedGetDashboardTitle.mockResolvedValue('Latest Updates');
      await renderDashboard();
      expect(screen.getByText('Latest Updates')).toBeInTheDocument();
    });
  });

  describe('data fetching', () => {
    it('calls getStats exactly once', async () => {
      await renderDashboard();
      expect(mockedGetStats).toHaveBeenCalledTimes(1);
    });

    it('calls getActivities exactly once', async () => {
      await renderDashboard();
      expect(mockedGetActivities).toHaveBeenCalledTimes(1);
    });

    it('calls getDashboardTitle exactly once', async () => {
      await renderDashboard();
      expect(mockedGetDashboardTitle).toHaveBeenCalledTimes(1);
    });
  });

  describe('layout', () => {
    it('renders card components', async () => {
      await renderDashboard();
      expect(screen.getAllByTestId('card').length).toBeGreaterThanOrEqual(1);
    });

    it('renders card content components', async () => {
      await renderDashboard();
      expect(screen.getAllByTestId('card-content').length).toBeGreaterThanOrEqual(1);
    });
  });
});