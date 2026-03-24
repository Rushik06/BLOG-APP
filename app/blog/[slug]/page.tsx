import { fetchAPI } from "@/lib/strapi";
import { Blog } from "@/app/types/blog";
import type { Props } from "@/app/types/blog";

export default async function BlogDetail({ params }: Props) {
  const { slug } = params; 

  const res = await fetchAPI(
    `/blogs?filters[slug][$eq]=${slug}`
  );

  const blog: Blog | undefined = res.data?.[0];

  if (!blog) return <div>Not found</div>;

  const data = blog.attributes;

  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.content}</p>
    </div>
  );
}