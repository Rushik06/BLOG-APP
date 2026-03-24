import { fetchAPI } from "@/lib/strapi";
import Button from "@/components/ui/Button";

export default async function Home() {
  const res = await fetchAPI("/landing-pages");
  const data = res.data;

  return (
    <div>
      <h1 style={{ fontSize: "40px" }}>{data?.HeroTitle}</h1>
      <p>{data?.HeroSubtitle}</p>

      <Button>{data?.CTAText}</Button>
    </div>
  );
}