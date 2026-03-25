import type { RichTextBlock } from '@/app/types/testimonals';

export function getText(content: RichTextBlock[]): string {
  return content
    .map((block) =>
      block.children
        ?.map((child) => {
          if (child.text) return child.text;

          if (child.children) {
            return child.children.map((c) => c.text).join('');
          }

          return '';
        })
        .join('')
    )
    .join(' ');
}