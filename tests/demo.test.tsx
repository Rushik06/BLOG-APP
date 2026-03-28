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
    expect(screen.getByText('Test child content')).toBeDefined();
  });

  it('renders the close button', () => {
    render(
      <DemoModal>
        <div />
      </DemoModal>
    );
    expect(screen.getByRole('button')).toBeDefined();
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

  it('fetches stats, inventories, and activities with revalidate option', async () => {
    await renderPage();
    expect(fetchAPI).toHaveBeenCalledWith(
      '/stats',
      expect.objectContaining({ next: { revalidate: 60 } })
    );
    expect(fetchAPI).toHaveBeenCalledWith(
      '/inventories',
      expect.objectContaining({ next: { revalidate: 60 } })
    );
    expect(fetchAPI).toHaveBeenCalledWith(
      '/activities',
      expect.objectContaining({ next: { revalidate: 60 } })
    );
  });

  it('calls fetchAPI exactly three times', async () => {
    await renderPage();
    expect(fetchAPI).toHaveBeenCalledTimes(3);
  });

  it('renders all stat cards', async () => {
    await renderPage();
    expect(screen.getByText('Products')).toBeDefined();
    expect(screen.getByText('Customers')).toBeDefined();
    expect(screen.getByText('Revenue')).toBeDefined();
    expect(screen.getByText('Orders')).toBeDefined();
    expect(screen.getByText('1,240')).toBeDefined();
    expect(screen.getByText('3,820')).toBeDefined();
    expect(screen.getByText('$48,200')).toBeDefined();
    expect(screen.getByText('980')).toBeDefined();
  });

  it('renders inventory items', async () => {
    await renderPage();
    expect(screen.getByText('Widget A')).toBeDefined();
    expect(screen.getByText('Widget B')).toBeDefined();
    expect(screen.getByText('Widget C')).toBeDefined();
  });

  it('renders stock values', async () => {
    await renderPage();
    expect(screen.getByText('120')).toBeDefined();
    expect(screen.getByText('4')).toBeDefined();
    expect(screen.getByText('75')).toBeDefined();
  });

  it('renders activity messages', async () => {
    await renderPage();
    expect(screen.getByText('Order #1023 placed by John')).toBeDefined();
    expect(screen.getByText('Stock replenished for Widget C')).toBeDefined();
    expect(screen.getByText('New customer registered')).toBeDefined();
  });

  it('renders the page header', async () => {
    await renderPage();
    expect(screen.getByText('RetailPro Demo')).toBeDefined();
    expect(screen.getByText('Quick preview of your dashboard')).toBeDefined();
  });

  it('renders the Inventory section heading', async () => {
    await renderPage();
    expect(screen.getByText('Inventory')).toBeDefined();
  });

  it('renders the Recent Activity section heading', async () => {
    await renderPage();
    expect(screen.getByText('Recent Activity')).toBeDefined();
  });

  it('shows red colour class for low-stock values', async () => {
    await renderPage();
    const el = screen.getByText('4');
    expect(el.className).toMatch(/text-red-500/);
  });

  it('applies green colour class to in-stock values', async () => {
    await renderPage();
    const el = screen.getByText('120');
    expect(el.className).toMatch(/text-green-600/);
  });

  it('renders gracefully when fetchAPI returns null for all endpoints', async () => {
    vi.mocked(fetchAPI).mockResolvedValue(null);
    await renderPage();
    expect(screen.queryByText('Products')).toBeNull();
    expect(screen.queryByText('Widget A')).toBeNull();
    expect(screen.queryByText('Order #1023 placed by John')).toBeNull();
  });

  it('renders gracefully with empty data arrays', async () => {
    vi.mocked(fetchAPI).mockResolvedValue({ data: [] });
    await renderPage();
    expect(screen.queryByText('Products')).toBeNull();
  });

  it('renders the correct number of cards', async () => {
    await renderPage();
    const cards = screen.getAllByTestId('card');
    expect(cards.length).toBe(mockStats.length + 2);
  });
});
