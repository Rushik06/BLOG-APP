import { fetchAPI } from "@/lib/strapi";
import FeatureCard from "@/components/features/Feature";
import { Feature } from "@/app/types/feature";

export default async function Features() {
  const res = await fetchAPI("/features");
  const features: Feature[] = res.data;

  return (
    <div>
      <h1>Features</h1>

      <div style={{ display: "grid", gap: "12px" }}>
        {features.map((f) => (
          <FeatureCard key={f.id} feature={f} />
        ))}
      </div>
    </div>
  );
}