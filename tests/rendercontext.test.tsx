import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RenderContent from '@/components/blog/RenderContent';

vi.mock('lucide-react', () => ({
  CheckCircle: () => <span data-testid="icon-check" />,
}));

describe('RenderContent', () => {
  it('handles invalid or empty content gracefully', () => {
    const { rerender } = render(<RenderContent content={null as unknown as []} />);
    expect(screen.getByText(/no content available/i)).toBeDefined();

    rerender(<RenderContent content={[]} />);
    expect(screen.queryByText(/./)).toBeNull();
  });

  it('renders standard paragraph blocks and nested text', () => {
    const content = [
      { type: 'paragraph', children: [{ text: 'Hello' }] },
      { type: 'paragraph', children: [{ children: [{ text: 'Nested ' }, { text: 'Text' }] }] },
    ];

    render(<RenderContent content={content} />);

    expect(screen.getByText('Hello')).toBeDefined();
    expect(screen.getByText('Nested Text')).toBeDefined();
  });

  it('transforms numbered text (1. Task) into list items with icons', () => {
    const content = [{ type: 'paragraph', children: [{ text: '1. Clean the room' }] }];

    render(<RenderContent content={content} />);

    expect(screen.getByTestId('icon-check')).toBeDefined();
    expect(screen.getByText('Clean the room')).toBeDefined();
    expect(screen.queryByText(/1\./)).toBeNull();
  });

  it('ignores blocks that have no text content', () => {
    const content = [
      { type: 'paragraph', children: [{ text: '' }] },
      { type: 'paragraph', children: [{ text: 'Valid Content' }] },
    ];

    render(<RenderContent content={content} />);

    expect(screen.getByText('Valid Content')).toBeDefined();
    const paragraphs = screen.queryAllByText(/./);
    expect(paragraphs.length).toBe(1);
  });

  it('renders a mix of plain text and list items', () => {
    const content = [
      { type: 'paragraph', children: [{ text: 'Intro' }] },
      { type: 'paragraph', children: [{ text: '1. Step One' }] },
      { type: 'paragraph', children: [{ text: 'Outro' }] },
    ];

    render(<RenderContent content={content} />);

    expect(screen.getByText('Intro')).toBeDefined();
    expect(screen.getByText('Step One')).toBeDefined();
    expect(screen.getByText('Outro')).toBeDefined();
    expect(screen.getAllByTestId('icon-check')).toHaveLength(1);
  });
});
