export interface Blog {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
}

export interface BlogCardProps {
  blog: Blog;
}

export interface BlogDetailProps {
  params: {
    slug: string;
  };
}