

export type RichTextChild = {
  text?: string;
  children?: { text: string }[];
};

export type RichTextBlock = {
  type: string;
  children?: RichTextChild[];
};

export type Testimonial = {
  id: number;
  name: string;
  role: string;
  content: RichTextBlock[];
  rating?: number;
};