export type Blog = {
  id: number;
  attributes: {
    title: string;
    content: string;
    slug: string;
  };
};

export type Props = {
  params: {
    slug: string;
  };
};