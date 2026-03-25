import { CheckCircle } from 'lucide-react';
import { RichTextBlock } from '@/app/types/blog';

export default function RenderContent({ content }: { content: unknown }) {
  if (!Array.isArray(content)) {
    return <p className="text-gray-600 dark:text-gray-400">No content available</p>;
  }

  return (
    <>
      {content.map((block: RichTextBlock, index: number) => {
        let text = '';

        block.children?.forEach((child) => {
          if (child.text) text += child.text;

          if (child.children) {
            text += child.children.map((c) => c.text).join('');
          }
        });

        const cleanText = text.trim();
        if (!cleanText) return null;

        const isList = /^\d+\./.test(cleanText);

        // LIST
        if (isList) {
          return (
            <div
              key={index}
              className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 dark:border-green-800 dark:bg-green-900/30"
            >
              <CheckCircle className="mt-1 text-green-600 dark:text-green-400" size={18} />
              <p className="text-[16px] leading-7 font-medium text-gray-800 dark:text-gray-200">
                {cleanText.replace(/^\d+\.\s*/, '')}
              </p>
            </div>
          );
        }

        // PARAGRAPH
        return (
          <p
            key={index}
            className="text-[17.5px] leading-8 tracking-[0.2px] text-gray-700 first:text-[18px] first:text-gray-900 dark:text-gray-300 dark:first:text-white"
          >
            {cleanText}
          </p>
        );
      })}
    </>
  );
}
