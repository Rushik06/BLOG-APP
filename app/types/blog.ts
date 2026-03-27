export interface Blog {
  id: number;
  Title: string;
  slug: string;
  createdAt: string;
  description: string;
  content: RichTextBlock[];
  category: string;
}

export interface BlogCardProps {
  blog: Blog;
}

export interface BlogDetailProps {
  params: Promise<{
    slug: string;
  }>;
}

export type RichTextChild = {
  text?: string;
  children?: { text: string }[];
};

export type RichTextBlock = {
  type: string;
  children?: RichTextChild[];
};

export type Props = {
  blogs: Blog[];
};
