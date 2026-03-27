import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RenderContent from '@/components/blog/RenderContent';

vi.mock('lucide-react', () => ({
  CheckCircle: () => <svg data-testid="icon-check" />,
}));

const makeBlock = (text: string) => ({
  type: 'paragraph',
  children: [{ text }],
});

const makeListBlock = (text: string) => ({
  type: 'paragraph',
  children: [{ text: `1. ${text}` }],
});

const makeNestedBlock = (texts: string[]) => ({
  type: 'paragraph',
  children: [{ children: texts.map((t) => ({ text: t })) }],
});

describe('RenderContent', () => {
  it('renders fallback when content is null', () => {
    render(<RenderContent content={null} />);
    expect(screen.getByText('No content available')).toBeInTheDocument();
  });

  it('renders fallback when content is a string', () => {
    render(<RenderContent content="some string" />);
    expect(screen.getByText('No content available')).toBeInTheDocument();
  });

  it('renders fallback when content is an object', () => {
    render(<RenderContent content={{}} />);
    expect(screen.getByText('No content available')).toBeInTheDocument();
  });

  it('renders fallback when content is undefined', () => {
    render(<RenderContent content={undefined} />);
    expect(screen.getByText('No content available')).toBeInTheDocument();
  });

  it('renders a paragraph block', () => {
    render(<RenderContent content={[makeBlock('Hello world')]} />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('renders multiple paragraph blocks', () => {
    render(
      <RenderContent content={[makeBlock('First paragraph'), makeBlock('Second paragraph')]} />
    );
    expect(screen.getByText('First paragraph')).toBeInTheDocument();
    expect(screen.getByText('Second paragraph')).toBeInTheDocument();
  });

  it('renders nested children text correctly', () => {
    render(<RenderContent content={[makeNestedBlock(['Nested ', 'text'])]} />);
    expect(screen.getByText('Nested text')).toBeInTheDocument();
  });

  it('skips blocks with empty text', () => {
    render(<RenderContent content={[makeBlock(''), makeBlock('Visible')]} />);
    expect(screen.getByText('Visible')).toBeInTheDocument();
    expect(screen.getAllByText(/./)).toHaveLength(1);
  });

  it('renders a numbered list block with CheckCircle icon', () => {
    render(<RenderContent content={[makeListBlock('Buy groceries')]} />);
    expect(screen.getByTestId('icon-check')).toBeInTheDocument();
  });

  it('strips the number prefix from list items', () => {
    render(<RenderContent content={[makeListBlock('Buy groceries')]} />);
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    expect(screen.queryByText(/^1\./)).not.toBeInTheDocument();
  });

  it('renders non-list block without CheckCircle icon', () => {
    render(<RenderContent content={[makeBlock('Regular text')]} />);
    expect(screen.queryByTestId('icon-check')).not.toBeInTheDocument();
  });

  it('renders a mix of paragraphs and list blocks', () => {
    render(
      <RenderContent
        content={[makeBlock('Intro text'), makeListBlock('Step one'), makeBlock('Closing text')]}
      />
    );
    expect(screen.getByText('Intro text')).toBeInTheDocument();
    expect(screen.getByText('Step one')).toBeInTheDocument();
    expect(screen.getByText('Closing text')).toBeInTheDocument();
    expect(screen.getAllByTestId('icon-check')).toHaveLength(1);
  });

  it('renders nothing when content is an empty array', () => {
    const { container } = render(<RenderContent content={[]} />);
    expect(container.innerHTML).toBe('');
  });
});
