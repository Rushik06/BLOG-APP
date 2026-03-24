import { fetchAPI } from '@/lib/strapi';
import PricingCard from '@/components/pricing/PricingCard';
import { Pricing } from '@/app/types/pricing';
import { BadgeCheck, Check, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

export default async function PricingPage() {
  const res = await fetchAPI<{ data: Pricing[] }>('/pricings');

  // ✅ FIX: normalize data (string → number)
  const plans = res.data.map((plan) => ({
    ...plan,
    price: Number(plan.Price),
  }));

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* ================= HEADER ================= */}
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-blue-100 p-3">
            <BadgeCheck className="text-blue-600" />
          </div>
        </div>

        <h1 className="text-4xl font-bold">Simple, Transparent Pricing</h1>

        <p className="mt-3 text-lg text-gray-500">Choose a plan that fits your business needs</p>
      </div>

      {/* ================= PRICING GRID ================= */}
      {plans.length === 0 ? (
        <div className="py-20 text-center text-gray-500">No pricing plans available.</div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => {
            const isPopular = plan.planName === 'Pro';

            return (
              <div key={plan.id} className="relative">
                {/* ⭐ Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-xs text-white">
                      <Sparkles size={12} />
                      Most Popular
                    </span>
                  </div>
                )}

                <PricingCard
                  plan={{
                    ...plan,
                    Price: plan.price, // normalized
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* ================= HIGHLIGHT ================= */}
      <div className="mt-20">
        <Card className="border-blue-100">
          <CardContent className="p-10 text-center">
            <h2 className="text-2xl font-semibold">All plans include:</h2>

            <div className="mt-6 flex flex-col justify-center gap-8 text-sm text-gray-600 md:flex-row">
              <div className="flex items-center gap-2">
                <Check className="text-green-500" size={16} />
                Real-time tracking
              </div>

              <div className="flex items-center gap-2">
                <Check className="text-green-500" size={16} />
                Analytics dashboard
              </div>

              <div className="flex items-center gap-2">
                <Check className="text-green-500" size={16} />
                Multi-store support
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ================= CTA ================= */}
      <div className="mt-16 text-center">
        <h3 className="text-xl font-semibold">Need a custom plan?</h3>

        <p className="mt-2 text-gray-500">Contact our team for enterprise solutions</p>
      </div>
    </div>
  );
}
