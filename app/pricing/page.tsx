import { fetchAPI } from "@/lib/strapi";
import PricingCard from "@/components/pricing/PricingCard";
import type { Pricing } from "../types/pricing";

export default async function Pricing() {
  const res = await fetchAPI("/pricings");
  const plans: Pricing[] = res.data;

  return (
    <div>
      <h1>Pricing</h1>

      <div style={{ display: "grid", gap: "12px" }}>
        {plans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
}