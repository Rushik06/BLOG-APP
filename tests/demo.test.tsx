import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('@/lib/strapi', () => ({
  fetchAPI: vi.fn(),
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

import DemoModal from '../app/demo/DemoModal';
import { fetchAPI } from '@/lib/strapi';

const mockStats = [
  { id: 1, title: 'Products', value: '1,240' },
  { id: 2, title: 'Customers', value: '3,820' },
  { id: 3, title: 'Revenue', value: '$48,200' },
  { id: 4, title: 'Orders', value: '980' },
];

const mockInventory = [
  { id: 1, name: 'Widget A', stock: 120, stockStatus: 'ok' },
  { id: 2, name: 'Widget B', stock: 4, stockStatus: 'low' },
  { id: 3, name: 'Widget C', stock: 75, stockStatus: 'ok' },
];

const mockActivities = [
  { id: 1, message: 'Order #1023 placed by John' },
  { id: 2, message: 'Stock replenished for Widget C' },
  { id: 3, message: 'New customer registered' },
];

describe('DemoModal', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders children correctly', () => {
    render(
      <DemoModal>
        <p>Test child content</p>
      </DemoModal>
    );
    expect(screen.getByText('Test child content')).toBeInTheDocument();
  });

  it('renders the close button', () => {
    render(
      <DemoModal>
        <div />
      </DemoModal>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls router.push("/") when the close button is clicked', async () => {
    render(
      <DemoModal>
        <div />
      </DemoModal>
    );
    await userEvent.click(screen.getByRole('button'));
    expect(mockPush).toHaveBeenCalledWith('/');
    expect(mockPush).toHaveBeenCalledTimes(1);
  });

  it('calls router.push("/") when the backdrop is clicked', async () => {
    const { container } = render(
      <DemoModal>
        <div />
      </DemoModal>
    );
    const backdrop = container.firstChild as HTMLElement;
    await userEvent.click(backdrop);
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('does NOT close when clicking inside the modal panel', async () => {
    render(
      <DemoModal>
        <p>Inner content</p>
      </DemoModal>
    );
    await userEvent.click(screen.getByText('Inner content'));
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('closes on Escape key press', () => {
    render(
      <DemoModal>
        <div />
      </DemoModal>
    );
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(mockPush).toHaveBeenCalledWith('/');
    expect(mockPush).toHaveBeenCalledTimes(1);
  });

  it('does NOT close on other key presses', () => {
    render(
      <DemoModal>
        <div />
      </DemoModal>
    );
    fireEvent.keyDown(window, { key: 'Enter' });
    fireEvent.keyDown(window, { key: 'Tab' });
    fireEvent.keyDown(window, { key: 'a' });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('removes the keydown listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(
      <DemoModal>
        <div />
      </DemoModal>
    );
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });

  it('does not fire multiple close events after re-render', () => {
    const { rerender } = render(
      <DemoModal>
        <div id="a" />
      </DemoModal>
    );
    rerender(
      <DemoModal>
        <div id="b" />
      </DemoModal>
    );
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(mockPush).toHaveBeenCalledTimes(1);
  });

  it('applies correct overlay classes', () => {
    const { container } = render(
      <DemoModal>
        <div />
      </DemoModal>
    );
    const overlay = container.firstChild as HTMLElement;
    expect(overlay.className).toMatch(/fixed/);
    expect(overlay.className).toMatch(/inset-0/);
    expect(overlay.className).toMatch(/z-50/);
  });

  it('applies correct modal panel classes', () => {
    render(
      <DemoModal>
        <div />
      </DemoModal>
    );
    const panel = screen.getByRole('button').parentElement!;
    expect(panel.className).toMatch(/rounded-2xl/);
    expect(panel.className).toMatch(/shadow-2xl/);
  });
});

describe('DemoPage', () => {
  beforeEach(() => {
    vi.mocked(fetchAPI).mockImplementation((path: string) => {
      if (path === '/stats') return Promise.resolve({ data: mockStats });
      if (path === '/inventories') return Promise.resolve({ data: mockInventory });
      if (path === '/activities') return Promise.resolve({ data: mockActivities });
      return Promise.resolve(null);
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  async function renderPage() {
    const { default: DemoPage } = await import('../app/demo/page');
    const jsx = await DemoPage();
    return render(jsx as React.ReactElement);
  }

  it('fetches stats, inventories, and activities on render', async () => {
    await renderPage();
    expect(fetchAPI).toHaveBeenCalledWith('/stats');
    expect(fetchAPI).toHaveBeenCalledWith('/inventories');
    expect(fetchAPI).toHaveBeenCalledWith('/activities');
  });

  it('renders all stat cards', async () => {
    await renderPage();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Customers')).toBeInTheDocument();
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('1,240')).toBeInTheDocument();
    expect(screen.getByText('3,820')).toBeInTheDocument();
    expect(screen.getByText('$48,200')).toBeInTheDocument();
    expect(screen.getByText('980')).toBeInTheDocument();
  });

  it('renders inventory items', async () => {
    await renderPage();
    expect(screen.getByText('Widget A')).toBeInTheDocument();
    expect(screen.getByText('Widget B')).toBeInTheDocument();
    expect(screen.getByText('Widget C')).toBeInTheDocument();
  });

  it('renders stock values', async () => {
    await renderPage();
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument();
  });

  it('renders activity messages', async () => {
    await renderPage();
    expect(screen.getByText('Order #1023 placed by John')).toBeInTheDocument();
    expect(screen.getByText('Stock replenished for Widget C')).toBeInTheDocument();
    expect(screen.getByText('New customer registered')).toBeInTheDocument();
  });

  it('renders the page header', async () => {
    await renderPage();
    expect(screen.getByText('RetailPro Demo')).toBeInTheDocument();
    expect(screen.getByText('Quick preview of your dashboard')).toBeInTheDocument();
  });

  it('renders the Inventory section heading', async () => {
    await renderPage();
    expect(screen.getByText('Inventory')).toBeInTheDocument();
  });

  it('renders the Recent Activity section heading', async () => {
    await renderPage();
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
  });

  it('shows red colour for low-stock values', async () => {
    await renderPage();
    expect(screen.getByText('4')).toHaveClass('text-red-500');
  });

  it('applies green colour to in-stock values', async () => {
    await renderPage();
    expect(screen.getByText('120')).toHaveClass('text-green-600');
  });

  it('renders gracefully when fetchAPI returns null for all endpoints', async () => {
    vi.mocked(fetchAPI).mockResolvedValue(null);
    await renderPage();
    expect(screen.queryByText('Products')).not.toBeInTheDocument();
    expect(screen.queryByText('Widget A')).not.toBeInTheDocument();
    expect(screen.queryByText('Order #1023 placed by John')).not.toBeInTheDocument();
  });

  it('renders gracefully with empty data arrays', async () => {
    vi.mocked(fetchAPI).mockResolvedValue({ data: [] });
    await renderPage();
    expect(screen.queryByText('Products')).not.toBeInTheDocument();
  });

  it('renders the correct number of stat icon wrappers', async () => {
    await renderPage();
    const iconWrappers = document.querySelectorAll('.rounded-full');
    expect(iconWrappers.length).toBe(mockStats.length);
  });

  it('wraps content inside a modal overlay', async () => {
    const { container } = await renderPage();
    const overlay = container.querySelector('.fixed.inset-0');
    expect(overlay).toBeInTheDocument();
  });

  it('renders the correct number of cards', async () => {
    await renderPage();
    const cards = screen.getAllByTestId('card');
    expect(cards.length).toBe(mockStats.length + 2);
  });
});
